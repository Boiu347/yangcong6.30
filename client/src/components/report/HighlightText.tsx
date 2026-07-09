import React from 'react';

/**
 * 结论正文高亮：把「数字/百分比/金额」和一份受控关键词清单用强调色标出，
 * 让用户扫读就能抓到重点，而不用逐句读完整段（对应「信息层级」原理）。
 */

const NUMBER_PATTERN = [
  String.raw`\d+(?:\.\d+)?%`, // 53%
  String.raw`\d+(?:\.\d+)?\s*元`, // 400 元
  String.raw`\d+\s*-\s*\d+\s*年级`, // 1-4 年级
  String.raw`\d+\s*年级`, // 5 年级
  String.raw`\d+(?:\.\d+)?\s*次`, // 86 次
  String.raw`\d[\d,]*\+`, // 300+、900+
  String.raw`\d{4,}`, // 1353
].join('|');

/** 默认关键词：小学物理学科启蒙项目里反复出现、值得被记住的核心词 */
export const DEFAULT_KEYWORDS = [
  '学科启蒙',
  '效果外化',
  '儿童化',
  '决策漏斗',
  '启蒙',
  '体系',
  '概念',
  '同步',
  '实验',
  '兴趣',
  '蓝海',
  '专业',
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildRegex(keywords: string[]): RegExp {
  const escaped = keywords
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp);
  return new RegExp(`(${[NUMBER_PATTERN, ...escaped].join('|')})`, 'g');
}

export interface HighlightTextProps {
  children?: string | null;
  /** 需要额外高亮的关键词；缺省用 DEFAULT_KEYWORDS */
  keywords?: string[];
  /** 强调色，默认洋葱橙 */
  color?: string;
  /** 外层包裹标签，默认 span；传 false 时用 Fragment */
  as?: 'span' | 'p' | false;
  className?: string;
}

export function HighlightText({
  children,
  keywords = DEFAULT_KEYWORDS,
  color = '#E95B35',
  as = false,
  className,
}: HighlightTextProps) {
  const text = children ?? '';
  const regex = React.useMemo(() => buildRegex(keywords), [keywords]);

  const nodes = React.useMemo(() => {
    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) result.push(text.slice(lastIndex, match.index));
      const value = match[0];
      const isNumber = /\d/.test(value);
      result.push(
        <mark
          key={`hl-${key++}`}
          style={{
            backgroundColor: isNumber ? `${color}1A` : 'transparent',
            color,
            fontWeight: 800,
            padding: isNumber ? '0 3px' : undefined,
            borderRadius: isNumber ? 4 : undefined,
          }}
        >
          {value}
        </mark>,
      );
      lastIndex = match.index + value.length;
      if (match.index === regex.lastIndex) regex.lastIndex++;
    }
    if (lastIndex < text.length) result.push(text.slice(lastIndex));
    return result;
  }, [text, regex, color]);

  if (as === 'p') return <p className={className}>{nodes}</p>;
  if (as === 'span') return <span className={className}>{nodes}</span>;
  return <>{nodes}</>;
}

export default HighlightText;
