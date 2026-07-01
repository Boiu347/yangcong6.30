from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
page = ROOT / "client/public/paisou-workshop.html"
frag = (ROOT / "client/public/jtbd-table.fragment.html").read_text(encoding="utf-8").strip()
text = page.read_text(encoding="utf-8")
marker_start = '<div class="jtbd-table-wrap">'
marker_end = "</tbody></table></div>"
start = text.index(marker_start)
end = text.index(marker_end, start) + len(marker_end)
page.write_text(text[:start] + frag + text[end:], encoding="utf-8")
print("embedded", len(frag), "chars")
