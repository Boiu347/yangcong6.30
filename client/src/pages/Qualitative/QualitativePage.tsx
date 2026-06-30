import React from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, BarChart3, ChevronDown, ChevronRight, X, Sparkles, Pencil, Save, RotateCcw, Loader2 } from 'lucide-react';
import {
  DEFAULT_QUALITATIVE_DATA,
  QualDimension,
  QualSubDimension,
  QualBrandEntry,
  QualBullet,
} from '../../store/defaultQualitativeData';
import { lookupSource, shortSource, lookupClips } from '../../utils/sourceUtils';
import EvidenceAudioClips from '../../components/EvidenceAudioClips';
import { useActiveFileIds, filterEvidenceByActiveFiles } from '../../store/activeFilesStore';
import { useContentStore } from '../../hooks/useContentStore';
import { useIsEditor } from '../../components/auth/PasswordGate';
import QualitativeEditor from '../../components/edit/QualitativeEditor';
import { cn } from '@/lib/utils';
import CalculationInsightsPage from './CalculationInsightsPage';
import FamilyInterviews from '../FamilyPackage/FamilyInterviews';
import PaisouUserStoriesPage from './PaisouUserStoriesPage';
import OnionPraiseSphere from './OnionPraiseSphere';

// ── Constants ─────────────────────────────────────────────────────────────────

const CALC_DIMENSIONS = ['用户分层与需求', '购买决策', '产品体验与服务价值', '续费诊断'] as const;
const LEGACY_DIMENSIONS = ['需求认知', '购买决策', '产品体验', '用户调研报告', '访谈录音'] as const;
const DIMENSIONS = [...CALC_DIMENSIONS, ...LEGACY_DIMENSIONS] as const;
type Dimension = (typeof DIMENSIONS)[number];

const DIM_CONFIG: Record<Dimension, { color: string; tab: string }> = {
  用户分层与需求: { color: '#5B7BBF', tab: 'border-[#5B7BBF] text-[#5B7BBF]' },
  需求认知: { color: '#5B7BBF', tab: 'border-[#5B7BBF] text-[#5B7BBF]' },
  购买决策: { color: '#BF9455', tab: 'border-[#BF9455] text-[#BF9455]' },
  产品体验与服务价值: { color: '#4BA69E', tab: 'border-[#4BA69E] text-[#4BA69E]' },
  产品体验: { color: '#4BA69E', tab: 'border-[#4BA69E] text-[#4BA69E]' },
  续费诊断: { color: '#E07A6E', tab: 'border-[#E07A6E] text-[#E07A6E]' },
  用户调研报告: { color: '#8B5CF6', tab: 'border-[#8B5CF6] text-[#8B5CF6]' },
  访谈录音:     { color: '#FF5722', tab: 'border-[#FF5722] text-[#FF5722]' },
};

// ── Interview recordings — real data ─────────────────────────────────────

/** Convert "HH:MM:SS" or "MM:SS" to seconds */
function t2s(time: string): number {
  const parts = time.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + (parts[2] ?? 0);
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
}

/** Format seconds back to mm:ss or h:mm:ss for display */
function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface TimeEntry { time: string; seconds: number; desc: string; }
interface Chapter   { title: string; entries: TimeEntry[]; }
interface Interview {
  id: string;
  label: string;
  meta: string;
  audioSrc: string;
  chapters: Chapter[];
}

function e(time: string, desc: string): TimeEntry { return { time, seconds: t2s(time), desc }; }

const INTERVIEWS: Interview[] = [
  {
    id: 'int-1',
    label: '访谈1 · 山东济宁',
    meta: '二年级 · 妙懂 & 十分通 & NB实验室 & 洋葱计算营',
    audioSrc: '/audio/interview-1.mp3',
    chapters: [
      {
        title: '孩子情况与洋葱计算营体验',
        entries: [
          e('00:07:23', '孩子成绩：数学约95/96，语文95以上，家长整体不焦虑'),
          e('00:10:47', '洋葱计算营购买原因：低年级打基础，同时摸底孩子计算能力'),
          e('00:12:03', '使用落差：孩子觉得计算营"太简单"，兴趣不大'),
          e('00:13:40', '二期不是复购满意，而是一次性买了两期；如果能退，家长倾向退'),
        ],
      },
      {
        title: '理科启蒙需求与竞品对比',
        entries: [
          e('00:23:19', '科学/理科启蒙动机：让孩子理解自然现象，有概念、能解释生活问题'),
          e('00:28:38', '妙懂：因"宣传多+永久卡+下架焦虑"购买，但孩子一眼没看过'),
          e('00:33:47', 'NB实验室：被"可触屏操作、模拟实验直观"吸引，但模拟不能替代真实'),
          e('00:37:11', '真实实验的价值：孩子喜欢、会主动要求报，兴趣带来自驱'),
          e('00:41:13', '万物指南/十分通：因吴姥姥背书、朋友推荐、永久权益购买'),
          e('00:47:36', '内容质量判断：喜欢"短而精、没有废话"，反感低幼化铺垫'),
        ],
      },
      {
        title: '购后验证与洋葱评价',
        entries: [
          e('00:58:54', '启蒙达标：孩子能大概说出一些原理，有概念性理解即可'),
          e('01:00:19', '洋葱大会员退订原因：宣传"都能看"，点进去发现部分另收费，产生"不坦诚/上当"感受'),
          e('01:03:01', '洋葱理科机会：比十分通明显更好才考虑，差不多不会再多花钱'),
          e('01:11:23', '留存痛点：需要家长催；AI/角色直接提醒孩子可能比家长催更有效'),
        ],
      },
    ],
  },
  {
    id: 'int-2',
    label: '访谈2 · 北京昌平',
    meta: '三年级 · 学而思科学 & NB实验室 & 洋葱大会员',
    audioSrc: '/audio/interview-2.mp3',
    chapters: [
      {
        title: '孩子情况与数学思维投入',
        entries: [
          e('00:01:39', '孩子成绩：三年级，数学/语文90分以上，班级中上'),
          e('00:04:43', '报数学思维原因：为初高中数学形成优势，也帮助理化'),
          e('00:05:35', '家长背景影响：自己是文科生，希望孩子不要因理科弱受限'),
          e('00:08:21', '数学思维课的证明：考试没有畏难情绪，校内不用怎么复习'),
        ],
      },
      {
        title: '学而思科学 → NB实验室选择链路',
        entries: [
          e('00:12:26', '从学而思科学转向NB：老师不再教三年级，加上性价比不高'),
          e('00:16:53', '家长明确区分：功利点讲，是学科启蒙，不只是兴趣启蒙'),
          e('00:17:16', '学而思成交点：打比赛让家长心动；后续发现进阶比赛需再次付费，评价下降'),
          e('00:22:45', 'NB成交点：终身制、不到2000、寒暑假可复习/预习'),
          e('00:23:16', 'NB留存价值：实验后能做习题，帮助消化实验原理'),
          e('00:34:21', 'NB核心价值：提前熟悉初高中实验，通过实验打知识点基础'),
          e('00:39:59', '启蒙达标：保持理化兴趣、不逆反，比短期正确率更重要'),
        ],
      },
      {
        title: '购后验证与洋葱机会',
        entries: [
          e('00:43:24', '妙懂未购买：已买NB，不会再买一套；更信任学霸三人行主播'),
          e('00:46:37', '购后验证：三年铺垫后，孩子对物理类书籍接纳度更高、兴奋度更高'),
          e('00:48:47', '洋葱机会：专家型初中老师做小学理科有吸引力，因孩子平常愿意看洋葱'),
        ],
      },
    ],
  },
  {
    id: 'int-3',
    label: '访谈3 · 广东中山',
    meta: '二年级 · 从小学物理（视频号购买）',
    audioSrc: '/audio/interview-3.mp3',
    chapters: [
      {
        title: '购买背景与成交原因',
        entries: [
          e('00:13:56', '孩子成绩：二年级，数学95以上，语文98/99，校内表现优秀'),
          e('00:17:03', '课外安排密集：舞蹈、羽毛球、英语、叫叫阅读/思维、洋葱1-6年级大会员'),
          e('00:20:36', '信息来源：微信"女儿派/鸭妈"直播'),
          e('00:21:15', '成交点：生活中能随手找到实验素材，可提前做物理启蒙'),
          e('00:22:54', '最打动点：终身权益，买后可以慢慢学、回放看'),
          e('00:23:23', '购买时没有明确变化期待，更像"先买着"'),
        ],
      },
      {
        title: '使用落差与坚持困难',
        entries: [
          e('00:25:11', '使用方式：家长有空就带着看，孩子很少主动看'),
          e('00:25:50', '使用落差：全部内容开放，缺少每天目标；叫叫有每日更新、打卡和奖励'),
          e('00:29:37', '原预期：每周学2-3次，接触生活物理，为初中打基础'),
          e('00:31:54', '尚未跟着做实验，认为前面知识"不太好做实验"'),
          e('00:34:52', '未坚持原因：孩子要学的东西太多，晚托后时间紧'),
        ],
      },
      {
        title: '期待与洋葱评价',
        entries: [
          e('00:41:41', '路径理解：先兴趣，再动手实验，最后到学科思维'),
          e('00:43:04', '启蒙达标：等初中真正学物理时不至于一点不懂，更好吸收'),
          e('00:45:15', '当前对洋葱感知：更像多做实验、多动手，离学科思维还差挺多'),
          e('00:46:39', '新学科建议：已买大会员，理想是从小学系列能对大会员开放'),
          e('00:51:24', '竞品证明：叫叫因每日打卡、提醒、奖励让孩子形成主动学习习惯'),
        ],
      },
    ],
  },
  {
    id: 'int-4',
    label: '访谈4 · 辽宁沈阳',
    meta: '二年级 · 从小学物理 & NB实验室 & 南开大学AI物理课',
    audioSrc: '/audio/interview-4.mp3',
    chapters: [
      {
        title: '家庭背景与从小学物理高留存',
        entries: [
          e('00:01:26', '二年级男孩；家长依据学习习惯和同学反馈判断孩子较优秀'),
          e('00:04:21', '家庭教育投入：线下资源有限，主力投放在线上'),
          e('00:06:12', '洋葱数学使用：紧贴校内，遇到不会的应用题会回到洋葱搜知识点'),
          e('00:08:24', '从小学物理使用：孩子自己翻、学得很多；家长视力控制15-20分钟，否则孩子还会串看'),
          e('00:09:08', '也买过NB实验室，但利用率不高'),
          e('00:10:30', 'AI物理课体验：动画不如洋葱吸引人，内容更晦涩'),
        ],
      },
      {
        title: '购买决策与竞品对比',
        entries: [
          e('00:13:37', '使用频率：如果不管，孩子每天都会刷从小学物理'),
          e('00:14:05', '孩子偏好：喜欢"实验男做实验"，当成趣味里学知识'),
          e('00:17:36', '购买链路：先买洋葱小学6年权益，从小学物理不含在内，因孩子喜欢额外付费'),
          e('00:23:14', '与NB/科学直播课差异：洋葱讲解孩子看得懂，后面答题形成小闭环'),
          e('00:28:42', '购买目的：丰富兴趣、跟着兴趣学知识，不是为了必须做实验'),
          e('00:29:54', '对洋葱核心认可：比NB和实验课更系统、知识更多、孩子更专注'),
        ],
      },
      {
        title: '证明时刻与未来期待',
        entries: [
          e('00:32:40', '学科启蒙评分：从小学物理10分给9分，扣分在实验元素和低龄概念理解'),
          e('00:34:45', '证明时刻1：孩子学完会跑来跟妈妈说"应该怎么操作"'),
          e('00:35:24', '证明时刻2：看完功率内容会考妈妈，并用自己语言分享学到的知识'),
          e('00:40:13', '与NB取舍：孩子选洋葱，NB就舍弃；洋葱有人讲、像听故事'),
          e('00:45:42', '新学科机会：如果化学/生物体验不错，可能酌情报'),
          e('00:46:44', '专业背书来源：喜欢杨临风直播表达，思路清晰，有"学霸崇拜"'),
        ],
      },
    ],
  },
  {
    id: 'int-5',
    label: '访谈5 · 重庆渝中',
    meta: '三年级 · 妙懂 & 三五小星 & 万物指南/物理十分通',
    audioSrc: '/audio/interview-5.mp3',
    chapters: [
      {
        title: '基础画像与三五小星体验',
        entries: [
          e('00:01:43', '三年级孩子数学/语文70-80多，英语较好；理科启蒙买过妙懂、三五小星、万物指南'),
          e('00:08:31', '三五小星的购买与回流：最早因内容少、界面粗糙退订；后续产品更新后重新购买'),
          e('00:17:52', '三五小星核心任务：不是系统学，而是"看着玩"、长知识；家长用"两星过关"轻量验证'),
        ],
      },
      {
        title: '妙懂与万物指南的购买对比',
        entries: [
          e('00:21:48', '妙懂的成交与落差：被AR直观、小四门题库吸引，但孩子感知妙懂更"正式"，使用不多'),
          e('00:30:35', '万物指南购买原因：主播推荐吴姥姥、市面少见动画化化学内容'),
          e('00:38:51', '使用分工：物理/地理看三五小星，化学看万物；化学从看不懂到逐渐知道名称和原理'),
        ],
      },
      {
        title: '启蒙期待与洋葱机会',
        entries: [
          e('00:40:08', '启蒙到系统学习期待：物理先保护兴趣避免畏难，化学更适合走向系统学习'),
          e('00:48:56', '效果反馈缺口：家长期待知道孩子学了什么、学了多少、记住什么'),
          e('00:51:47', '洋葱机会：知道从小学物理但当时主要为数学购买；若能提供题目、系统学习和家长反馈会考虑'),
        ],
      },
    ],
  },
  {
    id: 'int-6',
    label: '访谈6 · 河南郑州',
    meta: '四年级 · 从小学物理',
    audioSrc: '/audio/interview-6.mp3',
    chapters: [
      {
        title: '入口问题与基础画像',
        entries: [
          e('00:00:44', '入口问题：最近找不到从小学物理入口，原位置变化后显示早鸟价/立即购买'),
          e('00:02:49', '四年级孩子语数大多80-90，中等水平；郑州科学已是主科，期中期末考四门'),
          e('00:11:45', '洋葱数学参照物：更看重课内同步、随时翻知识点；之前买的实验包不适配教材，搁置'),
        ],
      },
      {
        title: '购买链路与使用落差',
        entries: [
          e('00:17:04', '从小学物理购买链路：通过郑州妈妈帮公众号和微信直播购买；郑州科学主科化提升购买动机'),
          e('00:25:39', '购买预期与落差：期待覆盖校内主要知识点；实际按四上课内知识点去找，曾没找到对应内容'),
          e('00:31:50', '购后状态：科学考前仍主要靠背，孩子很少主动点开物理'),
        ],
      },
      {
        title: '评分与期待',
        entries: [
          e('00:33:51', '购后评分：从小学物理5分给3分，主要扣在内容少、不够同步；动画形式被认可，点开后孩子愿意看'),
          e('00:41:24', '满分课程期待：知识点更多，能对标各地区教材，按地区/年级/单元/知识点查找'),
          e('00:50:22', '权益与新学科困惑：看到生物、地理入口后误以为是课包，询问后续更新和是否需分开购买'),
        ],
      },
    ],
  },
];

// ── InterviewRecordings component ──────────────────────────────────────────

function InterviewRecordings() {
  const [openId, setOpenId] = React.useState<string | null>('int-1');
  // Global audio state
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  // Keep audio element in sync
  React.useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.ontimeupdate = () => setCurrentTime(audioRef.current?.currentTime ?? 0);
      audioRef.current.ondurationchange = () => setDuration(audioRef.current?.duration ?? 0);
      audioRef.current.onended = () => setPlayingId(null);
    }
  }, []);

  const loadAndPlay = (interview: Interview, seekTo?: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.src !== window.location.origin + interview.audioSrc) {
      audio.src = interview.audioSrc;
      audio.load();
    }
    if (seekTo !== undefined) audio.currentTime = seekTo;
    void audio.play();
    setPlayingId(interview.id);
    setOpenId(interview.id);
  };

  const togglePlay = (interview: Interview) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingId === interview.id && !audio.paused) {
      audio.pause();
      setPlayingId(null);
    } else {
      loadAndPlay(interview);
    }
  };

  const seekAndPlay = (interview: Interview, seconds: number) => {
    loadAndPlay(interview, seconds);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-4">

        {INTERVIEWS.map((interview) => {
          const isOpen = openId === interview.id;
          const isPlaying = playingId === interview.id;

          return (
            <div
              key={interview.id}
              className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden"
              style={{ boxShadow: isOpen ? '0 2px 12px rgba(255,87,34,.07)' : '0 1px 4px rgba(0,0,0,.04)' }}
            >
              {/* Card header */}
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-[#FEFDF9] transition-colors"
                onClick={() => setOpenId(isOpen ? null : interview.id)}
              >
                {/* Play/Pause button */}
                <button
                  onClick={(e) => { e.stopPropagation(); togglePlay(interview); }}
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all border-2',
                    isPlaying
                      ? 'bg-[#FF5722] border-[#FF5722] text-white'
                      : 'border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white',
                  )}
                >
                  {isPlaying
                    ? <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '-1px' }}>■■</span>
                    : <span style={{ fontSize: 12, marginLeft: 2 }}>▶</span>
                  }
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
                  <div className="text-[11.5px] text-gray-400 mt-0.5">{interview.meta}</div>
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
                          style={{ background: '#FF5722' }}
                        >
                          {String(ci + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[13px] font-bold text-gray-800">{chapter.title}</span>
                      </div>

                      <div className="ml-7 space-y-1.5">
                        {chapter.entries.map((entry, ei) => (
                          <div key={ei} className="flex items-start gap-3 group">
                            <button
                              onClick={() => seekAndPlay(interview, entry.seconds)}
                              title={`跳转到 ${entry.time}`}
                              className="shrink-0 text-[#FF5722] text-[12px] font-mono font-semibold hover:underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity mt-0.5"
                              style={{ minWidth: 52 }}
                            >
                              {entry.time.startsWith('00:') ? entry.time.slice(3) : entry.time}
                            </button>
                            <span className="text-[12.5px] text-gray-500 leading-relaxed">{entry.desc}</span>
                          </div>
                        ))}
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

// ── Brand colors ─────────────────────────────────────────────────────────────

const BRAND_COLORS: Record<string, string> = {
  '洋葱':            '#E07A6E',
  '妙懂':            '#A87DB0',
  '万物指南':        '#5AABB8',
  'NB虚拟实验室':    '#7578C8',
  '学而思':          '#D49E55',
  '叫叫':            '#5BBF96',
  '赛先生科学课':    '#5DAD8A',
  '南开大学AI物理课':'#CC9450',
};

function brandColor(brand: string) {
  return BRAND_COLORS[brand] ?? '#9090A8';
}

const BRAND_ORDER = ['洋葱', '妙懂', '万物指南', 'NB虚拟实验室'];

function sortBrands(a: string, b: string) {
  const ai = BRAND_ORDER.indexOf(a);
  const bi = BRAND_ORDER.indexOf(b);
  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;
  return a.localeCompare(b, 'zh');
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Derive "访谈N·M / 城市A·城市B" from a list of evidence strings */
function getSourceSummary(evidence: string[]): string {
  const sources = evidence.map((e) => lookupSource(e)).filter(Boolean) as string[];
  const unique = Array.from(new Set(sources));
  const nums: string[] = [];
  const cities: string[] = [];
  for (const src of unique) {
    const m = src.match(/访谈(\d+)/);
    if (m) nums.push(m[1]);
    const parts = src.split('·');
    const city = (parts[2] ?? '').trim();
    if (city) cities.push(city);
  }
  const sortedNums = Array.from(new Set(nums)).sort((a, b) => +a - +b);
  const uniqueCities = Array.from(new Set(cities));
  if (!sortedNums.length) return '';
  return `访谈${sortedNums.join('·')} / ${uniqueCities.join('·')}`;
}

// ── Tag colors ────────────────────────────────────────────────────────────────

const TAG_STYLES: Record<string, { bg: string; text: string }> = {
  '启蒙-兴趣启蒙': { bg: '#E8F5F0', text: '#2E8B6E' },
  '启蒙-学科启蒙': { bg: '#E8EEF8', text: '#3D6BA6' },
  '应试-衔接先修': { bg: '#F5EDE5', text: '#B07030' },
  '应试-校内同步': { bg: '#F5F0E0', text: '#9A8520' },
  '学科启蒙':      { bg: '#E8EEF8', text: '#3D6BA6' },
  '兴趣启蒙':      { bg: '#E8F5F0', text: '#2E8B6E' },
};

// ── Highlight **keywords** in evidence text ──────────────────────────────────

function renderHighlightedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Single evidence quote ─────────────────────────────────────────────────────

function QuoteItem({
  text,
  color,
  showSources,
  quantitative,
}: {
  text: string;
  color: string;
  showSources: boolean;
  quantitative: boolean;
}) {
  const src = showSources ? lookupSource(text) : undefined;
  const clips = quantitative ? [] : lookupClips(text);
  const [metric, explanation] = quantitative && text.includes('｜')
    ? text.split(/｜(.+)/, 2)
    : ['', text];
  return (
    <div className="flex gap-3 pt-3 border-t border-gray-100 first:border-0 first:pt-0">
      {quantitative ? (
        <span
          className="mt-0.5 inline-flex min-w-[52px] shrink-0 items-center justify-center rounded-lg px-2 py-1 text-[12px] font-bold"
          style={{ color, backgroundColor: `${color}12` }}
        >
          {metric}
        </span>
      ) : (
        <span className="text-[22px] leading-none font-serif shrink-0 mt-0.5 select-none text-gray-300">
          "
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2 flex-wrap">
          <p className="text-[13px] text-gray-700 leading-relaxed flex-1">
            {renderHighlightedText(explanation)}
          </p>
        </div>
        {src && (
          <p className="text-[11px] text-gray-400 mt-1.5">
            — {shortSource(src)}
          </p>
        )}
        {clips.length > 0 && <EvidenceAudioClips clips={clips} />}
      </div>
    </div>
  );
}

// ── Brand card ────────────────────────────────────────────────────────────────

interface TaggedEvidence {
  text: string;
  tag?: string;
}

function BrandCard({
  entry,
  onEdit,
  showSources,
  quantitative,
}: {
  entry: QualBrandEntry;
  onEdit?: () => void;
  showSources: boolean;
  quantitative: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const bColor = brandColor(entry.brand);

  const allEvidence: TaggedEvidence[] = entry.bullets.flatMap((b) =>
    b.evidence.map((e) => ({ text: e, tag: b.tag }))
  );
  const sourceSummary = showSources ? getSourceSummary(allEvidence.map((e) => e.text)) : '';

  const PREVIEW = 3;
  const shown = expanded ? allEvidence : allEvidence.slice(0, PREVIEW);
  const hasMore = allEvidence.length > PREVIEW;

  if (allEvidence.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-[3px_4px_0_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="h-[2px] w-full bg-gray-100" />

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-gray-100 text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: bColor }} />
            {quantitative ? '问卷数据' : `${entry.brand}用户`}
          </span>
          <div className="flex items-center gap-2">
            {sourceSummary && (
              <span className="text-[11px] text-gray-400">{sourceSummary}</span>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-amber-600 hover:bg-amber-50 border border-amber-200 transition-colors"
              >
                <Pencil size={10} /> 编辑
              </button>
            )}
          </div>
        </div>

        {/* AI summary */}
        <div className="mb-4 rounded-xl p-3.5 border-l-[3px]"
             style={{ borderColor: bColor, backgroundColor: `${bColor}0A` }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={12} style={{ color: bColor }} />
            <span className="text-[11px] font-semibold" style={{ color: bColor }}>
              {quantitative ? '结论解释' : 'AI 总结'}
            </span>
          </div>
          <p className="text-[13px] font-semibold leading-relaxed text-gray-700">
            {entry.subtitle}
          </p>
        </div>

        {/* Evidence quotes */}
        <div className="space-y-0">
          {shown.map((e, i) => (
            <QuoteItem
              key={i}
              text={e.text}
              color={bColor}
              showSources={showSources}
              quantitative={quantitative}
            />
          ))}
        </div>

        {/* Expand / collapse */}
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            {expanded
              ? <><ChevronDown size={11} />收起</>
              : <><ChevronRight size={11} />展开全部 {allEvidence.length} 条{quantitative ? '数据依据' : '原声'}</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Sub-dimension section ─────────────────────────────────────────────────────

function SubDimSection({
  subDim,
  subIdx,
  selectedBrands,
  color,
  onEdit,
  showSources,
  quantitative,
}: {
  subDim: QualSubDimension;
  subIdx: number;
  selectedBrands: Set<string>;
  color: string;
  onEdit?: (brandIdx: number, activeTags: string[]) => void;
  showSources: boolean;
  quantitative: boolean;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [activeTags, setActiveTags] = React.useState<Set<string>>(new Set());

  // Collect all unique tags in this sub-dimension
  const allTags = Array.from(
    new Set(subDim.brands.flatMap((b) => b.bullets.map((bl) => bl.tag).filter(Boolean))) as Set<string>
  );

  // Brand-chip filter
  const brandFiltered =
    selectedBrands.size === 0
      ? subDim.brands
      : subDim.brands.filter((b) => selectedBrands.has(b.brand));

  // Active-files evidence filter + tag filter
  const visible: QualBrandEntry[] = brandFiltered
    .map((entry) => ({
      ...entry,
      bullets: entry.bullets
        .filter((bullet) => activeTags.size === 0 || (bullet.tag && activeTags.has(bullet.tag)))
        .map((bullet) => ({
          ...bullet,
          evidence: quantitative ? bullet.evidence : filterEvidenceByActiveFiles(bullet.evidence),
        })),
    }))
    .filter((entry) => entry.bullets.some((b) => b.evidence.length > 0))
    .sort((a, b) => sortBrands(a.brand, b.brand));

  if (visible.length === 0 && activeTags.size === 0) return null;

  return (
    <div>
      {/* Section header with left color border + tag filters inline */}
      <div className="mb-4 pl-3 border-l-[3px] flex items-center gap-3 flex-wrap" style={{ borderColor: color }}>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-2 text-left shrink-0"
        >
          <span className="text-[15px] font-bold text-gray-900">{subDim.name}</span>
          <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
            {visible.length} 个品牌
            {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          </span>
        </button>

        {/* Tag filter chips — inline right of title */}
        {allTags.length > 0 && !collapsed && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {allTags.map((tag) => {
              const isActive = activeTags.has(tag);
              const style = TAG_STYLES[tag];
              return (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTags((prev) => {
                      const next = new Set(prev);
                      if (next.has(tag)) next.delete(tag); else next.add(tag);
                      return next;
                    });
                  }}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium transition-all"
                  style={isActive ? {
                    backgroundColor: style?.text ?? '#666',
                    color: '#fff',
                  } : {
                    backgroundColor: 'transparent',
                    color: style?.text ?? '#999',
                    border: `1px dashed ${style?.text ?? '#ccc'}`,
                  }}
                >
                  {tag}
                </button>
              );
            })}
            {activeTags.size > 0 && (
              <button
                onClick={() => setActiveTags(new Set())}
                className="px-1.5 py-0.5 rounded-full text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
              >
                <X size={10} />清除
              </button>
            )}
          </div>
        )}
      </div>

      {!collapsed && (
        <>
        {subDim.globalSummary && (
          <div className="mb-4 rounded-xl px-4 py-3 border-l-[3px]"
               style={{ borderColor: color, backgroundColor: `${color}08` }}>
            <p className="text-sm text-gray-700 leading-relaxed">
              <Sparkles size={14} className="inline mr-1 -mt-0.5" style={{ color }} />
              <span className="font-bold mr-1.5" style={{ color }}>
                {quantitative ? '数据结论' : 'AI 概况'}
              </span>
              {subDim.globalSummary}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map((entry) => {
            const brandIdx = subDim.brands.findIndex((b) => b.brand === entry.brand);
            return (
              <BrandCard
                key={entry.brand}
                entry={entry}
                showSources={showSources}
                quantitative={quantitative}
                onEdit={onEdit && brandIdx >= 0 ? () => onEdit(brandIdx, Array.from(activeTags)) : undefined}
              />
            );
          })}
        </div>
        </>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function QualitativePage() {
  const { projectId, userId } = useParams<{ projectId: string; userId?: string }>();
  if (projectId === 'jisuanying_project') return <CalculationInsightsPage />;
  if (projectId === 'jiatingbao_project') return <FamilyInterviews />;
  if (projectId === 'paisou_project') return <PaisouUserStoriesPage key={userId ?? 'overview'} />;
  return <LegacyQualitativePage projectId={projectId} />;
}

function LegacyQualitativePage({ projectId }: { projectId?: string }) {
  const quantitative = false;
  const showSources = true;
  useActiveFileIds();
  const editor = useIsEditor();

  const { data: qualData, saving, save } =
    useContentStore<Record<string, QualDimension>>(
      'qualitative',
      DEFAULT_QUALITATIVE_DATA,
    );

  const visibleDimensions = LEGACY_DIMENSIONS;
  const [activeDim, setActiveDim] = React.useState<Dimension>(
    '需求认知',
  );
  const [selectedBrands, setSelectedBrands] = React.useState<Set<string>>(new Set());
  const [editingEntry, setEditingEntry] = React.useState<{
    dimKey: string;
    subIdx: number;
    brandIdx: number;
    tags: string[];
    bulletIndices: number[];
  } | null>(null);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
  };

  React.useEffect(() => { setSelectedBrands(new Set()); }, [activeDim]);

  const dimData = qualData[activeDim];
  const subDimensions = (dimData?.subDimensions ?? []).filter(
    (subDim) => subDim.name !== '优势好评' && subDim.name !== '洋葱好评',
  );
  const { color, tab } = DIM_CONFIG[activeDim];

  const allBrands = Array.from(
    new Set(subDimensions.flatMap((s) => s.brands.map((b) => b.brand))),
  ).sort(sortBrands);

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="bg-[#FEFDF9] border-b border-[#E8E2D9] px-6 pt-4 pb-0">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            {quantitative
              ? <BarChart3 size={15} className="text-[#FF5722]" />
              : <MessageSquare size={15} className="text-[#FF5722]" />}
            <h2 className="text-[15px] font-bold text-gray-900">
              {quantitative ? '问卷洞察' : '定性洞察'}
            </h2>
          </div>

          <div className="flex-1" />

          {allBrands.length > 0 && activeDim !== '用户调研报告' && activeDim !== '访谈录音' && (
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <span className="text-[11px] text-gray-400">筛选：</span>
              {allBrands.map((brand) => {
                const active = selectedBrands.has(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                      active
                        ? 'text-white border-transparent'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300',
                    )}
                    style={active ? { backgroundColor: color, borderColor: color } : {}}
                  >
                    {brand}
                  </button>
                );
              })}
              {selectedBrands.size < allBrands.length && (
                <button
                  onClick={() => setSelectedBrands(new Set(allBrands))}
                  className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[11px] text-gray-400 hover:text-gray-600 border border-gray-200 transition-colors"
                >
                  全选
                </button>
              )}
              {selectedBrands.size > 0 && (
                <button
                  onClick={() => setSelectedBrands(new Set())}
                  className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[11px] text-gray-400 hover:text-gray-600 border border-gray-200 transition-colors"
                >
                  <X size={9} />清空
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dimension tabs */}
        <div className="flex">
          {visibleDimensions.map((dim) => (
            <button
              key={dim}
              onClick={() => setActiveDim(dim)}
              className={cn(
                'px-5 py-2.5 text-[13px] font-medium border-b-2 transition-all',
                activeDim === dim ? DIM_CONFIG[dim].tab : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {dim}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeDim === '访谈录音' ? (
        <InterviewRecordings />
      ) : activeDim === '用户调研报告' ? (
        <iframe
          src="/research-report.html"
          title="用户调研报告 · 从小学系列"
          className="flex-1 w-full border-none block"
        />
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <OnionPraiseSphere />
          {subDimensions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-[14px] text-gray-400">「{activeDim}」暂无数据</p>
            </div>
          ) : (
            subDimensions.map((sub, subIdx) => (
              <SubDimSection
                key={sub.name}
                subDim={sub}
                subIdx={subIdx}
                selectedBrands={selectedBrands}
                color={color}
                showSources={showSources}
                quantitative={quantitative}
                onEdit={editor ? (brandIdx, tags) => {
                  const bullets = sub.brands[brandIdx]?.bullets ?? [];
                  const tagSet = new Set(tags);
                  setEditingEntry({
                    dimKey: activeDim,
                    subIdx,
                    brandIdx,
                    tags,
                    bulletIndices: tags.length === 0
                      ? bullets.map((_, idx) => idx)
                      : bullets
                        .map((bullet, idx) => (bullet.tag && tagSet.has(bullet.tag) ? idx : -1))
                        .filter((idx) => idx >= 0),
                  });
                } : undefined}
              />
            ))
          )}
        </div>
      )}

      {/* Edit drawer */}
      <QualitativeEditor
        open={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        entry={
          (() => {
            if (!editingEntry) return null;
            const entry = qualData[editingEntry.dimKey]?.subDimensions[editingEntry.subIdx]?.brands[editingEntry.brandIdx];
            if (!entry) return null;
            if (editingEntry.tags.length === 0) return entry;
            return {
              ...entry,
              bullets: editingEntry.bulletIndices.map((idx) => entry.bullets[idx]).filter(Boolean),
            };
          })()
        }
        saving={saving}
        defaultTag={editingEntry?.tags[0]}
        onSave={async (updated) => {
          if (!editingEntry) return;
          const next = structuredClone(qualData);
          const dim = next[editingEntry.dimKey];
          if (dim) {
            const original = dim.subDimensions[editingEntry.subIdx].brands[editingEntry.brandIdx];
            if (original && editingEntry.tags.length > 0) {
              const selected = new Set(editingEntry.bulletIndices);
              const mergedBullets: QualBullet[] = [];
              let updatedIdx = 0;
              for (let i = 0; i < original.bullets.length; i++) {
                if (selected.has(i)) {
                  const replacement = updated.bullets[updatedIdx++];
                  if (replacement) mergedBullets.push(replacement);
                } else {
                  mergedBullets.push(original.bullets[i]);
                }
              }
              mergedBullets.push(...updated.bullets.slice(updatedIdx));
              dim.subDimensions[editingEntry.subIdx].brands[editingEntry.brandIdx] = {
                ...original,
                subtitle: updated.subtitle,
                sentiment: updated.sentiment,
                bullets: mergedBullets,
              };
            } else {
              dim.subDimensions[editingEntry.subIdx].brands[editingEntry.brandIdx] = updated;
            }
          }
          await save(next);
          setEditingEntry(null);
        }}
      />
    </div>
  );
}
