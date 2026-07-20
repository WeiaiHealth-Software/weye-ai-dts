import { ArrowUp, Clock, HeartPulse, Mic, Search, ShieldCheck, Sparkles, User, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type AgentCategory = '全部名医' | '近视防控' | '斜弱视专区' | '角膜塑形镜';
type DoctorTab = '专业擅长' | '团队简介' | '获奖荣誉';

type DoctorProfile = {
  id: string;
  name: string;
  identityName: string;
  role: string;
  tag: string;
  tagClass: string;
  hospital: string;
  specialty: string;
  consultCount: string;
  avatarClass: string;
  heroFrom: string;
  heroVia: string;
  heroTo: string;
  intro: string;
  strengths: string[];
  team: string;
  honors: string;
  quickPrompts: string[];
  services: string[];
  categories: AgentCategory[];
};

type AgentsModuleProps = {
  onDetailVisibilityChange?: (open: boolean) => void;
};

const AGENT_CATEGORIES: AgentCategory[] = ['全部名医', '近视防控', '斜弱视专区', '角膜塑形镜'];

const DOCTORS: DoctorProfile[] = [
  {
    id: 'xu-wei',
    name: '徐蔚 教授',
    identityName: '徐蔚安心智能体',
    role: '近视防控专家 · 医生AI分身',
    tag: '眼视光领域',
    tagClass: 'bg-blue-50 text-blue-600',
    hospital: '上海市眼病防治中心 视光中心',
    specialty: '擅长：儿童青少年近视防控、角膜塑形镜及各类特殊接触镜的验配、斜弱视诊治。',
    consultCount: '12.5 万人咨询',
    avatarClass: 'bg-blue-100 text-blue-500',
    heroFrom: 'from-sky-300',
    heroVia: 'via-blue-400',
    heroTo: 'to-indigo-300',
    intro: '我是徐蔚医生 AI 分身，接受了近视防控、斜弱视和角膜塑形镜方向的专业训练，可以帮你解答筛查、复诊与报告问题。',
    strengths: ['儿童青少年近视防控', '角膜塑形镜验配', '双眼视功能评估'],
    team: '依托上海市眼病防治中心视光团队，联合门诊经验与随访知识库持续更新。',
    honors: '上海市眼病防治中心视光中心专家，累计服务超 12 万家庭。',
    quickPrompts: ['什么是医生AI分身？', '角膜塑形镜怎么复查？', '孩子近视增长快怎么办？'],
    services: ['健康管理', '报告解读', '病情分析', '复诊提醒'],
    categories: ['全部名医', '近视防控', '角膜塑形镜']
  },
  {
    id: 'lin-ruoning',
    name: '林若宁 主任',
    identityName: '林若宁安心智能体',
    role: '斜弱视专家 · 医生AI分身',
    tag: '斜弱视专区',
    tagClass: 'bg-emerald-50 text-emerald-600',
    hospital: '首都医科大学附属北京同仁医院',
    specialty: '擅长：儿童斜视、弱视个体化训练方案制定及双眼视功能重建。',
    consultCount: '9.8 万人咨询',
    avatarClass: 'bg-emerald-100 text-emerald-500',
    heroFrom: 'from-cyan-300',
    heroVia: 'via-sky-400',
    heroTo: 'to-blue-300',
    intro: '我是林若宁医生 AI 分身，聚焦斜弱视评估、训练方案解析和复诊管理，能帮助家长快速理解治疗节奏。',
    strengths: ['儿童斜弱视评估', '双眼视训练', '家庭训练依从性管理'],
    team: '依托北京同仁医院斜弱视专病团队，沉淀门诊评估和训练随访经验。',
    honors: '长期参与儿童眼病专项门诊建设，累计服务近 10 万家庭。',
    quickPrompts: ['弱视训练多久复查一次', '斜视需要手术吗', '家庭训练怎么做更有效'],
    services: ['训练计划', '病情分析', '复诊建议', '家长指导'],
    categories: ['全部名医', '斜弱视专区']
  },
  {
    id: 'chen-yusheng',
    name: '陈雨生 主任',
    identityName: '陈雨生安心智能体',
    role: '角膜塑形镜顾问 · 医生AI分身',
    tag: '角膜塑形镜',
    tagClass: 'bg-violet-50 text-violet-600',
    hospital: '温州医科大学附属眼视光医院',
    specialty: '擅长：角膜塑形镜验配评估、夜戴复查及角膜健康风险管理。',
    consultCount: '10.1 万人咨询',
    avatarClass: 'bg-violet-100 text-violet-500',
    heroFrom: 'from-indigo-300',
    heroVia: 'via-blue-400',
    heroTo: 'to-sky-300',
    intro: '我是陈雨生医生 AI 分身，可以结合佩戴反馈和复查指标，帮助你快速判断角膜塑形镜配适状态。',
    strengths: ['角膜塑形镜复查', '佩戴并发症识别', '角膜健康风险管理'],
    team: '依托温州医科大学附属眼视光医院接触镜团队，持续积累验配与夜戴随访经验。',
    honors: '专注角膜塑形镜临床评估与复查管理，长期参与规范化验配培训。',
    quickPrompts: ['夜戴后晨起视力波动正常吗', '角膜塑形镜多久换一副', '复查要看哪些指标'],
    services: ['配适评估', '复查提醒', '风险提示', '护理建议'],
    categories: ['全部名医', '角膜塑形镜', '近视防控']
  },
  {
    id: 'zhou-jing',
    name: '周静 主任',
    identityName: '周静安心智能体',
    role: '近视管理顾问 · 医生AI分身',
    tag: '近视防控',
    tagClass: 'bg-cyan-50 text-cyan-600',
    hospital: '浙江大学医学院附属第二医院',
    specialty: '擅长：青少年近视风险分层、离焦镜片方案制定和年度管理计划。',
    consultCount: '11.3 万人咨询',
    avatarClass: 'bg-cyan-100 text-cyan-500',
    heroFrom: 'from-sky-300',
    heroVia: 'via-cyan-400',
    heroTo: 'to-blue-300',
    intro: '我是周静医生 AI 分身，专注近视管理计划和年度复查节奏，可以帮你看懂控制效果和干预路径。',
    strengths: ['近视风险分层', '离焦镜片方案', '年度管理计划'],
    team: '依托浙大二院眼视光团队，整合门诊复查和家庭干预数据经验。',
    honors: '持续参与青少年近视防控门诊建设，累计管理超 11 万例咨询。',
    quickPrompts: ['离焦镜片适合什么年龄', '一年要复查几次', '怎样判断控制效果好不好'],
    services: ['方案推荐', '健康管理', '报告解读', '复查规划'],
    categories: ['全部名医', '近视防控']
  },
  {
    id: 'he-xin',
    name: '何欣 副主任',
    identityName: '何欣安心智能体',
    role: '双眼视训练师 · 医生AI分身',
    tag: '斜弱视专区',
    tagClass: 'bg-teal-50 text-teal-600',
    hospital: '中山大学中山眼科中心',
    specialty: '擅长：双眼视异常评估、视觉训练路径设计及训练结果跟踪。',
    consultCount: '7.6 万人咨询',
    avatarClass: 'bg-teal-100 text-teal-500',
    heroFrom: 'from-teal-300',
    heroVia: 'via-sky-400',
    heroTo: 'to-blue-300',
    intro: '我是何欣医生 AI 分身，可结合训练记录与复查结果，帮助你理解双眼视训练的目标和阶段变化。',
    strengths: ['双眼视异常评估', '视觉训练设计', '训练结果跟踪'],
    team: '依托中山眼科中心视觉训练团队，沉淀双眼视异常干预与居家训练经验。',
    honors: '长期参与双眼视功能障碍研究与训练体系建设，服务大量儿童与青少年患者。',
    quickPrompts: ['双眼视训练需要坚持多久', '弱视训练效果怎么看', '训练期间需要注意什么'],
    services: ['训练解读', '效果追踪', '病情分析', '复诊建议'],
    categories: ['全部名医', '斜弱视专区']
  },
  {
    id: 'gu-shuai',
    name: '顾帅 主任',
    identityName: '顾帅安心智能体',
    role: '接触镜专家 · 医生AI分身',
    tag: '角膜塑形镜',
    tagClass: 'bg-indigo-50 text-indigo-600',
    hospital: '复旦大学附属眼耳鼻喉科医院',
    specialty: '擅长：接触镜并发症筛查、角膜塑形镜个性化复查与护理指导。',
    consultCount: '8.9 万人咨询',
    avatarClass: 'bg-indigo-100 text-indigo-500',
    heroFrom: 'from-blue-300',
    heroVia: 'via-indigo-400',
    heroTo: 'to-sky-300',
    intro: '我是顾帅医生 AI 分身，重点帮助你理解佩戴反馈、镜片护理和复查异常提示。',
    strengths: ['接触镜并发症筛查', '个性化复查', '镜片护理指导'],
    team: '依托复旦眼耳鼻喉医院接触镜亚专科团队，持续更新复查建议与护理标准。',
    honors: '长期聚焦角膜塑形镜复查管理与护理宣教，累计咨询接近 9 万人次。',
    quickPrompts: ['镜片护理液怎么选', '复查时要不要停戴', '眼红还能继续戴吗'],
    services: ['护理指导', '风险提示', '复查管理', '病情分析'],
    categories: ['全部名医', '角膜塑形镜']
  }
];

const PROFILE_TABS: DoctorTab[] = ['专业擅长', '团队简介', '获奖荣誉'];

export function AgentsModule({ onDetailVisibilityChange }: AgentsModuleProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<DoctorTab>('专业擅长');
  const [activeCategory, setActiveCategory] = useState<AgentCategory>('全部名医');
  const [agentInput, setAgentInput] = useState('');

  const selectedDoctor = useMemo(
    () => DOCTORS.find((doctor) => doctor.id === selectedDoctorId) ?? null,
    [selectedDoctorId]
  );

  const filteredDoctors = useMemo(
    () => DOCTORS.filter((doctor) => activeCategory === '全部名医' || doctor.categories.includes(activeCategory)),
    [activeCategory]
  );

  useEffect(() => {
    onDetailVisibilityChange?.(Boolean(selectedDoctor));
  }, [onDetailVisibilityChange, selectedDoctor]);

  const profileBody =
    activeProfileTab === '专业擅长'
      ? `针对 ${selectedDoctor?.strengths.join('、')} 等方向，提供分级建议、复查节点和沟通话术。`
      : activeProfileTab === '团队简介'
        ? selectedDoctor?.team
        : selectedDoctor?.honors;

  if (selectedDoctor) {
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-[#eaf2ff] text-slate-900">
        {/* <div className="relative z-10 flex items-center justify-between px-4 pb-2 pt-4 text-white">
          <button
            type="button"
            onClick={() => setSelectedDoctorId(null)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/18 shadow-sm transition hover:bg-white/24"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm shadow-sm backdrop-blur-sm">
            <BriefcaseMedical size={15} />
            <span className="font-medium">···</span>
          </div>
        </div> */}

        <div className="relative z-10 flex-1 overflow-y-auto px-3 pb-52 pt-16">
          <div className="relative rounded-[28px] bg-white/82 px-4 pb-5 pt-12 shadow-[0_18px_36px_rgba(84,104,154,0.14)] backdrop-blur-xl">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.30),rgba(167,139,250,0.12)_58%,transparent_74%)] blur-md" />
                <div className="relative rounded-full bg-gradient-to-br from-[#fdf2d8] via-white to-[#dbeafe] p-[3px] shadow-[0_14px_32px_rgba(92,124,198,0.22)]">
                  <div className={`flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-white text-[44px] font-bold shadow-lg ${selectedDoctor.avatarClass}`}>
                    {selectedDoctor.name.slice(0, 1)}
                  </div>
                </div>
                <div className="absolute right-0 top-1 rounded-full border-2 border-white bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">AI</div>
              </div>
            </div>

            <div className="mt-1 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[26px] font-bold tracking-tight text-slate-900">
                  <span>{selectedDoctor.name}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-500">
                    <Sparkles size={11} />
                    医生 AI 分身
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full bg-[#233b8f] px-2.5 py-1 font-semibold text-white">专家团队</span>
                  <span className={`rounded-full px-2.5 py-1 font-medium ${selectedDoctor.tagClass}`}>{selectedDoctor.tag}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">三甲</span>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                关注
              </button>
            </div>

            <div className="mt-3 text-sm leading-6 text-slate-500">{selectedDoctor.hospital}</div>

            <div className="mt-5 flex items-center justify-between border-b border-slate-200/70 pb-2">
              {PROFILE_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveProfileTab(tab)}
                  className={`relative px-2 pb-2 text-sm font-semibold transition ${
                    activeProfileTab === tab ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {tab}
                  {activeProfileTab === tab ? <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-500" /> : null}
                </button>
              ))}
            </div>

            <div className="pt-4 text-sm leading-7 text-slate-500">{profileBody}</div>
          </div>

          <div className="mt-4 rounded-[24px] bg-white/72 px-4 py-4 text-[15px] leading-8 text-slate-700 shadow-[0_12px_26px_rgba(90,102,148,0.08)] backdrop-blur-xl">
            {selectedDoctor.intro}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {selectedDoctor.quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="rounded-full bg-white/88 px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white to-transparent px-4 pb-6 pt-10">
          <div className="no-scrollbar mb-3 flex gap-3 overflow-x-auto pb-1">
            {selectedDoctor.services.map((service, index) => (
              <div key={service} className="flex min-w-[106px] shrink-0 items-center gap-2 rounded-full bg-white/92 px-2 py-1 text-sm font-medium text-slate-700 shadow-sm">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    index % 4 === 0
                      ? 'bg-emerald-100 text-emerald-600'
                      : index % 4 === 1
                        ? 'bg-cyan-100 text-cyan-600'
                        : index % 4 === 2
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {index % 2 === 0 ? <ShieldCheck size={14} /> : <HeartPulse size={14} />}
                </span>
                <span className="whitespace-nowrap">{service}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center rounded-full bg-gray-50 p-1.5 shadow-inner">
            <button type="button" className="p-2 text-gray-500">
              <Mic size={22} />
            </button>
            <input
              type="text"
              value={agentInput}
              onChange={(event) => setAgentInput(event.target.value)}
              placeholder="有什么眼视光问题问我吗？"
              className="flex-1 border-none bg-transparent px-2 text-sm text-gray-700 focus:outline-none"
            />
            <button
              type="button"
              className={`rounded-full p-2 ${agentInput.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-white'}`}
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50/50">
      <div className="px-4 pb-2 pt-2">
        <div className="flex items-center rounded-full border border-gray-100 bg-white px-4 py-2 shadow-sm">
          <Search size={18} className="mr-2 text-gray-400" />
          <input type="text" placeholder="搜索眼科专家/服务" className="flex-1 border-none bg-transparent text-sm focus:outline-none" />
        </div>
      </div>

      <div className="no-scrollbar flex space-x-6 overflow-x-auto border-b border-gray-100 px-4 py-3">
        {AGENT_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap border-b-2 pb-1 text-sm transition ${
              activeCategory === category ? 'border-blue-600 font-bold text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 pb-8">
        {filteredDoctors.map((doctor) => (
          <button
            key={doctor.id}
            type="button"
            onClick={() => {
              setSelectedDoctorId(doctor.id);
              setActiveProfileTab('专业擅长');
            }}
            className="w-full rounded-2xl border border-gray-50 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ${doctor.avatarClass}`}>
                  <User size={24} />
                </div>
                <div className="absolute -right-1 -top-1 rounded-full border-2 border-white bg-blue-500 px-1 text-[10px] font-bold text-white">AI</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-gray-900">{doctor.name}</span>
                  <span className={`rounded px-1.5 py-0.5 text-xs ${doctor.tagClass}`}>{doctor.tag}</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px]">三甲</span>
                  <span className="truncate">{doctor.hospital}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">{doctor.specialty}</p>
                <div className="mt-2 flex items-center text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  {doctor.consultCount}
                </div>
              </div>
            </div>
          </button>
        ))}

        {filteredDoctors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-100 bg-white/80 px-5 py-10 text-center text-sm text-slate-500 shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <Users size={20} />
            </div>
            当前分类下暂无医生，稍后我会继续补充。
          </div>
        ) : null}
      </div>
    </div>
  );
}
