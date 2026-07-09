import React from 'react';
import {
  BookOpenCheck,
  ExternalLink,
  FileText,
  Handshake,
  Lightbulb,
  Pencil,
  Quote,
  SearchCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import type { EvidenceClip } from '@/utils/evidenceClipLookup';
import { useIsEditor } from '@/components/auth/PasswordGate';
import { useContentStore } from '@/hooks/useContentStore';
import { EditDrawer, ListField, SaveBar, TextField } from '@/components/edit/EditDrawer';
import { citeMatches, useCiteKey } from '@/components/siteAssistant/evidenceHighlight';
import {
  coreConclusionSections,
  countCoreUsers,
  countCoreVocClips,
  type DimensionSection,
  type MainConclusion,
  type Point,
  type SubSection,
  type VocClip,
} from './coreConclusionsData';
import { HighlightText } from '@/components/report/HighlightText';
import { Disclosure } from '@/components/report/Disclosure';
import { InsightHeadline } from '@/components/report/InsightHeadline';
import { ProsConsMatrix, onionExperiencePros, onionExperienceCons } from '@/components/report/ProsConsMatrix';

const CORE_CONCLUSIONS_STORE_KEY = 'core-conclusions';

function cloneMain(main: MainConclusion): MainConclusion {
  if (typeof structuredClone === 'function') return structuredClone(main);
  return JSON.parse(JSON.stringify(main)) as MainConclusion;
}

const INTERVIEW_INDEX_URL = 'https://guanghe.feishu.cn/wiki/STo3wNQSui7aohkP4oacAXVVnKf';
const QUANT_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/HBKvwABW1ibBvPkUX1ncVVBbnRe';
const STRATEGY_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/BRBywMno4iK5QakFbmqcwJxen4b?from=from_copylink';
const RESEARCH_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/S7NrwiHD8iQhkFkzR50cs54bnMf?from=from_copylink';

const iconByKey: Record<DimensionSection['iconKey'], typeof Lightbulb> = {
  deal: Handshake,
  barrier: SearchCheck,
  experience: BookOpenCheck,
};

function VocClipCard({ clip, color }: { clip: VocClip; color: string }) {
  const evidenceClips: EvidenceClip[] = clip.clipUrl ? [{ clipUrl: clip.clipUrl, startTime: 0, duration: 0 }] : [];
  return (
    <div className="flex w-full flex-col rounded-[12px] border border-[#EADFD2] bg-white px-3.5 py-3">
      <div className="flex items-start gap-1.5">
        <Quote size={13} className="mt-0.5 shrink-0" style={{ color }} />
        <p className="text-[12.5px] font-semibold leading-5 text-[#3A342E]">{clip.text}</p>
      </div>
      <p className="mt-1.5 text-[11px] font-bold text-[#9A8F82]">— {clip.source}</p>
      {clip.clipUrl ? (
        <EvidenceAudioClips clips={evidenceClips} />
      ) : (
        <p className="mt-1.5 text-[10.5px] font-semibold text-[#B7ADA1]">暂无对应录音切片（可后续补切）</p>
      )}
    </div>
  );
}

const LOSS_RED = '#D64C3C';

function PointBlock({ point, color }: { point: Point; color: string }) {
  const isLoss = point.label?.includes('劣势') ?? false;
  const accent = isLoss ? LOSS_RED : color;
  return (
    <div
      className="rounded-[12px] px-3.5 py-3.5"
      style={{ backgroundColor: isLoss ? '#FEF2F0' : '#FFF9F5' }}
    >
      <div className="flex items-start gap-2">
        {point.label && (
          <span
            className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black"
            style={{ backgroundColor: `${accent}18`, color: accent }}
          >
            {point.label}
          </span>
        )}
        <p className="min-w-0 flex-1 text-[15px] font-bold leading-7 text-[#292521]">
          <HighlightText color={accent}>{point.text}</HighlightText>
        </p>
      </div>

      {((point.notes && point.notes.length > 0) || (point.images && point.images.length > 0)) && (
        <Disclosure
          label="展开论据"
          count={(point.notes?.length ?? 0) + (point.images?.length ?? 0)}
          color={accent}
          className="mt-3"
        >
          {point.notes && point.notes.length > 0 && (
            <div className="rounded-[10px] border border-[#EEE3D6] bg-white px-3 py-2.5">
              <p className="mb-1.5 text-[11px] font-black tracking-[0.08em] text-[#B08968]">论据支撑</p>
              <ul className="space-y-1.5">
                {point.notes.map((note) => (
                  <li key={note} className="text-[13px] font-semibold leading-6 text-[#5F5851]">
                    · <HighlightText color={accent}>{note}</HighlightText>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {point.images && point.images.length > 0 && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {point.images.map((image) => (
                <figure key={image.src} className="overflow-hidden rounded-[12px] border border-[#EADFD2] bg-white">
                  <img src={image.src} alt={image.caption ?? ''} className="w-full object-contain" loading="lazy" />
                  {image.caption && (
                    <figcaption className="border-t border-[#F0E7DB] px-3 py-1.5 text-[11px] font-bold text-[#9A8F82]">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </Disclosure>
      )}

      {point.quotes && point.quotes.length > 0 && (
        <Disclosure label="听访谈原声" count={point.quotes.length} color={accent} icon={<Quote size={13} />} className="mt-2.5">
          <div className="flex flex-col gap-2">
            {point.quotes.map((clip, index) => (
              <VocClipCard key={clip.text + index} clip={clip} color={accent} />
            ))}
          </div>
        </Disclosure>
      )}
    </div>
  );
}

/** 取主标题在 —— 或 ：/: 之前的短词，无分隔符则返回全称 */
function toShortTitle(title: string): string {
  return title.split(/——|：|:/)[0].trim() || title;
}

function SubSectionBlock({ sub, index, color }: { sub: SubSection; index: number; color: string }) {
  return (
    <div className="rounded-[12px] bg-[#FFFDFB] px-3 py-3" style={{ boxShadow: `inset 3px 0 0 ${color}` }}>
      {sub.title && (
        <div className="mb-2.5 flex items-start gap-3">
          <span
            className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-black text-white"
            style={{ backgroundColor: color }}
          >
            {index + 1}
          </span>
          <h4 className="text-[16px] font-black leading-7 text-[#292521]">{sub.title}</h4>
        </div>
      )}
      <div className="space-y-2.5">
        {sub.points.map((point, pointIndex) => (
          <PointBlock key={(point.label ?? '') + point.text + pointIndex} point={point} color={color} />
        ))}
      </div>
    </div>
  );
}

export default function CoreConclusionsReport() {
  const editor = useIsEditor();
  const { data: storedSections, saving, save } = useContentStore<DimensionSection[]>(
    CORE_CONCLUSIONS_STORE_KEY,
    coreConclusionSections,
  );
  const sections = storedSections.length > 0 ? storedSections : coreConclusionSections;

  const [selectedByDimension, setSelectedByDimension] = React.useState<Record<string, string>>(() =>
    coreConclusionSections.reduce(
      (acc, section) => {
        acc[section.id] = section.mains[0]?.id ?? '';
        return acc;
      },
      {} as Record<string, string>,
    ),
  );
  const [draft, setDraft] = React.useState<{ sectionId: string; main: MainConclusion } | null>(null);

  const detailPanelRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const prevSelectedRef = React.useRef(selectedByDimension);
  const [activeSection, setActiveSection] = React.useState(coreConclusionSections[0]?.id ?? '');

  const totalVoc = countCoreVocClips();
  const userCount = countCoreUsers();
  const totalConclusions = sections.reduce((sum, section) => sum + section.mains.length, 0);

  const openEdit = React.useCallback((sectionId: string, main: MainConclusion) => {
    setDraft({ sectionId, main: cloneMain(main) });
  }, []);

  const patchDraftMain = React.useCallback((updater: (main: MainConclusion) => void) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const nextMain = cloneMain(prev.main);
      updater(nextMain);
      return { ...prev, main: nextMain };
    });
  }, []);

  const saveDraft = React.useCallback(async () => {
    if (!draft) return;
    const next = sections.map((section) =>
      section.id === draft.sectionId
        ? { ...section, mains: section.mains.map((main) => (main.id === draft.main.id ? draft.main : main)) }
        : section,
    );
    await save(next);
    setDraft(null);
  }, [draft, sections, save]);

  React.useLayoutEffect(() => {
    coreConclusionSections.forEach((section) => {
      if (prevSelectedRef.current[section.id] === selectedByDimension[section.id]) return;
      detailPanelRefs.current[section.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    prevSelectedRef.current = selectedByDimension;
  }, [selectedByDimension]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement && visible.target.dataset.sectionId) {
          setActiveSection(visible.target.dataset.sectionId);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5, 1] },
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jumpToSection = React.useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // 问答助手带 ?cite= 跳转过来时，自动选中命中的那条结论，让高亮能定位到详情区
  const citeKey = useCiteKey();
  React.useEffect(() => {
    if (!citeKey) return;
    for (const section of sections) {
      const hit = section.mains.find((main) => {
        const matchText = [
          main.title,
          main.summary,
          main.insight,
          ...main.subs.flatMap((sub) => [sub.title, ...sub.points.map((point) => point.text)]),
          ...main.subs.flatMap((sub) => sub.points.flatMap((point) => (point.quotes ?? []).map((quote) => quote.text))),
        ].filter(Boolean).join(' ');
        return citeMatches(matchText, citeKey);
      });
      if (hit) {
        setSelectedByDimension((prev) => (prev[section.id] === hit.id ? prev : { ...prev, [section.id]: hit.id }));
        requestAnimationFrame(() => jumpToSection(section.id));
        break;
      }
    }
  }, [citeKey, sections, jumpToSection]);

  return (
    <main className="min-h-full bg-[#F8F6F1] text-[#292521]">
      <header className="px-5 py-7 md:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[12px] font-black tracking-[0.16em] text-[#E95B35]">从小学系列售卖策略调研</p>
              <h1 className="mt-3 text-[32px] font-black leading-tight md:text-[42px]">核心结论</h1>
              <p className="mt-3 max-w-3xl text-[15px] font-semibold leading-7 text-[#706960]">
                按「成交原因 / 未成交卡点 / 产品体验」三个子页面沉淀核心结论，每条结论拆到用研洞察与业务启发，并落到问卷、销售数据与访谈原声。
              </p>
            </div>
            <div className="grid w-full max-w-[420px] grid-cols-2 gap-2 lg:w-[420px] lg:shrink-0">
              {[
                { label: '洞察小结', url: STRATEGY_SOURCE_URL },
                { label: '研究方案', url: RESEARCH_SOURCE_URL },
                { label: '访谈纪要', url: INTERVIEW_INDEX_URL },
                { label: '定量报告', url: QUANT_SOURCE_URL },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#D8D0C6] bg-white px-3 py-2 text-[12px] font-black text-[#5F5851] shadow-sm transition hover:border-[#E95B35] hover:text-[#E95B35]"
                >
                  <FileText size={13} />
                  {link.label}
                  <ExternalLink size={11} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              { icon: Lightbulb, value: totalConclusions, label: '核心结论', desc: '成交/卡点/体验三段沉淀', color: '#E95B35', bg: '#FFF3EE' },
              { icon: Quote, value: totalVoc, label: '访谈原声', desc: '与结论强绑定的录音切片', color: '#2F9F8F', bg: '#EFFFFB' },
              { icon: Target, value: userCount, label: '涉及用户', desc: '覆盖访谈用户来源', color: '#C58A3D', bg: '#FFF7E8' },
            ].map(({ icon: Icon, value, label, desc, color, bg }) => (
              <div key={label} className="rounded-[18px] border border-[#E6DDD3] bg-white p-5 shadow-[0_10px_28px_rgba(55,44,34,.05)]">
                <div className="flex items-center gap-4">
                  <div className="grid size-14 place-items-center rounded-full" style={{ backgroundColor: bg, color }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-[#403A34]">{label}</p>
                    <p className="text-[34px] font-black leading-none" style={{ color }}>
                      {value}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-[#8A8279]">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-20 border-y border-[#E4E2DA] bg-[#F8F6F1]/92 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-stretch gap-1 overflow-x-auto px-5 md:px-8">
          {coreConclusionSections.map((section, index) => {
            const active = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => jumpToSection(section.id)}
                className="group relative flex shrink-0 items-center gap-2 py-3.5 pl-1 pr-4 text-left"
              >
                <span
                  className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-black transition-colors"
                  style={{
                    background: active ? section.color : `${section.color}18`,
                    color: active ? '#fff' : section.color,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className="whitespace-nowrap text-[13px]"
                  style={{ color: active ? '#292521' : '#746E67', fontWeight: active ? 800 : 500 }}
                >
                  {section.label}
                </span>
                {active && <span className="absolute inset-x-1 bottom-0 h-0.5" style={{ background: section.color }} />}
              </button>
            );
          })}
        </div>
      </nav>

      <section className="px-5 pb-8 pt-6 md:px-8">
        <div className="mx-auto max-w-[1440px] space-y-6">
          {sections.map((section) => {
            const Icon = iconByKey[section.iconKey];
            const selectedId = selectedByDimension[section.id];
            const selectedMain = section.mains.find((item) => item.id === selectedId) ?? section.mains[0];
            const selectedIndex = section.mains.findIndex((item) => item.id === selectedMain.id);

            return (
              <article
                key={section.id}
                ref={(node) => {
                  sectionRefs.current[section.id] = node;
                }}
                data-section-id={section.id}
                className="w-full scroll-mt-16 rounded-[24px] border border-[#E0D7CC] bg-white p-5 shadow-[0_18px_42px_rgba(55,44,34,.07)]"
              >
                <div className="mb-5 flex flex-col gap-3 border-b border-[#E8DED3] pb-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-full" style={{ backgroundColor: `${section.color}18`, color: section.color }}>
                      <Icon size={21} />
                    </div>
                    <div>
                      <h2 className="text-[22px] font-black text-[#292521]">{section.label}</h2>
                      <p className="mt-1 text-[12px] font-semibold text-[#7D746A]">{section.desc}</p>
                    </div>
                  </div>
                  <span
                    className="w-fit rounded-full px-3 py-1.5 text-[12px] font-black"
                    style={{ backgroundColor: `${section.color}14`, color: section.color }}
                  >
                    {section.mains.length} 条结论
                  </span>
                </div>

                {section.id === 'experience' && (
                  <div className="mb-5 rounded-[18px] border border-[#E6DDD3] bg-[#FBFAF7] p-5">
                    <div className="mb-3 flex items-center gap-2 text-[13px] font-black" style={{ color: section.color }}>
                      <BookOpenCheck size={16} />
                      洋葱体验一眼看 · 优势 vs 折损
                    </div>
                    <ProsConsMatrix pros={onionExperiencePros} cons={onionExperienceCons} prosColor={section.color} />
                  </div>
                )}

                <div className="w-full">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[14px] font-black text-[#403A34]">结论列表</p>
                    <span className="text-[11px] font-bold text-[#8A8279]">{section.mains.length} 条</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {section.mains.map((main, index) => {
                      const selected = main.id === selectedMain.id;
                      return (
                        <button
                          key={main.id}
                          type="button"
                          onClick={() => setSelectedByDimension((prev) => ({ ...prev, [section.id]: main.id }))}
                          className={cn(
                            'flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-left transition',
                            selected ? 'shadow-[0_10px_24px_rgba(55,44,34,.08)]' : 'hover:bg-[#FFF9F5]',
                          )}
                          style={{
                            borderColor: selected ? section.color : `${section.color}55`,
                            backgroundColor: selected ? `${section.color}12` : '#fff',
                          }}
                        >
                          <span
                            className="grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-black text-white"
                            style={{ backgroundColor: selected ? section.color : `${section.color}80` }}
                          >
                            {index + 1}
                          </span>
                          <span
                            className="whitespace-nowrap text-[14px] font-black"
                            style={{ color: selected ? section.color : '#5F5851' }}
                          >
                            {toShortTitle(main.title)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <section
                    ref={(node) => {
                      detailPanelRefs.current[section.id] = node;
                    }}
                    className="mt-5 w-full min-w-0 scroll-mt-16 rounded-[18px] border border-[#E6DDD3] bg-white p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-black"
                        style={{ backgroundColor: `${section.color}12`, color: section.color }}
                      >
                        当前结论
                        <span className="rounded-full bg-white px-2 py-0.5">{selectedIndex + 1}</span>
                      </div>
                      {editor && (
                        <button
                          type="button"
                          onClick={() => openEdit(section.id, selectedMain)}
                          className="flex shrink-0 items-center gap-1 rounded-lg border border-amber-200 px-2.5 py-1.5 text-[11px] font-bold text-amber-600 transition-colors hover:bg-amber-50"
                        >
                          <Pencil size={11} />
                          编辑
                        </button>
                      )}
                    </div>
                    <h3 className="mt-4 text-[26px] font-black leading-tight text-[#292521]">{selectedMain.title}</h3>
                    <p className="mt-2 text-[14px] font-semibold leading-6 text-[#7D746A]">
                      <HighlightText color={section.color}>{selectedMain.summary}</HighlightText>
                    </p>

                    <InsightHeadline
                      insight={selectedMain.insight}
                      color={section.color}
                      statsSource={`${selectedMain.summary} ${selectedMain.evidenceNote}`}
                      className="mt-5"
                    />

                    <div className="mt-4 rounded-[16px] border bg-white p-5" style={{ borderColor: `${section.color}40`, boxShadow: `inset 4px 0 0 ${section.color}` }}>
                      <div className="flex items-center gap-2 text-[14px] font-black" style={{ color: section.color }}>
                        <Sparkles size={17} />
                        核心结论
                      </div>
                      <div className="mt-3 space-y-3">
                        {selectedMain.subs.map((sub, subIndex) => (
                          <SubSectionBlock key={sub.title + subIndex} sub={sub} index={subIndex} color={section.color} />
                        ))}
                      </div>
                    </div>

                    <Disclosure label="查看来源" color={section.color} icon={<FileText size={13} />} className="mt-4">
                      <p className="rounded-[14px] border border-[#E6DDD3] bg-[#FBFAF7] px-4 py-3 text-[12px] font-semibold leading-6 text-[#7D746A]">
                        {selectedMain.evidenceNote}
                      </p>
                    </Disclosure>
                  </section>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="px-5 pb-8 text-center text-[12px] font-semibold text-[#A19990] md:px-8">
        内容对应《从小学系列售卖策略调研》主页面2·核心结论；访谈原声取自访谈纪要中的用户1-用户8。
      </footer>

      <EditDrawer
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft ? `编辑「${toShortTitle(draft.main.title)}」` : '编辑核心结论'}
      >
        {draft && (
          <div className="space-y-5">
            <TextField
              label="结论标题"
              value={draft.main.title}
              onChange={(value) => patchDraftMain((main) => { main.title = value; })}
            />
            <TextField
              label="一句话摘要"
              value={draft.main.summary}
              multiline
              onChange={(value) => patchDraftMain((main) => { main.summary = value; })}
            />
            <TextField
              label="关键洞察"
              value={draft.main.insight}
              multiline
              onChange={(value) => patchDraftMain((main) => { main.insight = value; })}
            />

            <div className="space-y-4">
              {draft.main.subs.map((sub, subIndex) => (
                <div key={`sub-${subIndex}`} className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
                  <TextField
                    label={`副标题 ${subIndex + 1}`}
                    value={sub.title}
                    onChange={(value) =>
                      patchDraftMain((main) => { main.subs[subIndex].title = value; })
                    }
                  />
                  <div className="space-y-3">
                    {sub.points.map((point, pointIndex) => (
                      <div key={`point-${subIndex}-${pointIndex}`} className="rounded-xl border border-gray-200 bg-white p-3">
                        <p className="mb-2 text-[11px] font-bold text-gray-400">要点 {pointIndex + 1}</p>
                        <TextField
                          label="标签"
                          value={point.label ?? ''}
                          placeholder="如 前提 / 核心 / 体验优势 / 体验劣势"
                          onChange={(value) =>
                            patchDraftMain((main) => {
                              main.subs[subIndex].points[pointIndex].label = value || undefined;
                            })
                          }
                        />
                        <TextField
                          label="正文"
                          value={point.text}
                          multiline
                          onChange={(value) =>
                            patchDraftMain((main) => {
                              main.subs[subIndex].points[pointIndex].text = value;
                            })
                          }
                        />
                        <ListField
                          label="文字论据（问卷 / 行业 / 销售等）"
                          items={point.notes ?? []}
                          onChange={(items) =>
                            patchDraftMain((main) => {
                              main.subs[subIndex].points[pointIndex].notes = items;
                            })
                          }
                        />
                        {(point.quotes?.length ?? 0) > 0 && (
                          <div className="mt-1 space-y-2">
                            <p className="text-[11px] font-medium text-gray-400">访谈原声（音频切片不受影响）</p>
                            {point.quotes!.map((quote, quoteIndex) => (
                              <div key={`quote-${subIndex}-${pointIndex}-${quoteIndex}`} className="rounded-lg border border-gray-100 bg-gray-50/60 p-2.5">
                                <TextField
                                  label="原话"
                                  value={quote.text}
                                  multiline
                                  onChange={(value) =>
                                    patchDraftMain((main) => {
                                      main.subs[subIndex].points[pointIndex].quotes![quoteIndex].text = value;
                                    })
                                  }
                                />
                                <TextField
                                  label="来源"
                                  value={quote.source}
                                  onChange={(value) =>
                                    patchDraftMain((main) => {
                                      main.subs[subIndex].points[pointIndex].quotes![quoteIndex].source = value;
                                    })
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <TextField
              label="底部来源说明"
              value={draft.main.evidenceNote}
              multiline
              onChange={(value) => patchDraftMain((main) => { main.evidenceNote = value; })}
            />

            <SaveBar saving={saving} onSave={() => void saveDraft()} onCancel={() => setDraft(null)} />
          </div>
        )}
      </EditDrawer>
    </main>
  );
}
