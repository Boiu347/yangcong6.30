import type { EvidenceClip } from './evidenceClipLookup';
import { JIATINGBAO_CLIP_MAP } from './jiatingbaoClipLookup';
import { clipsForQuote } from './sourceUtils';
import { JTB_VOICE_CLIPS } from '@/store/jiatingbaoVoiceClips';

interface EvidenceAudioInput {
  quote: string;
  clipCaption?: string;
}

export interface ResolvedEvidenceAudio {
  clips: EvidenceClip[];
  label: '真实访谈原声' | '相关访谈切片';
}

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

const EXACT_QUOTE_CLIPS: Record<string, EvidenceClip> = {
  '主要担忧是小孩不适应这个课，买了浪费。': {
    clipUrl: '/clips/jiatingbao/seg/user1/0045.mp3',
    startTime: 0,
    duration: 0,
  },
};

export function resolveJiatingbaoEvidenceAudio({
  quote,
  clipCaption,
}: EvidenceAudioInput): ResolvedEvidenceAudio {
  if (clipCaption) {
    const clip =
      JIATINGBAO_CLIP_MAP[clipCaption] ?? VOICE_CLIP_BY_CAPTION[clipCaption];
    if (clip) return { clips: [clip], label: '真实访谈原声' };
  }

  const directClip = EXACT_QUOTE_CLIPS[quote];
  if (directClip) return { clips: [directClip], label: '真实访谈原声' };

  const matchedClips = clipsForQuote(quote);
  if (matchedClips.length > 0) {
    return { clips: matchedClips, label: '真实访谈原声' };
  }

  const relatedCaption = RELATED_CLIP_CAPTIONS[quote];
  const relatedClip = relatedCaption
    ? VOICE_CLIP_BY_CAPTION[relatedCaption]
    : undefined;
  return {
    clips: relatedClip ? [relatedClip] : [],
    label: relatedClip ? '相关访谈切片' : '真实访谈原声',
  };
}
