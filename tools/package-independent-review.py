#!/usr/bin/env python3
"""Build or verify a deterministic, public-only offline Phyllotaxis review packet.

Only these five explicit public files may appear in the archive. Does not
contain participant responses, private implementation or workflow artifacts.
"""
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

FILES = (
    ("docs/examples/independent-review-participant-README.md", "README.md"),
    ("docs/examples/dimensional-utility-review-session.html", "docs/examples/dimensional-utility-review-session.html"),
    ("docs/examples/dimensional-utility-reference.html", "docs/examples/dimensional-utility-reference.html"),
    ("docs/examples/dimensional-utility-boundaries.html", "docs/examples/dimensional-utility-boundaries.html"),
    ("docs/architecture/dimensional-utility-human-review-worksheet.md", "docs/architecture/dimensional-utility-human-review-worksheet.md"),
)


def source_bytes(root: Path, source: str) -> bytes:
    p = root / source
    if not p.is_file() or p.is_symlink():
        raise ValueError(f"Missing or linked input file: {source}")
    return p.read_bytes()


def write_archive(root: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(dest, "w") as out:
        for source, target in FILES:
            item = ZipInfo(target, date_time=(1980, 1, 1, 0, 0, 0))
            item.compress_type = ZIP_DEFLATED
            item.external_attr = 0o100644 << 16
            out.writestr(item, source_bytes(root, source))


def verify_archive(root: Path, dest: Path) -> None:
    expected = [target for _, target in FILES]
    with ZipFile(dest, "r") as archive:
        names = archive.namelist()
        if names != expected or archive.testzip() is not None:
            raise ValueError(f"Unexpected ZIP contents: {names!r}, expected {expected!r}")
        for source, target in FILES:
            if archive.read(target) != source_bytes(root, source):
                raise ValueError(f"Source/ZIP byte mismatch: {source} -> {target}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--archive", type=Path, required=True)
    parser.add_argument("--verify-only", action="store_true")
    args = parser.parse_args()
    root = args.root.resolve()
    archive = args.archive.resolve()
    if not args.verify_only:
        write_archive(root, archive)
    verify_archive(root, archive)
    print(f"PASS: {len(FILES)} exact public files; SHA256={hashlib.sha256(archive.read_bytes()).hexdigest()}")


if __name__ == "__main__":
    main()
