import React from 'react';

/**
 * 购买决策漏斗：把「感兴趣 → 理解价值 → 判断适配 → 消除顾虑 → 下单」画成一条漏斗，
 * 每一层对应一个用户阻碍，给页面一个可记住的视觉锚点（对应「视觉锚点」原理）。
 */

export interface FunnelStage {
  stage: string;
  barrier: string;
}

export const purchaseFunnelStages: FunnelStage[] = [
  { stage: '感兴趣', barrier: '孩子愿不愿意点开：趣味动画课 53%、孩子喜欢 40%' },
  { stage: '理解价值', barrier: '家长认不认「学科启蒙有用」，而非只是好玩' },
  { stage: '判断适配', barrier: '既不抢跑刷题，又要学得到东西' },
  { stage: '消除顾虑', barrier: '会不会买了吃灰、到底学没学到' },
  { stage: '下单', barrier: '当前多靠品牌信任与顺手加购收口' },
];

export interface DecisionFunnelProps {
  stages?: FunnelStage[];
  color?: string;
  className?: string;
}

export function DecisionFunnel({
  stages = purchaseFunnelStages,
  color = '#C58A3D',
  className,
}: DecisionFunnelProps) {
  const total = stages.length;
  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-1.5">
        {stages.map((item, index) => {
          const width = 100 - (index * 40) / Math.max(1, total - 1);
          const opacity = 1 - index * 0.12;
          return (
            <React.Fragment key={item.stage}>
              <div
                className="relative flex flex-col items-center justify-center rounded-[12px] px-4 py-2.5 text-center"
                style={{ width: `${width}%`, backgroundColor: color, opacity }}
              >
                <span className="flex items-center gap-2 text-[15px] font-black text-white">
                  <span className="grid size-5 place-items-center rounded-full bg-white/25 text-[11px]">
                    {index + 1}
                  </span>
                  {item.stage}
                </span>
                <span className="mt-0.5 text-[11px] font-semibold leading-4 text-white/90">
                  {item.barrier}
                </span>
              </div>
              {index < total - 1 && (
                <span className="text-[11px] font-black" style={{ color }}>
                  ↓
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default DecisionFunnel;
