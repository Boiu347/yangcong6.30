# -*- coding: utf-8 -*-
"""Extract JTBD table from Feishu doc and emit HTML fragment."""
from __future__ import annotations

import html
import json
import re
import subprocess
import sys
from pathlib import Path

DOC = "https://guanghe.feishu.cn/wiki/PWA5wZGawiTvS2kK6aGcrBP5nWc"


def strip_tags(s: str) -> str:
    s = re.sub(r"<blockquote>.*?</blockquote>", " ", s, flags=re.S)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def cell_html(raw: str) -> str:
    raw = raw.strip()
    if not raw:
        return ""
    # preserve short code labels
    raw = re.sub(
        r"<code>(.*?)</code>",
        lambda m: f'<span class="jtbd-tag">{html.escape(strip_tags(m.group(1)))}</span>',
        raw,
        flags=re.S,
    )
    # lists -> compact paragraphs
    parts: list[str] = []
    for ol in re.findall(r"<ol>(.*?)</ol>", raw, flags=re.S):
        items = re.findall(r"<li[^>]*>(.*?)</li>", ol, flags=re.S)
        for i, item in enumerate(items, 1):
            t = strip_tags(item)
            if t:
                parts.append(f"<p><b>{i}.</b> {html.escape(t)}</p>")
        raw = raw.replace(ol, "")
    main = strip_tags(raw)
    if main:
        parts.insert(0, f"<p>{html.escape(main)}</p>")
    return "".join(parts)


def fetch_content() -> str:
    import shutil

    cli = shutil.which("lark-cli.cmd") or shutil.which("lark-cli")
    if not cli:
        raise RuntimeError("lark-cli not found in PATH")
    cmd = [
        cli,
        "docs",
        "+fetch",
        "--api-version",
        "v2",
        "--doc",
        DOC,
        "--as",
        "user",
        "--format",
        "json",
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        raise RuntimeError(r.stderr or r.stdout)
    data = json.loads(r.stdout)
    return data["data"]["document"]["content"]


def find_table(content: str) -> str:
    marker = "Finding：待办任务整理和总结"
    idx = content.find(marker)
    if idx < 0:
        idx = content.find("待办任务整理")
    if idx < 0:
        raise ValueError("JTBD table marker not found")
    sub = content[idx:]
    m = re.search(r"<table>(.*?)</table>", sub, re.S)
    if not m:
        raise ValueError("table not found after marker")
    return m.group(1)


def parse_table(table_html: str) -> list[list[dict]]:
    rows_html = re.findall(r"<tr>(.*?)</tr>", table_html, re.S)
    grid: list[list[dict]] = []
    span_carry: dict[int, dict] = {}

    for row_html in rows_html:
        row: list[dict] = []
        col = 0
        cells = re.findall(r"<td([^>]*)>(.*?)</td>", row_html, re.S)
        for attrs, inner in cells:
            while col in span_carry:
                row.append(span_carry[col])
                span_carry[col]["_reuse"] = True
                if span_carry[col]["rowspan"] <= 1:
                    del span_carry[col]
                else:
                    span_carry[col]["rowspan"] -= 1
                col += 1

            rs = 1
            cs = 1
            m = re.search(r'rowspan="(\d+)"', attrs)
            if m:
                rs = int(m.group(1))
            m = re.search(r'colspan="(\d+)"', attrs)
            if m:
                cs = int(m.group(1))
            cell = {
                "html": cell_html(inner),
                "rowspan": rs,
                "colspan": cs,
                "_reuse": False,
            }
            row.append(cell)
            if rs > 1:
                span_carry[col] = {**cell, "rowspan": rs - 1}
            col += cs
        grid.append(row)
    return grid


def emit_html(grid: list[list[dict]]) -> str:
    if not grid:
        return ""
    head = grid[0]
    body = grid[1:]
    lines = ['<div class="jtbd-table-wrap"><table class="jtbd-table"><thead><tr>']
    for cell in head:
        text = strip_tags(cell["html"]) or cell["html"]
        lines.append(f'<th colspan="{cell["colspan"]}">{html.escape(text)}</th>')
    lines.append("</tr></thead><tbody>")

    for row in body:
        lines.append("<tr>")
        for cell in row:
            if cell.get("_reuse"):
                continue
            attrs = []
            if cell["rowspan"] > 1:
                attrs.append(f'rowspan="{cell["rowspan"]}"')
            if cell["colspan"] > 1:
                attrs.append(f'colspan="{cell["colspan"]}"')
            cls = []
            if cell["html"].startswith("<p>") and len(row) == 1:
                cls.append("jtbd-cell-wide")
            attr_s = (" " + " ".join(attrs)) if attrs else ""
            class_s = f' class="{" ".join(cls)}"' if cls else ""
            lines.append(f"<td{class_s}{attr_s}>{cell['html']}</td>")
        lines.append("</tr>")
    lines.append("</tbody></table></div>")
    return "\n".join(lines)


def main():
    content = fetch_content()
    table = find_table(content)
    grid = parse_table(table)
    out = emit_html(grid)
    out_path = Path(__file__).resolve().parents[1] / "client/public/jtbd-table.fragment.html"
    out_path.write_text(out, encoding="utf-8")
    print(out_path)
    print(f"rows: {len(grid)}")


if __name__ == "__main__":
    main()
