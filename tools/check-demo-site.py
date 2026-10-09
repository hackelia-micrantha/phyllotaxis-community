#!/usr/bin/env python3
"""Fail-closed checks for the seven-file public GitHub Pages artifact.

This validates a deliberately small static asset surface, not arbitrary HTML/CSS.
New external resources require explicit review and extension of this contract.
"""

from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys


EXPECTED = {
    "index.html",
    "site.css",
    "examples/utility-reference.html",
    "examples/utility-reference.css",
    "examples/dimensional-utility-reference.html",
    "material-playground.html",
    "material-playground.css",
}
# The published build contains exactly seven reviewed text files. Do not accept
# attributes with implicit requests, executable behavior or extensions to the
# fixture vocabulary without a new contract review.
REFERENCES = ("href", "action")
ALLOWED_ATTRIBUTES = {
    "lang", "charset", "name", "content", "class", "id",
    "aria-label", "aria-labelledby", "aria-hidden",
    "href", "rel", "action", "type", "data-phyllotaxis-profile",
    "for", "value", "checked",
}
FORBIDDEN_ELEMENTS = {"base", "embed", "iframe", "object", "script"}
# Deliberately restrictive: no CSS-embedded assets are published today.
# Fail closed on escaped function spellings as well as direct resource syntax.
CSS_RESOURCE = re.compile(
    r"@import\b|@font-face\b|url\s*\(|image-set\s*\(|cross-fade\s*\(|"
    r"image\s*\(|https?://|//|data:|blob:",
    re.IGNORECASE,
)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def check_css(text: str, context: str) -> None:
    require("\\" not in text, f"{context}: CSS escapes are not allowlisted")
    require(
        not CSS_RESOURCE.search(text),
        f"{context}: CSS resource-capable constructs are not allowlisted",
    )


def classify_reference(tag: str, attribute: str, value: str) -> str:
    """Return local/external-navigation or reject a remote/active resource."""
    require(not value.startswith("//"), f"{tag} {attribute}: protocol-relative URL rejected: {value}")
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        require(
            tag == "a" and attribute == "href" and parsed.scheme == "https" and bool(parsed.netloc),
            f"{tag} {attribute}: external resource or unsafe navigation rejected: {value}",
        )
        return "external-navigation"
    require(not parsed.path.startswith("/"), f"{tag} {attribute}: root-absolute path rejected: {value}")
    return "local"


class ReferenceParser(HTMLParser):
    def __init__(self, page: Path):
        super().__init__(convert_charrefs=True)
        self.page = page
        self.refs: list[tuple[str, str, str]] = []
        self.ids: set[str] = set()
        self.in_style = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        require(tag not in FORBIDDEN_ELEMENTS, f"{self.page}: prohibited active element <{tag}>")
        props = dict(attrs)
        require(len(props) == len(attrs), f"{self.page}: duplicate HTML attributes")
        unknown = props.keys() - ALLOWED_ATTRIBUTES
        require(not unknown, f"{self.page}: unsupported or request-capable attributes: {sorted(unknown)}")
        require(tag in {"a", "link"} or "href" not in props, f"{self.page}: href on unsupported tag {tag}")
        require(tag == "form" or "action" not in props, f"{self.page}: action on unsupported tag {tag}")
        require(tag == "label" or "for" not in props, f"{self.page}: for on unsupported tag {tag}")
        require(tag == "input" or not ({"checked", "value"} & props.keys()),
                f"{self.page}: control-only attributes on unsupported tag {tag}")
        if tag == "input":
            require(props.get("type") == "radio" and bool(props.get("name")),
                    f"{self.page}: only named native radio inputs supported")
        if props.get("id"):
            require(props["id"] not in self.ids, f"{self.page}: duplicate id {props['id']}")
            self.ids.add(props["id"])
        if props.get("style"):
            check_css(props["style"], f"{self.page}: inline style")
        self.in_style = tag == "style"
        for attribute in REFERENCES:
            if attribute in props:
                require(bool(props[attribute]), f"{self.page}: empty {tag} {attribute}")
                self.refs.append((tag, attribute, props[attribute]))

    def handle_data(self, data: str) -> None:
        if self.in_style:
            check_css(data, f"{self.page}: <style>")

    def handle_endtag(self, tag: str) -> None:
        if tag == "style":
            self.in_style = False


def check_site(root: Path) -> None:
    root = root.resolve(strict=True)
    present = {str(path.relative_to(root)) for path in root.rglob("*") if path.is_file()}
    require(present == EXPECTED, f"static publication allowlist mismatch: {present ^ EXPECTED}")

    for css in root.rglob("*.css"):
        check_css(css.read_text(encoding="utf-8"), str(css))

    parsed: dict[Path, ReferenceParser] = {}
    for page in root.rglob("*.html"):
        parser = ReferenceParser(page)
        parser.feed(page.read_text(encoding="utf-8"))
        parser.close()
        parsed[page.resolve()] = parser

    for page, parser in parsed.items():
        for tag, attribute, value in parser.refs:
            if classify_reference(tag, attribute, value) == "external-navigation":
                continue
            link = urlsplit(value)
            target = (
                (page.parent / unquote(link.path)).resolve()
                if link.path else page
            )
            require(target.is_relative_to(root), f"{page}: link escapes gallery: {value}")
            require(target.is_file(), f"{page}: broken resource/link: {value}")
            if link.fragment and target in parsed:
                require(
                    unquote(link.fragment) in parsed[target].ids,
                    f"{page}: missing fragment: {value}",
                )


def self_test() -> None:
    for tag, attribute, value in [
        ("link", "href", "https://cdn.example.invalid/styles.css"),
        ("link", "href", "//cdn.example.invalid/styles.css"),
        ("img", "src", "https://cdn.example.invalid/image.png"),
        ("img", "src", "data:image/png;base64,AAAA"),
        ("script", "src", "https://cdn.example.invalid/app.js"),
        ("a", "href", "javascript:alert(1)"),
        ("a", "href", "//example.invalid/"),
        ("form", "action", "https://example.invalid/post"),
        ("link", "href", "/root.css"),
    ]:
        try:
            classify_reference(tag, attribute, value)
        except ValueError:
            pass
        else:
            raise AssertionError(f"resource-boundary negative fixture unexpectedly passed: {tag} {attribute} {value}")
    require(
        classify_reference("a", "href", "https://github.com/hackelia-micrantha") == "external-navigation",
        "public documentation navigation must be allowed",
    )
    require(classify_reference("link", "href", "./site.css") == "local", "local stylesheets allowed")
    for css in [
        "@import 'https://example.invalid/a.css';",
        "background:url(https://example.invalid/a.png)",
        'background-image: image-set("https://example.invalid/x.png" 1x)',
        r"background: u\72l(https://example.invalid/x.png)",
        'background: cross-fade("https://example.invalid/a.png", red, 50%)',
    ]:
        try:
            check_css(css, "negative fixture")
        except ValueError:
            pass
        else:
            raise AssertionError("remote CSS resource accepted")
    for fragment in [
        "<link rel='stylesheet' href='//cdn.example.invalid/css'>",
        "<img srcset='https://example.invalid/img.png 2x'>",
        "<script src='./app.js'></script>",
        "<base href='https://example.invalid/'>",
        "<svg><image xlink:href='https://example.invalid/x.png'></image></svg>",
        "<svg><image href='https://example.invalid/x.png'></image></svg>",
        "<body onload=\"fetch('https://example.invalid/x')\">",
        "<a ping='https://example.invalid/track' href='https://github.com/'>Link</a>",
        "<img src='./not-allowlisted.png'>",
        "<meta http-equiv='refresh' content='0;url=https://example.invalid/'>",
    ]:
        try:
            parser = ReferenceParser(Path("fixture.html"))
            parser.feed(fragment)
            parser.close()
            for tag, attribute, value in parser.refs:
                classify_reference(tag, attribute, value)
        except ValueError:
            pass
        else:
            raise AssertionError(f"unsafe HTML fixture accepted: {fragment}")


def main() -> None:
    if len(sys.argv) == 2 and sys.argv[1] == "--self-test":
        self_test()
        print("gallery validator negative cases: passed")
    elif len(sys.argv) == 2:
        check_site(Path(sys.argv[1]))
        print("gallery publication allowlist and references: passed")
    else:
        sys.exit("Usage: check-demo-site.py SITE_ROOT | --self-test")


if __name__ == "__main__":
    main()
