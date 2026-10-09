#!/usr/bin/env python3
"""Validate the static, non-normative SPACE-001 comparison fixture.

Structural checks only: not screenshot, browser zoom, or a11y conformance evidence.
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


DENSITIES = ("compact", "comfortable", "spacious")
BLOCKS = ("sections", "grid", "controls", "prose", "status")
VARIABLES = (
    "--sample-gutter", "--sample-section", "--sample-group",
    "--sample-inset", "--sample-paragraph", "--sample-cell",
)


class FixtureParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.samples = []
        self.ids = []
        self.blocks = {}
        self.sample = None
        self.block = None
        self.block_depth = 0
        self.scripts = []
        self.externals = []
        self.event_handlers = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "script":
            self.scripts.append(tag)
        self.event_handlers.extend(k for k in a if k.startswith("on"))
        if "id" in a:
            self.ids.append(a["id"])
        for name in ("src", "href"):
            value = a.get(name, "")
            if value and not value.startswith("#"):
                self.externals.append(value)
        if self.block is not None and tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}:
            self.block_depth += 1
        if "data-density" in a:
            assert tag == "article" and self.sample is None
            self.sample = a["data-density"]
            self.samples.append(self.sample)
            self.blocks[self.sample] = {}
        if "data-sample-block" in a:
            assert tag == "section" and self.sample is not None and self.block is None
            self.block = a["data-sample-block"]
            self.block_depth = 1
            self.blocks[self.sample][self.block] = []

    def handle_data(self, value):
        if self.block is not None:
            self.blocks[self.sample][self.block].append(value.strip())

    def handle_endtag(self, tag):
        if self.block is not None:
            self.block_depth -= 1
            if self.block_depth == 0:
                self.block = None
        if tag == "article" and self.block is None:
            self.sample = None


def inspect(content):
    parser = FixtureParser()
    parser.feed(content)
    assert tuple(parser.samples) == DENSITIES, f"specimens: {parser.samples}"
    assert len(parser.ids) == len(set(parser.ids)), "duplicate HTML ids"
    assert not parser.scripts and not parser.event_handlers, "script/event handler not allowed"
    assert not parser.externals, f"external resources: {parser.externals}"
    assert "not a public" in content or "not a released" in content
    baseline = None
    for density in DENSITIES:
        assert tuple(parser.blocks[density]) == BLOCKS, f"blocks for {density}"
        text = tuple(" ".join(" ".join(parser.blocks[density][b]).split()) for b in BLOCKS)
        if baseline is None:
            baseline = text
        else:
            assert text == baseline, f"content drift in {density}"
    css = {}
    for density, body in re.findall(
        r'\.sample\[data-density="(compact|comfortable|spacious)"\]\s*\{([^{}]+)\}', content
    ):
        assert density not in css, f"duplicate density style: {density}"
        css[density] = {
            name: float(value)
            for name, value in re.findall(r'(--sample-[\w-]+)\s*:\s*(\d*\.?\d+)rem\s*;', body)
        }
        assert set(css[density]) == set(VARIABLES), f"missing or extra values in {density}"
    assert set(css) == set(DENSITIES), "candidate density styles not present"
    for name in VARIABLES:
        values = [css[d][name] for d in DENSITIES]
        assert values == sorted(values) and len(set(values)) == len(values), (name, values)
    assert "min(100%, 22rem)" in content, "missing narrow-screen intrinsic reflow"
    assert ":focus-visible" in content, "missing focus indicator"
    return len(parser.samples), sum(len(x) for x in parser.blocks.values())


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: check-spatial-fixture.py PATH")
    samples, blocks = inspect(Path(sys.argv[1]).read_text(encoding="utf-8"))
    print(f"SPACE-001 static fixture: PASS ({samples} specimens, {blocks} matching content blocks)")
    print("Browser, zoom, screenshot and human-review evidence: NOT assessed")


if __name__ == "__main__":
    main()
