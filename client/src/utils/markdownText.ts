/**
 * CommonMark 在「**标签：**正文」或「**标签**正文」里，闭合 ** 后若紧跟文字，
 * 加粗常会解析失败并原样露出星号。给闭合 ** 后补一个空格即可恢复。
 */
export function normalizeMarkdownEmphasis(markdown: string): string {
  return markdown.replace(/\*\*([^*\n]+)\*\*(?=[^\s*\n])/g, '**$1** ');
}
