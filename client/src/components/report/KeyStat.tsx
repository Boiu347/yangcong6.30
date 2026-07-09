import React from 'react';
import { cn } from '@/lib/utils';

/**
 * 数字锚点：把埋在段落里的关键数据（如 53% / 40% / 29%）提到卡片顶部，
 * 做成带进度条的 chip，作为视觉钩子（对应「视觉锚点」原理）。
 */

export interface Stat {
  value: string;
  label?: string;
}

/** 从一段文字里抽取「名词 + 百分比」形式的关键数据 */
const STAT_STOPWORDS = new Set([
  '从',
  '到',
  '占',
  '约',
  '超过',
  '提升',
  '提升到',
  '达到',
  '接受度',
  '占比',
  '比例',
]);

export function extractStats(text: string | undefined, max = 3): Stat[] {
  if (!text) return [];
  const out: Stat[] = [];
  const seen = new Set<string>();
  const re = /([\u4e00-\u9fa5]{2,8})?\s*(\d+(?:\.\d+)?%)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null && out.length < max) {
    const value = match[2];
    if (seen.has(value)) continue;
    seen.add(value);
    let label: string | undefined = match[1]?.trim();
    if (label && STAT_STOPWORDS.has(label)) label = undefined;
    out.push({ value, label });
  }
  return out;
}

function toPercent(value: string): number | null {
  const m = value.match(/(\d+(?:\.\d+)?)%/);
  if (!m) return null;
  return Math.min(100, parseFloat(m[1]));
}

export interface KeyStatProps {
  stats: Stat[];
  color?: string;
  className?: string;
}

export function KeyStat({ stats, color = '#E95B35', className }: KeyStatProps) {
  if (!stats.length) return null;
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {stats.map((stat, index) => {
        const percent = toPercent(stat.value);
        return (
          <div
            key={stat.value + index}
            className="min-w-[96px] flex-1 rounded-[12px] border border-[#EADFD2] bg-white px-3 py-2.5"
          >
            <div className="text-[22px] font-black leading-none" style={{ color }}>
              {stat.value}
            </div>
            {stat.label && (
              <div className="mt-1 text-[11px] font-bold leading-4 text-[#8A8279]">{stat.label}</div>
            )}
            {percent !== null && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F0E7DB]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percent}%`, backgroundColor: color }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default KeyStat;
