import React from 'react';
import { Play, Pause, Headphones, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JtbTurn {
  idx: number;
  role: string;
  text: string;
  clip: string;
  start: number;
  duration: number;
}

interface TranscriptData {
  seq: number;
  turns: JtbTurn[];
}

const base = (seq: number) => `/clips/jiatingbao/user${seq}`;

/** 完整逐字稿 · 录音对齐：单个共享 audio，逐段播放并自动顺延 */
export default function JtbTranscript({ seq }: { seq: number }) {
  const [data, setData] = React.useState<TranscriptData | null>(null);
  const [status, setStatus] = React.useState<'loading' | 'ok' | 'empty'>('loading');
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);
  const [playing, setPlaying] = React.useState(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const rowRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());

  React.useEffect(() => {
    let alive = true;
    setStatus('loading');
    setData(null);
    setActiveIdx(null);
    setPlaying(false);
    fetch(`${base(seq)}/transcript.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: TranscriptData) => {
        if (!alive) return;
        if (!d.turns?.length) {
          setStatus('empty');
          return;
        }
        setData(d);
        setStatus('ok');
      })
      .catch(() => alive && setStatus('empty'));
    return () => {
      alive = false;
    };
  }, [seq]);

  const playTurn = React.useCallback(
    (turn: JtbTurn) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (activeIdx === turn.idx && playing) {
        audio.pause();
        return;
      }
      audio.src = `${base(seq)}/${turn.clip}`;
      audio.play().catch(() => setPlaying(false));
      setActiveIdx(turn.idx);
    },
    [seq, activeIdx, playing],
  );

  // 播放结束自动顺延到下一段
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !data) return;
    const onEnded = () => {
      const cur = data.turns.findIndex((t) => t.idx === activeIdx);
      const next = data.turns[cur + 1];
      if (next) {
        audio.src = `${base(seq)}/${next.clip}`;
        audio.play().catch(() => setPlaying(false));
        setActiveIdx(next.idx);
        const el = rowRefs.current.get(next.idx);
        el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        setPlaying(false);
        setActiveIdx(null);
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [data, seq, activeIdx]);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 py-6 text-[12px] text-gray-400">
        <Loader2 size={14} className="animate-spin" />
        正在加载逐字稿…
      </div>
    );
  }
  if (status === 'empty' || !data) {
    return <p className="py-4 text-[12px] leading-5 text-gray-400">该用户暂无录音逐字稿</p>;
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <Headphones size={13} className="text-[#e65532]" />
        <span className="text-[12px] font-bold text-gray-700">完整录音逐字稿</span>
        <span className="text-[11px] text-gray-400">{data.turns.length} 段 · 逐字稿与录音对齐</span>
      </div>

      <audio ref={audioRef} preload="none" />

      <div className="max-h-[60vh] space-y-1 overflow-y-auto rounded-xl border border-[#E8E2D9] bg-[#FEFDF9] p-2">
        {data.turns.map((turn) => {
          const isParent = turn.role === '家长';
          const active = activeIdx === turn.idx;
          return (
            <div
              key={turn.idx}
              ref={(el) => {
                if (el) rowRefs.current.set(turn.idx, el);
                else rowRefs.current.delete(turn.idx);
              }}
              className={cn(
                'flex gap-2 rounded-lg px-2 py-1.5 transition-colors',
                active ? 'bg-[#e65532]/[0.08]' : 'hover:bg-white',
              )}
            >
              <button
                type="button"
                onClick={() => playTurn(turn)}
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors',
                  active && playing
                    ? 'bg-[#e65532] text-white'
                    : 'bg-white text-[#e65532] ring-1 ring-[#e65532]/30 hover:bg-[#e65532]/10',
                )}
                aria-label={active && playing ? '暂停' : '播放'}
              >
                {active && playing ? (
                  <Pause size={11} fill="currentColor" />
                ) : (
                  <Play size={11} fill="currentColor" className="ml-0.5" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    'mr-1.5 rounded px-1 py-0.5 align-middle text-[10px] font-bold',
                    isParent ? 'bg-[#e65532]/10 text-[#c2452f]' : 'bg-gray-100 text-gray-500',
                  )}
                >
                  {turn.role}
                </span>
                <span
                  className={cn(
                    'align-middle text-[12.5px] leading-6',
                    isParent ? 'text-gray-800' : 'text-gray-500',
                  )}
                >
                  {turn.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
