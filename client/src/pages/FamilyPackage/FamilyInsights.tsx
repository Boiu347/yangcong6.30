import React from 'react';
import { Lightbulb, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { JTB_THEMES, JtbTheme } from '../../store/jiatingbaoData';
import { cn } from '@/lib/utils';

function renderHighlighted(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

const THEME_COLORS = ['#e65532', '#5B7BBF', '#4BA69E', '#BF9455', '#7578C8', '#E07A6E', '#5BBF96'];

function ThemeCard({ theme, color, defaultOpen }: { theme: JtbTheme; color: string; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen ?? false);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white shadow-[2px_3px_0_rgba(0,0,0,0.04)]">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-start gap-3 px-5 py-4 text-left hover:bg-[#FEFDF9]">
        <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <div className="min-w-0 flex-1">
          <span className="text-[14px] font-bold text-gray-900">{theme.title}</span>
          <p className="mt-1 text-[12.5px] leading-6 text-gray-500">{theme.summary}</p>
        </div>
        {open ? <ChevronDown size={16} className="mt-1 shrink-0 text-gray-300" /> : <ChevronRight size={16} className="mt-1 shrink-0 text-gray-300" />}
      </button>

      {open && (
        <div className="space-y-2.5 border-t border-[#F0EDE7] px-5 py-4">
          {theme.points.map((p, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
              <p className="text-[12.5px] leading-6 text-gray-700">{renderHighlighted(p.text)}</p>
              {p.quote && (
                <p className="mt-2 border-l-2 pl-2.5 text-[12px] italic leading-5 text-gray-500" style={{ borderColor: color }}>
                  “{p.quote}”
                </p>
              )}
              {p.from && <p className="mt-1.5 text-[11px] text-gray-400">— {p.from}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FamilyInsights() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#E8E2D9] bg-[#FEFDF9] px-6 py-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={15} className="text-[#e65532]" />
          <h2 className="text-[15px] font-bold text-gray-900">核心洞察</h2>
          <span className="text-[11px] text-gray-400">{JTB_THEMES.length} 大跨用户主题</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-3">
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-[#e65532]/20 bg-[#e65532]/[0.04] p-4">
            <Sparkles size={15} className="mt-0.5 shrink-0 text-[#e65532]" />
            <p className="text-[13px] leading-6 text-gray-600">
              {renderHighlighted(
                '以下洞察跨 11 位家庭归纳，覆盖**决策锚点、性价比感知、机会点、付费理由、人群机会、共性顾虑与最强痛点**。点击展开可查看支撑要点与用户原声。',
              )}
            </p>
          </div>
          {JTB_THEMES.map((theme, i) => (
            <ThemeCard key={theme.id} theme={theme} color={THEME_COLORS[i % THEME_COLORS.length]} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
