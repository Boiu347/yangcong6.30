import React from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

/**
 * 优势 / 劣势对照矩阵：把产品体验的亮点与折损点做成左右红绿对照，
 * 让用户一眼记住「好在哪、卡在哪」（对应「视觉锚点」原理）。
 */

export interface ProsConsMatrixProps {
  pros: string[];
  cons: string[];
  prosColor?: string;
  consColor?: string;
  className?: string;
}

export const onionExperiencePros = [
  '每个模块知识多、内容更系统',
  '短视频节奏、时长短、无压力',
  '实验男让孩子愿意自主看',
];

export const onionExperienceCons = [
  '概念晦涩、不够口语化，孩子够不着',
  '答题有生字、读题困难',
  '新鲜感过去孩子不主动看',
  '课程与校内科学课不同步',
];

export function ProsConsMatrix({
  pros,
  cons,
  prosColor = '#2F9F8F',
  consColor = '#D64C3C',
  className,
}: ProsConsMatrixProps) {
  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[14px] border p-4" style={{ borderColor: `${prosColor}40`, backgroundColor: `${prosColor}0D` }}>
          <div className="flex items-center gap-1.5 text-[13px] font-black" style={{ color: prosColor }}>
            <ThumbsUp size={15} />
            体验优势
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {pros.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] font-semibold leading-6 text-[#403A34]">
                <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: prosColor }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[14px] border p-4" style={{ borderColor: `${consColor}40`, backgroundColor: `${consColor}0D` }}>
          <div className="flex items-center gap-1.5 text-[13px] font-black" style={{ color: consColor }}>
            <ThumbsDown size={15} />
            体验折损
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {cons.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] font-semibold leading-6 text-[#403A34]">
                <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: consColor }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProsConsMatrix;
