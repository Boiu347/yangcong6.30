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

/**
 * 从一段文字里抽取「名词 + 百分比」形式的关键数据。
 * 只保留标签干净的数字：像「提升到 40%」这类前面只有方位/动词的，
 * 清洗后标签为空，就整条丢弃（避免出现没头没尾的孤立数字）。
 */

// 需要从标签首尾剥离的方位 / 动词 / 量化词
const LABEL_AFFIXES = [
  '从',
  '到',
  '至',
  '约',
  '为',
  '是',
  '将',
  '需',
  '占比',
  '占',
  '提升到',
  '提升',
  '达到',
  '超过',
  '接受度',
  '比例',
  '以上',
  '以下',
  '大约',
];

function cleanLabel(raw: string | undefined): string | undefined {
  let label = raw?.trim();
  if (!label) return undefined;
  let changed = true;
  while (changed && label) {
    changed = false;
    for (const affix of LABEL_AFFIXES) {
      if (label.endsWith(affix)) {
        label = label.slice(0, -affix.length).trim();
        changed = true;
      }
      if (label.startsWith(affix)) {
        label = label.slice(affix.length).trim();
        changed = true;
      }
    }
  }
  if (!label || label.length < 2) return undefined;
  return label;
}

export function extractStats(text: string | undefined, max = 3): Stat[] {
  if (!text) return [];
  const out: Stat[] = [];
  const seen = new Set<string>();
  const re = /([\u4e00-\u9fa5]{2,12})?\s*(\d+(?:\.\d+)?%)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null && out.length < max) {
    const value = match[2];
    if (seen.has(value)) continue;
    seen.add(value);
    const label = cleanLabel(match[1]);
    if (!label) continue; // 标签不干净 / 为空 → 不展示该数字
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
