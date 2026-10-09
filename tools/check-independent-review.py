#!/usr/bin/env python3
"""Validate the non-normative offline human review packet in the public contract repo.

This is a source-integrity and JavaScript-syntax check, NOT a browser, usability,
accessibility, or participant-response test.
"""
from __future__ import annotations

import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path


class ReviewDocument(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.labels: list[str] = []
        self.variant_text: dict[str, list[str]] = {}
        self.active_variant: str | None = None
        self.section_depth = 0
        self.scripts: list[str] = []
        self.script = False
        self.unsafe_resources: list[str] = []
        self.form_count = 0
        self.download_count = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if "id" in values and values["id"]:
            self.ids.append(values["id"])
        if tag == "label" and values.get("for"):
            self.labels.append(values["for"] or "")
        if tag == "form":
            self.form_count += 1
        if tag == "button" and values.get("id") == "export":
            self.download_count += 1
        for key in ("src", "href", "action", "formaction"):
            target = values.get(key) or ""
            if re.match(r"^(?:[a-z][a-z0-9+.-]*:|//)", target, re.I):
                self.unsafe_resources.append(f"{tag}.{key}={target}")
        if tag in ("img", "iframe", "link", "object", "embed", "video", "audio", "source"):
            self.unsafe_resources.append(f"unexpected external-asset element: {tag}")
        if tag == "script":
            if values.get("src"):
                self.unsafe_resources.append("external script source")
            self.script = True
            self.scripts.append("")
        if tag == "section":
            if self.active_variant is not None:
                self.section_depth += 1
            elif "variant" in (values.get("class") or "").split():
                case = values.get("data-condition")
                if not case or case in self.variant_text:
                    raise ValueError("Missing/duplicate review variant condition")
                self.active_variant = case
                self.section_depth = 1
                self.variant_text[case] = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "script":
            self.script = False
        if tag == "section" and self.active_variant is not None:
            self.section_depth -= 1
            if self.section_depth == 0:
                self.active_variant = None

    def handle_data(self, data: str) -> None:
        if self.script:
            self.scripts[-1] += data
        if self.active_variant is not None:
            self.variant_text[self.active_variant].append(data)


def main(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    document = ReviewDocument()
    document.feed(text)
    expected = {"flat", "bounded", "stacked", "differentiated", "equal"}
    assert set(document.variant_text) == expected, "Expected five distinct review conditions"
    assert len(document.ids) == len(set(document.ids)), "Duplicate HTML ids"
    assert set(document.labels).issubset(set(document.ids)), "A label points to a missing control"
    assert document.form_count == 1 and document.download_count == 1
    assert not document.unsafe_resources, f"Remote or embedded asset: {document.unsafe_resources}"
    assert len(document.scripts) == 1, "Expected one self-contained script"

    def normalized(case: str) -> str:
        text = " ".join(document.variant_text[case])
        return re.sub(r"Option\s+\d+", "Option", " ".join(text.split()))

    assert len({normalized(x) for x in ("flat", "bounded", "stacked")}) == 1, (
        "Scanning cases must have exactly matched text"
    )
    assert normalized("differentiated") == normalized("equal"), (
        "Action/read-only cases must have exactly matched text"
    )
    script = document.scripts[0]
    forbidden = (r"\bfetch\s*\(", r"\bXMLHttpRequest\b", r"\bsendBeacon\b",
                 r"\bWebSocket\b", r"\blocalStorage\b", r"\bsessionStorage\b",
                 r"\bindexedDB\b", r"\beval\s*\(", r"\bimport\s*\(")
    assert not any(re.search(pattern, script) for pattern in forbidden), (
        "Review packet must not access network, persistent storage or dynamic code"
    )
    assert 'approvalStatus:"unverified-human-response"' in script
    assert "presentationOrder:orders" in script
    assert "URL.createObjectURL" in script and "a.download=" in script
    check = subprocess.run(["node", "--check"], input=script, text=True,
                           capture_output=True, check=False)
    assert check.returncode == 0, f"Invalid inline JavaScript: {check.stderr}"
    print("PASS: offline review source, matched content, anonymity gates and JavaScript syntax")
    print("LIMITATION: no browser functionality, participant observations or accessibility certified")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: check-independent-review.py PATH", file=sys.stderr)
        sys.exit(2)
    main(Path(sys.argv[1]))
