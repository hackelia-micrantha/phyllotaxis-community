{
  description = "Phyllotaxis public contract validation";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";

  outputs = { nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
      demoForSystem = system:
        let pkgs = import nixpkgs { inherit system; };
        in pkgs.runCommand "phyllotaxis-public-demo" { } ''
          mkdir -p "$out/examples"
          cp ${./site/index.html} "$out/index.html"
          cp ${./site/site.css} "$out/site.css"
          cp ${./docs/examples/utility-reference.html} "$out/examples/utility-reference.html"
          cp ${./docs/examples/utility-reference.css} "$out/examples/utility-reference.css"
          cp ${./docs/examples/dimensional-utility-reference.html} "$out/examples/dimensional-utility-reference.html"
        '';
    in
    {
      packages = forAllSystems (system: {
        demo-site = demoForSystem system;
      });

      checks = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
          python = pkgs.python3.withPackages (ps: [ ps.jsonschema ]);
        in
        {
          public-contracts = pkgs.runCommand "phyllotaxis-community-contracts" {
            nativeBuildInputs = [ python ];
          } ''
            cp -R ${./contracts} contracts
            chmod -R u+w contracts
            python - <<'PY'
            import json
            from pathlib import Path
            from jsonschema import Draft202012Validator

            for stem in ("public-interface", "chroma-inspection"):
                data = json.loads(Path(f"contracts/{stem}-v1.json").read_text())
                schema = json.loads(Path(f"contracts/{stem}.schema.json").read_text())
                Draft202012Validator(schema).validate(data)

            public = json.loads(Path("contracts/public-interface-v1.json").read_text())
            assert "tokens" in public["cli"]["commands"]
            PY
            touch "$out"
          '';

          demo-site = pkgs.runCommand "phyllotaxis-public-demo-links" {
            nativeBuildInputs = [ pkgs.python3 ];
          } ''
            python ${./tools/check-demo-site.py} --self-test
            python ${./tools/check-demo-site.py} ${demoForSystem system}
            touch "$out"
          '';
        }
      );

      devShells = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
          browserPackages = pkgs.lib.optionals pkgs.stdenv.isLinux [
            pkgs.chromium
            pkgs.chromedriver
            pkgs.firefox
            pkgs.geckodriver
          ];
        in
        {
          browser-evidence = pkgs.mkShell {
            packages = [
              pkgs.nodejs_22
            ] ++ browserPackages;

            CHROMIUM_BIN = pkgs.lib.optionalString pkgs.stdenv.isLinux "${pkgs.chromium}/bin/chromium";
            CHROMEDRIVER_BIN = pkgs.lib.optionalString pkgs.stdenv.isLinux "${pkgs.chromedriver}/bin/chromedriver";
            FIREFOX_BIN = pkgs.lib.optionalString pkgs.stdenv.isLinux "${pkgs.firefox}/bin/firefox";
            GECKODRIVER_BIN = pkgs.lib.optionalString pkgs.stdenv.isLinux "${pkgs.geckodriver}/bin/geckodriver";
          };
        }
      );
    };
}
