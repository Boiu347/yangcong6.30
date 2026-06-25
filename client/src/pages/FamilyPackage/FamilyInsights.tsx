import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MessageSquare, Sparkles, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  FAMILY_INSIGHT_DIMENSIONS,
  FamilyEvidence,
  FamilyInsightDimension,
  FamilySubDimension,
} from '../../store/familyInsightsData';
import { citeMatches, useCiteKey } from '../../components/siteAssistant/evidenceHighlight';
import { clipsForQuote } from '../../utils/sourceUtils';
import EvidenceAudioClips from '../../components/EvidenceAudioClips';
import FamilyInterviewRecordings from './FamilyInterviewRecordings';
import { useContentStore } from '../../hooks/useContentStore';
import { useIsEditor } from '../../components/auth/PasswordGate';
import { EditDrawer, SaveBar, TextField } from '../../components/edit/EditDrawer';

const RECORDINGS_KEY = 'recordings';
const RECORDINGS_COLOR = '#FF5722';

// ── 口语原声清洗（仅用于展示，不改动 ev.text，音频仍按原文匹配）────────────────
// 去掉语气词/填充词与口吃重复，让浏览网站的人更易读。
// 可安全去重的「虚词/代词」双字（无正常叠词含义）；不含 看/想/说 等有叠词义的字。
const STUTTER_CHARS = '他她它我你您这那就是在有会要可对先再都也还把被和跟的了不没很';
const STUTTER_RE = new RegExp(`([${STUTTER_CHARS}])\\1`, 'g');

function cleanSpokenText(text: string): string {
  return text
    .replace(/[嗯呃唉噢哦诶欸唔呐]/g, '') // 纯填充语气词
    .replace(/[啊呀哇啦嘞咯]/g, '') // 句中/句末语气助词噪声
    .replace(/(.)\1{2,}/g, '$1') // 连续 3+ 单字口吃：他他他 → 他
    .replace(/(.{2,4})\1+/g, '$1') // 紧邻重复短语：就是就是 → 就是
    .replace(STUTTER_RE, '$1') // 虚词/代词双字口吃：先先 → 先
    .replace(/\s+/g, '')
    .replace(/([，。！？、])[，。、！？]+/g, '$1') // 折叠因删词产生的连续标点
    .replace(/^[，。、！？]+/, '') // 去前导标点
    .replace(/[，、]+$/g, '')
    .trim();
}

// ── 高亮 **关键词** ─────────────────────────────────────────────────────────
function renderHighlightedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-gray-900 font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ── 单条代表原声 ────────────────────────────────────────────────────────────
function QuoteItem({ ev, color }: { ev: FamilyEvidence; color: string }) {
  const clips = clipsForQuote(ev.text);
  return (
    <div
      data-evidence-card
      className="flex gap-3 pt-3 px-2 -mx-2 border-t border-gray-100 first:border-0 first:pt-0"
    >
      <span className="text-[22px] leading-none font-serif shrink-0 mt-0.5 select-none text-gray-300">
        "
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2 flex-wrap">
          <p className="text-[13px] text-gray-700 leading-relaxed flex-1">
            {renderHighlightedText(cleanSpokenText(ev.text))}
          </p>
          {ev.tag && (
            <span
              className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium mt-0.5"
              style={{ backgroundColor: `${color}14`, color }}
            >
              {ev.tag}
            </span>
          )}
        </div>
        {ev.who && <p className="text-[11px] text-gray-400 mt-1.5">— {ev.who}</p>}
        {clips.length > 0 && <EvidenceAudioClips clips={clips} />}
      </div>
    </div>
  );
}

// ── 子维度 section（单产品，去掉物理页的多品牌对比层） ────────────────────────
function SubDimSection({
  sub,
  color,
  citeKey,
  onEdit,
}: {
  sub: FamilySubDimension;
  color: string;
  citeKey?: string;
  onEdit?: () => void;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  // 被引用的原话若落在本子维度，自动展开（含「展开全部」），确保高亮能定位到
  React.useEffect(() => {
    if (citeKey && sub.evidence.some((ev) => citeMatches(ev.text, citeKey))) {
      setCollapsed(false);
      setExpanded(true);
    }
  }, [citeKey, sub.evidence]);

  if (sub.evidence.length === 0) return null;

  const PREVIEW = 3;
  const shown = expanded ? sub.evidence : sub.evidence.slice(0, PREVIEW);
  const hasMore = sub.evidence.length > PREVIEW;

  const toggleExpanded = () => {
    setExpanded((v) => {
      // 收起时回滚到该维度顶部，避免停留在很靠下、看不到上下文的位置
      if (v) {
        requestAnimationFrame(() =>
          sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        );
      }
      return !v;
    });
  };

  return (
    <div ref={sectionRef} className="scroll-mt-4">
      {/* 子维度标题（左侧色条） */}
      <div
        className="mb-4 pl-3 border-l-[3px] flex items-center gap-3 flex-wrap"
        style={{ borderColor: color }}
      >
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-2 text-left shrink-0"
        >
          <span className="text-[15px] font-bold text-gray-900">{sub.name}</span>
          <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
            {sub.evidence.length} 条原声
            {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          </span>
        </button>
      </div>

      {!collapsed && (
        <>
          {/* AI 概况 */}
          {sub.summary && (
            <div
              className="mb-4 rounded-xl px-4 py-3 border-l-[3px]"
              style={{ borderColor: color, backgroundColor: `${color}08` }}
            >
              <p className="text-sm text-gray-700 leading-relaxed">
                <Sparkles size={14} className="inline mr-1 -mt-0.5" style={{ color }} />
                <span className="font-bold mr-1.5" style={{ color }}>
                  AI 概况
                </span>
                {sub.summary}
              </p>
            </div>
          )}

          {/* 单产品卡片：AI 总结 + 代表原声 */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-[3px_4px_0_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="h-[2px] w-full bg-gray-100" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-gray-100 text-gray-700">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  洋葱家庭包用户
                </span>
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="flex items-center gap-1 rounded-lg border border-amber-200 px-2 py-1 text-[11px] font-medium text-amber-600 transition-colors hover:bg-amber-50"
                  >
                    <Pencil size={10} />
                    编辑
                  </button>
                )}
              </div>

              {/* AI 总结 */}
              {sub.cardSummary && (
                <div
                  className="mb-4 rounded-xl p-3.5 border-l-[3px]"
                  style={{ borderColor: color, backgroundColor: `${color}0A` }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles size={12} style={{ color }} />
                    <span className="text-[11px] font-semibold" style={{ color }}>
                      AI 总结
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold leading-relaxed text-gray-700">
                    {sub.cardSummary}
                  </p>
                </div>
              )}

              {/* 代表原声：展开后限高内部滚动，避免撑长整页、收起按钮够不到 */}
              <div
                className={cn(
                  'space-y-0',
                  expanded &&
                    'max-h-[58vh] overflow-y-auto pr-2 -mr-2 overscroll-contain rounded-lg',
                )}
              >
                {shown.map((ev, i) => (
                  <QuoteItem key={i} ev={ev} color={color} />
                ))}
              </div>

              {hasMore && (
                <button
                  onClick={toggleExpanded}
                  className="mt-3 flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {expanded ? (
                    <>
                      <ChevronDown size={11} />
                      收起
                    </>
                  ) : (
                    <>
                      <ChevronRight size={11} />
                      展开全部 {sub.evidence.length} 条原声
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── 主页面 ──────────────────────────────────────────────────────────────────
function cloneDimension(dim: FamilyInsightDimension): FamilyInsightDimension {
  if (typeof structuredClone === 'function') return structuredClone(dim);
  return JSON.parse(JSON.stringify(dim)) as FamilyInsightDimension;
}

export default function FamilyInsights() {
  const { projectId } = useParams<{ projectId: string }>();
  const editor = useIsEditor();
  const { data: storedDimensions, saving, save } = useContentStore<FamilyInsightDimension[]>(
    'family-insights',
    FAMILY_INSIGHT_DIMENSIONS,
  );
  const dimensions = storedDimensions.length > 0 ? storedDimensions : FAMILY_INSIGHT_DIMENSIONS;
  const [activeKey, setActiveKey] = React.useState(FAMILY_INSIGHT_DIMENSIONS[0].key);
  const [draft, setDraft] = React.useState<FamilyInsightDimension | null>(null);
  const citeKey = useCiteKey();

  // 有引用跳转时，切到包含被引用原话的维度 Tab（否则原话在非当前 Tab，根本没渲染）
  React.useEffect(() => {
    if (!citeKey) return;
    const target = dimensions.find((dim) =>
      dim.subDimensions.some((sub) => sub.evidence.some((ev) => citeMatches(ev.text, citeKey))),
    );
    if (target) setActiveKey(target.key);
  }, [citeKey, dimensions]);

  React.useEffect(() => {
    if (activeKey === RECORDINGS_KEY) return;
    if (!dimensions.some((dim) => dim.key === activeKey)) {
      setActiveKey(dimensions[0]?.key ?? FAMILY_INSIGHT_DIMENSIONS[0].key);
    }
  }, [activeKey, dimensions]);

  // 仅家庭包项目可用，其余项目重定向到总览
  if (projectId !== 'jiatingbao_project') {
    return <Navigate to={`/projects/${projectId}/summary`} replace />;
  }

  const isRecordings = activeKey === RECORDINGS_KEY;
  const active = dimensions.find((d) => d.key === activeKey) ?? dimensions[0] ?? FAMILY_INSIGHT_DIMENSIONS[0];

  const openEditDrawer = () => {
    if (isRecordings || !active) return;
    setDraft(cloneDimension(active));
  };

  const saveDraft = async () => {
    if (!draft) return;
    const next = dimensions.map((dim) => (dim.key === draft.key ? draft : dim));
    await save(next);
    setDraft(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 顶栏 */}
      <div className="bg-[#FEFDF9] border-b border-[#E8E2D9] px-6 pt-4 pb-0">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <MessageSquare size={15} className="text-[#FF5722]" />
          <h2 className="text-[15px] font-bold text-gray-900">定性洞察</h2>
          <span className="text-[11px] text-gray-400">洋葱家庭包 · 用户访谈逐句拆解</span>
        </div>

        {/* 维度 Tab */}
        <div className="flex">
          {dimensions.map((dim) => {
            const isActive = activeKey === dim.key;
            return (
              <button
                key={dim.key}
                onClick={() => setActiveKey(dim.key)}
                className={cn(
                  'px-5 py-2.5 text-[13px] font-medium border-b-2 transition-all',
                  isActive ? '' : 'border-transparent text-gray-500 hover:text-gray-700',
                )}
                style={isActive ? { borderColor: dim.color, color: dim.color } : {}}
              >
                {dim.label}
              </button>
            );
          })}
          <button
            onClick={() => setActiveKey(RECORDINGS_KEY)}
            className={cn(
              'px-5 py-2.5 text-[13px] font-medium border-b-2 transition-all',
              isRecordings ? '' : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
            style={isRecordings ? { borderColor: RECORDINGS_COLOR, color: RECORDINGS_COLOR } : {}}
          >
            访谈录音
          </button>
        </div>
      </div>

      {/* 内容 */}
      {isRecordings ? (
        <FamilyInterviewRecordings />
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 维度结论 */}
          <div
            className="rounded-xl px-4 py-3 border-l-[3px]"
            style={{ borderColor: active.color, backgroundColor: `${active.color}08` }}
          >
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold" style={{ color: active.color }}>
                <Sparkles size={14} />
                维度结论
              </span>
              {editor && (
                <button
                  onClick={openEditDrawer}
                  className="flex items-center gap-1 rounded-lg border border-amber-200 bg-white/70 px-2 py-1 text-[11px] font-medium text-amber-600 transition-colors hover:bg-amber-50"
                >
                  <Pencil size={10} />
                  编辑
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{active.verdict}</p>
          </div>

          {active.subDimensions.map((sub) => (
            <SubDimSection
              key={sub.name}
              sub={sub}
              color={active.color}
              citeKey={citeKey}
              onEdit={editor ? openEditDrawer : undefined}
            />
          ))}
        </div>
      )}
      <EditDrawer
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft ? `编辑「${draft.label}」` : '编辑家庭包洞察'}
      >
        {draft && (
          <div className="space-y-5">
            <TextField
              label="维度名称"
              value={draft.label}
              onChange={(value) => setDraft({ ...draft, label: value })}
            />
            <TextField
              label="维度结论"
              value={draft.verdict}
              multiline
              onChange={(value) => setDraft({ ...draft, verdict: value })}
            />
            <div className="space-y-4">
              {draft.subDimensions.map((sub, index) => (
                <div key={`${sub.name}-${index}`} className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
                  <TextField
                    label={`子维度 ${index + 1} 名称`}
                    value={sub.name}
                    onChange={(value) => {
                      const next = cloneDimension(draft);
                      next.subDimensions[index] = { ...next.subDimensions[index], name: value };
                      setDraft(next);
                    }}
                  />
                  <TextField
                    label="AI 概况"
                    value={sub.summary}
                    multiline
                    onChange={(value) => {
                      const next = cloneDimension(draft);
                      next.subDimensions[index] = { ...next.subDimensions[index], summary: value };
                      setDraft(next);
                    }}
                  />
                  <TextField
                    label="卡片 AI 总结"
                    value={sub.cardSummary}
                    multiline
                    onChange={(value) => {
                      const next = cloneDimension(draft);
                      next.subDimensions[index] = { ...next.subDimensions[index], cardSummary: value };
                      setDraft(next);
                    }}
                  />
                  <p className="text-[11px] text-gray-400">
                    该子维度下 {sub.evidence.length} 条原声证据不在这里编辑，以免影响录音切片匹配。
                  </p>
                </div>
              ))}
            </div>
            <SaveBar saving={saving} onSave={() => void saveDraft()} onCancel={() => setDraft(null)} />
          </div>
        )}
      </EditDrawer>
    </div>
  );
}
