{
  description = "Phyllotaxis public contract validation";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";

  outputs = { self, nixpkgs, ... }:
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
          cp ${./site/material-playground.html} "$out/material-playground.html"
          cp ${./site/material-playground.css} "$out/material-playground.css"
          cp ${./docs/examples/utility-reference.html} "$out/examples/utility-reference.html"
          cp ${./docs/examples/utility-reference.css} "$out/examples/utility-reference.css"
          cp ${./docs/examples/dimensional-utility-reference.html} "$out/examples/dimensional-utility-reference.html"
          # TEXT-001: opt-in, non-normative static prose comparison; no runtime/package contract.
          cp ${./docs/examples/text-rhythm-comparison.html} "$out/examples/text-rhythm-comparison.html"
        '';
    in
    {
      checks = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
          python = pkgs.python3.withPackages (ps: [ ps.jsonschema ]);
        in
        {
          demo-site = pkgs.runCommand "phyllotaxis-public-demo-links" {
            nativeBuildInputs = [ pkgs.python3 ];
          } ''
            python ${./tools/check-demo-site.py} --self-test
            python ${./tools/check-demo-site.py} ${demoForSystem system}
            touch "$out"
          '';
          independent-review-kit-archive = pkgs.runCommand "phyllotaxis-community-independent-review-kit-validation" {
            nativeBuildInputs = [ pkgs.python3 ];
          } ''
            archive="${self.packages.${system}.independent-review-kit}/independent-review-kit.zip"
            python ${./tools/package-independent-review.py} --root ${./.} --archive "$archive" --verify-only
            touch "$out"
          '';
          spatial-fixture = pkgs.runCommand "phyllotaxis-space-reference-integrity" {
            nativeBuildInputs = [ pkgs.python3 ];
          } ''
            python ${./tools/check-spatial-fixture.py} ${./docs/examples/spatial-rhythm-comparison.html}
            touch "$out"
          '';
          text-rhythm-fixture = pkgs.runCommand "phyllotaxis-text-rhythm-fixture-integrity" {
            nativeBuildInputs = [ pkgs.python3 ];
          } ''
            python ${./tools/check-text-rhythm-fixture.py} ${./docs/examples/text-rhythm-comparison.html} ${./docs/examples/text-rhythm-suggestions.json}
            touch "$out"
          '';
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

      packages = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          demo-site = demoForSystem system;
          independent-review-kit = pkgs.runCommand "phyllotaxis-independent-review-kit" {
            nativeBuildInputs = [ pkgs.python3 ];
          } ''
            mkdir -p "$out"
            python ${./tools/package-independent-review.py} --root ${./.} --archive "$out/independent-review-kit.zip"
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
