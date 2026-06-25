import React from 'react';
import { useLocation } from 'react-router-dom';

// 文本归一化：镜像 FamilyInsights 的 cleanSpokenText（去语气词/叠词），并额外去掉
// 大小写、所有空白与标点、加粗标记 *，使「AI 引用的原话」与「页面展示文本」可互相匹配。
const FILLER_INTERJECTION = /[嗯呃唉噢哦诶欸唔呐啊呀哇啦嘞咯]/g;
const STUTTER_CHARS = '他她它我你您这那就是在有会要可对先再都也还把被和跟的了不没很';
const STUTTER_RE = new RegExp(`([${STUTTER_CHARS}])\\1`, 'g');
const PUNCT_AND_SPACE = /[\s\u3000，。、！？；：“”‘’（）()【】[\]{}…·,.!?;:"'`~\-—_/\\*]+/g;

export function normalizeForMatch(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(FILLER_INTERJECTION, '')
    .replace(/(.)\1{2,}/g, '$1') // 连续 3+ 单字口吃
    .replace(/(.{2,4})\1+/g, '$1') // 紧邻重复短语
    .replace(STUTTER_RE, '$1') // 虚词/代词双字口吃
    .replace(PUNCT_AND_SPACE, '');
}

// 由引用文本生成 URL 上的 cite 参数（截断到 48 字，过短则不生成）
export function buildCiteParam(text: string): string {
  const key = normalizeForMatch(text);
  if (key.length < 8) return '';
  return encodeURIComponent(key.slice(0, 48));
}

// 判断某段文本是否对应当前的 cite（用于页面侧自动展开折叠区/切换 Tab/翻到对应分页）
export function citeMatches(text: string, citeKey: string): boolean {
  if (!citeKey || citeKey.length < 6) return false;
  const normalized = normalizeForMatch(text);
  if (normalized.length < 6) return false;
  const probes = [citeKey, citeKey.slice(0, 20), citeKey.slice(0, 12)].filter(
    (probe, index, all) => probe.length >= 8 && all.indexOf(probe) === index,
  );
  return probes.some((probe) => normalized.includes(probe));
}

// 读取当前 URL 上的 cite（已归一化）。页面用它来决定是否需要展开/定位被引用内容。
export function useCiteKey(): string {
  const location = useLocation();
  return React.useMemo(() => {
    const cite = new URLSearchParams(location.search).get('cite');
    return cite ? decodeURIComponent(cite) : '';
  }, [location.search]);
}

const CANDIDATE_SELECTOR = 'p, li, blockquote, td, dd, h2, h3, h4, summary, span';
const SPOTLIGHT_STYLE_ID = 'evidence-spotlight-style';
const SPOTLIGHT_CLASS = 'evidence-spotlight';

function ensureStyle() {
  if (document.getElementById(SPOTLIGHT_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = SPOTLIGHT_STYLE_ID;
  style.textContent = `
@keyframes evidenceSpotlightPulse {
  0% { transform: scale(1); background-color: transparent; box-shadow: inset 0 0 0 0 rgba(230,85,50,0), 0 0 0 0 rgba(230,85,50,0); }
  15% { transform: scale(1.03); background-color: rgba(230,85,50,0.16); box-shadow: inset 0 0 0 2px rgba(230,85,50,0.85), 0 8px 22px rgba(230,85,50,0.30); }
  70% { transform: scale(1.03); background-color: rgba(230,85,50,0.16); box-shadow: inset 0 0 0 2px rgba(230,85,50,0.85), 0 8px 22px rgba(230,85,50,0.30); }
  100% { transform: scale(1); background-color: transparent; box-shadow: inset 0 0 0 0 rgba(230,85,50,0), 0 0 0 0 rgba(230,85,50,0); }
}
.${SPOTLIGHT_CLASS} {
  animation: evidenceSpotlightPulse 2.1s ease-in-out both;
  border-radius: 12px;
  position: relative;
  z-index: 5;
  transform-origin: center;
}`;
  document.head.appendChild(style);
}

function findCitedElement(key: string): HTMLElement | null {
  const probes = [key, key.slice(0, 32), key.slice(0, 20), key.slice(0, 12)].filter(
    (probe, index, all) => probe.length >= 10 && all.indexOf(probe) === index,
  );
  if (!probes.length) return null;

  // 若有打开的弹窗/抽屉（标记 data-evidence-scope），仅在其内部查找，
  // 避免命中被遮挡在弹窗后面的同款原话而高亮到看不见的地方。
  const scope = document.querySelector<HTMLElement>('[data-evidence-scope]') ?? document;
  const nodes = Array.from(scope.querySelectorAll<HTMLElement>(CANDIDATE_SELECTOR));
  let best: HTMLElement | null = null;
  let bestLen = Infinity;
  for (const el of nodes) {
    if (el.closest('[data-site-assistant]')) continue; // 跳过问答助手自身
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue; // 跳过隐藏元素
    const normalized = normalizeForMatch(el.textContent || '');
    if (normalized.length < 10) continue;
    if (probes.some((probe) => normalized.includes(probe))) {
      // 取命中里「最具体（文本最短）」的元素，精准指向被引用的那句
      if (normalized.length < bestLen) {
        best = el;
        bestLen = normalized.length;
      }
    }
  }
  if (!best) return null;
  // 优先高亮整张「证据卡」（标记了 data-evidence-card），否则退回命中的文本元素本身
  const card = best.closest<HTMLElement>('[data-evidence-card]');
  return card ?? best;
}

function spotlight(el: HTMLElement) {
  ensureStyle();
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.remove(SPOTLIGHT_CLASS);
  void el.offsetWidth; // 强制重排以重启动画
  el.classList.add(SPOTLIGHT_CLASS);
  window.setTimeout(() => el.classList.remove(SPOTLIGHT_CLASS), 2100);
}

// 监听 URL 上的 cite 参数：跳转到目标页后，定位被引用的原话并「放大→复原」高亮。
export function EvidenceHighlighter() {
  const location = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cite = params.get('cite');
    if (!cite) return;
    const key = decodeURIComponent(cite);
    if (key.length < 10) return;

    let cancelled = false;
    let attempts = 0;
    let timer = 0;

    const run = () => {
      if (cancelled) return;
      const el = findCitedElement(key);
      if (el) {
        spotlight(el);
        // 命中后清掉 URL 上的 cite，避免刷新/返回时重复触发
        params.delete('cite');
        const search = params.toString();
        window.history.replaceState(
          window.history.state,
          '',
          location.pathname + (search ? `?${search}` : ''),
        );
        return;
      }
      attempts += 1;
      if (attempts < 24) timer = window.setTimeout(run, 150); // 内容懒加载，重试约 3.8s
    };

    timer = window.setTimeout(run, 280); // 等目标页首屏渲染
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [location.pathname, location.search]);

  return null;
}
