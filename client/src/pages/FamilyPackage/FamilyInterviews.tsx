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
  Library,
  Copy,
  Headphones,
} from 'lucide-react';
import { toast } from 'sonner';
import { JTB_INTERVIEWS, JtbInterview, JtbOnion } from '../../store/jiatingbaoData';
import { JTB_VOICE_CLIPS, JtbVoiceClip } from '../../store/jiatingbaoVoiceClips';
import EvidenceAudioClips from '../../components/EvidenceAudioClips';
import { citeMatches, normalizeForMatch, useCiteKey } from '../../components/siteAssistant/evidenceHighlight';
import { cn } from '@/lib/utils';

/** 该用户从录音里精确切出的逐字原声（按维度） */
function voiceClipsForSeq(seq: number): JtbVoiceClip[] {
  return JTB_VOICE_CLIPS.filter((c) => c.seq === seq);
}

/**
 * 卡片预览用：挑选与「标题（首条洞察）」对应的那段录音。
 * 卡片标题取自 insights[0].title，其代表原话是 insights[0].quote；
 * 录音切片的 caption 往往就等于该洞察原话，故按 quote ↔ caption/text 互相包含来匹配。
 * 匹配不到则返回 undefined（卡片不显示录音，避免标题与录音牛头不对马嘴）。
 */
function teaserClipOf(itv: JtbInterview): JtbVoiceClip | undefined {
  const clips = voiceClipsForSeq(itv.seq);
  if (!clips.length) return undefined;
  const targetQuote = itv.insights[0]?.quote ?? representativeVoiceOf(itv);
  const key = normalizeForMatch(targetQuote || '');
  if (key.length < 6) return undefined;
  return clips.find((c) => {
    const cap = normalizeForMatch(c.caption || '');
    const txt = normalizeForMatch(c.text || '');
    return (
      (cap.length >= 6 && (cap.includes(key) || key.includes(cap))) ||
      (txt.length >= 6 && (txt.includes(key) || key.includes(txt)))
    );
  });
}

// 收集一位受访者可被引用的所有文本（洞察标题/详情/原声、独立原声、洋葱相关、学情、录音原声）
function interviewTexts(itv: JtbInterview): string[] {
  const texts: string[] = [];
  itv.insights?.forEach((ins) => {
    if (ins.title) texts.push(ins.title);
    if (ins.detail) texts.push(ins.detail);
    if (ins.quote) texts.push(ins.quote);
  });
  itv.quotes?.forEach((q) => texts.push(q));
  Object.values(itv.onion ?? {}).forEach((arr) =>
    ((arr as string[] | undefined) ?? []).forEach((it) => texts.push(it)),
  );
  itv.study?.forEach((s) => texts.push(s));
  voiceClipsForSeq(itv.seq).forEach((c) => {
    if (c.text) texts.push(c.text);
    if (c.caption) texts.push(c.caption);
  });
  return texts;
}

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

const ONION_LABELS: { key: keyof JtbOnion; label: string }[] = [
  { key: 'cognition', label: '认知' },
  { key: 'understanding', label: '了解' },
  { key: 'purchase', label: '购买' },
  { key: 'usage', label: '使用' },
  { key: 'expectation', label: '预期' },
  { key: 'feedback', label: '建议 / 反馈' },
];

// ── 学段映射（小低=1-3年级，小高=4-6年级） ─────────────────────────────

const STAGE_RANK = ['学前', '小低', '小高', '初中', '高中', '已毕业'];
const ROW_RANK = ['学前', '小低', '小高', '初中', '高中', '其他'];
const CN_NUM: Record<string, number> = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6 };

function gradeToStage(token: string): string {
  const t = token.trim();
  if (/中班|幼儿园|小班|大班|学前/.test(t)) return '学前';
  if (/已毕业|毕业/.test(t)) return '已毕业';
  if (/高[一二三]|高中/.test(t)) return '高中';
  if (/初[一二三]|初中|[七八九]年级/.test(t)) return '初中';
  let n = 0;
  const ar = t.match(/(\d+)\s*年级/);
  if (ar) n = parseInt(ar[1], 10);
  else {
    const cn = t.match(/([一二三四五六])\s*年级/);
    if (cn) n = CN_NUM[cn[1]] ?? 0;
  }
  if (n >= 1 && n <= 3) return '小低';
  if (n >= 4 && n <= 6) return '小高';
  return '其他';
}

/** 把孩子年级组合归一为学段组合标签，如「小低+小高」「学前+小低+小高+初中」 */
function comboLabelOf(itv: JtbInterview): string {
  const stages = itv.combo.split('&').map((s) => gradeToStage(s));
  const uniq = Array.from(new Set(stages));
  uniq.sort((a, b) => STAGE_RANK.indexOf(a) - STAGE_RANK.indexOf(b));
  return uniq.join('+');
}

function rowLabelOf(comboLabel: string): string {
  const stages = comboLabel.split('+');
  if (stages.includes('学前')) return '学前';
  if (stages.includes('小低')) return '小低';
  if (stages.includes('小高')) return '小高';
  if (stages.includes('初中')) return '初中';
  if (stages.includes('高中')) return '高中';
  return '其他';
}

function groupByCombo(list: JtbInterview[]): { label: string; items: JtbInterview[] }[] {
  const map = new Map<string, JtbInterview[]>();
  for (const itv of list) {
    const label = comboLabelOf(itv);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(itv);
  }
  const labels = Array.from(map.keys()).sort((a, b) => {
    const sa = STAGE_RANK.indexOf(a.split('+')[0]);
    const sb = STAGE_RANK.indexOf(b.split('+')[0]);
    if (sa !== sb) return sa - sb;
    return a.localeCompare(b, 'zh');
  });
  return labels.map((label) => ({ label, items: map.get(label)!.slice().sort((x, y) => x.seq - y.seq) }));
}

function groupRowsByStage(list: JtbInterview[]): { label: string; groups: { label: string; items: JtbInterview[] }[]; count: number }[] {
  const rows = new Map<string, { label: string; items: JtbInterview[] }[]>();
  for (const group of groupByCombo(list)) {
    const rowLabel = rowLabelOf(group.label);
    if (!rows.has(rowLabel)) rows.set(rowLabel, []);
    rows.get(rowLabel)!.push(group);
  }
  const labels = Array.from(rows.keys()).sort((a, b) => {
    const ra = ROW_RANK.indexOf(a);
    const rb = ROW_RANK.indexOf(b);
    return (ra === -1 ? ROW_RANK.length : ra) - (rb === -1 ? ROW_RANK.length : rb);
  });
  return labels.map((label) => {
    const groups = rows.get(label)!;
    return {
      label,
      groups,
      count: groups.reduce((sum, group) => sum + group.items.length, 0),
    };
  });
}

// ── 通用 helper ─────────────────────────────────────────────────────────

function hasDetail(itv: JtbInterview): boolean {
  return itv.insights.length > 0 || ONION_LABELS.some(({ key }) => itv.onion[key]?.length) || itv.quotes.length > 0;
}

function teaserOf(itv: JtbInterview): string {
  if (!hasDetail(itv)) return '访谈纪要整理中';
  if (itv.insights[0]?.title) return itv.insights[0].title;
  if (itv.quotes[0]) return itv.quotes[0];
  return itv.study[0] ?? '';
}

function representativeVoiceOf(itv: JtbInterview): string {
  return itv.insights.find((ins) => ins.quote)?.quote ?? itv.quotes[0] ?? '';
}

function hasMinutes(itv: JtbInterview): boolean {
  return !!itv.minutesUrl && !itv.minutesUrl.endsWith('/');
}

// 购买性质（用于概览分布）
function stageOf(itv: JtbInterview): string {
  const t = itv.purchaseType ?? '';
  if (itv.status === '未购' || t.includes('未购')) return '未购';
  if (t.includes('续购')) return '续购';
  if (t.includes('升单')) return '升单';
  if (t.includes('首购')) return '首购';
  return '已购';
}

const PURCHASE_STAGE_ORDER = ['首购', '续购', '升单', '已购', '未购'];
const ACCENT = '#e65532';
const PURCHASE_STAGE_STYLE: Record<string, { color: string; bg: string }> = {
  首购: { color: '#e65532', bg: '#e65532' },
  续购: { color: '#5B7BBF', bg: '#5B7BBF' },
  升单: { color: '#BF9455', bg: '#BF9455' },
  已购: { color: '#4BA69E', bg: '#4BA69E' },
  未购: { color: '#B8667A', bg: '#B8667A' },
};

const COMBO_TINTS = ['#e65532', '#5B7BBF', '#4BA69E', '#BF9455', '#8B6BB8', '#B8667A'];

function comboTint(label: string) {
  let hash = 0;
  for (const char of label) hash += char.charCodeAt(0);
  return COMBO_TINTS[hash % COMBO_TINTS.length];
}

function StatusBadge({ status }: { status: '已购' | '未购' }) {
  const positive = status === '已购';
  return (
    <span
      className={cn(
        'shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        positive
          ? 'border-[#4BA69E]/25 bg-[#4BA69E]/10 text-[#2D817A]'
          : 'border-[#B8667A]/25 bg-[#B8667A]/10 text-[#A24E63]',
      )}
    >
      {status}
    </span>
  );
}

function VoiceQuote({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <blockquote
      data-evidence-card
      className={cn(
        'relative rounded-xl border border-[#f0ded8] bg-[#fff8f5] text-gray-700',
        compact ? 'px-3 py-2.5 text-[12px] leading-5' : 'px-4 py-3 text-[12.5px] leading-6',
      )}
    >
      <Quote
        size={compact ? 12 : 14}
        className="absolute left-3 top-2.5 text-[#e65532]/50"
      />
      <p className="pl-5">{renderHighlighted(text)}</p>
    </blockquote>
  );
}

const DIM_TINT: Record<string, string> = {
  关键原声: '#e65532', 洞察: '#e65532', 认知: '#5B7BBF', 了解: '#4BA69E',
  购买: '#BF9455', 使用: '#7578C8', 预期: '#E07A6E', '建议/反馈': '#5BBF96', 基本学情: '#8a857d',
};

/** 逐字原声卡：维度标签 + 逐字原话 + 播放器 + 纪要转述小字 */
function VerbatimVoiceCard({ clip }: { clip: JtbVoiceClip }) {
  const tint = DIM_TINT[clip.dimension] ?? '#e65532';
  return (
    <div data-evidence-card className="rounded-xl border border-[#E8E2D9] bg-white p-3">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: tint }}>
          {clip.dimension}
        </span>
        <EvidenceAudioClips clips={[clip]} />
      </div>
      <p className="text-[12.5px] leading-6 text-gray-700">{clip.text}</p>
      {clip.caption && clip.caption !== clip.text && (
        <p className="mt-1.5 border-l-2 border-gray-200 pl-2 text-[11px] leading-5 text-gray-400">
          纪要：{clip.caption}
        </p>
      )}
    </div>
  );
}

// ── 概览驾驶舱 ───────────────────────────────────────────────────────────

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border border-[#E8E2D9] bg-white px-4 py-3 shadow-sm">
      <div className="text-[11px] font-bold text-gray-400">{label}</div>
      <div className="mt-1.5 text-[22px] font-extrabold leading-none text-[#252525]">{value}</div>
      {note && <div className="mt-1 line-clamp-1 text-[11px] text-gray-400">{note}</div>}
    </div>
  );
}

function PurchaseDistribution({ interviews }: { interviews: JtbInterview[] }) {
  const total = Math.max(interviews.length, 1);
  const stageCounts = PURCHASE_STAGE_ORDER.map((stage) => {
    const count = interviews.filter((i) => stageOf(i) === stage).length;
    return {
      stage,
      count,
      percent: Math.round((count / total) * 100),
      style: PURCHASE_STAGE_STYLE[stage],
    };
  }).filter((item) => item.count > 0);

  return (
    <div className="rounded-xl border border-[#E8E2D9] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-[#e65532]" />
          <span className="text-[12px] font-bold text-gray-800">购买性质分布</span>
        </div>
        <span className="text-[11px] text-gray-400">按 {interviews.length} 户受访家庭计算</span>
      </div>

      <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-gray-100">
        {stageCounts.map((item) => (
          <div
            key={item.stage}
            title={`${item.stage} ${item.count}户，占${item.percent}%`}
            className="h-full border-r border-white last:border-r-0"
            style={{ width: `${(item.count / total) * 100}%`, backgroundColor: item.style.bg }}
          />
        ))}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {stageCounts.map((item) => (
          <div key={item.stage} className="rounded-lg border border-gray-100 bg-[#FAFAF8] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.style.bg }} />
              <span className="text-[11px] font-semibold text-gray-600">{item.stage}</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <strong className="text-[18px] font-extrabold text-gray-900">{item.count}</strong>
              <span className="text-[11px] text-gray-400">户</span>
              <span className="ml-auto text-[11px] font-semibold" style={{ color: item.style.color }}>{item.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cockpit({ interviews }: { interviews: JtbInterview[] }) {
  const total = interviews.length;
  const purchased = interviews.filter((i) => i.status === '已购').length;
  const unpurchased = interviews.filter((i) => i.status === '未购').length;
  const regions = Array.from(new Set(interviews.map((i) => i.region.slice(0, 2))));

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Metric label="已整理访谈" value={String(total)} note="隐藏未整理空卡片" />
        <Metric label="已购 / 未购" value={`${purchased} / ${unpurchased}`} note="覆盖首购·续购·升单·未购" />
        <Metric label="覆盖地区" value={String(regions.length)} note={regions.join(' · ')} />
      </div>
      <PurchaseDistribution interviews={interviews} />
    </section>
  );
}

// ── 家庭卡片 ─────────────────────────────────────────────────────────────

function CompactMeta({ itv }: { itv: JtbInterview }) {
  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
        <MapPin size={10} className="shrink-0" />
        <span>{itv.region}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10.5px] font-medium text-gray-600">{itv.combo}</span>
        {itv.purchaseType && (
          <span className="rounded-md border border-gray-100 bg-white px-1.5 py-0.5 text-[10.5px] text-gray-500">{itv.purchaseType}</span>
        )}
      </div>
    </div>
  );
}

function FamilyCard({ itv, onOpen }: { itv: JtbInterview; onOpen: (itv: JtbInterview) => void }) {
  const detail = hasDetail(itv);
  const firstClip = teaserClipOf(itv);
  const voice = representativeVoiceOf(itv);

  return (
    <div
      role="button"
      tabIndex={detail ? 0 : -1}
      onClick={() => detail && onOpen(itv)}
      onKeyDown={(e) => {
        if (detail && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onOpen(itv);
        }
      }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white p-4 text-left transition-all',
        detail ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[#e65532]/40 hover:shadow-[2px_4px_0_rgba(0,0,0,0.06)]' : 'cursor-default opacity-60',
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e65532]/15 bg-white text-[13px] font-extrabold text-[#e65532]">
          {itv.seq}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 pr-10">
            <span className="truncate text-[14px] font-bold text-gray-900">{itv.parent}</span>
            <StatusBadge status={itv.status} />
          </div>
          <p className="mt-1 line-clamp-1 text-[12px] font-medium text-gray-500">{teaserOf(itv)}</p>
        </div>
        {itv.priority && (
          <span className="absolute right-3 top-3 rounded-full border border-[#e65532]/25 bg-white px-2 py-0.5 text-[10px] font-bold text-[#e65532]">{itv.priority}</span>
        )}
      </div>

      <CompactMeta itv={itv} />

      {firstClip ? (
        <div className="mt-3 flex-1 border-t border-gray-100 pt-3">
          <div className="mb-1.5 flex items-center gap-1 text-[10px] font-bold text-gray-400">
            <Headphones size={11} className="text-[#e65532]/70" />
            录音原声
          </div>
          <p className="line-clamp-2 text-[12px] leading-5 text-gray-600">“{firstClip.text}”</p>
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            <EvidenceAudioClips clips={[firstClip]} />
          </div>
        </div>
      ) : voice ? (
        <div className="mt-3 flex-1 border-t border-gray-100 pt-3">
          <div className="mb-1.5 flex items-center gap-1 text-[10px] font-bold text-gray-400">
            <Quote size={11} className="text-[#e65532]/55" />
            代表原声
          </div>
          <p className="line-clamp-2 text-[12px] leading-5 text-gray-600">“{renderHighlighted(voice)}”</p>
        </div>
      ) : (
        <p className="mt-3 flex-1 border-t border-gray-100 pt-3 text-[12px] leading-5 text-gray-400">访谈纪要整理中</p>
      )}

      {detail && (
        <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#e65532] opacity-0 transition-opacity group-hover:opacity-100">
          查看完整访谈 <ChevronRight size={12} />
        </div>
      )}
    </div>
  );
}

// ── 详情内容（抽屉里复用，不含链接） ─────────────────────────────────────

function InterviewDetail({ itv }: { itv: JtbInterview }) {
  const voiceClips = voiceClipsForSeq(itv.seq);

  return (
    <div className="space-y-5">
      {itv.insights.length > 0 && (
        <div className="space-y-3">
          {itv.insights.map((ins, i) => (
            <div key={i} data-evidence-card className="rounded-xl border-l-[3px] border-[#e65532] bg-[#e65532]/[0.04] p-3.5">
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#e65532]" />
                <span className="text-[12.5px] font-bold text-gray-800">{ins.title}</span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-6 text-gray-600">{renderHighlighted(ins.detail)}</p>
              {ins.quote && (
                <div className="mt-3">
                  <VoiceQuote text={ins.quote} compact />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {voiceClips.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Headphones size={13} className="text-[#e65532]" />
            <span className="text-[12px] font-bold text-gray-700">录音原声</span>
            <span className="text-[11px] text-gray-400">{voiceClips.length} 条 · 逐字稿与录音对齐</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {voiceClips.map((clip) => (
              <VerbatimVoiceCard key={clip.clipUrl} clip={clip} />
            ))}
          </div>
        </div>
      )}

      {itv.study.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <GraduationCap size={13} className="text-gray-400" />
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

      {ONION_LABELS.some(({ key }) => itv.onion[key]?.length) && (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-gray-700">洋葱相关内容</span>
          </div>
          <div className="space-y-2.5">
            {ONION_LABELS.map(({ key, label }) => {
              const items = itv.onion[key];
              if (!items?.length) return null;
              return (
                <div key={key} className="flex gap-2.5">
                  <span className="mt-0.5 h-fit shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                    {label}
                  </span>
                  <ul className="flex-1 space-y-1">
                    {items.map((it, i) => (
                      <li key={i} data-evidence-card className="text-[12.5px] leading-6 text-gray-600">{it}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
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
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-[720px] flex-col bg-white shadow-2xl">
        <div className="flex items-start gap-3 border-b border-[#E8E2D9] bg-[#FEFDF9] px-5 py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e65532]/10 text-[14px] font-extrabold text-[#e65532]">
            {itv.seq}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-bold text-gray-900">{itv.parent}</span>
              <StatusBadge status={itv.status} />
              {itv.purchaseType && (
                <span className="rounded-full border border-gray-100 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500">{itv.purchaseType}</span>
              )}
              {itv.priority && (
                <span className="rounded-full border border-[#e65532]/25 bg-white px-2 py-0.5 text-[10px] font-bold text-[#e65532]">{itv.priority}</span>
              )}
            </div>
            <div className="mt-1 text-[12px] text-gray-500">
              {itv.combo} · {itv.region}
            </div>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div data-evidence-scope className="flex-1 overflow-y-auto px-5 py-5">
          <InterviewDetail itv={itv} />
        </div>
      </div>
    </div>
  );
}

// ── 访谈资料库（链接库） ─────────────────────────────────────────────────

function LibraryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const list = JTB_INTERVIEWS
    .filter((itv) => hasMinutes(itv) || !!itv.transcriptUrl)
    .slice()
    .sort((a, b) => a.seq - b.seq);

  const copyAll = async () => {
    const lines: string[] = [];
    for (const itv of list) {
      const parts: string[] = [];
      if (hasMinutes(itv)) parts.push(`妙记 ${itv.minutesUrl}`);
      if (itv.transcriptUrl) parts.push(`文字记录 ${itv.transcriptUrl}`);
      if (parts.length) lines.push(`用户${itv.seq} ${itv.parent}（${itv.combo}）\n  ${parts.join('\n  ')}`);
    }
    const text = lines.join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      toast.success('已复制全部链接到剪贴板');
    } catch {
      toast.error('复制失败，请手动复制');
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[#E8E2D9] bg-[#FEFDF9] px-5 py-4">
          <Library size={16} className="text-[#e65532]" />
          <div className="flex-1">
            <div className="text-[15px] font-bold text-gray-900">访谈资料库</div>
            <div className="text-[11px] text-gray-400">每户的妙记录音与文字记录，点击在飞书打开</div>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-[#F0EDE7] px-5 py-3">
          <button
            onClick={copyAll}
            className="flex items-center gap-1.5 rounded-lg bg-[#e65532] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#d34427]"
          >
            <Copy size={13} /> 复制全部链接
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-2">
            {list.map((itv) => {
              const minutes = hasMinutes(itv);
              const transcript = !!itv.transcriptUrl;
              return (
                <div key={itv.id} className="flex items-center gap-3 rounded-xl border border-[#E8E2D9] bg-white px-3.5 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e65532]/10 text-[12px] font-extrabold text-[#e65532]">
                    {itv.seq}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-bold text-gray-800">{itv.parent}</span>
                      <StatusBadge status={itv.status} />
                    </div>
                    <div className="truncate text-[11px] text-gray-400">{itv.combo} · {itv.region}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {minutes ? (
                      <a
                        href={itv.minutesUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-md border border-[#5B7BBF]/30 px-2 py-1 text-[11px] font-medium text-[#5B7BBF] hover:bg-[#5B7BBF]/5"
                      >
                        <Headphones size={11} /> 妙记
                      </a>
                    ) : (
                      <span className="rounded-md border border-gray-100 px-2 py-1 text-[11px] text-gray-300">无妙记</span>
                    )}
                    {transcript ? (
                      <a
                        href={itv.transcriptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
                      >
                        <FileText size={11} /> 文字记录
                      </a>
                    ) : (
                      <span className="rounded-md border border-gray-100 px-2 py-1 text-[11px] text-gray-300">无记录</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 分区 + 二级分组 ─────────────────────────────────────────────────────

function SectionBlock({
  title,
  tone,
  list,
  onOpen,
}: {
  title: string;
  tone: 'purchased' | 'unpurchased';
  list: JtbInterview[];
  onOpen: (itv: JtbInterview) => void;
}) {
  if (list.length === 0) return null;
  const groups = groupByCombo(list);
  const rows = groupRowsByStage(list);
  const label = tone === 'purchased' ? '已购样本' : '未购样本';
  const laneWidth = tone === 'purchased' ? 'min-w-[390px] max-w-[390px]' : 'min-w-[430px] max-w-[430px]';

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 border-b border-[#E8E2D9] pb-2">
        <h3 className="text-[16px] font-extrabold text-gray-900">{title}</h3>
        <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-400">{label}</span>
        <span className="text-[12px] text-gray-400">{list.length} 户 · {groups.length} 个年级组合</span>
      </div>

      <div className="space-y-5">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl border border-[#E9E3DA] bg-white/55 p-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-md bg-[#e65532]/10 px-2 py-0.5 text-[12px] font-extrabold text-[#e65532]">
                {row.label}
              </span>
              <span className="text-[11px] text-gray-400">{row.count} 户 · {row.groups.length} 个组合</span>
              <span className="h-px flex-1 bg-[#EFEAE2]" />
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-max gap-4">
                {row.groups.map((g) => {
                  const tint = comboTint(g.label);
                  return (
                    <div
                      key={g.label}
                      className={cn('rounded-2xl border bg-[#FEFDF9] p-3', laneWidth)}
                      style={{ borderColor: `${tint}55` }}
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="rounded-md px-2 py-0.5 text-[12px] font-bold"
                            style={{ backgroundColor: `${tint}16`, color: tint }}
                          >
                            {g.label}
                          </span>
                          <span className="text-[11px] text-gray-400">{g.items.length} 户</span>
                        </div>
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tint }} />
                      </div>
                      <div className="space-y-3">
                        {g.items.map((itv) => (
                          <FamilyCard key={itv.id} itv={itv} onOpen={onOpen} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 主页面 ───────────────────────────────────────────────────────────────

export default function FamilyInterviews() {
  const [selected, setSelected] = React.useState<JtbInterview | null>(null);
  const [libraryOpen, setLibraryOpen] = React.useState(false);
  const citeKey = useCiteKey();

  // 有引用跳转时：自动打开包含被引用原话的受访者抽屉，让全局高亮能定位到弹窗内的原话
  React.useEffect(() => {
    if (!citeKey) return;
    const match = JTB_INTERVIEWS.find((itv) =>
      interviewTexts(itv).some((t) => citeMatches(t, citeKey)),
    );
    if (match) setSelected(match);
  }, [citeKey]);

  const visibleInterviews = JTB_INTERVIEWS.filter(hasDetail);
  const purchased = visibleInterviews.filter((i) => i.status === '已购');
  const unpurchased = visibleInterviews.filter((i) => i.status === '未购');

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="border-b border-[#E8E2D9] bg-[#FEFDF9] px-6 py-3">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Users2 size={15} className="text-[#e65532]" />
            <h2 className="text-[15px] font-bold text-gray-900">用户访谈</h2>
            <span className="text-[11px] text-gray-400">{visibleInterviews.length} 位已整理访谈家庭</span>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setLibraryOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-600 hover:border-[#e65532]/40 hover:text-[#e65532]"
          >
            <Library size={14} /> 访谈资料库
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mx-auto max-w-[1180px] space-y-8">
          <Cockpit interviews={visibleInterviews} />
          <SectionBlock title="已购用户" tone="purchased" list={purchased} onOpen={setSelected} />
          <SectionBlock title="未购用户" tone="unpurchased" list={unpurchased} onOpen={setSelected} />
        </div>
      </div>

      <DetailDrawer itv={selected} onClose={() => setSelected(null)} />
      <LibraryDrawer open={libraryOpen} onClose={() => setLibraryOpen(false)} />
    </div>
  );
}
