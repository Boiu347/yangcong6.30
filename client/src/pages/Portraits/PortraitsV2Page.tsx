import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const VIDEOS = [
  {
    label: 'Golden Hour',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4',
  },
  {
    label: 'Still Water',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4',
  },
  {
    label: 'Deep Woods',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4',
  },
  {
    label: 'Quiet Dawn',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4',
  },
];

const OVERLAY_PNG =
  'https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png';

const NAV_LINKS = ['How It Works', 'Features', 'Pricing', 'Community'];

const SYS_FONT = 'system-ui, sans-serif';

export default function PortraitsV2Page() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 第 3 个视频（Deep Woods，index 2）触发深色内容模式
  const isDark = activeVideo === 2;
  const contentColor = isDark ? '#182C41' : '#ffffff';

  const switchVideo = (index: number) => {
    if (index === activeVideo || isTransitioning) return;
    setIsTransitioning(true);
    setActiveVideo(index);
    window.setTimeout(() => setIsTransitioning(false), 1000);
  };

  return (
    <section className="lumora-hero relative h-full w-full overflow-hidden bg-black">
      {/* ===== 背景视频层 ===== */}
      {VIDEOS.map((video, index) => (
        <video
          key={video.src}
          src={video.src}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeVideo ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* ===== 透明 PNG 叠加层（train-bob 动画）===== */}
      <img
        src={OVERLAY_PNG}
        alt=""
        aria-hidden
        className="lumora-train-bob pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ zIndex: 1 }}
      />

      {/* ===== 内容层 ===== */}
      <div className="relative flex h-full w-full flex-col px-5 py-5 sm:px-10 sm:py-7" style={{ zIndex: 2 }}>
        {/* 导航 */}
        <nav className="flex items-center justify-between">
          <span className="text-xl italic text-white sm:text-2xl">Lumora</span>

          {/* 桌面端导航 */}
          <div
            className="liquid-glass hidden items-center gap-6 rounded-full py-2 pl-6 pr-2 md:flex"
            style={{ fontFamily: SYS_FONT }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className="text-sm text-white/90 transition-colors hover:text-white"
              >
                {link}
              </button>
            ))}
            <button className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90">
              Get Started
            </button>
          </div>

          {/* 移动端汉堡按钮 */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="liquid-glass relative flex h-11 w-11 items-center justify-center rounded-full md:hidden"
            aria-label="Menu"
          >
            <Menu
              size={20}
              className={`absolute text-white transition-all duration-300 ${
                menuOpen ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              size={20}
              className={`absolute text-white transition-all duration-300 ${
                menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'
              }`}
            />
          </button>
        </nav>

        {/* Hero 内容（居中）*/}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {/* Badge */}
          <div
            className="liquid-glass rounded-full px-4 py-1.5 text-xs transition-colors duration-700 sm:text-sm"
            style={{ color: contentColor, fontFamily: SYS_FONT }}
          >
            Over 10,000 minds already finding their clarity
          </div>

          {/* 主标题 */}
          <h1
            className="mt-6 max-w-4xl text-4xl leading-[1.1] transition-colors duration-700 sm:text-5xl md:text-7xl lg:text-[5.5rem]"
            style={{ color: contentColor }}
          >
            Clarity in an Endlessly
            <br />
            Noisy Universe
          </h1>

          {/* 副标题 */}
          <p
            className="mt-6 max-w-xl text-base leading-relaxed transition-colors duration-700"
            style={{ color: contentColor, fontFamily: SYS_FONT }}
          >
            Rise above the chaos of pings, infinite scrolling, and relentless demands. Discover how
            to protect your presence and create with intention.
          </p>

          {/* 邮箱输入框 */}
          <div
            className="liquid-glass mt-8 flex w-full max-w-[320px] items-center gap-2 rounded-full p-1.5 pl-5 sm:max-w-sm"
            style={{ fontFamily: SYS_FONT }}
          >
            <input
              type="email"
              placeholder="Your Best Email"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:transition-colors"
              style={{ color: contentColor }}
            />
            <button className="shrink-0 rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90">
              Get Early Access
            </button>
          </div>

          {/* 视频切换器 */}
          <div className="mt-10 flex items-center gap-6" style={{ fontFamily: SYS_FONT }}>
            {VIDEOS.map((video, index) => {
              const current = index === activeVideo;
              return (
                <button
                  key={video.label}
                  onClick={() => switchVideo(index)}
                  className={`border-b-2 pb-1 text-xs transition-all duration-700 sm:text-sm ${
                    current ? 'border-current opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                  style={{ color: contentColor }}
                >
                  {video.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 底部统计 */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/70 sm:text-sm"
          style={{ fontFamily: SYS_FONT }}
        >
          <span>60+ Deep Sessions</span>
          <span className="hidden sm:inline">|</span>
          <span>12,000+ Creators</span>
          <span className="hidden sm:inline">|</span>
          <span>4.8 User Satisfaction</span>
          <span className="hidden sm:inline">|</span>
          <span>Intentional-First Design</span>
        </div>
      </div>

      {/* ===== 移动端菜单浮层 ===== */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative flex h-full flex-col items-center justify-center gap-8" style={{ fontFamily: SYS_FONT }}>
            {NAV_LINKS.map((link, index) => (
              <button
                key={link}
                onClick={() => setMenuOpen(false)}
                className="translate-y-4 text-3xl text-white opacity-0"
                style={{
                  animation: `lumora-menu-in 500ms cubic-bezier(0.4,0,0.2,1) ${100 + index * 50}ms forwards`,
                }}
              >
                {link}
              </button>
            ))}
            <button
              onClick={() => setMenuOpen(false)}
              className="mt-4 translate-y-4 scale-95 rounded-full bg-white px-8 py-3 text-base font-medium text-black opacity-0"
              style={{
                animation: `lumora-menu-in 500ms cubic-bezier(0.4,0,0.2,1) ${100 + NAV_LINKS.length * 50}ms forwards`,
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
