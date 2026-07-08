import React from 'react';
import { Bot, ExternalLink, Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiAskSiteAssistant } from '../../api/siteAssistant';
import { useProjects } from '../../store/useProjectStore';
import { buildSiteKnowledge } from './siteKnowledge';
import { hasEnoughEvidence, searchKnowledge } from './search';
import { buildCiteParam, normalizeForMatch } from './evidenceHighlight';
import type { EvidenceLink, SiteAssistantResponse } from './types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  links?: EvidenceLink[];
  unavailable?: boolean;
  answerMode?: SiteAssistantResponse['answerMode'];
}

const QUICK_QUESTIONS = [
  '为什么初中的家庭会买家庭包？',
  '家庭包未购用户主要顾虑是什么？',
  '初中用户画像的核心痛点是什么？',
];

const OUT_OF_SCOPE =
  '这个问题超出了当前网站资料范围。我只能回答 InsightHub 中已有项目、画像、定性原声和报告内容。';

// 展示去重：标题越长（具体洞察句）越严格（最多 1 条），通用短标题（如「家庭包用户原声」）放宽到 3 条；
// 完全相同的原话只保留 1 条。避免引用区出现「标题一样」的重复卡片。
function dedupeLinksForDisplay(links: EvidenceLink[] = []): EvidenceLink[] {
  const titleCount = new Map<string, number>();
  const seenExcerpt = new Set<string>();
  const out: EvidenceLink[] = [];
  for (const link of links) {
    const excerptKey = normalizeForMatch(link.excerpt || '');
    if (excerptKey && seenExcerpt.has(excerptKey)) continue;
    const base = (link.title || '').split(/\s*·\s*/)[0].trim();
    const cap = base.length >= 10 ? 1 : 3;
    const count = titleCount.get(base) ?? 0;
    if (base && count >= cap) continue;
    if (excerptKey) seenExcerpt.add(excerptKey);
    if (base) titleCount.set(base, count + 1);
    out.push(link);
  }
  return out;
}

// 把 AI 返回的轻量 Markdown 渲染成加粗：**文字** → <strong>；同时清理裸露的多余 * 号
function renderAnswerText(text: string): React.ReactNode {
  // 先规整：去掉行首列表用的孤立 *（如「* 文字」），保留 **加粗**
  const cleaned = text.replace(/^[ \t]*\*[ \t]+/gm, '');
  const parts = cleaned.split(/(\*\*[^*\n]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-[#252525]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // 兜底：清掉任何残留的成对/单个 * 号，避免露出星号
    return <React.Fragment key={index}>{part.replace(/\*+/g, '')}</React.Fragment>;
  });
}

function fallbackAnswer(question: string, links: EvidenceLink[]): SiteAssistantResponse {
  return {
    answer: [
      'AI 没有生成有效总结；我只能先展示检索到的站内证据。',
      '这不是 AI 实时总结，请点击下方链接查看原始页面。',
    ].filter(Boolean).join('\n'),
    relatedLinks: links,
    confidence: 'low',
    unavailable: true,
    answerMode: 'unavailable',
  };
}

export default function SiteAssistantWidget() {
  const projects = useProjects();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'hello',
      role: 'assistant',
      text: '你好，我可以基于站内项目、定性调研、用户画像和家庭包访谈回答问题，并给出可跳转的证据链接。',
    },
  ]);

  const knowledge = React.useMemo(() => buildSiteKnowledge(projects), [projects]);

  const ask = React.useCallback(async (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question || loading) return;

    setOpen(true);
    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text: question }]);

    const results = searchKnowledge(question, knowledge, 12);
    const links = results.slice(0, 6).map(({ chunk }) => ({
      title: chunk.title,
      excerpt: chunk.excerpt,
      route: chunk.route,
      source: chunk.source,
      projectName: chunk.projectName,
    }));

    if (!hasEnoughEvidence(results)) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: OUT_OF_SCOPE,
          links,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const response = await apiAskSiteAssistant(
        question,
        results.map((result) => result.chunk),
        location.pathname,
      );
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: response.answer,
          links: response.relatedLinks?.length ? response.relatedLinks : links,
          unavailable: response.unavailable,
          answerMode: response.answerMode,
        },
      ]);
    } catch {
      const response = fallbackAnswer(question, links);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: response.answer,
          links: response.relatedLinks,
          unavailable: true,
          answerMode: response.answerMode,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [knowledge, loading, location.pathname]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    void ask(input);
  };

  const openLink = (link: EvidenceLink) => {
    const cite = buildCiteParam(link.excerpt || link.title);
    const separator = link.route.includes('?') ? '&' : '?';
    navigate(cite ? `${link.route}${separator}cite=${cite}` : link.route);
    setOpen(false);
  };

  return (
    <div data-site-assistant className="fixed bottom-5 right-5 z-50">
      {open && (
        <section className="mb-3 flex h-[min(680px,calc(100vh-96px))] w-[min(420px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-[#ddd8cf] bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-[#eee8df] bg-[#fffaf7] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e65532] text-white">
                <Bot size={18} />
              </span>
              <div>
                <div className="text-sm font-extrabold text-[#252525]">站内问答助手</div>
                <div className="text-[11px] text-[#8a8178]">只基于 InsightHub 已有内容回答</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#756d64] hover:bg-[#f2ece5]"
              aria-label="关闭问答助手"
            >
              <X size={17} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#fbfaf7] px-4 py-4">
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void ask(question)}
                  className="rounded-full border border-[#eadfd5] bg-white px-3 py-1.5 text-left text-xs font-semibold text-[#6f6258] hover:border-[#e65532] hover:text-[#e65532]"
                >
                  {question}
                </button>
              ))}
            </div>

            {messages.map((message) => (
              <article
                key={message.id}
                className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'ml-8 bg-[#252525] text-white'
                    : 'mr-3 border border-[#eee4d9] bg-white text-[#333]'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-[#e65532]">
                    <Sparkles size={13} /> InsightHub
                    {message.answerMode === 'ai' && <span className="text-[#9b8d82]"> · AI实时总结</span>}
                    {message.answerMode === 'evidence' && <span className="text-[#9b8d82]"> · 仅证据检索</span>}
                    {message.unavailable && <span className="text-[#9b8d82]"> · AI不可用</span>}
                  </div>
                )}
                <div className="whitespace-pre-wrap">
                  {message.role === 'assistant' ? renderAnswerText(message.text) : message.text}
                </div>
                {message.links?.length ? (
                  <div className="mt-3 space-y-2">
                    {dedupeLinksForDisplay(message.links).slice(0, 5).map((link, index) => (
                      <button
                        key={`${link.route}_${index}`}
                        type="button"
                        onClick={() => openLink(link)}
                        className="block w-full rounded-xl border border-[#eee4d9] bg-[#fffdfb] p-3 text-left hover:border-[#e65532]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="line-clamp-1 text-xs font-extrabold text-[#252525]">{link.title}</span>
                          <ExternalLink size={13} className="shrink-0 text-[#e65532]" />
                        </div>
                        <div className="mt-1 text-[11px] text-[#9a8f85]">{link.projectName || link.source}</div>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#6c625b]">{link.excerpt}</p>
                      </button>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}

            {loading && (
              <div className="mr-12 flex items-center gap-2 rounded-2xl border border-[#eee4d9] bg-white px-4 py-3 text-sm text-[#756d64]">
                <Loader2 size={15} className="animate-spin text-[#e65532]" />
                正在检索站内证据并整理回答...
              </div>
            )}
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t border-[#eee8df] bg-white p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="问一个站内问题，例如：为什么初中的家庭会买家庭包？"
              className="min-w-0 flex-1 rounded-xl border border-[#ddd8cf] px-3 py-2 text-sm outline-none focus:border-[#e65532]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e65532] text-white disabled:cursor-not-allowed disabled:bg-[#d8d2cc]"
              aria-label="发送问题"
            >
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e65532] text-white shadow-xl shadow-[#e6553240] transition-transform hover:-translate-y-0.5"
        aria-label="打开站内问答助手"
      >
        {open ? <X size={22} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
}
