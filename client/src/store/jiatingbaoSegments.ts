// 家庭包访谈：语义切片 + 三级标签标注（人工语义标注，非关键词）。
// 录音 clipUrl/startTime/duration 与 jiatingbaoVoiceClips 对应。
import type { LabeledSegment } from './segmentTaxonomy';

const R: Record<number, string> = {
  1: '用户1 · 广东广州',
  2: '用户2 · 江西景德镇',
  3: '用户3 · 安徽合肥',
  4: '用户4 · 江西九江',
  5: '用户5 · 浙江杭州',
  6: '用户6 · 江苏镇江',
  7: '用户7 · 广东深圳',
  8: '用户8 · 广东湛江',
  10: '用户10 · 山东济南',
};

interface Raw {
  seq: number;
  idx: string;
  dim: 'app' | 'course' | 'buy';
  primary: string;
  aux: string[];
  value: 'high' | 'medium' | 'low';
  quote: string;
  start: number;
  dur: number;
  pending?: string; // 新增理由（主标签为待归类_xxx 时）
}

const RAW: Raw[] = [
  // ── 用户1 · 广东广州 ──
  { seq: 1, idx: '0001', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'medium', quote: '针对小升初一个分班册的内容哦，', start: 429.6, dur: 3.8 },
  { seq: 1, idx: '0002', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'high', quote: '数学一直都没没没赶上，好像听不到。呃，没有没有进入状态哦，', start: 898.8, dur: 8.9 },
  { seq: 1, idx: '0003', dim: 'buy', primary: 'buy_need_trigger', aux: ['buy_concern'], value: 'high', quote: '到了到了五六年级就更难搞哦，', start: 990.5, dur: 3.9 },
  { seq: 1, idx: '0004', dim: 'app', primary: 'app_first_contact', aux: ['buy_need_trigger'], value: 'medium', quote: '下载个 APP 先了解一下吗？', start: 1188.7, dur: 2.6 },
  { seq: 1, idx: '0005', dim: 'buy', primary: 'buy_need_trigger', aux: ['course_effect'], value: 'medium', quote: '达到他那个思维拓展的话，', start: 1566.8, dur: 3.2 },
  { seq: 1, idx: '0006', dim: 'buy', primary: 'buy_conversion', aux: ['buy_family_package'], value: 'high', quote: '因为嗯他他也有也好像有九十天的那一个一对一吧。', start: 1757.9, dur: 6.5 },
  { seq: 1, idx: '0007', dim: 'buy', primary: 'buy_family_package', aux: [], value: 'medium', quote: '尽量尽量让孩子去用上，', start: 2253.1, dur: 2.7 },
  { seq: 1, idx: '0008', dim: 'buy', primary: 'buy_competitor', aux: ['course_difficulty'], value: 'medium', quote: '这有一天每天两个小时一颗哦，', start: 2373.4, dur: 3.9 },

  // ── 用户2 · 江西景德镇 ──
  { seq: 2, idx: '0001', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'low', quote: '现在就是七年级了，马上不是七年级要完了，', start: 99.5, dur: 3.5 },
  { seq: 2, idx: '0002', dim: 'buy', primary: 'buy_need_trigger', aux: ['course_match'], value: 'medium', quote: '英语的话，他自己能力还是比较强……一开始呃上高中的学习了，应该他已经在自己自学高中的东西了，', start: 368.2, dur: 17.9 },
  { seq: 2, idx: '0003', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'low', quote: '我感觉好像语文的优势没有发挥出来。', start: 636.4, dur: 3.6 },
  { seq: 2, idx: '0004', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'medium', quote: '那我们肯定不能跟学校同步的哦，', start: 930.5, dur: 2.9 },
  { seq: 2, idx: '0005', dim: 'buy', primary: 'buy_info_source', aux: ['buy_decision_role'], value: 'medium', quote: '他就是主要还是可能是看那些呃小红书上别人的意见啊。', start: 1034.3, dur: 5.8 },
  { seq: 2, idx: '0006', dim: 'buy', primary: 'buy_need_trigger', aux: ['course_content_type'], value: 'medium', quote: '我更看重的就是跟甲方一定要有同步啊。', start: 1059.1, dur: 3.3 },
  { seq: 2, idx: '0007', dim: 'buy', primary: 'buy_conversion', aux: ['buy_family_package'], value: 'high', quote: '他比如说这个学习机嘛，本来我开始没有打算买学习机的。', start: 1201.0, dur: 3.9 },
  { seq: 2, idx: '0008', dim: 'buy', primary: 'buy_concern', aux: ['buy_conversion'], value: 'high', quote: '就是比如说有小孩子会不会是心血来潮啦？', start: 1412.3, dur: 4.5 },
  { seq: 2, idx: '0009', dim: 'course', primary: 'course_effect', aux: ['buy_need_trigger'], value: 'medium', quote: '我希望他的意思就是说他能够呃能够超前学的东西，能够自己消化技术的话，', start: 1620.1, dur: 8.7 },
  { seq: 2, idx: '0010', dim: 'buy', primary: 'buy_need_trigger', aux: ['course_effect'], value: 'high', quote: '希望的是更多的能够呃提高孩子那种思维分析能力，', start: 1758.7, dur: 5.6 },
  { seq: 2, idx: '0011', dim: 'buy', primary: 'buy_price', aux: ['buy_competitor'], value: 'medium', quote: '他他是说那肯定比学比上培训班要便宜点啊，', start: 2680.2, dur: 4.7 },
  { seq: 2, idx: '0012', dim: 'buy', primary: 'buy_family_package', aux: [], value: 'high', quote: '你要既然要学，就是嗯你既然要学嘛，你居然就要提前我们一起来。', start: 2821.1, dur: 7.3 },

  // ── 用户3 · 安徽合肥 ──
  { seq: 3, idx: '0001', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'low', quote: '姐姐肯定是比较忙的，因为临近中考了嘛，', start: 122.4, dur: 3.6 },
  { seq: 3, idx: '0002', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'low', quote: '要不然的话基本上三科的作业一个小时差不多哦，', start: 162.1, dur: 4.5 },
  { seq: 3, idx: '0003', dim: 'course', primary: '待归类_孩子自主性', aux: ['course_persistence'], value: 'high', quote: '其实这些都是姐姐让我比较担心……就是主动性不够，', start: 726.5, dur: 11.0, pending: '“主动性/自驱不够”影响使用与效果，词典“孩子反应/坚持情况”偏兴趣与时长，未覆盖自主性。' },
  { seq: 3, idx: '0004', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'low', quote: '然后当时就是因为姐姐马上要中考了，', start: 841.1, dur: 2.7 },
  { seq: 3, idx: '0005', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'medium', quote: '因为尤其到了马上升到高中嘛……其实我们之后慢慢就不可能再管他了。', start: 900.7, dur: 8.0 },
  { seq: 3, idx: '0006', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'medium', quote: '那我因为他小学升初中的时候，我就怎么说呢？那部分的压力我没有给他保，', start: 1494.4, dur: 8.2 },
  { seq: 3, idx: '0007', dim: 'buy', primary: 'buy_conversion', aux: ['buy_family_package'], value: 'high', quote: '我现在买的这个四年的话，只能保证姐姐到高中……正好妹妹可以可以高中毕业。', start: 1975.3, dur: 16.8 },
  { seq: 3, idx: '0008', dim: 'buy', primary: 'buy_need_trigger', aux: ['待归类_孩子自主性'], value: 'medium', quote: '其实小红书都挺好的……我给你提供了这个东西，你可以自己借助这个东西把这个学科学好，', start: 2039.4, dur: 17.6 },
  { seq: 3, idx: '0009', dim: 'buy', primary: 'buy_price', aux: ['buy_conversion'], value: 'high', quote: '就去年前一段时间应该是价格低很多的情况下，', start: 2127.4, dur: 4.5 },
  { seq: 3, idx: '0010', dim: 'buy', primary: 'buy_concern', aux: ['buy_renewal'], value: 'high', quote: '所以这个其实我也要考虑一下。我就在想那妹妹会不会也出现这种问题呢？反正再观察四年嘛。', start: 2272.6, dur: 5.9 },
  { seq: 3, idx: '0011', dim: 'app', primary: 'app_feature_use', aux: ['course_content_type'], value: 'medium', quote: '既然就是说你这边已经 AI 定制班帮他规定好，', start: 2596.4, dur: 4.7 },
  { seq: 3, idx: '0012', dim: 'course', primary: 'course_content_type', aux: ['course_child_reaction'], value: 'medium', quote: '因为他们毕竟最终的检测还是中考高考，', start: 3091.4, dur: 4.8 },
  { seq: 3, idx: '0013', dim: 'course', primary: 'course_content_type', aux: [], value: 'medium', quote: '我们现在都说的是六年级，英语这块要把初中三年的单词全部背完。', start: 3193.6, dur: 9.8 },
  { seq: 3, idx: '0014', dim: 'course', primary: 'course_content_type', aux: ['app_feature_use'], value: 'high', quote: '就是接受能力。他如果他很快把小学的已经看完了，他也都会，然后他就可以进入下一轮了嘛，', start: 3320.9, dur: 10.8 },
  { seq: 3, idx: '0015', dim: 'buy', primary: 'buy_price', aux: ['buy_competitor'], value: 'high', quote: '时间成本也没有哦，', start: 4118.4, dur: 2.2 },

  // ── 用户4 · 江西九江 ──
  { seq: 4, idx: '0001', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'medium', quote: '想在这个暑假的时候利用这些学习资源让他提前学习一下，然后正式进入初中，', start: 690.6, dur: 14.8 },
  { seq: 4, idx: '0002', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'low', quote: '然后就数学语文的课内的嗯复习预习嗯，', start: 1172.6, dur: 7.5 },
  { seq: 4, idx: '0003', dim: 'course', primary: '待归类_孩子自主性', aux: ['buy_need_trigger'], value: 'high', quote: '嗯也不知道怎么指导孩子去把握这个度。', start: 1588.2, dur: 3.7, pending: '“孩子看答案、不会自主思考，家长不知如何引导”是自主性痛点，词典未覆盖。' },
  { seq: 4, idx: '0004', dim: 'buy', primary: 'buy_need_trigger', aux: ['buy_info_source'], value: 'medium', quote: '没有嗯没有具体的学习问题，', start: 2114.1, dur: 3.1 },
  { seq: 4, idx: '0005', dim: 'buy', primary: 'buy_family_package', aux: ['app_feature_use'], value: 'high', quote: '那个可以一起的那可以两个一起用，', start: 2228.1, dur: 4.6 },
  { seq: 4, idx: '0006', dim: 'buy', primary: 'buy_family_package', aux: ['app_feature_use'], value: 'high', quote: '然后分了两个账号也不会相互冲突，', start: 2232.2, dur: 3.9 },
  { seq: 4, idx: '0007', dim: 'buy', primary: 'buy_trust', aux: ['buy_info_source'], value: 'high', quote: '对吧？如果我只是单独的说你这个东西好，嗯，', start: 2789.5, dur: 4.5 },
  { seq: 4, idx: '0008', dim: 'buy', primary: 'buy_trust', aux: ['buy_info_source'], value: 'high', quote: '那你肯定说自己家的王婆卖瓜嘛，', start: 2912.3, dur: 4.0 },
  { seq: 4, idx: '0009', dim: 'buy', primary: 'buy_concern', aux: ['buy_family_package'], value: 'high', quote: '就是两个小孩能不能一起用嘛？', start: 2986.6, dur: 4.4 },

  // ── 用户5 · 浙江杭州 ──
  { seq: 5, idx: '0001', dim: 'course', primary: 'course_content_type', aux: ['buy_conversion'], value: 'low', quote: '什么课都有嘛，', start: 1103.2, dur: 1.5 },
  { seq: 5, idx: '0002', dim: 'buy', primary: 'buy_concern', aux: [], value: 'high', quote: '其他的就怕你到时候课程更新啊什么的，会不会及时啊什么？', start: 1149.6, dur: 5.3 },
  { seq: 5, idx: '0003', dim: 'buy', primary: 'buy_family_package', aux: ['buy_price'], value: 'high', quote: '我买小学的话用不了多久？我买小学到初中的话，感觉还会有浪费。', start: 1225.6, dur: 5.3 },
  { seq: 5, idx: '0004', dim: 'buy', primary: 'buy_competitor', aux: ['app_problem'], value: 'medium', quote: '买过一个一起作业的那个啊，', start: 1438.8, dur: 2.6 },
  { seq: 5, idx: '0005', dim: 'buy', primary: 'buy_family_package', aux: ['buy_price'], value: 'high', quote: '你们那个套餐不是分开买更贵吗？', start: 2114.3, dur: 3.0 },
  { seq: 5, idx: '0006', dim: 'buy', primary: 'buy_family_package', aux: ['buy_renewal'], value: 'high', quote: '一个孩子的话就不是很划算了。', start: 2249.7, dur: 2.7 },

  // ── 用户6 · 江苏镇江 ──
  { seq: 6, idx: '0001', dim: 'app', primary: 'app_parent_supervision', aux: ['app_improvement'], value: 'high', quote: '他因为一个账号里相当于两个人都在用了哦，', start: 323.6, dur: 6.7 },
  { seq: 6, idx: '0002', dim: 'buy', primary: 'buy_need_trigger', aux: ['buy_price'], value: 'medium', quote: '那你这边的主要目的是什么？', start: 394.0, dur: 2.1 },
  { seq: 6, idx: '0003', dim: 'buy', primary: 'buy_concern', aux: [], value: 'high', quote: '花这么多不一定见到效果吧，', start: 781.7, dur: 2.2 },
  { seq: 6, idx: '0004', dim: 'buy', primary: 'buy_competitor', aux: [], value: 'medium', quote: '有些线下的也是去看视频哦，', start: 1146.0, dur: 3.6 },
  { seq: 6, idx: '0005', dim: 'buy', primary: 'buy_info_source', aux: [], value: 'medium', quote: '我看那个抖音上面那种也是名师啊单独授课啊。', start: 1575.5, dur: 6.3 },
  { seq: 6, idx: '0006', dim: 'buy', primary: 'buy_competitor', aux: ['待归类_孩子自主性'], value: 'medium', quote: '他们也觉得这个差别形式其实也没有太大区别吧。', start: 1674.6, dur: 5.3 },
  { seq: 6, idx: '0007', dim: 'buy', primary: 'buy_renewal', aux: ['buy_concern'], value: 'high', quote: '当时的数学能到都到九十分以上了，', start: 1714.9, dur: 2.9 },

  // ── 用户7 · 广东深圳 ──
  { seq: 7, idx: '0001', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'low', quote: '去年期末是三百多名哦，三百五十多还是三百二十名。', start: 211.2, dur: 7.6 },
  { seq: 7, idx: '0002', dim: 'course', primary: 'course_child_reaction', aux: ['course_match'], value: 'medium', quote: '因为我这里有个小的小孩子四年级，', start: 377.7, dur: 3.3 },
  { seq: 7, idx: '0003', dim: 'course', primary: 'course_effect', aux: ['course_teaching'], value: 'high', quote: '先解释底层逻辑是什么，让小孩更理解这个知识点。', start: 599.3, dur: 4.4 },
  { seq: 7, idx: '0004', dim: 'course', primary: 'course_teaching', aux: ['course_effect'], value: 'high', quote: '因为你把那个一个抽象的东西具体化，', start: 758.7, dur: 3.9 },
  { seq: 7, idx: '0005', dim: 'buy', primary: 'buy_competitor', aux: ['buy_info_source'], value: 'high', quote: '我觉得刚开始欧拉觉得挺好的……但是他对刚跟我说欧拉有什么缺陷之类的，', start: 930.9, dur: 16.7 },
  { seq: 7, idx: '0006', dim: 'course', primary: 'course_teaching', aux: ['course_child_reaction'], value: 'high', quote: '看你们同步课程的那个动画，我去看了一下，我觉得还可以。然后培优的我自己也进去看，', start: 1065.2, dur: 8.8 },
  { seq: 7, idx: '0007', dim: 'course', primary: 'course_teaching', aux: [], value: 'high', quote: '另外一个就是复杂的一些知识点，能够用动画形象的给它描述出来，', start: 1124.5, dur: 7.2 },
  { seq: 7, idx: '0008', dim: 'buy', primary: 'buy_conversion', aux: ['buy_family_package'], value: 'high', quote: '就是一大一小嘛，本来我想给老二也弄一个，我说一大一小的有没有更便宜一点，', start: 1349.2, dur: 5.1 },
  { seq: 7, idx: '0009', dim: 'buy', primary: 'buy_family_package', aux: [], value: 'high', quote: '看六年是吧，对不对？这个是家庭班，是六年的，本来高中的时候是两年的。', start: 1750.8, dur: 8.3 },
  { seq: 7, idx: '0010', dim: 'buy', primary: 'buy_concern', aux: ['course_child_reaction'], value: 'high', quote: '这边就买了东西，他不看你再好东西也没用嘛，', start: 1888.8, dur: 4.2 },
  { seq: 7, idx: '0011', dim: 'course', primary: 'course_content_type', aux: ['app_usage_habit'], value: 'medium', quote: '复习先复习，前面的时候提前学一点吧。', start: 2301.2, dur: 4.3 },
  { seq: 7, idx: '0012', dim: 'app', primary: 'app_improvement', aux: ['course_improvement'], value: 'medium', quote: '就是这些讲逻辑的那种 AI 的，包括这些方面可以再多做一点。', start: 2502.9, dur: 8.6 },

  // ── 用户8 · 广东湛江 ──
  { seq: 8, idx: '0001', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'medium', quote: '然后他的右脑发育也是没有左脑好的，', start: 325.4, dur: 5.1 },
  { seq: 8, idx: '0002', dim: 'buy', primary: 'buy_competitor', aux: ['buy_conversion'], value: 'high', quote: '我给他报了学而思的数学……上了一两节课呢，他觉得不行，有抵触心理，就像老师讲课一样，', start: 1210.7, dur: 18.4 },
  { seq: 8, idx: '0003', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'high', quote: '他就是有难题，有不懂的，他不敢问老师啊，', start: 1468.9, dur: 4.1 },
  { seq: 8, idx: '0004', dim: 'buy', primary: 'buy_info_source', aux: ['buy_trust'], value: 'medium', quote: '然后评论里面也有一些呃提到洋葱啊。', start: 1622.2, dur: 3.8 },
  { seq: 8, idx: '0005', dim: 'buy', primary: 'buy_info_source', aux: ['buy_trust'], value: 'high', quote: '丢个洋葱给他在家看就行了。', start: 1649.5, dur: 2.3 },
  { seq: 8, idx: '0006', dim: 'course', primary: '待归类_自主学习闭环', aux: ['course_effect'], value: 'high', quote: '然后那一种他丢了一个文件夹过来给你，你可以点开看呢，', start: 1736.0, dur: 6.3, pending: '“没有输出就是盲目接收 vs 报课闭环”是学习模式判断，词典未覆盖自主学习/输出闭环。' },
  { seq: 8, idx: '0007', dim: 'buy', primary: 'buy_family_package', aux: ['buy_conversion'], value: 'high', quote: '他就说你如果买六年年限的话，你的大宝二宝都可以用完了。', start: 2186.0, dur: 6.7 },
  { seq: 8, idx: '0008', dim: 'app', primary: 'app_feature_use', aux: ['app_parent_supervision'], value: 'medium', quote: '我也不知道他用哪些，是洋葱那个一对一老师帮我制定的那个 AI 定制班里面的，', start: 2369.6, dur: 8.0 },
  { seq: 8, idx: '0009', dim: 'app', primary: 'app_parent_supervision', aux: ['app_feature_use'], value: 'high', quote: '老师就说那加入家庭组，然后把初中和小学的，我就建议把这两组分开……一个爸爸管一个妈妈管，', start: 2625.3, dur: 14.6 },
  { seq: 8, idx: '0010', dim: 'buy', primary: 'buy_renewal', aux: ['course_persistence'], value: 'high', quote: '我觉得如果有效果，我会排除万难，让他们学下去。', start: 2772.3, dur: 4.9 },
  { seq: 8, idx: '0011', dim: 'course', primary: 'course_effect', aux: ['course_improvement'], value: 'high', quote: '我觉得能把他数学学到一百零八分以上也值了哦，', start: 3043.8, dur: 4.8 },
  { seq: 8, idx: '0012', dim: 'buy', primary: 'buy_renewal', aux: ['app_parent_supervision'], value: 'high', quote: '如果我孩子期末考试进步很大的话，人家肯定会问我……他就是一个闭环学习，', start: 3258.8, dur: 15.6 },
  { seq: 8, idx: '0013', dim: 'buy', primary: 'buy_family_package', aux: ['app_problem'], value: 'high', quote: '你三个孩子同时在自己的房间学完了，', start: 3497.5, dur: 3.1 },

  // ── 用户10 · 山东济南 ──
  { seq: 10, idx: '0001', dim: 'buy', primary: 'buy_need_trigger', aux: ['buy_competitor'], value: 'high', quote: '他现在的作业时间是晚上到十点半，是比较普遍的情况哦……他这边基本上八点半左右，', start: 484.2, dur: 11.8 },
  { seq: 10, idx: '0002', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'high', quote: '当时就没有刻意去培养他读书认字，阅读习惯培养的太晚了。', start: 1070.1, dur: 9.2 },
  { seq: 10, idx: '0003', dim: 'buy', primary: 'buy_need_trigger', aux: [], value: 'low', quote: '但是在这个绘本阅读上也不算晚开始的。', start: 1098.6, dur: 6.2 },
  { seq: 10, idx: '0004', dim: 'buy', primary: 'buy_concern', aux: ['app_problem'], value: 'medium', quote: '呃只是因为视力的问题，', start: 2088.9, dur: 2.4 },
  { seq: 10, idx: '0005', dim: 'buy', primary: 'buy_conversion', aux: ['course_child_reaction'], value: 'high', quote: '然后让老二看了看，老二觉得还挺好玩的……老二就天天喜欢去听一节两节的，', start: 2140.2, dur: 15.7 },
  { seq: 10, idx: '0006', dim: 'course', primary: 'course_teaching', aux: ['course_content_type'], value: 'high', quote: '是因为它每一节课每一个知识点它拆的非常的细。', start: 2329.8, dur: 5.5 },
  { seq: 10, idx: '0007', dim: 'buy', primary: 'buy_need_trigger', aux: ['buy_conversion'], value: 'medium', quote: '正规的数学是为了一开始接触洋葱，是为了数学。', start: 2386.0, dur: 4.8 },
  { seq: 10, idx: '0008', dim: 'course', primary: 'course_effect', aux: ['course_content_type'], value: 'high', quote: '我觉得在上线下课之前，', start: 3068.0, dur: 2.6 },
  { seq: 10, idx: '0009', dim: 'course', primary: '待归类_孩子自主性', aux: ['course_improvement'], value: 'high', quote: '我觉得他可能还是依赖于孩子的这种自觉性吧，', start: 3224.9, dur: 9.2, pending: '“线上依赖孩子自觉性、需要有人把知识点串起来”是自主性/学习模式判断，词典未覆盖。' },
  { seq: 10, idx: '0010', dim: 'app', primary: 'app_usage_habit', aux: ['course_persistence'], value: 'medium', quote: '比如说老大暑假会让他完成下学期知识点的初步预习，至少把这个课先给他过一遍。', start: 3404.3, dur: 14.5 },
  { seq: 10, idx: '0011', dim: 'course', primary: 'course_child_reaction', aux: ['buy_need_trigger'], value: 'medium', quote: '对我觉得只要孩子喜欢用，', start: 3453.3, dur: 2.6 },
  { seq: 10, idx: '0012', dim: 'course', primary: 'course_effect', aux: ['course_child_reaction'], value: 'high', quote: '对于老大这种普通孩子，提上一点分数进步了，这就是效果。对于老二来讲，我觉得他只要感兴趣，', start: 3766.5, dur: 10.9 },
  { seq: 10, idx: '0013', dim: 'course', primary: 'course_improvement', aux: [], value: 'high', quote: '但是预习阶段的题量不够，', start: 4696.1, dur: 3.4 },
  { seq: 10, idx: '0014', dim: 'app', primary: 'app_improvement', aux: ['待归类_新产品机会'], value: 'high', quote: '就是充当一个十万个为什么，', start: 5261.0, dur: 3.0, pending: '提出 AI 实体答疑硬件机会（语音问答/讲故事/十万个为什么），属新产品机会，APP 改进标签未完全覆盖。' },
];

export const JIATINGBAO_SEGMENTS: LabeledSegment[] = RAW.map((r) => ({
  id: `jtb-${r.seq}-${r.idx}`,
  project: 'jiatingbao',
  projectName: '洋葱家庭包用户调研',
  respondent: R[r.seq] ?? `用户${r.seq}`,
  dimension: r.dim,
  primaryLabel: r.primary,
  auxLabels: r.aux,
  researchValue: r.value,
  quote: r.quote,
  clipUrl: `/clips/jiatingbao/user${r.seq}/${r.idx}.mp3`,
  startTime: r.start,
  duration: r.dur,
  pendingNew: r.primary.startsWith('待归类_') || undefined,
  pendingReason: r.pending,
}));
