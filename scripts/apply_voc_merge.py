# -*- coding: utf-8 -*-
"""Merge curated v5 VOC into paisou-workshop.html."""
from pathlib import Path

HTML = Path(__file__).resolve().parents[1] / "client/public/paisou-workshop.html"

WHEN_CSS = """
  .when{margin-top:28px;background:#fff;border:1px solid var(--line);border-radius:12px;
    padding:22px 24px 20px;box-shadow:0 1px 0 var(--bg2),0 10px 24px -18px rgba(40,35,20,.4);}
  .when .wh-title{font-size:12.5px;letter-spacing:.16em;color:var(--note);font-weight:700;
    margin-bottom:14px;text-transform:uppercase;}
  .when .wh-title b{color:var(--ink);margin-right:8px;letter-spacing:.04em;text-transform:none;}
  .when ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:10px 22px;}
  @media(max-width:680px){.when ul{grid-template-columns:1fr;}}
  .when li{position:relative;padding-left:14px;font-size:14px;color:#34312b;line-height:1.7;}
  .when li::before{content:"";position:absolute;left:0;top:11px;width:5px;height:5px;
    border-radius:50%;background:var(--accent);}
  .when li .who{display:block;font-size:11.5px;color:var(--note);margin-top:2px;letter-spacing:.02em;}
  .evidence .voice-box.more-voc{margin-top:12px;padding-top:12px;border-top:1px dashed var(--line);}
  .evidence .voice-box.more-voc .mini-inline{font-size:11px;font-weight:700;color:var(--note);
    letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;}
"""

WHEN_BLOCK = """
    <div class="when">
      <div class="wh-title"><b>先用学生自己的话，一眼看清「拍搜出现在哪些时刻」</b></div>
      <ul>
        <li>写作业遇到难题不会的时候拍一下。<span class="who">— 初三学生</span></li>
        <li>作业不会写或者懒得思考的时候。<span class="who">— 小三学生</span></li>
        <li>写作业，把不会的一起查了，一科一科地，写完化学拍化学。<span class="who">— 徐同学 初二</span></li>
        <li>大部分是做作业，遇到不会的题就会去搜一下。<span class="who">— 初二学生</span></li>
        <li>针对错题，先自己写，过程卡住了就拍搜。<span class="who">— 吴语遥 初二</span></li>
        <li>中等题是高频——周内写作业，脑子绕不过来弯，知道答案但是自己证明会卡壳。<span class="who">— 丁同学 初三</span></li>
        <li>压轴大题没思路时，数学物理首选洋葱。<span class="who">— 丁同学 初三</span></li>
        <li>对完标准答案，遇到做错的题，想要有趣易懂的讲解。<span class="who">— 诺诗 初三</span></li>
        <li>父母不在、独自做作业卡壳时。<span class="who">— 梦梅 六年级</span></li>
        <li>奥数题父母都不会时。<span class="who">— 梦梅 六年级</span></li>
        <li>英语作业量大（十几页练习册）的时候。<span class="who">— 吕同学 初二</span></li>
        <li>做物理实验题或感觉拿不准的数学题。<span class="who">— 吕同学 初二</span></li>
        <li>写完作业之后用洋葱上课——听在学校没听懂的。<span class="who">— 吴语遥 初二</span></li>
        <li>考前复习时，把这学期的错题集中拍一遍。<span class="who">— 吴语遥 初二</span></li>
      </ul>
    </div>
"""

VOICES = {
    "吴语遥": """          <div class="voices">
            <div class="v">老师说不会的题别一直定着，联系不上老师就用「作业批改」。针对错题，先自己写，过程卡住了就拍搜。</div>
            <div class="v good">先看答案，再看它的过程，最后才看自己的过程。看完用精准学找同类题再做一遍——要是对了，那我就不管了。</div>
            <div class="v good">有一点思路，但过程卡住。</div>
            <div class="v good">洋葱使用：用于学习在学校没听懂的数学、物理知识点。</div>
            <div class="v good">写完作业之后用洋葱上课（听在学校没听懂的）。</div>
            <div class="v good">期末复习时，在洋葱里找试卷让父母打印下来做，不会的题用学习机学习，会出类似题目巩固。</div>
            <div class="v warm">DeepSeek 扣分就扣在它跳得太大，五步能从第一步直接跳到第四步，反应不过来。</div>
          </div>""",
    "徐同学": """          <div class="voices">
            <div class="v">急的时候开豆包，它更快；洋葱搜要挺长时间，还多一个框选的步骤，慢。</div>
            <div class="v">写作业，把不会的一起查了，一科一科地，写完化学拍化学。</div>
            <div class="v good">洋葱会用我能理解的角度讲，像拿杯子一样举例子，翻译成听得懂的通俗话，不是文绉绉的。看完解析换成自己的方式写，更符合老师要求，不容易扣分。</div>
            <div class="v good">豆包答案是错的，时间充足（七点半左右写完全部作业）就会用洋葱看课。有解题课就看课，解题课没有就拍题。</div>
            <div class="v good">洋葱适合时间充足的时候有耐心的学生用，目的是把这类题弄懂。</div>
            <div class="v good">物理的话，十次中有六七八次是看课。</div>
            <div class="v good">没做对就看解析和答案。解析看完，极大多数情况答案就会了（十次中有九次），会演算一遍。</div>
            <div class="v good">本学期上完同步课/培优课，用试卷库检验，试卷库的题，截屏拍洋葱、另一个手机拍。期中的时候也会用。</div>
            <div class="v warm">豆包有些答案经常是错的，第二天老师一讲才发现填错了。洋葱语文讲得和答案不符，上海版本也常常对不上。</div>
          </div>""",
    "小杰": """          <div class="voices">
            <div class="v">不会直接看答案，直接看答案没什么用。先看思路和解析，不明白再看视频，会做之后找两道题练。</div>
            <div class="v good">科大讯飞视频讲解和举一反三我能明白，题目难度有质量。小猿只要是举例子基本都能懂。</div>
            <div class="v good">以自己更容易理解的写法写在那个本子上——主要还是自己写，方便自己理解。</div>
            <div class="v">得分点很重要——老师注重过程，少写漏写一般扣3~4分。一开始照AI步骤写，验证几次发现能得分，之后就按自己理解写。</div>
          </div>""",
    "丁同学": """          <div class="voices">
            <div class="v">检查作业把所有题都拍给作业帮，一下出所有答案。要继续写作业，能越快越好——洋葱有点慢。</div>
            <div class="v">中等题是高频——周内写作业，脑子绕不过来弯，知道答案但是自己证明会卡壳。</div>
            <div class="v good">数学物理首选洋葱，能看到不一样的解法和相关的课程。压轴题用洋葱，想要一种不一样的方法。</div>
            <div class="v good">压轴大题没有思路时，首选洋葱——能看到不一样的解法和相关的课程。</div>
            <div class="v warm">洋葱政治历史科目覆盖少，拍不出答案——政治题被推到语文里边了。</div>
          </div>""",
    "吕同学": """          <div class="voices">
            <div class="v">怎么证（角的关系）少个条件，好像证进死角里了。第一眼看的是文字解析，重点看我不会那一步——看完之后捋思路，自己写一遍，按照自己的写。</div>
            <div class="v">英语作业量大（十几页练习册）的时候，或做物理实验题、感觉拿不准的数学题，会去搜一下。</div>
            <div class="v good">在作业帮发现知识点忘了，就去洋葱看一眼这个知识点视频，然后再回来再推一遍——10次得有5次这种操作。</div>
            <div class="v warm">老师说了，拍作业帮的肯定跟他的思路对不上，老师首先会怀疑你抄的答案。</div>
          </div>""",
    "诺诗": """          <div class="voices">
            <div class="v good">洋葱讲题语气委婉、温柔、有耐心——更像朋友，不像老师和长辈那么严肃。作业帮没有感情，只是单纯讲题，听不进去。</div>
            <div class="v good">洋葱帮我弄懂这道题是突然弄懂了——看了解题思路或解析的时候，恍然大悟，发现是上课讲过的。</div>
            <div class="v good">上一次做几何题，先看了一点点解析，突然想到老师上课讲到的知识点，突然就知道怎么做了。</div>
            <div class="v good">说明考的是哪个知识点的情况下，更容易有恍然大悟的感觉。</div>
            <div class="v good">洋葱比作业帮使用高频，原因是洋葱更容易理解，更有兴趣一点，作业帮讲得太无聊了。</div>
            <div class="v good">弄懂了会先自己写一遍，再用红笔标重点和步骤——自己写下来比较有成就感，抄步骤会有一点小小的罪恶感。</div>
          </div>""",
    "小林": """          <div class="voices">
            <div class="v good">用洋葱后数学从60多提到90多分。它的不可替代性是可以上课——看洋葱十道错5道，不看十道错8道。</div>
            <div class="v good">按题目难度，总的看，最多的是大题……十次中五六次用洋葱。</div>
            <div class="v good">特别难的视频看两三遍，在草稿纸上复刻，记进我专门的笔记本。在学校没手机，翻笔记本就还会做。</div>
            <div class="v warm">第一时间没想到洋葱，因为它没有对话框。我感觉计算怪怪的，就问豆包「哪一步错了」，它直接指出来。</div>
          </div>""",
}

PACK_EXTRA = {
    "01": """<div class="voice green">“洋葱会用一些从你理解得到的角度跟你讲……就比如像拿杯子一样，这种他会通过举例子的方式。”<span class="who">徐同学｜上海初二</span></div><div class="voice">“洋葱是一步步来的，会说这个步骤是怎么来的——第一步先说思路，再从思路里继续讲解。”<span class="who">诺诗｜湖南初三</span></div><div class="voice orange">“洋葱讲解题目是比豆包爱学更好的……比较适合那种想理解比较透彻的人。”<span class="who">初二学生</span></div><div class="voice">“作业帮和小猿讲得不够详细，结果导致没听懂还是没听懂，所以不会使用。”<span class="who">徐同学｜上海初二</span></div><div class="voice green">“它是启发思考，而不是直接给答案。”<span class="who">初一学生</span></div><div class="voice">“他会提问，不会让你直接抄答案……提问的方式非常好，肯定能帮到我。”<span class="who">初二学生</span></div><div class="voice orange">“是可以看懂的。如果我看不懂了，我是可以自己问它的。”<span class="who">初二学生</span></div><div class="voice">“它比如会有一些你不懂的地方，它可以利用、运用一些比喻，让你就更加生动形象地理解这个概念。”<span class="who">初二学生</span></div><div class="voice green">“老师讲的很好，我看一次就看懂了，后面做其他类型的题，只要跟这个同根同源，我基本上都能会。”<span class="who">初一学生</span></div><div class="voice">“我之前搜答案全都是只给结果不给过程，洋葱学院这个还有个性回答，还可以具体的给我们讲解过程，还可以问问题。”<span class="who">问卷星 #505｜初中1年级</span></div><div class="voice orange">“讲解的很详细，比较通俗易懂，尤其是可以提问这个功能，有不会的可以直接问，也会直接给出详细的解答。”<span class="who">问卷星 #672｜初中2年级</span></div><div class="voice green">“我有时只要快速出答案就够了，洋葱我是真的想要搞懂知识点才用。洋葱继续保持高品质，豆包只是极速助理，不要掉教学品质，不然我会员白买了。”<span class="who">问卷星 #306｜初中2年级</span></div>""",
    "02": """<div class="voice warm">“推荐视频有时和原题相似度不高，得自己强行关联逻辑。”<span class="who">小林｜南宁初一</span></div><div class="voice warm">“用平板学洋葱，遇到不会还得再用手机拍一张平板上的题。”<span class="who">徐同学｜上海初二</span></div><div class="voice warm">“较难类型的数学压轴题容易出现数据识别错误或者是计算错误。”<span class="who">初二学生</span></div><div class="voice">“可以直接拍题，然后就会出现相关题目的课程。”<span class="who">小六学生</span></div><div class="voice green">“写完作业之后用洋葱上课（听在学校没听懂的）。”<span class="who">吴语遥｜苏州初二</span></div><div class="voice orange">“洋葱使用：用于学习在学校没听懂的数学、物理知识点。”<span class="who">吴语遥｜苏州初二</span></div><div class="voice">“压轴大题没有思路时，首选洋葱——能看到不一样的解法和相关的课程。”<span class="who">丁同学｜安徽初三</span></div><div class="voice green">“洋葱的不可替代性是可以上课——看洋葱十道错5道，不看错8道。”<span class="who">小林｜南宁初一</span></div><div class="voice">“物理的话，十次中有六七八次是看课。”<span class="who">徐同学｜上海初二</span></div><div class="voice orange">“期末复习时，在洋葱里找试卷让父母打印下来做，不会的题用学习机学习，会出类似题目巩固。”<span class="who">吴语遥｜苏州初二</span></div><div class="voice">“它里面没有推荐相关知识点，但是洋葱推荐了比较好……如果洋葱也有类似的AI助手可以互动聊天，那肯定是选洋葱啊。”<span class="who">AI访谈 #80｜初中3年级</span></div>""",
    "03": """<div class="voice green">“洋葱帮我弄懂这道题是突然弄懂了——看了解题思路或解析的时候，恍然大悟，发现是上课讲过的。”<span class="who">诺诗｜湖南初三</span></div><div class="voice">“用洋葱这种情况会比作业帮多——突然想起来老师在课上讲了这个知识点。”<span class="who">诺诗｜湖南初三</span></div><div class="voice orange">“上一次做几何题，先看了一点点解析，突然想到老师上课讲到的知识点，突然就知道怎么做了。”<span class="who">诺诗｜湖南初三</span></div><div class="voice green">“说明考的是哪个知识点的情况下，更容易有恍然大悟的感觉。”<span class="who">诺诗｜湖南初三</span></div><div class="voice">“老师总是会一针见血地指出题目关键点，使一直搞不懂的题目一下被点醒。”<span class="who">问卷星 #707｜初中1年级</span></div>""",
    "04": """<div class="voice green">“以自己更容易理解的写法写在那个本子上——主要还是自己写，方便自己理解。”<span class="who">小杰｜广东初一</span></div><div class="voice">“面对数学大题，不仅要做对，更要像复刻「母题」一样彻底吃透逻辑，形成可在学校使用的知识资产。”<span class="who">小林｜南宁初一</span></div><div class="voice orange">“按题目难度，总的看，最多的是大题……十次中五六次用洋葱。”<span class="who">小林｜南宁初一</span></div>""",
    "05": """<div class="voice green">“看到解析会换一种方式写到作业上，更符合老师要求，不容易扣分。格式好，更规范。”<span class="who">徐同学｜上海初二</span></div>""",
    "06": """<div class="voice orange">“洋葱比作业帮使用高频，原因是洋葱更容易理解，更有兴趣一点，作业帮讲得太无聊了。”<span class="who">诺诗｜湖南初三</span></div>""",
}


def inject_pack(html: str, num: str, extra: str) -> str:
    marker = f'<div class="num">{num}</div>'
    idx = html.find(marker)
    if idx < 0:
        raise SystemExit(f"pack {num} not found")
    vb = html.find('<div class="voice-box">', idx)
    if vb < 0:
        raise SystemExit(f"voice-box for pack {num} not found")
    end = html.find("</div>", vb + 20)
    # first voice-box closes at first </div> after opening - wrong, nested divs
    depth = 0
    pos = vb
    while pos < len(html):
        if html.startswith("<div", pos):
            depth += 1
            pos = html.find(">", pos) + 1
            continue
        if html.startswith("</div>", pos):
            depth -= 1
            pos += 6
            if depth == 0:
                end = pos
                break
            continue
        pos += 1
    insert = (
        f'<div class="voice-box more-voc"><div class="mini-inline">v5 补充原声</div>{extra}</div>'
    )
    return html[:end] + insert + html[end:]


def main():
    html = HTML.read_text(encoding="utf-8")

    if ".when{" not in html:
        html = html.replace(
            "  .scenes{margin-top:30px;display:grid;gap:18px;}",
            "  .scenes{margin-top:30px;display:grid;gap:18px;}" + WHEN_CSS,
        )

    if 'class="when"' not in html:
        html = html.replace('<div class="scenes">', WHEN_BLOCK + '\n    <div class="scenes">', 1)

    import re
    for who, voices in VOICES.items():
        html = re.sub(
            rf'(<span class="who">{re.escape(who)}</span>.*?)<div class="voices">.*?</div>\s*<p class="tag">',
            rf'\1{voices}\n          <p class="tag">',
            html,
            count=1,
            flags=re.S,
        )

    for num, extra in PACK_EXTRA.items():
        html = inject_pack(html, num, extra)

    HTML.write_text(html, encoding="utf-8")
    print(f"updated {HTML}")


if __name__ == "__main__":
    main()
