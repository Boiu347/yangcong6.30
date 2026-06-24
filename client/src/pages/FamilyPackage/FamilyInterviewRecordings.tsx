import React from 'react';
import { cn } from '@/lib/utils';
import { JTB_VOICE_CLIPS, JtbVoiceClip } from '../../store/jiatingbaoVoiceClips';
import { JTB_INTERVIEWS } from '../../store/jiatingbaoData';

// 访谈录音页：与小学物理「访谈录音」界面/功能完全一致
// （可展开卡片 + 主播放/暂停键 + 进度条 + 章节时间轴，点击时间戳跳到该处播放）。
// 数据源为家庭包逐字原声切片 JTB_VOICE_CLIPS（按维度分章），点击播放对应切片。

const ACCENT = '#FF5722';

/** 把秒数格式化为 mm:ss 或 h:mm:ss */
function fmtTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// 章节（维度）展示顺序
const DIM_ORDER = ['基本学情', '认知', '了解', '购买', '使用', '预期', '建议/反馈', '建议-反馈', '洞察', '关键原声'];
function dimRank(d: string): number {
  const i = DIM_ORDER.indexOf(d);
  return i === -1 ? DIM_ORDER.length : i;
}

interface RecChapter {
  title: string;
  clips: JtbVoiceClip[];
}
interface RecInterview {
  seq: number;
  label: string;
  meta: string;
  chapters: RecChapter[];
  flat: JtbVoiceClip[];
}

function buildRecordings(): RecInterview[] {
  const bySeq = new Map<number, JtbVoiceClip[]>();
  for (const c of JTB_VOICE_CLIPS) {
    if (!bySeq.has(c.seq)) bySeq.set(c.seq, []);
    bySeq.get(c.seq)!.push(c);
  }

  const result: RecInterview[] = [];
  for (const seq of Array.from(bySeq.keys()).sort((a, b) => a - b)) {
    const clips = bySeq.get(seq)!;
    const itv = JTB_INTERVIEWS.find((i) => i.seq === seq);
    const dims = Array.from(new Set(clips.map((c) => c.dimension))).sort(
      (a, b) => dimRank(a) - dimRank(b),
    );
    const chapters: RecChapter[] = dims.map((d) => ({
      title: d,
      clips: clips.filter((c) => c.dimension === d).slice().sort((a, b) => a.startTime - b.startTime),
    }));
    const flat = chapters.flatMap((ch) => ch.clips);
    result.push({
      seq,
      label: itv ? `用户${seq} · ${itv.parent}` : `用户${seq}`,
      meta: itv ? [itv.combo, itv.region, itv.status].filter(Boolean).join(' · ') : '',
      chapters,
      flat,
    });
  }
  return result;
}

const RECORDINGS = buildRecordings();

export default function FamilyInterviewRecordings() {
  const [openId, setOpenId] = React.useState<number | null>(RECORDINGS[0]?.seq ?? null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const playingRef = React.useRef<{ seq: number; idx: number } | null>(null);
  const [playingSeq, setPlayingSeq] = React.useState<number | null>(null);
  const [playingClip, setPlayingClip] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const playClipAt = React.useCallback((seq: number, idx: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const itv = RECORDINGS.find((r) => r.seq === seq);
    const clip = itv?.flat[idx];
    if (!clip) return;
    if (audio.src !== window.location.origin + clip.clipUrl) {
      audio.src = clip.clipUrl;
      audio.load();
    }
    audio.currentTime = 0;
    void audio.play().catch(() => {});
    playingRef.current = { seq, idx };
    setPlayingSeq(seq);
    setPlayingClip(clip.clipUrl);
    setOpenId(seq);
  }, []);

  React.useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);
    const onPause = () => setPlayingSeq(null);
    const onPlay = () => {
      if (playingRef.current) setPlayingSeq(playingRef.current.seq);
    };
    const onEnded = () => {
      const p = playingRef.current;
      const itv = p ? RECORDINGS.find((r) => r.seq === p.seq) : undefined;
      if (p && itv && p.idx < itv.flat.length - 1) {
        playClipAt(p.seq, p.idx + 1);
      } else {
        playingRef.current = null;
        setPlayingSeq(null);
        setPlayingClip(null);
      }
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('durationchange', onDur);
    audio.addEventListener('loadedmetadata', onDur);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('durationchange', onDur);
      audio.removeEventListener('loadedmetadata', onDur);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('ended', onEnded);
    };
  }, [playClipAt]);

  const toggleInterview = (itv: RecInterview) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingSeq === itv.seq && !audio.paused) {
      audio.pause();
      return;
    }
    const p = playingRef.current;
    if (p && p.seq === itv.seq && audio.src) {
      void audio.play().catch(() => {});
      setPlayingSeq(itv.seq);
    } else {
      playClipAt(itv.seq, 0);
    }
  };

  const playEntry = (itv: RecInterview, clip: JtbVoiceClip) => {
    const idx = itv.flat.findIndex((c) => c.clipUrl === clip.clipUrl);
    playClipAt(itv.seq, idx >= 0 ? idx : 0);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {RECORDINGS.map((interview) => {
          const isOpen = openId === interview.seq;
          const audio = audioRef.current;
          const isPlaying = playingSeq === interview.seq && !!audio && !audio.paused;

          return (
            <div
              key={interview.seq}
              className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden"
              style={{ boxShadow: isOpen ? '0 2px 12px rgba(255,87,34,.07)' : '0 1px 4px rgba(0,0,0,.04)' }}
            >
              {/* Card header */}
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-[#FEFDF9] transition-colors"
                onClick={() => setOpenId(isOpen ? null : interview.seq)}
              >
                {/* Play/Pause button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleInterview(interview);
                  }}
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all border-2',
                    isPlaying
                      ? 'bg-[#FF5722] border-[#FF5722] text-white'
                      : 'border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white',
                  )}
                >
                  {isPlaying ? (
                    <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '-1px' }}>■■</span>
                  ) : (
                    <span style={{ fontSize: 12, marginLeft: 2 }}>▶</span>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-gray-900">{interview.label}</span>
                    {isPlaying && (
                      <span className="text-[10px] font-semibold text-[#FF5722] bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5 animate-pulse">
                        播放中 {fmtTime(currentTime)}
                      </span>
                    )}
                  </div>
                  <div className="text-[11.5px] text-gray-400 mt-0.5">
                    {interview.meta}
                    {interview.flat.length > 0 && ` · ${interview.flat.length} 段原声`}
                  </div>
                </div>

                {/* Progress bar (visible when this interview is playing) */}
                {isPlaying && duration > 0 && (
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF5722] rounded-full transition-all"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-300 font-mono">{fmtTime(duration)}</span>
                  </div>
                )}

                <span className="text-gray-300 text-[12px] ml-2 shrink-0">{isOpen ? '▲' : '▼'}</span>
              </div>

              {/* Timeline */}
              {isOpen && (
                <div className="border-t border-[#F0EDE7] px-5 py-4 space-y-5">
                  {interview.chapters.map((chapter, ci) => (
                    <div key={ci}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span
                          className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: ACCENT }}
                        >
                          {String(ci + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[13px] font-bold text-gray-800">{chapter.title}</span>
                      </div>

                      <div className="ml-7 space-y-1.5">
                        {chapter.clips.map((clip) => {
                          const isCur = playingClip === clip.clipUrl;
                          return (
                            <div key={clip.clipUrl} className="flex items-start gap-3 group">
                              <button
                                onClick={() => playEntry(interview, clip)}
                                title={`播放 ${fmtTime(clip.startTime)}`}
                                className="shrink-0 text-[#FF5722] text-[12px] font-mono font-semibold hover:underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity mt-0.5"
                                style={{ minWidth: 52 }}
                              >
                                {fmtTime(clip.startTime)}
                              </button>
                              <span
                                className={cn(
                                  'text-[12.5px] leading-relaxed',
                                  isCur ? 'text-[#FF5722] font-medium' : 'text-gray-500',
                                )}
                              >
                                {clip.caption || clip.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
