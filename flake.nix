{
  description = "Phyllotaxis public contract validation and demo gallery";

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
            export SITE_ROOT=${demoForSystem system}
            python - <<'PY'
            from html.parser import HTMLParser
            from pathlib import Path
            from urllib.parse import unquote, urlsplit
            import os

            root = Path(os.environ["SITE_ROOT"])
            expected = {
                "index.html", "site.css",
                "examples/utility-reference.html",
                "examples/utility-reference.css",
                "examples/dimensional-utility-reference.html",
            }
            present = {str(path.relative_to(root)) for path in root.rglob("*") if path.is_file()}
            assert present == expected, (present, expected)

            class Links(HTMLParser):
                def __init__(self):
                    super().__init__()
                    self.refs = []
                    self.ids = set()

                def handle_starttag(self, tag, attrs):
                    props = dict(attrs)
                    if props.get("id"):
                        self.ids.add(props["id"])
                    for key in ("href", "src"):
                        if props.get(key):
                            self.refs.append(props[key])

            parsed = {}
            for page in root.rglob("*.html"):
                parser = Links()
                parser.feed(page.read_text())
                parsed[page.resolve()] = parser

            for page, parser in parsed.items():
                for value in parser.refs:
                    link = urlsplit(value)
                    if link.scheme or link.netloc:
                        continue
                    assert not value.startswith("//"), (page, value)
                    target = ((page.parent / unquote(link.path)).resolve()
                              if link.path else page)
                    assert target.is_relative_to(root.resolve()), (page, value)
                    assert target.is_file(), (page, value)
                    if link.fragment and target in parsed:
                        assert unquote(link.fragment) in parsed[target].ids, (page, value)
            assert "<script" not in (root / "index.html").read_text().lower()
            PY
            touch "$out"
          '';
        }
      );
    };
