/** 结论文案分层工具：把长段落拆成「金句首句」+「其余展开内容」。 */

/** 取第一句（到第一个 。！？ 为止）作为金句判断，用于一级信息大字展示。 */
export function firstSentence(text: string | undefined): string {
  const trimmed = (text ?? '').trim();
  if (!trimmed) return '';
  const match = trimmed.match(/^[^。！？]*[。！？]?/);
  return (match?.[0] ?? trimmed).trim();
}

/** 取金句之外的剩余段落，收进三级折叠。 */
export function restAfterFirstSentence(text: string | undefined): string {
  const trimmed = (text ?? '').trim();
  if (!trimmed) return '';
  const first = firstSentence(trimmed);
  return trimmed.slice(first.length).trim();
}
