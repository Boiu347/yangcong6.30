/**
 * CommonMark 在「**标签：**正文」或「**标签**正文」里，闭合 ** 后若紧跟文字，
 * 加粗常会解析失败并原样露出星号。给闭合 ** 后补一个空格即可恢复。
 */
export function normalizeMarkdownEmphasis(markdown: string): string {
  return markdown.replace(/\*\*([^*\n]+)\*\*(?=[^\s*\n])/g, '**$1** ');
}

export interface MarkdownResearchObjective {
  number: string;
  title: string;
  question: string;
  value: string;
}

export interface MarkdownWithResearchObjectives {
  before: string;
  objectives: MarkdownResearchObjective[];
  after: string;
}

/**
 * 把「## 研究目标」下的三级标题与两条说明提取为卡片数据，
 * 同时保留该章节前后的 Markdown，供页面继续正常渲染。
 */
export function extractResearchObjectives(
  markdown: string,
): MarkdownWithResearchObjectives | null {
  const headingMatch = /^##\s+研究目标\s*$/m.exec(markdown);
  if (!headingMatch || headingMatch.index === undefined) return null;

  const sectionStart = headingMatch.index;
  const bodyStart = sectionStart + headingMatch[0].length;
  const rest = markdown.slice(bodyStart);
  const nextHeading = /^##\s+/m.exec(rest);
  const bodyEnd = nextHeading?.index ?? rest.length;
  const sectionBody = rest.slice(0, bodyEnd);

  const objectiveHeadings = Array.from(
    sectionBody.matchAll(/^###\s+(\d+)\.\s+(.+)\s*$/gm),
  );
  if (objectiveHeadings.length === 0) return null;

  const objectives = objectiveHeadings.map((heading, index) => {
    const blockStart = (heading.index ?? 0) + heading[0].length;
    const blockEnd = objectiveHeadings[index + 1]?.index ?? sectionBody.length;
    const block = sectionBody.slice(blockStart, blockEnd);
    const question = block.match(
      /^-\s+\*\*研究需回答[：:]\*\*\s*(.+)\s*$/m,
    )?.[1];
    const value = block.match(
      /^-\s+\*\*业务价值[：:]\*\*\s*(.+)\s*$/m,
    )?.[1];

    return {
      number: heading[1],
      title: heading[2].trim(),
      question: question?.trim() ?? '',
      value: value?.trim() ?? '',
    };
  });

  return {
    before: markdown.slice(0, sectionStart).trimEnd(),
    objectives,
    after: rest.slice(bodyEnd).trimStart(),
  };
}
