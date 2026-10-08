#!/usr/bin/env python3
"""Fail-closed checks for the five-file public GitHub Pages artifact.

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
}
REFERENCES = ("href", "src", "action", "formaction", "poster")
FORBIDDEN_ELEMENTS = {"base", "embed", "iframe", "object", "script"}
FORBIDDEN_ATTRIBUTES = {"srcset", "imagesrcset"}
# The current gallery has no CSS asset URLs or imports. Reject all rather than
# approximating a CSS parser's URL and escaping semantics.
CSS_RESOURCE = re.compile(r"@import\b|url\s*\(", re.IGNORECASE)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def check_css(text: str, context: str) -> None:
    require(not CSS_RESOURCE.search(text), f"{context}: CSS imports and url() resources are not allowlisted")


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
        require(not (FORBIDDEN_ATTRIBUTES & props.keys()), f"{self.page}: srcset requires explicit asset validation")
        require(
            not (tag == "meta" and props.get("http-equiv", "").lower() == "refresh"),
            f"{self.page}: meta refresh not allowed",
        )
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
    for css in ["@import 'https://example.invalid/a.css';", "background:url(https://example.invalid/a.png)"]:
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
