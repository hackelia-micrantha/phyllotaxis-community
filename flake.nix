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
    in
    {
      checks = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
          python = pkgs.python3.withPackages (ps: [ ps.jsonschema ]);
        in
        {
          independent-review-kit-archive = pkgs.runCommand "phyllotaxis-community-independent-review-kit-validation" {
            nativeBuildInputs = [ pkgs.unzip ];
          } ''
            archive="${self.packages.${system}.independent-review-kit}/independent-review-kit.zip"
            test -s "$archive"
            unzip -t "$archive"
            test "$(unzip -Z1 "$archive" | wc -l)" -eq 5
            unzip -Z1 "$archive" | grep -Fxq "README.md"
            unzip -Z1 "$archive" | grep -Fxq "docs/examples/dimensional-utility-review-session.html"
            unzip -Z1 "$archive" | grep -Fxq "docs/examples/dimensional-utility-reference.html"
            unzip -Z1 "$archive" | grep -Fxq "docs/examples/dimensional-utility-boundaries.html"
            unzip -Z1 "$archive" | grep -Fxq "docs/architecture/dimensional-utility-human-review-worksheet.md"
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
          independent-review-kit = pkgs.runCommand "phyllotaxis-independent-review-kit" {
            nativeBuildInputs = [ pkgs.zip ];
          } ''
            mkdir -p "$out" "staging/docs/examples" "staging/docs/architecture"
            cp ${./docs/examples/independent-review-participant-README.md} staging/README.md
            cp ${./docs/examples/dimensional-utility-review-session.html} staging/docs/examples/
            cp ${./docs/examples/dimensional-utility-reference.html} staging/docs/examples/
            cp ${./docs/examples/dimensional-utility-boundaries.html} staging/docs/examples/
            cp ${./docs/architecture/dimensional-utility-human-review-worksheet.md} staging/docs/architecture/
            cd staging
            zip -q -X "$out/independent-review-kit.zip" \
              README.md \
              docs/examples/dimensional-utility-review-session.html \
              docs/examples/dimensional-utility-reference.html \
              docs/examples/dimensional-utility-boundaries.html \
              docs/architecture/dimensional-utility-human-review-worksheet.md
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
