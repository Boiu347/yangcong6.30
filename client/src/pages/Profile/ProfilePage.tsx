import React from 'react';

// ── Persona data from 洋葱学园小学家长画像调研白皮书 ─────────────────────────

const PERSONAS = [
  {
    id: 'elite-planner',
    emoji: '👩‍💼',
    emojiColor: 'rgba(255,87,34,.1)',
    dotColor: '#FF5722',
    tagColor: { bg: 'rgba(255,87,34,.1)', text: '#FF5722' },
    name: '精英规划师',
    tag: '清醒 · 高投入',
    desc: '理性筛选、因材施教、兴趣与应试兼顾、高陪伴、重科学的长期主义家长',
    projectCount: 'x',
    aiSummary:
      '不盲目追求短期分数，相信科学的教育方法与儿童发展规律。重视兴趣驱动、思维能力和自主学习，把亲子关系放在重要位置，倾向于做孩子的"朋友式父母"。将分数视为"底线"，素养是"高线"——通过能力培养间接保证成绩，属于"用高级能力覆盖低级目标"的策略。高自主筛选型消费者，通过教育博主、书籍、熟人推荐等渠道主动筛选，寻找既兼顾兴趣又不脱离应试现实的产品。',
    timeline: [
      {
        dotColor: '#FF5722',
        tagLabel: '定性访谈',
        tagStyle: { background: 'rgba(255,87,34,.1)', color: '#FF5722' },
        project: '场景化营销家长深度访谈 · 2025.06',
        quote: '「我不是让他刷题，是让他真正理解概念，分数是会跟来的。洋葱这个我研究过，教研逻辑是对的，不是应付考试那种灌输。」',
        audio: 'interview_elite_01.mp3',
      },
      {
        dotColor: '#4361EE',
        tagLabel: '定性访谈',
        tagStyle: { background: 'rgba(67,97,238,.1)', color: '#4361EE' },
        project: '小学998家长用户调研 · 2025.03',
        quote: '「孩子学得有没有兴趣很重要，强逼着学，学了也用不长远。我希望他是自己想学，而不是我逼着学。」',
        audio: 'interview_elite_02.mp3',
      },
      {
        dotColor: '#3DBFBF',
        tagLabel: '定量问卷',
        tagStyle: { background: 'rgba(61,191,191,.1)', color: '#3DBFBF' },
        project: '小学家长画像定量调研 · 2025.08',
        quote: '「洋葱和学而思、猿辅导最大的区别就是紧扣校内，我不想让孩子学了一堆考不到的东西。」',
        audio: 'interview_elite_03.mp3',
      },
    ],
  },
  {
    id: 'practical-idealist',
    emoji: '👩',
    emojiColor: 'rgba(61,191,191,.1)',
    dotColor: '#3DBFBF',
    tagColor: { bg: 'rgba(61,191,191,.1)', text: '#3DBFBF' },
    name: '务实理想者',
    tag: '清醒 · 低投入',
    desc: '核心天使用户（占比约40%），务实高效、应试目标明确，认可洋葱"紧扣校内"的价值定位',
    projectCount: 'x',
    aiSummary:
      '教育理念相对清醒，但由于时间或精力有限，整体投入程度偏低。务实导向，不追求超前学习，以"打好校内基础"为核心目标。对洋葱的评价较高，认为其"学的就是考的"，是最具性价比的选择。购买决策相对理性，通常经过简单比较后做出选择，续费意愿较稳定。是洋葱口碑传播的主力军。',
    timeline: [
      {
        dotColor: '#3DBFBF',
        tagLabel: '定性访谈',
        tagStyle: { background: 'rgba(61,191,191,.1)', color: '#3DBFBF' },
        project: '场景化营销家长深度访谈 · 2025.06',
        quote: '「我也想陪他学，但工作确实忙，所以找了个靠谱的平台让他自己用。只要成绩稳住，我就觉得够了。」',
        audio: 'interview_practical_01.mp3',
      },
      {
        dotColor: '#FF5722',
        tagLabel: '定性访谈',
        tagStyle: { background: 'rgba(255,87,34,.1)', color: '#FF5722' },
        project: '小学998家长用户调研 · 2025.03',
        quote: '「洋葱学的都是课内的，不像有些课外班学校外的东西，学了也不考，浪费时间。这一点我很认可。」',
        audio: 'interview_practical_02.mp3',
      },
      {
        dotColor: '#D97706',
        tagLabel: '定量问卷',
        tagStyle: { background: 'rgba(217,119,6,.1)', color: '#D97706' },
        project: '小学家长画像定量调研 · 2025.08',
        quote: '「续费了两年，感觉孩子预习用着挺顺手的，理解能力比之前好了不少，老师也说上课跟得上了。」',
        audio: 'interview_practical_03.mp3',
      },
    ],
  },
  {
    id: 'anxious-investor',
    emoji: '😟',
    emojiColor: 'rgba(67,97,238,.1)',
    dotColor: '#4361EE',
    tagColor: { bg: 'rgba(67,97,238,.1)', text: '#4361EE' },
    name: '焦虑投资者',
    tag: '混沌 · 高投入',
    desc: '缺乏系统教育理念，在"彻底放养"和"一时紧抓"间摇摆，底层是焦虑与无力感，结果驱动',
    projectCount: 'x',
    aiSummary:
      '对"如何教育孩子"感到迷茫，缺乏系统、因材施教、可持续的教育理念。决策链条短，决策信息源高度依赖熟人推荐、广告或孩子即时反馈，"经常看到广告"或"孩子试试不讨厌"就可能促成购买。容易陷入恶性循环：成绩不理想→家长焦虑→盲目报班→效果不佳→更焦虑。教育消费总量高但分散，ROI认知模糊，对续费障碍敏感。',
    timeline: [
      {
        dotColor: '#4361EE',
        tagLabel: '定性访谈',
        tagStyle: { background: 'rgba(67,97,238,.1)', color: '#4361EE' },
        project: '场景化营销家长深度访谈 · 2025.06',
        quote: '「我就是不知道该怎么办，别人报什么我就跟着报，总感觉怕落后。买了好多课，有的他根本不用，但不买又不放心。」',
        audio: 'interview_anxious_01.mp3',
      },
      {
        dotColor: '#FF5722',
        tagLabel: '定性访谈',
        tagStyle: { background: 'rgba(255,87,34,.1)', color: '#FF5722' },
        project: '小学998家长用户调研 · 2025.03',
        quote: '「考试没考好我就很焦虑，不知道是课没上好还是孩子没认真，反正就是会很着急，然后再去找别的方法。」',
        audio: 'interview_anxious_02.mp3',
      },
      {
        dotColor: '#3DBFBF',
        tagLabel: '定量问卷',
        tagStyle: { background: 'rgba(61,191,191,.1)', color: '#3DBFBF' },
        project: '小学家长画像定量调研 · 2025.08',
        quote: '「洋葱是朋友推荐的，试了觉得还好，就买了会员，但有时候孩子也不怎么用，也不知道有没有效果。」',
        audio: 'interview_anxious_03.mp3',
      },
    ],
  },
  {
    id: 'permissive-observer',
    emoji: '🧘',
    emojiColor: 'rgba(217,119,6,.1)',
    dotColor: '#D97706',
    tagColor: { bg: 'rgba(217,119,6,.1)', text: '#D97706' },
    name: '放任观望者',
    tag: '混沌 · 低投入',
    desc: '整体偏向放养型，缺乏明确教育规划和较高教育投资，但部分亲子关系和谐，孩子自驱力较好',
    projectCount: 'x',
    aiSummary:
      '没有明确的教育投资计划，对孩子的学习采取较为宽松的态度。决策主要依赖孩子自身意愿，"孩子喜欢就买"。对品牌营销信息感知较弱，主动获取教育产品信息的意愿低。对洋葱的评价参差不齐，口碑传播意愿较低。受问卷回收局限，该群体在样本中可能被低估——根据销售反馈，实际市场中放任观望者的比例偏多。',
    timeline: [
      {
        dotColor: '#D97706',
        tagLabel: '定性访谈',
        tagStyle: { background: 'rgba(217,119,6,.1)', color: '#D97706' },
        project: '场景化营销家长深度访谈 · 2025.06',
        quote: '「洋葱是孩子自己说想用的，我也不太懂这些，他喜欢就买了，用不用得起来就看他自己了。」',
        audio: 'interview_permissive_01.mp3',
      },
      {
        dotColor: '#4361EE',
        tagLabel: '定性访谈',
        tagStyle: { background: 'rgba(67,97,238,.1)', color: '#4361EE' },
        project: '小学998家长用户调研 · 2025.03',
        quote: '「他成绩还行，我就没怎么管。孩子不喜欢压力大的学习方式，报班反而让他更抗拒，所以我没有刻意去规划什么。」',
        audio: 'interview_permissive_02.mp3',
      },
      {
        dotColor: '#3DBFBF',
        tagLabel: '定量问卷',
        tagStyle: { background: 'rgba(61,191,191,.1)', color: '#3DBFBF' },
        project: '小学家长画像定量调研 · 2025.08',
        quote: '「报班这些吧，我觉得没必要那么早，孩子还小，玩玩也没什么。等他大了，自然就知道学习重要了吧。」',
        audio: 'interview_permissive_03.mp3',
      },
    ],
  },
];

// ── ProfilePage ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [activeId, setActiveId] = React.useState(PERSONAS[0].id);
  const persona = PERSONAS.find((p) => p.id === activeId) ?? PERSONAS[0];

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        padding: '22px 24px',
        gap: 18,
        background: '#FEFDF9',
      }}
    >
      {/* ── Left: persona list ── */}
      <div style={{ width: 228, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto' }}>
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999', marginBottom: 2, flexShrink: 0 }}>
          用户原型 · 四类家长
        </p>

        {PERSONAS.map((p) => {
          const isActive = p.id === activeId;
          return (
            <div
              key={p.id}
              onClick={() => setActiveId(p.id)}
              style={{
                background: '#fff',
                border: `1.5px solid ${isActive ? p.dotColor : '#E8E2D9'}`,
                borderRadius: 12,
                padding: 13,
                cursor: 'pointer',
                transition: 'all .2s',
                boxShadow: isActive ? `2px 3px 0 ${p.dotColor}22` : undefined,
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: p.emojiColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {p.emoji}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 1 }}>{p.name}</div>
                  <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: p.tagColor.bg, color: p.tagColor.text }}>
                    {p.tag}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#666', lineHeight: 1.5 }}>{p.desc}</div>
              <div style={{ marginTop: 7, fontSize: 11, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dotColor, display: 'inline-block', flexShrink: 0 }} />
                出现于 {p.projectCount} 个项目
              </div>
            </div>
          );
        })}

        {/* Data source note */}
        <div style={{ marginTop: 4, padding: '10px 12px', background: 'rgba(255,87,34,.04)', border: '1px solid rgba(255,87,34,.12)', borderRadius: 8, flexShrink: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#FF5722', marginBottom: 3 }}>数据来源</p>
          <p style={{ fontSize: 11, color: '#888', lineHeight: 1.6 }}>洋葱学园小学家长画像调研白皮书（2025.12）<br />定性访谈 11 人 · 定量问卷 667 份</p>
        </div>
      </div>

      {/* ── Right: persona detail ── */}
      <div
        style={{
          flex: 1,
          background: '#fff',
          border: '1.5px solid #E8E2D9',
          borderRadius: 14,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        {/* Head */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid #E8E2D9',
            flexShrink: 0,
            background: `linear-gradient(135deg, ${persona.emojiColor} 0%, transparent 60%)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: persona.emojiColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
              {persona.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.3px' }}>{persona.name}</div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: persona.tagColor.bg, color: persona.tagColor.text }}>
                  {persona.tag}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: '#999' }}>{persona.desc}</div>
            </div>
          </div>

          {/* AI Summary */}
          <div style={{ background: 'rgba(255,87,34,.04)', border: '1px solid rgba(255,87,34,.12)', borderRadius: 8, padding: '10px 13px' }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: '#FF5722', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4 }}>
              AI 综合画像
            </span>
            <p style={{ fontSize: 12.5, color: '#555', lineHeight: 1.75, margin: 0 }}>{persona.aiSummary}</p>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: '18px 22px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999', margin: 0, flexShrink: 0 }}>
            原声积累时间线
          </p>

          {persona.timeline.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 13 }}>
              {/* dot + connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.dotColor, marginTop: 4, flexShrink: 0 }} />
                {i < persona.timeline.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: '#E8E2D9', marginTop: 5, minHeight: 20 }} />
                )}
              </div>

              {/* body */}
              <div style={{ flex: 1, paddingBottom: i < persona.timeline.length - 1 ? 4 : 0 }}>
                {/* Source label */}
                <div style={{ fontSize: 11, color: '#999', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 100, ...item.tagStyle, flexShrink: 0 }}>
                    {item.tagLabel}
                  </span>
                  {item.project}
                </div>

                {/* Quote */}
                <div style={{
                  background: 'rgba(255,87,34,.03)',
                  border: '1px solid rgba(255,87,34,.13)',
                  borderRadius: 8,
                  padding: '10px 13px',
                  fontSize: 13,
                  color: '#555',
                  lineHeight: 1.75,
                  fontStyle: 'italic',
                  marginBottom: 8,
                }}>
                  {item.quote}
                </div>

                {/* Audio button (demo — no actual audio) */}
                <button
                  onClick={() => {}}
                  title="Demo 模式，暂无实际音频"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '3px 10px',
                    borderRadius: 100,
                    border: '1px solid #E8E2D9',
                    fontSize: 11,
                    color: '#999',
                    cursor: 'default',
                    background: 'white',
                  }}
                >
                  ▶ 听原声 · {item.audio}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
