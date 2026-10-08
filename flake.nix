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
    in
    {
      checks = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
          python = pkgs.python3.withPackages (ps: [ ps.jsonschema ]);
        in
        {
          public-contracts = pkgs.runCommand "phyllotaxis-community-contracts" {
            nativeBuildInputs = [ python pkgs.nodejs_22 ];
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
            python ${./tools/check-independent-review.py} ${./docs/examples/dimensional-utility-review-session.html}
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
