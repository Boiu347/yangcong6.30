import type { EvidenceClip } from './evidenceClipLookup';
import { JIATINGBAO_CLIP_MAP } from './jiatingbaoClipLookup';
import { clipsForQuote } from './sourceUtils';
import { JTB_VOICE_CLIPS } from '@/store/jiatingbaoVoiceClips';
import { JIATINGBAO_SEGMENTS } from '@/store/jiatingbaoSegments';

interface EvidenceAudioInput {
  quote: string;
  clipCaption?: string;
}

export interface ResolvedEvidenceAudio {
  clips: EvidenceClip[];
  /** 实际播出内容（与 clips 对齐）；有值时应优先展示，避免文案与录音错位 */
  spokenText?: string;
  label: '真实访谈原声' | '相关访谈切片';
}

const VOICE_BY_CAPTION = Object.fromEntries(
  JTB_VOICE_CLIPS.map((clip) => [clip.caption, clip]),
);

const VOICE_CLIP_BY_CAPTION: Record<string, EvidenceClip> = Object.fromEntries(
  JTB_VOICE_CLIPS.map((clip) => [
    clip.caption,
    {
      clipUrl: clip.clipUrl,
      startTime: clip.startTime,
      duration: clip.duration,
    },
  ]),
);

/** 研究摘录找不到逐字切片时，仅用主题相近的旁证；UI 必须展示 spokenText */
const RELATED_CLIP_CAPTIONS: Record<string, string> = {
  '不确定孩子学得到底怎么样，如果后面好，我肯定会一次性投入。':
    '花这么多钱不一定能见到提分效果。',
  '这个涵盖的跨度时间太长，不确定性比较高，我不确定后面会不会有别的更好的替代。':
    '顾虑：线下有无门店、会不会倒闭、课程更新是否及时、孩子会不会看一会就不看。',
  '他数学方面需要进一步提升，班里52人有时候数学都排到40名了。':
    '初一男孩：作业多且耗时，晚上 10 点半左右写完；排名 30 左右，中等水平；数学薄弱，线下数学班 1 对 5 / 2 小时，目前从寒假开始上但没明显起色。',
  '大宝前面没有那么早规划，小宝肯定会提早给他规划、提前学习。':
    '小升初的时候没有给报，现在想起来有点后悔。',
  '现在先学5年级内容复习，寒暑假预习6年级内容。':
    '现在复习五年级，暑假再提前学六年级。',
};

const EXACT_QUOTE_CLIPS: Record<string, { clip: EvidenceClip; spokenText: string }> = {
  '主要担忧是小孩不适应这个课，买了浪费。': {
    clip: {
      clipUrl: '/clips/jiatingbao/seg/user1/0045.mp3',
      startTime: 0,
      duration: 0,
    },
    spokenText: '也当时也也不，我觉得担忧是小孩不适应这个课，就是买了浪费啊',
  },
};

function normalize(text: string): string {
  return text.replace(/[^\u4e00-\u9fffA-Za-z0-9]/g, '').toLowerCase();
}

function overlapScore(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;
  if (na.includes(nb) || nb.includes(na)) {
    return Math.min(na.length, nb.length) / Math.max(na.length, nb.length);
  }
  const set = new Set([...na]);
  let hit = 0;
  for (const ch of nb) if (set.has(ch)) hit += 1;
  return hit / Math.max(na.length, nb.length);
}

/** 在逐句拆解库里找与 quote 最接近的片段 */
function findBestSegment(quote: string): { clip: EvidenceClip; spokenText: string } | null {
  let best: { score: number; clip: EvidenceClip; spokenText: string } | null = null;
  for (const seg of JIATINGBAO_SEGMENTS) {
    const score = overlapScore(quote, seg.quote);
    if (score < 0.55) continue;
    if (!best || score > best.score) {
      best = {
        score,
        spokenText: seg.quote,
        clip: {
          clipUrl: seg.clipUrl!,
          startTime: seg.startTime ?? 0,
          duration: seg.duration,
        },
      };
    }
  }
  return best ? { clip: best.clip, spokenText: best.spokenText } : null;
}

function spokenTextForClipUrl(clipUrl: string): string | undefined {
  const voice = JTB_VOICE_CLIPS.find((c) => c.clipUrl === clipUrl);
  if (voice?.text) return voice.text;
  const seg = JIATINGBAO_SEGMENTS.find((s) => s.clipUrl === clipUrl);
  return seg?.quote;
}

export function resolveJiatingbaoEvidenceAudio({
  quote,
  clipCaption,
}: EvidenceAudioInput): ResolvedEvidenceAudio {
  if (clipCaption) {
    const voice = VOICE_BY_CAPTION[clipCaption];
    const clip = JIATINGBAO_CLIP_MAP[clipCaption] ?? VOICE_CLIP_BY_CAPTION[clipCaption];
    if (clip) {
      return {
        clips: [clip],
        spokenText: voice?.text ?? spokenTextForClipUrl(clip.clipUrl),
        label: '真实访谈原声',
      };
    }
  }

  const exact = EXACT_QUOTE_CLIPS[quote];
  if (exact) {
    return { clips: [exact.clip], spokenText: exact.spokenText, label: '真实访谈原声' };
  }

  const segmentHit = findBestSegment(quote);
  if (segmentHit) {
    return {
      clips: [segmentHit.clip],
      spokenText: segmentHit.spokenText,
      label: '真实访谈原声',
    };
  }

  const matchedClips = clipsForQuote(quote);
  if (matchedClips.length > 0) {
    return {
      clips: matchedClips,
      spokenText: spokenTextForClipUrl(matchedClips[0].clipUrl),
      label: '真实访谈原声',
    };
  }

  const relatedCaption = RELATED_CLIP_CAPTIONS[quote];
  const relatedVoice = relatedCaption ? VOICE_BY_CAPTION[relatedCaption] : undefined;
  const relatedClip = relatedCaption
    ? VOICE_CLIP_BY_CAPTION[relatedCaption]
    : undefined;
  if (relatedClip && relatedVoice) {
    return {
      clips: [relatedClip],
      spokenText: relatedVoice.text,
      label: '相关访谈切片',
    };
  }

  return { clips: [], label: '真实访谈原声' };
}
