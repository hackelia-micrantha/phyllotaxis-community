#!/usr/bin/env python3
"""Validate the public TEXT-001 static specimens; not browser or semantic AI evidence."""
from __future__ import annotations
import json
import sys
from html.parser import HTMLParser
from pathlib import Path

PROFILES = ("utility", "editorial")
SCHEMES = ("light", "dark")
VARIANTS = ("continuous", "transition", "thematic", "ornament")
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

class Reader(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.samples = {}
        self.current = None
        self.active_block = None
        self.depth = 0
        self.ids = []
        self.externals = []
        self.scripts = []
        self.handlers = []
        self.sample_depth = 0
        self.tags = []
        self.ornaments = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "script":
            self.scripts.append(tag)
        self.handlers.extend(k for k in a if k.startswith("on"))
        if "id" in a:
            self.ids.append(a["id"])
        for attr in ("src", "href"):
            if a.get(attr) and not a[attr].startswith("#"):
                self.externals.append(a[attr])
        if self.current is not None and tag not in VOID:
            self.sample_depth += 1
        if "data-document" in a or "data-variant" in a:
            assert tag == "article" and self.current is None
            key = (a.get("data-document"), a.get("data-variant"))
            assert key[0] in PROFILES and key[1] in VARIANTS
            self.current = key
            self.sample_depth = 1
            self.samples.setdefault(key, []).append({"blocks": [], "hr": 0, "glyph": 0, "transition": 0})
        if self.current is not None:
            specimen = self.samples[self.current][-1]
            if tag == "hr":
                specimen["hr"] += 1
            if "ornament-glyph" in a.get("class", "").split():
                specimen["glyph"] += 1
                self.ornaments.append(a.get("aria-hidden"))
            if "thought-start" in a.get("class", "").split():
                specimen["transition"] += 1
            if "data-block-id" in a:
                assert tag in ("p", "pre") and self.active_block is None
                self.active_block = {"id": a["data-block-id"], "text": [], "tag": tag}
                self.depth = 1
            elif self.active_block and tag not in VOID:
                self.depth += 1

    def handle_data(self, data):
        if self.active_block:
            self.active_block["text"].append(data)

    def handle_endtag(self, tag):
        if self.active_block:
            self.depth -= 1
            if self.depth == 0:
                b = self.active_block
                self.samples[self.current][-1]["blocks"].append((b["id"], " ".join(" ".join(b["text"]).split())))
                self.active_block = None
        if self.current is not None:
            self.sample_depth -= 1
            if self.sample_depth == 0:
                assert tag == "article"
                self.current = None

def validate(html: str, plan: dict) -> tuple[int, int]:
    parser = Reader()
    parser.feed(html)
    assert parser.current is None and parser.active_block is None, "unclosed specimen/block"
    assert not parser.scripts and not parser.handlers and not parser.externals, "no JS, handlers or external fetches permitted"
    assert len(parser.ids) == len(set(parser.ids)), "duplicate HTML IDs"
    expected = {(p,v) for p in PROFILES for v in VARIANTS}
    assert set(parser.samples) == expected and all(len(parser.samples[k]) == len(SCHEMES) for k in expected), "missing profile/scheme/variant specimen"
    assert html.count('data-fixture-scheme="light"') == 2 and html.count('data-fixture-scheme="dark"') == 2
    assert html.count('data-fixture-profile="utility"') == 2 and html.count('data-fixture-profile="editorial"') == 2
    assert "non-normative" in html and "no JavaScript" in html.lower().replace("no javascript", "no JavaScript"), "proposal banner missing"
    for profile in PROFILES:
        expected_blocks = None
        for variant in VARIANTS:
            for sample in parser.samples[(profile,variant)]:
                blocks = sample["blocks"]
                assert len(blocks) == (5 if profile == "utility" else 4)
                assert len({name for name, _ in blocks}) == len(blocks)
                assert all(text for _, text in blocks)
                if expected_blocks is None:
                    expected_blocks = blocks
                assert blocks == expected_blocks, f"content drift: {profile}/{variant}"
                assert sample["hr"] == (1 if variant in ("thematic", "ornament") else 0)
                assert sample["glyph"] == (1 if variant == "ornament" else 0)
                assert sample["transition"] == (1 if variant == "transition" else 0)
    assert parser.ornaments and all(v == "true" for v in parser.ornaments), "ornaments must be aria-hidden"
    assert html.count('class="thematic-rule"') == 8, "native thematic rules must be preserved"
    assert "@media (forced-colors:active)" in html and "@media print" in html
    assert not ("<script" in html.lower())
    assert plan["_note"].startswith("TEXT-001 synthetic"), "plan must be illustrative"
    assert plan["documentRevision"] == "fixture-revision-001"
    candidates = plan["suggestions"]
    assert len(candidates) == 4 and len({s["id"] for s in candidates}) == len(candidates)
    known = {"u-p1","u-p2","u-p3","u-p4","u-code","e-p1","e-p2","e-p3","e-p4"}
    assert all(s["source"] == "synthetic-editorial-example" and s["kind"] == "thematic-break" for s in candidates)
    valid = [s for s in candidates if s["reviewState"] == "accepted" and s["documentRevision"] == plan["documentRevision"] and s["afterBlockId"] in known]
    assert len(valid) == 1 and valid[0]["id"] == plan["approvedSuggestionId"] and valid[0]["afterBlockId"] == "u-p2"
    assert len([s for s in candidates if s["reviewState"] == "pending"]) == 1
    assert len([s for s in candidates if s["documentRevision"] != plan["documentRevision"]]) == 1
    assert len([s for s in candidates if s["afterBlockId"] not in known]) == 1
    return sum(len(v) for v in parser.samples.values()),len(valid)

def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: check-text-rhythm-fixture.py HTML JSON")
    html = Path(sys.argv[1]).read_text(encoding="utf-8")
    plan = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
    samples, valid = validate(html, plan)
    # Negative mutation assertions ensure the checker rejects malformed specimens.
    for broken_html in (html.replace('aria-hidden="true"','aria-hidden="false"',1),
                        html.replace('data-block-id="u-p2"','data-block-id="u-pX"',1),
                        html.replace('<hr class="thematic-rule">','',1),
                        html.replace('<main>','<main><script>alert(1)</script>',1)):
        try:
            validate(broken_html, plan)
        except AssertionError:
            pass
        else:
            raise AssertionError("structural guard accepted invalid specimen")
    broken_plan = dict(plan, documentRevision="different-revision")
    try:
        validate(html, broken_plan)
    except AssertionError:
        pass
    else:
        raise AssertionError("revision guard accepted wrong revision")
    print(f"TEXT-001 static fixture: PASS ({samples} specimens, {valid} illustrative approved suggestions)")
    print("Browser/rendering, screen-reader and semantic inference quality: NOT assessed")

if __name__ == "__main__":
    main()
