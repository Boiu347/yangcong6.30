import React from 'react';
import { BookOpenCheck, Lightbulb } from 'lucide-react';
import { HighlightText } from './HighlightText';
import { KeyStat, extractStats } from './KeyStat';
import { Disclosure } from './Disclosure';
import { firstSentence, restAfterFirstSentence } from './reportText';

/**
 * 关键洞察三层化：金句判断（一级，大字+高亮）+ 数字锚点 + 折叠完整洞察（三级）。
 * 两个结论页共用，保证风格统一。
 */

export interface InsightHeadlineProps {
  insight: string;
  color?: string;
  /** 用于抽取数字锚点的文案来源（如 evidenceNote / conclusion） */
  statsSource?: string;
  className?: string;
}

export function InsightHeadline({
  insight,
  color = '#E95B35',
  statsSource,
  className,
}: InsightHeadlineProps) {
  const headline = firstSentence(insight);
  const rest = restAfterFirstSentence(insight);
  const stats = extractStats(statsSource);
  return (
    <div
      className={className}
      style={{
        border: `1px solid ${color}40`,
        backgroundColor: `${color}0D`,
        borderRadius: 16,
        padding: 20,
      }}
    >
      <div className="flex items-center gap-2 text-[12px] font-black tracking-[0.08em]" style={{ color }}>
        <Lightbulb size={15} />
        一句话判断
      </div>
      <p className="mt-2 text-[19px] font-black leading-8 text-[#292521] md:text-[21px]">
        <HighlightText color={color}>{headline}</HighlightText>
      </p>
      {stats.length > 0 && <KeyStat stats={stats} color={color} className="mt-4" />}
      {rest && (
        <Disclosure label="展开完整洞察" color={color} icon={<BookOpenCheck size={13} />} className="mt-4">
          <p className="text-[14px] font-semibold leading-7 text-[#403A34]">
            <HighlightText color={color}>{rest}</HighlightText>
          </p>
        </Disclosure>
      )}
    </div>
  );
}

export default InsightHeadline;
