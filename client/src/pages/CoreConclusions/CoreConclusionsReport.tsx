import React from 'react';
import {
  BarChart3,
  BookOpenCheck,
  ExternalLink,
  FileText,
  Handshake,
  Lightbulb,
  Quote,
  SearchCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import type { EvidenceClip } from '@/utils/evidenceClipLookup';
import {
  coreConclusionSections,
  countCoreUsers,
  countCoreVocClips,
  type DimensionSection,
  type Point,
  type SubSection,
  type VocClip,
} from './coreConclusionsData';

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

function PointBlock({ point, color }: { point: Point; color: string }) {
  return (
    <div className="rounded-[12px] bg-[#FFF9F5] px-3.5 py-3.5">
      <div className="flex items-start gap-2">
        {point.label && (
          <span
            className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {point.label}
          </span>
        )}
        <p className="min-w-0 flex-1 text-[15px] font-bold leading-7 text-[#292521]">{point.text}</p>
      </div>

      {point.notes && point.notes.length > 0 && (
        <div className="mt-3 rounded-[10px] border border-[#EEE3D6] bg-white px-3 py-2.5">
          <p className="mb-1.5 text-[11px] font-black tracking-[0.08em] text-[#B08968]">论据支撑</p>
          <ul className="space-y-1.5">
            {point.notes.map((note) => (
              <li key={note} className="text-[13px] font-semibold leading-6 text-[#5F5851]">
                · {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {point.quotes && point.quotes.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {point.quotes.map((clip, index) => (
            <VocClipCard key={clip.text + index} clip={clip} color={color} />
          ))}
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
    </div>
  );
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
  const [selectedByDimension, setSelectedByDimension] = React.useState<Record<string, string>>(() =>
    coreConclusionSections.reduce(
      (acc, section) => {
        acc[section.id] = section.mains[0]?.id ?? '';
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  const detailRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const detailPanelRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const prevSelectedRef = React.useRef(selectedByDimension);
  const [sharedDetailHeight, setSharedDetailHeight] = React.useState<number | null>(null);

  const totalVoc = countCoreVocClips();
  const userCount = countCoreUsers();
  const totalConclusions = coreConclusionSections.reduce((sum, section) => sum + section.mains.length, 0);

  React.useLayoutEffect(() => {
    const measuredNodes = coreConclusionSections
      .map((section) => [section.id, detailRefs.current[section.id]] as const)
      .filter((entry): entry is readonly [string, HTMLElement] => Boolean(entry[1]));

    if (measuredNodes.length === 0) return;

    const updateAllHeights = () => {
      const maxHeight = Math.max(...measuredNodes.map(([, node]) => Math.ceil(node.getBoundingClientRect().height)));
      setSharedDetailHeight((prev) => (prev === maxHeight ? prev : maxHeight));
    };

    updateAllHeights();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateAllHeights);
      return () => window.removeEventListener('resize', updateAllHeights);
    }

    const observer = new ResizeObserver(() => updateAllHeights());
    measuredNodes.forEach(([, node]) => observer.observe(node));
    window.addEventListener('resize', updateAllHeights);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateAllHeights);
    };
  }, [selectedByDimension]);

  React.useLayoutEffect(() => {
    coreConclusionSections.forEach((section) => {
      if (prevSelectedRef.current[section.id] === selectedByDimension[section.id]) return;
      detailPanelRefs.current[section.id]?.scrollTo({ top: 0 });
    });
    prevSelectedRef.current = selectedByDimension;
  }, [selectedByDimension]);

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

      <section className="px-5 pb-8 md:px-8">
        <div className="mx-auto max-w-[1440px] space-y-6">
          {coreConclusionSections.map((section) => {
            const Icon = iconByKey[section.iconKey];
            const selectedId = selectedByDimension[section.id];
            const selectedMain = section.mains.find((item) => item.id === selectedId) ?? section.mains[0];
            const selectedIndex = section.mains.findIndex((item) => item.id === selectedMain.id);

            const dynamicHeightStyle = sharedDetailHeight
              ? ({ '--detail-column-height': `${sharedDetailHeight + 48}px` } as React.CSSProperties)
              : undefined;

            return (
              <article
                key={section.id}
                className="w-full rounded-[24px] border border-[#E0D7CC] bg-white p-5 shadow-[0_18px_42px_rgba(55,44,34,.07)]"
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

                <div className="grid w-full items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
                  <aside
                    ref={(node) => {
                      detailRefs.current[section.id] = node;
                    }}
                    className="w-full shrink-0 self-start rounded-[18px] border border-[#E6DDD3] bg-[#FBFAF7] p-3 lg:w-[300px]"
                  >
                    <div className="mb-3 flex shrink-0 items-center justify-between">
                      <p className="text-[14px] font-black text-[#403A34]">结论列表</p>
                      <span className="text-[11px] font-bold text-[#8A8279]">{section.mains.length} 条</span>
                    </div>
                    <div className="space-y-2.5">
                      {section.mains.map((main, index) => {
                        const selected = main.id === selectedMain.id;
                        return (
                          <button
                            key={main.id}
                            type="button"
                            onClick={() => setSelectedByDimension((prev) => ({ ...prev, [section.id]: main.id }))}
                            className={cn(
                              'w-full rounded-[14px] border p-4 text-left transition',
                              selected ? 'bg-white shadow-[0_12px_28px_rgba(55,44,34,.08)]' : 'bg-white hover:bg-[#FFF9F5]',
                            )}
                            style={{ borderColor: selected ? section.color : `${section.color}55` }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F1ECE5] text-[14px] font-black text-[#7D746A]">
                                {index + 1}
                              </span>
                              <div className="min-w-0">
                                <h3 className="text-[15px] font-black leading-6 text-[#292521]">{main.title}</h3>
                                <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6F675F]">{main.summary}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  <section
                    ref={(node) => {
                      detailPanelRefs.current[section.id] = node;
                    }}
                    className="w-full min-w-0 self-start rounded-[18px] border border-[#E6DDD3] bg-white p-5 lg:h-[var(--detail-column-height)] lg:overflow-y-auto"
                    style={dynamicHeightStyle}
                  >
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-black"
                      style={{ backgroundColor: `${section.color}12`, color: section.color }}
                    >
                      当前结论
                      <span className="rounded-full bg-white px-2 py-0.5">{selectedIndex + 1}</span>
                    </div>
                    <h3 className="mt-4 text-[26px] font-black leading-tight text-[#292521]">{selectedMain.title}</h3>

                    <div className="mt-5 rounded-[16px] border border-[#EEE0D6] bg-[#FFF9F5] p-5">
                      <div className="flex items-center gap-2 text-[14px] font-black" style={{ color: section.color }}>
                        <BookOpenCheck size={17} />
                        关键洞察
                      </div>
                      <p className="mt-3 text-[15px] font-semibold leading-8 text-[#403A34]">{selectedMain.insight}</p>
                    </div>

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

                    <div className="mt-4 rounded-[14px] border border-[#E6DDD3] bg-[#FBFAF7] px-4 py-3 text-[12px] font-semibold leading-6 text-[#7D746A]">
                      {selectedMain.evidenceNote}
                    </div>
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
    </main>
  );
}
