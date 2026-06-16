import React from 'react';
import { Users2, ChevronDown, ChevronRight, Sparkles, GraduationCap, FileText, ExternalLink, Quote } from 'lucide-react';
import { JTB_INTERVIEWS, JtbInterview, JtbOnion } from '../../store/jiatingbaoData';
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

const ONION_LABELS: { key: keyof JtbOnion; label: string; color: string }[] = [
  { key: 'cognition', label: '认知', color: '#5B7BBF' },
  { key: 'understanding', label: '了解', color: '#4BA69E' },
  { key: 'purchase', label: '购买', color: '#BF9455' },
  { key: 'usage', label: '使用', color: '#7578C8' },
  { key: 'expectation', label: '预期', color: '#E07A6E' },
  { key: 'feedback', label: '建议 / 反馈', color: '#5BBF96' },
];

function StatusBadge({ status }: { status: '已购' | '未购' }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold',
        status === '已购' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500',
      )}
    >
      {status}
    </span>
  );
}

function InterviewCard({ itv, defaultOpen }: { itv: JtbInterview; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen ?? false);
  const hasDetail = itv.insights.length > 0 || itv.onion.cognition || itv.quotes.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white shadow-[2px_3px_0_rgba(0,0,0,0.04)]">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-[#FEFDF9]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e65532]/10 text-[13px] font-extrabold text-[#e65532]">
          {itv.seq}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-bold text-gray-900">{itv.parent}</span>
            <span className="text-[12px] text-gray-500">{itv.combo}</span>
            <StatusBadge status={itv.status} />
            {itv.purchaseType && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">{itv.purchaseType}</span>
            )}
            {itv.priority && (
              <span className="rounded-full bg-[#e65532]/10 px-2 py-0.5 text-[10px] font-bold text-[#e65532]">{itv.priority}</span>
            )}
          </div>
          <div className="mt-0.5 text-[11.5px] text-gray-400">
            {itv.region}
            {itv.phone ? ` · ${itv.phone}` : ''}
          </div>
        </div>
        {hasDetail ? (
          open ? <ChevronDown size={16} className="shrink-0 text-gray-300" /> : <ChevronRight size={16} className="shrink-0 text-gray-300" />
        ) : (
          <span className="shrink-0 text-[11px] text-gray-300">纪要整理中</span>
        )}
      </button>

      {/* Detail */}
      {open && hasDetail && (
        <div className="space-y-5 border-t border-[#F0EDE7] px-5 py-5">
          {/* Insights */}
          {itv.insights.length > 0 && (
            <div className="space-y-3">
              {itv.insights.map((ins, i) => (
                <div key={i} className="rounded-xl border-l-[3px] border-[#e65532] bg-[#e65532]/[0.04] p-3.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#e65532]" />
                    <span className="text-[12.5px] font-bold text-gray-800">{ins.title}</span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-6 text-gray-600">{renderHighlighted(ins.detail)}</p>
                  {ins.quote && (
                    <p className="mt-2 border-l-2 border-gray-200 pl-2.5 text-[12px] italic leading-5 text-gray-500">
                      “{ins.quote}”
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Study situation */}
          {itv.study.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <GraduationCap size={13} className="text-[#5B7BBF]" />
                <span className="text-[12px] font-bold text-gray-700">基本学情</span>
              </div>
              <ul className="space-y-1.5">
                {itv.study.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[12.5px] leading-6 text-gray-600">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Onion content */}
          {ONION_LABELS.some(({ key }) => itv.onion[key]?.length) && (
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-[12px] font-bold text-gray-700">洋葱相关内容</span>
              </div>
              <div className="space-y-2.5">
                {ONION_LABELS.map(({ key, label, color }) => {
                  const items = itv.onion[key];
                  if (!items?.length) return null;
                  return (
                    <div key={key} className="flex gap-2.5">
                      <span
                        className="mt-0.5 h-fit shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {label}
                      </span>
                      <ul className="flex-1 space-y-1">
                        {items.map((it, i) => (
                          <li key={i} className="text-[12.5px] leading-6 text-gray-600">{it}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quotes */}
          {itv.quotes.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <Quote size={13} className="text-[#e65532]" />
                <span className="text-[12px] font-bold text-gray-700">关键原声</span>
              </div>
              <div className="space-y-2">
                {itv.quotes.map((q, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 px-3 py-2 text-[12px] italic leading-6 text-gray-600">
                    “{q}”
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(itv.minutesUrl || itv.transcriptUrl) && (
            <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3">
              {itv.minutesUrl && itv.minutesUrl.endsWith('/') === false && (
                <a
                  href={itv.minutesUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11.5px] font-medium text-[#5B7BBF] hover:underline"
                >
                  <ExternalLink size={11} /> 查看访谈妙记
                </a>
              )}
              {itv.transcriptUrl && (
                <a
                  href={itv.transcriptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11.5px] font-medium text-gray-500 hover:underline"
                >
                  <FileText size={11} /> 查看文字记录
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FamilyInterviews() {
  const [filter, setFilter] = React.useState<'全部' | '已购' | '未购'>('全部');
  const list = JTB_INTERVIEWS.filter((i) => filter === '全部' || i.status === filter).sort((a, b) => a.seq - b.seq);

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="border-b border-[#E8E2D9] bg-[#FEFDF9] px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Users2 size={15} className="text-[#e65532]" />
            <h2 className="text-[15px] font-bold text-gray-900">用户访谈</h2>
            <span className="text-[11px] text-gray-400">{JTB_INTERVIEWS.length} 位受访家庭</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            {(['全部', '已购', '未购'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all',
                  filter === f
                    ? 'border-transparent bg-[#e65532] text-white'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-3">
          {list.map((itv, idx) => (
            <InterviewCard key={itv.id} itv={itv} defaultOpen={idx === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
