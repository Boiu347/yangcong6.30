# -*- coding: utf-8 -*-
"""Extract JTBD table from Feishu doc and emit HTML fragment."""
from __future__ import annotations

import html
import json
import re
import subprocess
from pathlib import Path

DOC = "https://guanghe.feishu.cn/wiki/PWA5wZGawiTvS2kK6aGcrBP5nWc"

STUDENT_TYPE_COL = 2
JTBD_COL = 7
GROUP_COL = 0
SIMPLE_COLS = {3, 4, 5, 6}
SCENE_COL = 1


def strip_tags(s: str) -> str:
    s = re.sub(r"<blockquote>.*?</blockquote>", " ", s, flags=re.S)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def apply_highlights(raw: str) -> str:
    raw = re.sub(
        r"<b>\s*<u>(.*?)</u>\s*</b>",
        lambda m: f'<span class="jtbd-hl">{html.escape(strip_tags(m.group(1)))}</span>',
        raw,
        flags=re.S,
    )
    raw = re.sub(
        r"<u>(.*?)</u>",
        lambda m: f'<span class="jtbd-hl">{html.escape(strip_tags(m.group(1)))}</span>',
        raw,
        flags=re.S,
    )
    raw = re.sub(
        r"<code>(.*?)</code>",
        lambda m: f'<span class="jtbd-tag">{html.escape(strip_tags(m.group(1)))}</span>',
        raw,
        flags=re.S,
    )
    return raw


def flatten_bold(raw: str) -> str:
    return re.sub(r"</?b>", "", raw, flags=re.I)


def sanitize_paragraph(raw: str) -> str:
    raw = re.sub(r"</?p[^>]*>", "", raw, flags=re.I)
    raw = re.sub(r"<ol>.*?</ol>", "", raw, flags=re.S)
    raw = apply_highlights(raw)
    raw = flatten_bold(raw)
    raw = re.sub(r"<br\s*/?>", "<br>", raw, flags=re.I)

    chunks: list[str] = []
    for m in re.finditer(
        r'<span class="jtbd-(?:tag|hl)">.*?</span>|<br>|[^<]+',
        raw,
        flags=re.S,
    ):
        chunk = m.group(0)
        if chunk.startswith("<"):
            chunks.append(chunk)
        else:
            text = strip_tags(chunk)
            if text:
                chunks.append(html.escape(text))
    return "".join(chunks).strip()


def sanitize_inline(raw: str, *, lists: bool = True) -> str:
    raw = raw.strip()
    if not raw:
        return ""

    raw = re.sub(r"<blockquote>.*?</blockquote>", " ", raw, flags=re.S)
    parts: list[str] = []

    if lists:
        item_num = 0
        for ol in re.findall(r"<ol>(.*?)</ol>", raw, flags=re.S):
            items = re.findall(r"<li[^>]*>(.*?)</li>", ol, flags=re.S)
            for item in items:
                inner = sanitize_paragraph(item)
                if inner:
                    item_num += 1
                    parts.append(f"<p><b>{item_num}.</b> {inner}</p>")
            raw = raw.replace(ol, "")

    raw = re.sub(r"<ol>.*?</ol>", "", raw, flags=re.S)
    main = sanitize_paragraph(raw)
    if main:
        parts.insert(0, f"<p>{main}</p>")
    return "".join(parts)


def split_paragraphs(raw: str) -> list[str]:
    paras = re.findall(r"<p[^>]*>(.*?)</p>", raw, flags=re.S)
    if paras:
        return [strip_tags(p) for p in paras if strip_tags(p)]
    parts = re.split(r"<br\s*/?>", raw, flags=re.I)
    return [strip_tags(p) for p in parts if strip_tags(p)]


def format_simple_cell(raw: str) -> str:
    paras = re.findall(r"<p[^>]*>(.*?)</p>", raw, flags=re.S)
    if paras:
        rendered = [sanitize_paragraph(f"<p>{p}</p>") for p in paras]
        rendered = [r for r in rendered if r]
        if rendered:
            return f"<p>{'<br>'.join(rendered)}</p>"
    inner = sanitize_paragraph(raw)
    return f"<p>{inner}</p>" if inner else ""


def format_student_type(raw: str) -> str:
    labels = split_paragraphs(raw)
    if not labels:
        text = strip_tags(raw)
        labels = [t.strip() for t in re.split(r"[\s\n]+", text) if t.strip()]
    if not labels:
        return format_simple_cell(raw)
    spans = "".join(f'<span class="vtext">{html.escape(l)}</span>' for l in labels)
    return f'<div class="vtext-wrap">{spans}</div>'


def format_group_cell(raw: str) -> str:
    lines = split_paragraphs(raw)
    if len(lines) >= 2:
        return "".join(f'<span class="vtext">{html.escape(ln)}</span>' for ln in lines)
    text = strip_tags(raw)
    known = {
        "第一时间看答案": ["第一时间", "看答案"],
        "第一时间看解析和步骤": ["第一时间", "看解析和步骤"],
    }
    if text in known:
        lines = known[text]
        return "".join(f'<span class="vtext">{html.escape(ln)}</span>' for ln in lines)
    return format_simple_cell(raw)


def cell_html(raw: str, col: int | None = None) -> str:
    raw = raw.strip()
    if not raw:
        return ""
    if col == STUDENT_TYPE_COL:
        return format_student_type(raw)
    if col == GROUP_COL:
        return format_group_cell(raw)
    if col == SCENE_COL:
        inner = sanitize_paragraph(raw)
        return f"<p>{inner}</p>" if inner else ""
    if col == JTBD_COL:
        return sanitize_inline(raw, lists=True)
    if col in SIMPLE_COLS:
        return format_simple_cell(raw)
    return sanitize_inline(raw, lists=False)


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
                carried = span_carry[col]
                row.append({**carried, "_reuse": True, "_col": col})
                if carried["rowspan"] <= 1:
                    del span_carry[col]
                else:
                    span_carry[col] = {**carried, "rowspan": carried["rowspan"] - 1}
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
                "raw": inner,
                "html": "",
                "rowspan": rs,
                "colspan": cs,
                "_reuse": False,
                "_col": col,
            }
            row.append(cell)
            if rs > 1:
                span_carry[col] = {**cell, "rowspan": rs - 1}
            col += cs
        grid.append(row)
    return grid


def col_class(col: int) -> str | None:
    if col == STUDENT_TYPE_COL:
        return "jtbd-student-type"
    if col == GROUP_COL:
        return "jtbd-group"
    if col == JTBD_COL:
        return "jtbd-summary"
    return None


def emit_html(grid: list[list[dict]]) -> str:
    if not grid:
        return ""
    head = grid[0]
    body = grid[1:]

    for row in grid:
        for cell in row:
            if not cell.get("_reuse"):
                cell["html"] = cell_html(cell["raw"], cell.get("_col"))

    lines = ['<div class="jtbd-table-wrap"><table class="jtbd-table"><thead><tr>']
    for cell in head:
        text = strip_tags(cell["raw"]) or strip_tags(cell.get("html", ""))
        lines.append(f'<th colspan="{cell["colspan"]}">{html.escape(text)}</th>')
    lines.append("</tr></thead><tbody>")

    for row in body:
        lines.append("<tr>")
        for cell in row:
            if cell.get("_reuse"):
                continue
            attrs: list[str] = []
            if cell["rowspan"] > 1:
                attrs.append(f'rowspan="{cell["rowspan"]}"')
            if cell["colspan"] > 1:
                attrs.append(f'colspan="{cell["colspan"]}"')
            cls = col_class(cell.get("_col", -1))
            if cls:
                attrs.append(f'class="{cls}"')
            attr_s = (" " + " ".join(attrs)) if attrs else ""
            lines.append(f"<td{attr_s}>{cell['html']}</td>")
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
