import type { CSSProperties } from 'react';
import { ArrowRight, Camera, Construction, MessageSquareQuote, ScanSearch, Sparkles, Table2 } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  section: string;
  hint?: string;
};

function PatternIcon({
  icon: Icon,
  className,
  style,
}: {
  icon: typeof Camera;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`pointer-events-none absolute flex items-center justify-center rounded-2xl border border-[#E8E2D9]/80 bg-white/70 text-[#E65532]/35 shadow-[0_8px_24px_rgba(61,49,37,.04)] backdrop-blur-sm ${className ?? ''}`}
      style={style}
      aria-hidden
    >
      <Icon size={22} strokeWidth={1.6} />
    </div>
  );
}

export default function PaisouUnderConstruction({ section, hint }: Props) {
  return (
    <main className="relative flex min-h-full flex-col items-center justify-center overflow-hidden bg-[#F7F5F0] px-6 py-16 text-[#292724]">
      {/* 背景装饰：拍搜 / 洞察站相关图案 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-16 top-12 h-64 w-64 rounded-full bg-[#FFE8DE]/60 blur-3xl" />
        <div className="absolute -right-10 bottom-8 h-72 w-72 rounded-full bg-[#FFF3BF]/50 blur-3xl" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.045]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="paisou-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#E65532" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#paisou-grid)" />
        </svg>
        <PatternIcon icon={Camera} className="left-[8%] top-[14%] h-14 w-14 rotate-[-12deg]" />
        <PatternIcon icon={ScanSearch} className="right-[10%] top-[18%] h-16 w-16 rotate-[8deg]" />
        <PatternIcon icon={Table2} className="left-[12%] bottom-[16%] h-15 w-15 rotate-[6deg]" style={{ width: 60, height: 60 }} />
        <PatternIcon icon={MessageSquareQuote} className="right-[14%] bottom-[20%] h-14 w-14 rotate-[-8deg]" />
        <PatternIcon icon={Sparkles} className="left-[42%] top-[8%] h-11 w-11 rotate-[15deg]" style={{ width: 44, height: 44 }} />
        <PatternIcon icon={Construction} className="right-[38%] bottom-[10%] h-12 w-12 rotate-[-6deg]" style={{ width: 48, height: 48 }} />
      </div>

      <div className="relative z-10 w-full max-w-[520px] text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] border border-[#F0C4B4] bg-white shadow-[0_12px_40px_rgba(230,85,50,.12)]">
          <Construction size={30} className="text-[#E65532]" strokeWidth={1.8} />
        </div>

        <p className="text-[11px] font-bold tracking-[0.2em] text-[#E65532]">PAISOU RESEARCH · 拍搜调研</p>
        <h1 className="mt-3 text-[28px] font-black tracking-[-0.03em] md:text-[34px]">正在施工中</h1>
        <p className="mt-2 text-[15px] font-semibold text-[#5C564E]">{section}</p>
        <p className="mt-5 text-[14px] leading-7 text-[#716C65]">
          {hint ?? '这一页的内容还在整理与排版，稍后会上线完整版本。'}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {['用户访谈', 'JTBD 表格', '竞品走查', '问卷数据'].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#E4DED5] bg-white/90 px-3 py-1 text-[11px] font-bold text-[#8A837A]"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to="/projects/paisou_project/qualitative"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#E65532]/20 bg-white px-5 py-3 text-[13px] font-bold text-[#E65532] shadow-[0_8px_24px_rgba(230,85,50,.08)] transition hover:border-[#E65532]/40 hover:bg-[#FFF7F3]"
        >
          先去查看定性洞察
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* 底部条纹：施工警示 + 品牌色 */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-1.5 opacity-80"
        style={{
          background:
            'repeating-linear-gradient(-45deg, #FFE8C8 0 12px, #E65532 12px 24px, #FFF3BF 24px 36px, transparent 36px 48px)',
        }}
        aria-hidden
      />
    </main>
  );
}
