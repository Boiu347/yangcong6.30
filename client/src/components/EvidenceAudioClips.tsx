import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EvidenceClip } from '@/utils/evidenceClipLookup';

interface Props {
  clips: EvidenceClip[];
  className?: string;
}

/** 全页互斥：同一时刻只允许一个 EvidenceAudioClips 在播 */
const AUDIO_STOP_EVENT = 'insighthub:evidence-audio-stop';

function fmt(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function EvidenceAudioClips({ clips, className }: Props) {
  const [seg, setSeg] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const instanceId = React.useId();
  const autoPlayNextRef = React.useRef(false);
  const [playing, setPlaying] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  const clip = clips[seg];
  const multi = clips.length > 1;

  React.useEffect(() => {
    setSeg(0);
    autoPlayNextRef.current = false;
  }, [clips]);

  React.useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    setReady(false);
    setFailed(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.load();
    }
  }, [clip?.clipUrl]);

  // 其它实例开始播放时，停掉自己
  React.useEffect(() => {
    const onStopOthers = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail;
      if (detail?.id === instanceId) return;
      const audio = audioRef.current;
      if (!audio) return;
      autoPlayNextRef.current = false;
      audio.pause();
      setPlaying(false);
    };
    window.addEventListener(AUDIO_STOP_EVENT, onStopOthers);
    return () => window.removeEventListener(AUDIO_STOP_EVENT, onStopOthers);
  }, [instanceId]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !clip) return;

    const markReady = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setReady(true);
      setFailed(false);
      if (autoPlayNextRef.current) {
        autoPlayNextRef.current = false;
        window.dispatchEvent(new CustomEvent(AUDIO_STOP_EVENT, { detail: { id: instanceId } }));
        audio.play().catch(() => {
          setPlaying(false);
          setFailed(true);
        });
      }
    };

    const onTimeUpdate = () => setCurrent(audio.currentTime);
    const onEnded = () => {
      if (multi && seg < clips.length - 1) {
        autoPlayNextRef.current = true;
        setSeg((s) => s + 1);
        return;
      }
      setPlaying(false);
      setCurrent(0);
    };
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onError = () => {
      setReady(false);
      setPlaying(false);
      setFailed(true);
      autoPlayNextRef.current = false;
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', markReady);
    audio.addEventListener('canplay', markReady);
    audio.addEventListener('durationchange', markReady);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('error', onError);

    // 若浏览器已缓存，事件可能已错过
    if (audio.readyState >= 1) markReady();

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', markReady);
      audio.removeEventListener('canplay', markReady);
      audio.removeEventListener('durationchange', markReady);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('error', onError);
    };
  }, [clip?.clipUrl, multi, seg, clips.length, instanceId]);

  if (!clip) return null;

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      autoPlayNextRef.current = false;
      audio.pause();
      return;
    }
    window.dispatchEvent(new CustomEvent(AUDIO_STOP_EVENT, { detail: { id: instanceId } }));
    audio.play().catch(() => {
      setPlaying(false);
      setFailed(true);
    });
  };

  const retry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    setFailed(false);
    setReady(false);
    audio.load();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const val = Number(e.target.value);
    audio.currentTime = val;
    setCurrent(val);
  };

  const goSeg = (e: React.MouseEvent, next: number) => {
    e.stopPropagation();
    autoPlayNextRef.current = playing;
    setSeg(next);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      className={cn('mt-1.5 flex items-center gap-1.5 min-w-0', className)}
      onClick={(e) => e.stopPropagation()}
    >
      <audio ref={audioRef} src={clip.clipUrl} preload="auto" />

      {multi && (
        <div className="flex items-center shrink-0 gap-0.5">
          <button
            type="button"
            disabled={seg === 0}
            onClick={(e) => goSeg(e, seg - 1)}
            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            aria-label="上一段"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[10px] text-gray-400 tabular-nums min-w-[28px] text-center">
            {seg + 1}/{clips.length}
          </span>
          <button
            type="button"
            disabled={seg >= clips.length - 1}
            onClick={(e) => goSeg(e, seg + 1)}
            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            aria-label="下一段"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {failed ? (
        <button
          type="button"
          onClick={retry}
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-[#fff1ec] text-[#e65532] hover:bg-[#ffe4db]"
          aria-label="重新加载"
          title="音频加载失败，点击重试"
        >
          <RotateCcw size={11} />
        </button>
      ) : (
        <button
          type="button"
          onClick={toggle}
          disabled={!ready}
          className={cn(
            'shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors',
            ready ? 'bg-[#4361EE] text-white hover:bg-[#3451d1]' : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
          aria-label={playing ? '暂停' : '播放'}
        >
          {playing ? <Pause size={11} fill="currentColor" /> : <Play size={11} fill="currentColor" className="ml-0.5" />}
        </button>
      )}

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={current}
        onChange={seek}
        disabled={!ready || !duration || failed}
        className="evidence-audio-range flex-1 min-w-0 h-1 appearance-none rounded-full cursor-pointer disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, #4361EE ${progress}%, #E8E2D9 ${progress}%)`,
        }}
      />

      <span className="text-[10px] text-gray-400 tabular-nums shrink-0">
        {failed ? '加载失败' : fmt(current)}
      </span>
    </div>
  );
}
