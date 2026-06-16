import React from 'react';
import {
  Users2,
  Sparkles,
  GraduationCap,
  FileText,
  ExternalLink,
  Quote,
  X,
  MapPin,
  ChevronRight,
} from 'lucide-react';
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

// ── helpers ───────────────────────────────────────────────────────────────

function hasDetail(itv: JtbInterview): boolean {
  return itv.insights.length > 0 || ONION_LABELS.some(({ key }) => itv.onion[key]?.length) || itv.quotes.length > 0;
}

/** 一行 teaser：优先首条洞察标题，其次首句原声 */
function teaserOf(itv: JtbInterview): string {
  if (!hasDetail(itv)) return '访谈纪要整理中';
  if (itv.insights[0]?.title) return itv.insights[0].title;
  if (itv.quotes[0]) return itv.quotes[0];
  return itv.study[0] ?? '';
}

/** 把杂乱的 purchaseType 归一成购买阶段 */
function stageOf(itv: JtbInterview): string {
  const t = itv.purchaseType ?? '';
  if (itv.status === '未购' || t.includes('未购')) return '未购';
  if (t.includes('续购')) return '续购';
  if (t.includes('升单')) return '升单';
  if (t.includes('首购')) return '首购';
  return '已购';
}

const STAGE_ORDER = ['首购', '续购', '升单', '已购', '未购'];
const STAGE_COLOR: Record<string, string> = {
  首购: '#4BA69E',
  续购: '#5B7BBF',
  升单: '#BF9455',
  已购: '#7578C8',
  未购: '#E07A6E',
};

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

// ── 概览驾驶舱 ───────────────────────────────────────────────────────────

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border border-[#E8E2D9] bg-white px-4 py-3">
      <div className="text-[11px] font-bold text-[#999]">{label}</div>
      <div className="mt-1.5 text-[22px] font-extrabold leading-none text-[#252525]">{value}</div>
      {note && <div className="mt-1 text-[11px] text-[#aaa]">{note}</div>}
    </div>
  );
}

function Cockpit() {
  const total = JTB_INTERVIEWS.length;
  const purchased = JTB_INTERVIEWS.filter((i) => i.status === '已购').length;
  const unpurchased = JTB_INTERVIEWS.filter((i) => i.status === '未购').length;
  const pending = JTB_INTERVIEWS.filter((i) => !hasDetail(i)).length;
  const regions = Array.from(new Set(JTB_INTERVIEWS.map((i) => i.region.slice(0, 2))));

  const stageCounts = STAGE_ORDER.map((s) => ({
    stage: s,
    count: JTB_INTERVIEWS.filter((i) => stageOf(i) === s).length,
  })).filter((s) => s.count > 0);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="受访家庭" value={String(total)} note="多孩家庭为主" />
        <Metric label="已购 / 未购" value={`${purchased} / ${unpurchased}`} note={pending ? `其中 ${pending} 户纪要整理中` : '覆盖首购·续购·升单·未购'} />
        <Metric label="覆盖地区" value={String(regions.length)} note={regions.join(' · ')} />
        <Metric label="最多孩家庭" value="4 娃" note="年龄跨度近 10 年（用户8）" />
      </div>

      {/* 购买性质分布 */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={13} className="text-[#e65532]" />
          <span className="text-[12px] font-bold text-gray-700">购买性质分布</span>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
          {stageCounts.map((s) => (
            <div
              key={s.stage}
              style={{ width: `${(s.count / total) * 100}%`, backgroundColor: STAGE_COLOR[s.stage] }}
              title={`${s.stage} ${s.count}`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {stageCounts.map((s) => (
            <div key={s.stage} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STAGE_COLOR[s.stage] }} />
              <span className="text-[12px] text-gray-600">{s.stage}</span>
              <span className="text-[12px] font-bold text-gray-800">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 家庭卡片（画廊） ─────────────────────────────────────────────────────

function FamilyCard({ itv, onOpen }: { itv: JtbInterview; onOpen: (itv: JtbInterview) => void }) {
  const detail = hasDetail(itv);
  const accent = itv.status === '已购' ? '#10b981' : '#f43f5e';

  return (
    <button
      type="button"
      onClick={() => detail && onOpen(itv)}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white pl-4 pr-4 py-4 text-left transition-all',
        detail ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[#e65532]/40 hover:shadow-[2px_4px_0_rgba(0,0,0,0.06)]' : 'cursor-default opacity-60',
      )}
    >
      <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: accent }} />

      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e65532]/10 text-[13px] font-extrabold text-[#e65532]">
          {itv.seq}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[14px] font-bold text-gray-900">{itv.parent}</span>
            <StatusBadge status={itv.status} />
            {itv.priority && (
              <span className="rounded-full bg-[#e65532]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#e65532]">{itv.priority}</span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
            <MapPin size={10} className="shrink-0" />
            {itv.region}
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10.5px] font-medium text-gray-600">{itv.combo}</span>
        {itv.purchaseType && (
          <span className="rounded-md bg-gray-50 px-1.5 py-0.5 text-[10.5px] text-gray-500">{itv.purchaseType}</span>
        )}
      </div>

      <p className="mt-2.5 line-clamp-2 flex-1 text-[12.5px] leading-6 text-gray-600">{teaserOf(itv)}</p>

      {detail && (
        <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-[#e65532] opacity-0 transition-opacity group-hover:opacity-100">
          查看完整访谈 <ChevronRight size={12} />
        </div>
      )}
    </button>
  );
}

// ── 详情内容（抽屉里复用） ───────────────────────────────────────────────

function InterviewDetail({ itv }: { itv: JtbInterview }) {
  return (
    <div className="space-y-5">
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
                <p className="mt-2 border-l-2 border-gray-200 pl-2.5 text-[12px] italic leading-5 text-gray-500">“{ins.quote}”</p>
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
              <div key={i} className="rounded-lg bg-gray-50 px-3 py-2 text-[12px] italic leading-6 text-gray-600">“{q}”</div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {(itv.transcriptUrl || (itv.minutesUrl && !itv.minutesUrl.endsWith('/'))) && (
        <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3">
          {itv.minutesUrl && !itv.minutesUrl.endsWith('/') && (
            <a href={itv.minutesUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11.5px] font-medium text-[#5B7BBF] hover:underline">
              <ExternalLink size={11} /> 查看访谈妙记
            </a>
          )}
          {itv.transcriptUrl && (
            <a href={itv.transcriptUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11.5px] font-medium text-gray-500 hover:underline">
              <FileText size={11} /> 查看文字记录
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── 右侧详情抽屉 ─────────────────────────────────────────────────────────

function DetailDrawer({ itv, onClose }: { itv: JtbInterview | null; onClose: () => void }) {
  React.useEffect(() => {
    if (!itv) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [itv, onClose]);

  if (!itv) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 animate-in fade-in" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-start gap-3 border-b border-[#E8E2D9] bg-[#FEFDF9] px-5 py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e65532]/10 text-[14px] font-extrabold text-[#e65532]">
            {itv.seq}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-bold text-gray-900">{itv.parent}</span>
              <StatusBadge status={itv.status} />
              {itv.purchaseType && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">{itv.purchaseType}</span>
              )}
              {itv.priority && (
                <span className="rounded-full bg-[#e65532]/10 px-2 py-0.5 text-[10px] font-bold text-[#e65532]">{itv.priority}</span>
              )}
            </div>
            <div className="mt-1 text-[12px] text-gray-500">
              {itv.combo} · {itv.region}
              {itv.phone ? ` · ${itv.phone}` : ''}
            </div>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        {/* body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <InterviewDetail itv={itv} />
        </div>
      </div>
    </div>
  );
}

// ── 主页面 ───────────────────────────────────────────────────────────────

export default function FamilyInterviews() {
  const [filter, setFilter] = React.useState<'全部' | '已购' | '未购'>('全部');
  const [selected, setSelected] = React.useState<JtbInterview | null>(null);

  const list = JTB_INTERVIEWS.filter((i) => filter === '全部' || i.status === filter).sort((a, b) => a.seq - b.seq);

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="border-b border-[#E8E2D9] bg-[#FEFDF9] px-6 py-3">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-3">
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mx-auto max-w-[1180px] space-y-6">
          {filter === '全部' && <Cockpit />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((itv) => (
              <FamilyCard key={itv.id} itv={itv} onOpen={setSelected} />
            ))}
          </div>
        </div>
      </div>

      <DetailDrawer itv={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
