import React from 'react';
import { CheckCircle2, Loader2, Lock, LockOpen, PenLine } from 'lucide-react';
import { toast } from 'sonner';
import { lockEditor, unlockEditor, useIsEditor } from './PasswordGate';
import { cn } from '@/lib/utils';

interface EditorModeButtonProps {
  compact?: boolean;
  className?: string;
}

export default function EditorModeButton({ compact, className }: EditorModeButtonProps) {
  const editor = useIsEditor();
  const [open, setOpen] = React.useState(false);

  if (editor) {
    return (
      <div className={cn('flex shrink-0 items-center gap-2', className)}>
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 md:flex">
          <CheckCircle2 size={12} />
          编辑模式已开启
        </div>
        <button
          onClick={() => {
            lockEditor();
            toast.info('已退出编辑模式');
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#dddcd5] bg-white px-3 py-1.5 text-xs font-semibold text-[#666] transition-colors hover:border-[#e65532] hover:text-[#e65532]"
        >
          <LockOpen size={13} />
          {compact ? '退出' : '退出编辑'}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#dddcd5] bg-white px-3 py-1.5 text-xs font-semibold text-[#666] transition-colors hover:border-[#e65532] hover:text-[#e65532]',
          className,
        )}
      >
        <Lock size={13} />
        {compact ? '编辑' : '解锁编辑'}
      </button>
      {open && <EditorUnlockModal onClose={() => setOpen(false)} />}
    </>
  );
}

function EditorUnlockModal({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleUnlock = async () => {
    if (!password.trim() || loading) return;
    setLoading(true);
    const ok = await unlockEditor(password.trim());
    setLoading(false);
    if (ok) {
      toast.success('编辑模式已开启，可编辑区域会显示铅笔按钮');
      onClose();
      return;
    }
    toast.error('编辑密码不正确');
    setPassword('');
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff1ec] text-[#e65532]">
            <PenLine size={20} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-950">解锁编辑</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-gray-500">
              解锁后，页面上的可编辑模块会出现铅笔按钮。家庭包定性洞察可编辑维度结论和 AI 总结。
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void handleUnlock();
            if (event.key === 'Escape') onClose();
          }}
          placeholder="请输入编辑密码"
          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-[13px] text-gray-900 outline-none transition focus:border-[#e65532] focus:ring-2 focus:ring-[#e65532]/15"
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => void handleUnlock()}
            disabled={loading || !password.trim()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#e65532] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#d64b2a] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <LockOpen size={14} />}
            解锁
          </button>
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
