import React from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  clipUrl: string;
  className?: string;
}

function fmt(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function EvidenceAudioPlayer({ clipUrl, className }: Props) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrent(audio.currentTime);
    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setReady(true);
    };
    const onEnded = () => {
      setPlaying(false);
      setCurrent(0);
    };
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('durationchange', onLoaded);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('durationchange', onLoaded);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
    };
  }, [clipUrl]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => setPlaying(false));
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const val = Number(e.target.value);
    audio.currentTime = val;
    setCurrent(val);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      className={cn('flex items-center gap-2 mt-2', className)}
      onClick={(e) => e.stopPropagation()}
    >
      <audio ref={audioRef} src={clipUrl} preload="metadata" />

      <button
        type="button"
        onClick={toggle}
        disabled={!ready}
        className={cn(
          'shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors',
          ready
            ? 'bg-[#4361EE] text-white hover:bg-[#3451d1]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed',
        )}
        aria-label={playing ? '暂停' : '播放'}
      >
        {playing ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          onChange={seek}
          disabled={!ready || !duration}
          className="evidence-audio-range flex-1 h-1.5 appearance-none rounded-full cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #4361EE ${progress}%, #E8E2D9 ${progress}%)`,
          }}
        />
        <span className="text-[10px] text-gray-400 tabular-nums shrink-0 w-[72px] text-right">
          {fmt(current)} / {fmt(duration)}
        </span>
      </div>
    </div>
  );
}
