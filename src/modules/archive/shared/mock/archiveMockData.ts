export type PatientProfile = {
  memberLevel?: string;
  reviewStatus?: string;
  source?: string;
  other?: string;
};

export type Patient = {
  id: string;
  no: string;
  name: string;
  gender: "男" | "女";
  age: number;
  mobile: string;
  idCard?: string;
  store?: string;
  owner?: string;
  latestVisit?: string;
  nextReview?: string;
  diagnosis?: string;
  diagnosisNote?: string;
  treatment?: string;
  followupType?: string;
  axial?: { od: number; os: number };
  axialDelta?: { od: number; os: number };
  tags?: string[];
  profile?: PatientProfile;
  followStatus?: string;
  memberStatus?: string;
  summary?: string;
  medicalHistory?: {
    eyeDiseaseHistory?: string;
    eyeSurgerySide?: "无" | "左眼" | "右眼" | "双眼";
    eyeSurgeryDesc?: string;
  };
};

export type MiniProgramUser = {
  id: string;
  name: string;
  mobile: string;
  gender: "男" | "女";
  birthday: string;
  source?: string;
  memberLevel?: string;
};

export const miniProgramUsers: MiniProgramUser[] = [
  {
    id: "mpu-001",
    name: "张店长",
    mobile: "13800138000",
    gender: "男",
    birthday: "1990-01-01",
    source: "自然",
    memberLevel: "VIP",
  },
  {
    id: "mpu-002",
    name: "李女士",
    mobile: "13900139000",
    gender: "女",
    birthday: "1994-08-12",
    source: "小红书",
    memberLevel: "普通用户",
  },
  {
    id: "mpu-003",
    name: "王同学",
    mobile: "13700001111",
    gender: "男",
    birthday: "2012-05-20",
    source: "美团",
    memberLevel: "普通用户",
  },
  {
    id: "mpu-004",
    name: "陈女士",
    mobile: "13600002222",
    gender: "女",
    birthday: "1988-11-03",
    source: "海华",
    memberLevel: "SVIP",
  },
  {
    id: "mpu-005",
    name: "赵先生",
    mobile: "13500003333",
    gender: "男",
    birthday: "1997-03-16",
    source: "自然",
    memberLevel: "VIP",
  },
];

export type Appointment = {
  id: string;
  patient: string;
  time: string;
  date: string;
  store: string;
  room: string;
  source: string;
  issue: string;
  solution: string;
  status: string;
  tags: string;
  note: string;
};

export type Followup = {
  id: string;
  patient: string;
  latestVisit: string;
  diagnosis: string;
  treatment: string;
  reviewDate: string;
  reminderDate?: string;
  status: string;
  result: string;
  owner: string;
};

export type TrainingRecord = {
  id: string;
  patient: string;
  trainingTime: string;
  trainer: string;
  store: string;
  note: string;
  project: string;
  duration: string;
  completion: string;
};

export type Visit = {
  id: string;
  date: string;
  personType: "初诊" | "复诊";
  store: string;
  diagnosis: string;
  treatment: string;
  axial: string;
  va: string;
  summary: string;
  review: string;
  visitTypes?: Array<"就诊" | "配镜" | "视光训练">;
};

export type VisitExamRow = {
  label: string;
  right: string;
  left: string;
  type?: "boolean";
};

export type VisitDetailRecord = {
  basicInfo: { doctor: string; optometrist: string };
  chiefHistory: {
    eye: string;
    symptom: string;
    duration: string;
    durationUnit: string;
    description: string;
  };
  eyeExam: VisitExamRow[];
  auxExam: VisitExamRow[];
  diagnosis: string;
  treatment: {
    inspection: { item: string; quantity: string; unit: string; price: string; total: string };
    prescription: { drug: string; quantity: string; spec: string; unit: string; price: string; eye: string; usage: string; total: string };
    therapy: { item: string; quantity: string; unit: string; price: string; total: string };
    advice: string;
    followupCycle: string;
    estimatedDate: string;
    reminderDate: string;
  };
};

export type ArchiveModuleKey = "clinic" | "training" | "fitting" | "billing";

export const archiveGenderOptions = ["男", "女"] as const;
export const archiveSourceOptions = ["自然", "小红书", "美团", "海华", "其他"] as const;
export const archiveMemberOptions = ["普通用户", "VIP", "SVIP"] as const;
export const archivePaymentStatusOptions = ["未收费", "待支付", "已支付"] as const;

export const profileTagStandard = [
  {
    key: "memberLevel",
    label: "会员类型",
    options: [
      { value: "普通用户", className: "border-slate-200 bg-slate-100 text-slate-600" },
      { value: "VIP", className: "border-violet-100 bg-violet-50 text-violet-700" },
      { value: "SVIP", className: "border-fuchsia-100 bg-fuchsia-50 text-fuchsia-700" },
    ],
    desc: "用于区分普通用户与会员等级。",
  },
  {
    key: "reviewStatus",
    label: "复查状态",
    options: [
      { value: "跟进中", className: "border-emerald-100 bg-emerald-50 text-emerald-700" },
      { value: "待复查", className: "border-orange-100 bg-orange-50 text-orange-700" },
      { value: "已就诊", className: "border-primary-100 bg-primary-50 text-primary-600" },
      { value: "已终止", className: "border-rose-100 bg-rose-50 text-rose-700" },
    ],
    desc: "沿用当前 CRM 复查状态逻辑。",
  },
  {
    key: "source",
    label: "客户来源",
    options: [
      { value: "徐蔚", className: "border-sky-100 bg-sky-50 text-sky-700" },
      { value: "美团", className: "border-amber-100 bg-amber-50 text-amber-700" },
      { value: "小红书", className: "border-rose-100 bg-rose-50 text-rose-700" },
      { value: "海华", className: "border-teal-100 bg-teal-50 text-teal-700" },
      { value: "自然", className: "border-emerald-100 bg-emerald-50 text-emerald-700" },
      { value: "小程序扫码", className: "border-emerald-100 bg-emerald-50 text-emerald-700" },
      { value: "其他", className: "border-slate-200 bg-slate-100 text-slate-600" },
    ],
    desc: "标识客户进入系统的主要来源渠道。",
  },
  {
    key: "other",
    label: "其他",
    options: [
      { value: "新客户", className: "border-sky-100 bg-sky-50 text-sky-700" },
      { value: "老客户", className: "border-amber-100 bg-amber-50 text-amber-700" },
    ],
    desc: "用于承接新客户、老客户等辅助标签。",
  },
] as const;

export const patients: Patient[] = [
  {
    id: "p_new_1",
    no: "P20269901",
    name: "许星澜",
    gender: "女",
    age: 9,
    mobile: "138 0000 0901",
    store: "静安门店",
    profile: { memberLevel: "普通用户", other: "新客户" },
  },
  {
    id: "p_new_2",
    no: "P20269902",
    name: "秦沐阳",
    gender: "男",
    age: 12,
    mobile: "138 0000 0902",
    store: "静安门店",
    profile: { memberLevel: "普通用户", other: "新客户" },
  },
  {
    id: "p_new_3",
    no: "P20269903",
    name: "沈予安",
    gender: "男",
    age: 7,
    mobile: "138 0000 0903",
    store: "静安门店",
    profile: { memberLevel: "普通用户", other: "新客户" },
  },
  {
    id: "p1",
    no: "P20260001",
    name: "周沐言",
    gender: "女",
    age: 12,
    mobile: "138 1712 0291",
    store: "惟爱 · 上海海华医院",
    owner: "王懿雯",
    latestVisit: "2026-05-01 10:20",
    nextReview: "2026-06-01",
    diagnosis: "青少年近视进展期",
    diagnosisNote: "近三个月眼轴增长趋缓，建议继续当前干预方案。",
    treatment: "离焦镜片 + 视觉训练",
    followupType: "离焦框架镜",
    axial: { od: 25.36, os: 25.54 },
    axialDelta: { od: 0.22, os: 0.03 },
    tags: ["复诊", "高关注", "会员"],
    profile: { memberLevel: "VIP", other: "老客户", reviewStatus: "跟进中" },
    followStatus: "跟进中",
    memberStatus: "生效中",
    summary: "本次复查眼轴增长放缓，建议持续离焦镜片干预。",
  },
  {
    id: "p2",
    no: "P20260024",
    name: "顾景川",
    gender: "男",
    age: 10,
    mobile: "136 0188 8801",
    store: "静安门店",
    owner: "刘嘉程",
    latestVisit: "2026-04-27 15:10",
    nextReview: "2026-05-15",
    diagnosis: "OK镜复查",
    diagnosisNote: "镜片配适稳定，夜戴依从性需持续观察。",
    treatment: "角膜塑形镜复查",
    followupType: "角膜塑形镜",
    axial: { od: 24.88, os: 25.01 },
    axialDelta: { od: 0.18, os: 0.11 },
    tags: ["OK镜", "待复查"],
    profile: { memberLevel: "普通用户", other: "老客户", reviewStatus: "待复查" },
    followStatus: "待复查",
    memberStatus: "非会员",
    summary: "镜片配适稳定，但依从性需要继续观察。",
  },
  {
    id: "p3",
    no: "P20260103",
    name: "林舒予",
    gender: "女",
    age: 14,
    mobile: "139 6600 4221",
    store: "浦东中心店",
    owner: "陈意宁",
    latestVisit: "2026-04-23 09:30",
    nextReview: "2026-05-23",
    diagnosis: "干眼伴视疲劳",
    diagnosisNote: "首诊后干眼指标改善，建议按计划继续回访。",
    treatment: "干眼治疗 + 训练计划",
    followupType: "定期复查",
    axial: { od: 24.12, os: 24.28 },
    tags: ["干眼", "会员"],
    profile: { memberLevel: "SVIP", other: "新客户", reviewStatus: "已就诊" },
    followStatus: "已就诊",
    memberStatus: "生效中",
    summary: "泪膜指标改善明显，保留基础治疗方案。",
  },
  {
    id: "p4",
    no: "P20260112",
    name: "赵一宁",
    gender: "女",
    age: 11,
    mobile: "137 2031 4489",
    store: "惟爱 · 上海海华医院",
    owner: "王懿雯",
    latestVisit: "2026-04-18 11:05",
    nextReview: "2026-05-18",
    diagnosis: "视疲劳",
    diagnosisNote: "近视用眼强度高，建议加强户外时长并配合训练。",
    treatment: "视觉训练",
    followupType: "视训",
    axial: { od: 25.02, os: 25.16 },
    tags: ["高关注"],
    profile: { memberLevel: "普通用户", other: "新客户", reviewStatus: "跟进中" },
    followStatus: "跟进中",
    memberStatus: "非会员",
    summary: "建议建立训练计划，2周后复查评估。",
  },
  {
    id: "p5",
    no: "P20260118",
    name: "陈思涵",
    gender: "女",
    age: 9,
    mobile: "135 7710 0624",
    store: "静安门店",
    owner: "刘嘉程",
    latestVisit: "2026-05-06 09:10",
    nextReview: "2026-06-06",
    diagnosis: "近视筛查",
    diagnosisNote: "首次筛查度数轻度，建议定期复查并完善视功能评估。",
    treatment: "视功能评估",
    followupType: "初诊",
    axial: { od: 23.92, os: 24.05 },
    tags: ["首诊"],
    profile: { memberLevel: "普通用户", other: "新客户", reviewStatus: "待复查" },
    followStatus: "待复查",
    memberStatus: "非会员",
    summary: "建议1个月复查，关注用眼习惯。",
  },
  {
    id: "p6",
    no: "P20260125",
    name: "李嘉禾",
    gender: "男",
    age: 13,
    mobile: "139 1120 3846",
    store: "浦东中心店",
    owner: "陈意宁",
    latestVisit: "2026-04-30 16:40",
    nextReview: "2026-05-30",
    diagnosis: "近视控制中",
    diagnosisNote: "离焦镜片依从性良好，建议继续并记录每日佩戴时长。",
    treatment: "离焦镜片随访",
    followupType: "复查",
    axial: { od: 24.64, os: 24.79 },
    axialDelta: { od: 0.08, os: -0.02 },
    tags: ["复诊"],
    profile: { memberLevel: "VIP", other: "老客户", reviewStatus: "跟进中" },
    followStatus: "跟进中",
    memberStatus: "生效中",
    summary: "维持方案，按期复查眼轴。",
  },
  {
    id: "p7",
    no: "P20260131",
    name: "王子墨",
    gender: "男",
    age: 8,
    mobile: "138 5402 1198",
    store: "浦东中心店",
    owner: "陈意宁",
    latestVisit: "2026-04-09 14:20",
    nextReview: "2026-05-09",
    diagnosis: "角膜塑形镜评估",
    diagnosisNote: "角膜曲率稳定，可进入OK镜试戴流程。",
    treatment: "OK镜试戴",
    followupType: "角膜塑形镜",
    axial: { od: 23.74, os: 23.88 },
    tags: ["OK镜"],
    profile: { memberLevel: "SVIP", other: "新客户", reviewStatus: "跟进中" },
    followStatus: "跟进中",
    memberStatus: "生效中",
    summary: "安排试戴与配适复查。",
  },
  {
    id: "p8",
    no: "P20260144",
    name: "宋可欣",
    gender: "女",
    age: 15,
    mobile: "136 9021 3370",
    store: "惟爱 · 上海海华医院",
    owner: "王懿雯",
    latestVisit: "2026-04-02 10:05",
    nextReview: "2026-05-02",
    diagnosis: "干眼",
    diagnosisNote: "症状波动，建议规律热敷并配合人工泪液。",
    treatment: "用药 + 护理",
    followupType: "用药",
    axial: { od: 25.1, os: 25.18 },
    axialDelta: { od: 0.04, os: 0.01 },
    tags: ["干眼"],
    profile: { memberLevel: "VIP", other: "老客户", reviewStatus: "已就诊" },
    followStatus: "已就诊",
    memberStatus: "生效中",
    summary: "两周复评症状与泪膜指标。",
  },
  {
    id: "p9",
    no: "P20260158",
    name: "周书桐",
    gender: "女",
    age: 10,
    mobile: "137 6608 4015",
    store: "静安门店",
    owner: "刘嘉程",
    latestVisit: "2026-05-03 17:15",
    nextReview: "2026-06-03",
    diagnosis: "离焦软镜随访",
    diagnosisNote: "佩戴舒适度可，需强化护理流程与复查频率。",
    treatment: "离焦软镜随访",
    followupType: "配镜",
    axial: { od: 24.42, os: 24.58 },
    axialDelta: { od: 0.23, os: 0.17 },
    tags: ["复诊"],
    profile: { memberLevel: "普通用户", other: "老客户", reviewStatus: "待复查" },
    followStatus: "待复查",
    memberStatus: "非会员",
    summary: "安排1个月复查，关注镜片护理。",
  },
  {
    id: "p10",
    no: "P20260163",
    name: "许泽宇",
    gender: "男",
    age: 12,
    mobile: "139 7833 0422",
    store: "惟爱 · 上海海华医院",
    owner: "王懿雯",
    latestVisit: "2026-04-15 09:50",
    nextReview: "2026-05-15",
    diagnosis: "近视进展期",
    diagnosisNote: "近两个月度数增长明显，建议调整干预组合方案。",
    treatment: "离焦镜片 + 训练",
    followupType: "离焦框架镜",
    axial: { od: 25.6, os: 25.71 },
    axialDelta: { od: 0.28, os: 0.19 },
    tags: ["高关注"],
    profile: { memberLevel: "SVIP", other: "老客户", reviewStatus: "跟进中" },
    followStatus: "跟进中",
    memberStatus: "生效中",
    summary: "建议加强训练并复查眼轴与屈光。",
  },
  {
    id: "p11",
    no: "P20260175",
    name: "高梓萱",
    gender: "女",
    age: 7,
    mobile: "135 3401 8076",
    store: "静安门店",
    owner: "刘嘉程",
    latestVisit: "2026-04-26 13:30",
    nextReview: "2026-05-26",
    diagnosis: "弱视训练随访",
    diagnosisNote: "训练依从性一般，建议家长配合监督并调整训练内容。",
    treatment: "训练计划调整",
    followupType: "视训",
    axial: { od: 22.91, os: 23.05 },
    tags: ["视训"],
    profile: { memberLevel: "VIP", other: "新客户", reviewStatus: "跟进中" },
    followStatus: "跟进中",
    memberStatus: "生效中",
    summary: "两周复评训练效果。",
  },
  {
    id: "p12",
    no: "P20260188",
    name: "唐楚然",
    gender: "女",
    age: 16,
    mobile: "138 2910 5564",
    store: "浦东中心店",
    owner: "陈意宁",
    latestVisit: "2026-04-06 10:40",
    nextReview: "2026-05-06",
    diagnosis: "干眼复诊",
    diagnosisNote: "症状缓解但仍反复，建议继续护理并排查诱因。",
    treatment: "用药随访",
    followupType: "用药",
    axial: { od: 24.03, os: 24.19 },
    axialDelta: { od: -0.01, os: 0.02 },
    tags: ["复诊", "干眼"],
    profile: { memberLevel: "普通用户", other: "老客户", reviewStatus: "已就诊" },
    followStatus: "已就诊",
    memberStatus: "非会员",
    summary: "维持用药与护理，按期复查。",
  },
  {
    id: "p13",
    no: "P20260201",
    name: "邓雨辰",
    gender: "男",
    age: 9,
    mobile: "136 1177 0933",
    store: "惟爱 · 上海海华医院",
    owner: "王懿雯",
    latestVisit: "2026-04-21 15:25",
    nextReview: "2026-05-21",
    diagnosis: "哺光仪随访",
    diagnosisNote: "家长反馈使用频次不足，需强调使用规范与记录。",
    treatment: "哺光仪管理",
    followupType: "哺光仪",
    axial: { od: 24.9, os: 25.05 },
    axialDelta: { od: 0.12, os: 0.05 },
    tags: ["高关注"],
    profile: { memberLevel: "VIP", other: "老客户", reviewStatus: "待复查" },
    followStatus: "待复查",
    memberStatus: "生效中",
    summary: "提醒按周记录并复查评估。",
  },
  {
    id: "p14",
    no: "P20260213",
    name: "蒋若宁",
    gender: "女",
    age: 13,
    mobile: "137 8801 6220",
    store: "静安门店",
    owner: "刘嘉程",
    latestVisit: "2026-04-12 11:10",
    nextReview: "2026-05-12",
    diagnosis: "复查未到诊",
    diagnosisNote: "连续两次未按期复查，建议电话跟进确认原因。",
    treatment: "回访跟进",
    followupType: "定期复查",
    axial: { od: 24.2, os: 24.36 },
    axialDelta: { od: 0, os: 0.03 },
    tags: ["待复查"],
    profile: { memberLevel: "普通用户", other: "老客户", reviewStatus: "已终止" },
    followStatus: "已终止",
    memberStatus: "非会员",
    summary: "建议发起回访任务，确认后续计划。",
  },
  {
    id: "p15",
    no: "P20260224",
    name: "马一诺",
    gender: "男",
    age: 11,
    mobile: "139 4509 3361",
    store: "浦东中心店",
    owner: "陈意宁",
    latestVisit: "2026-05-02 10:30",
    nextReview: "2026-06-02",
    diagnosis: "OK镜复查",
    diagnosisNote: "镜片定位良好，角膜染色阴性，继续观察。",
    treatment: "角膜塑形镜复查",
    followupType: "角膜塑形镜",
    axial: { od: 25.08, os: 25.22 },
    axialDelta: { od: 0.07, os: 0.21 },
    tags: ["OK镜", "复诊"],
    profile: { memberLevel: "SVIP", other: "老客户", reviewStatus: "已就诊" },
    followStatus: "已就诊",
    memberStatus: "生效中",
    summary: "维持方案，按期复查。",
  },
  {
    id: "p16",
    no: "P20260235",
    name: "沈予安",
    gender: "男",
    age: 14,
    mobile: "135 9088 2704",
    store: "惟爱 · 上海海华医院",
    owner: "王懿雯",
    latestVisit: "2026-04-29 18:05",
    nextReview: "2026-05-29",
    diagnosis: "离焦软镜评估",
    diagnosisNote: "适配度良好，建议完善护理培训并制定复查计划。",
    treatment: "护理培训",
    followupType: "离焦软镜",
    axial: { od: 24.66, os: 24.82 },
    tags: ["首诊"],
    profile: { memberLevel: "VIP", other: "新客户", reviewStatus: "跟进中" },
    followStatus: "跟进中",
    memberStatus: "生效中",
    summary: "建立随访与护理记录。",
  },
  {
    id: "p17",
    no: "P20260247",
    name: "叶星然",
    gender: "女",
    age: 12,
    mobile: "136 5050 1197",
    store: "静安门店",
    owner: "刘嘉程",
    latestVisit: "2026-04-05 09:20",
    nextReview: "2026-05-05",
    diagnosis: "近视控制评估",
    diagnosisNote: "评估后建议先进行视功能训练，再决定光学方案。",
    treatment: "训练评估",
    followupType: "视训",
    axial: { od: 23.55, os: 23.71 },
    tags: ["新客户"],
    profile: { memberLevel: "普通用户", other: "新客户", reviewStatus: "待复查" },
    followStatus: "待复查",
    memberStatus: "非会员",
    summary: "两周后复评训练建议。",
  },
  {
    id: "p18",
    no: "P20260259",
    name: "方知夏",
    gender: "女",
    age: 9,
    mobile: "138 0172 6630",
    store: "浦东中心店",
    owner: "陈意宁",
    latestVisit: "2026-04-11 16:15",
    nextReview: "2026-05-11",
    diagnosis: "近视防控随访",
    diagnosisNote: "近期阅读姿势需纠正，建议配合用眼行为干预。",
    treatment: "行为干预",
    followupType: "定期复查",
    axial: { od: 24.34, os: 24.48 },
    axialDelta: { od: 0.16, os: 0.09 },
    tags: ["复诊"],
    profile: { memberLevel: "VIP", other: "老客户", reviewStatus: "跟进中" },
    followStatus: "跟进中",
    memberStatus: "生效中",
    summary: "强化用眼管理，按期复查。",
  },
];

export const appointments: Appointment[] = [
  {
    id: "a1",
    patient: "周沐言",
    time: "09:00-09:30",
    date: "2026-05-12",
    store: "惟爱 · 上海海华医院",
    room: "2号诊室",
    source: "小程序预约",
    issue: "复查视力变化",
    solution: "验光检查",
    status: "已确认",
    tags: "复诊 / 会员",
    note: "需家长陪同",
  },
  {
    id: "a2",
    patient: "顾景川",
    time: "10:30-11:00",
    date: "2026-05-12",
    store: "静安门店",
    room: "1号诊室",
    source: "后台代预约",
    issue: "OK镜复查",
    solution: "复查+镜片检查",
    status: "待到诊",
    tags: "OK镜",
    note: "需测角膜曲率",
  },
  {
    id: "a3",
    patient: "林舒予",
    time: "14:00-14:30",
    date: "2026-05-12",
    store: "浦东中心店",
    room: "3号诊室",
    source: "小程序预约",
    issue: "干眼回访",
    solution: "复诊复评",
    status: "已改期",
    tags: "干眼 / 会员",
    note: "已改到周三",
  },
];

export const followups: Followup[] = [
  (() => {
    const now = new Date();
    const reminder = new Date(now);
    reminder.setDate(now.getDate() - 2);
    const yyyy = reminder.getFullYear();
    const mm = String(reminder.getMonth() + 1).padStart(2, "0");
    const dd = String(reminder.getDate()).padStart(2, "0");
    const reminderDate = `${yyyy}-${mm}-${dd}`;
    return {
      id: "f-alarm",
      patient: "周沐言",
      latestVisit: "2026-05-01",
      diagnosis: "复查提醒（演示）",
      treatment: "到店复查",
      reviewDate: "2026-06-01",
      reminderDate,
      status: "待跟进",
      result: "未联系",
      owner: "王懿雯",
    };
  })(),
  { id: "f1", patient: "顾景川", latestVisit: "2026-04-27", diagnosis: "OK镜复查", treatment: "镜片复查", reviewDate: "2026-05-15", status: "待跟进", result: "未联系", owner: "刘嘉程" },
  { id: "f2", patient: "周沐言", latestVisit: "2026-05-01", diagnosis: "近视进展期", treatment: "离焦镜片", reviewDate: "2026-06-01", status: "待到店", result: "家长确认复诊", owner: "王懿雯" },
  { id: "f3", patient: "赵一宁", latestVisit: "2026-04-18", diagnosis: "视疲劳", treatment: "视觉训练", reviewDate: "2026-05-08", status: "已逾期", result: "三次未接通", owner: "陈意宁" },
  { id: "f4", patient: "林舒予", latestVisit: "2026-04-23", diagnosis: "干眼伴视疲劳", treatment: "干眼治疗", reviewDate: "2026-05-23", status: "已联系", result: "已确认复诊时间", owner: "陈意宁" },
];

export const trainingRecords: TrainingRecord[] = [
  {
    id: "t1",
    patient: "周沐言",
    trainingTime: "2026-05-01 11:20",
    trainer: "苏雨晴",
    store: "惟爱 · 上海海华医院",
    note: "完成双眼调节训练，状态稳定。",
    project: "调节灵敏度训练",
    duration: "20",
    completion: "90",
  },
  {
    id: "t2",
    patient: "周沐言",
    trainingTime: "2026-03-28 10:40",
    trainer: "苏雨晴",
    store: "惟爱 · 上海海华医院",
    note: "家长配合度较高，建议继续保持家庭训练。",
    project: "集合训练",
    duration: "25",
    completion: "95",
  },
  {
    id: "t3",
    patient: "赵一宁",
    trainingTime: "2026-04-18 11:50",
    trainer: "李嘉怡",
    store: "惟爱 · 上海海华医院",
    note: "首训完成，后续需观察依从性。",
    project: "视疲劳舒缓训练",
    duration: "15",
    completion: "80",
  },
  {
    id: "t4",
    patient: "高梓萱",
    trainingTime: "2026-04-26 14:10",
    trainer: "孙子琪",
    store: "静安门店",
    note: "训练中注意力一般，建议缩短单次时长。",
    project: "弱视精细训练",
    duration: "20",
    completion: "70",
  },
];

export const historyVisits: Visit[] = [
  {
    id: "v1",
    date: "2026-05-01",
    personType: "复诊",
    store: "惟爱 · 上海海华医院",
    diagnosis: "青少年近视进展期",
    treatment: "离焦镜片 + 视觉训练",
    axial: "24.22mm",
    va: "4.8 / 4.9",
    summary: "眼轴增长较上次减缓，建议维持离焦方案并继续每晚训练。",
    review: "2026-06-01",
    visitTypes: ["就诊", "视光训练"],
  },
  {
    id: "v2",
    date: "2026-03-28",
    personType: "复诊",
    store: "惟爱 · 上海海华医院",
    diagnosis: "近视控制中",
    treatment: "离焦镜片",
    axial: "24.17mm",
    va: "4.9 / 4.9",
    summary: "配镜适应良好，家长反馈配戴依从性高。",
    review: "2026-05-01",
    visitTypes: ["就诊", "配镜"],
  },
  {
    id: "v3",
    date: "2026-02-14",
    personType: "初诊",
    store: "惟爱 · 上海海华医院",
    diagnosis: "青少年近视",
    treatment: "离焦镜片评估",
    axial: "24.05mm",
    va: "4.7 / 4.8",
    summary: "完成首诊评估，建议进入近视防控方案。",
    review: "2026-03-28",
    visitTypes: ["就诊"],
  },
];

export const visitDetailRecords: Record<string, VisitDetailRecord> = {
  v1: {
    basicInfo: { doctor: "吴丽颖", optometrist: "/" },
    chiefHistory: {
      eye: "双眼",
      symptom: "视力下降",
      duration: "1",
      durationUnit: "日",
      description:
        "双眼OK镜复诊，戴镜1月。日前光学矫正(OK镜)治疗，无眼红、眼痛等不适主诉。脱镜无明显畏光，目前视力好。既往史：否认“高血压病、糖尿病、心脏病”等慢性病史；否认“病毒性肝炎、结核病、伤寒、疟疾”等急慢性传染病史；无肝、肾等重要脏器疾病史，否认新型冠状病毒肺炎流行病学史；否认头痛、发热、呼吸道症状病史。",
    },
    eyeExam: [
      { label: "眼位", right: "位正", left: "位正" },
      { label: "交替遮盖", right: "轻度由外到中", left: "轻度由外到中" },
      { label: "眼球运动", right: "无受限", left: "无受限" },
      { label: "眼前节", right: "阴性", left: "阴性", type: "boolean" },
      { label: "眼底", right: "阴性", left: "阴性", type: "boolean" },
    ],
    auxExam: [
      { label: "裸眼视力", right: "1.20", left: "1.20" },
      { label: "最佳矫正视力", right: "", left: "" },
      { label: "球镜", right: "-1.00", left: "-1.50" },
      { label: "柱镜", right: "-1.00", left: "-1.00" },
      { label: "轴位", right: "141", left: "38" },
      { label: "SE", right: "-1.5", left: "-2.0" },
      { label: "角膜曲率", right: "39.50", left: "40.00" },
      { label: "K1", right: "39.00", left: "39.25" },
      { label: "K2", right: "40.00", left: "40.50" },
      { label: "眼轴", right: "25.36", left: "25.54" },
      { label: "轴率比", right: "0.6420", left: "0.6385" },
      { label: "晶体厚度(mm)", right: "4.00", left: "3.85" },
      { label: "角膜厚度(um)", right: "550", left: "545" },
      { label: "角膜内皮计数", right: "2963", left: "3292" },
      { label: "CRT(um)", right: "", left: "" },
      { label: "RNFL(um)", right: "", left: "" },
      { label: "眼压(mmHg)", right: "16", left: "16" },
      { label: "泪膜破裂时间(s)", right: "/", left: "/" },
      { label: "泪液分泌试验(mm)", right: "/", left: "/" },
      { label: "立体视(s)", right: "/", left: "/" },
      { label: "色觉", right: "/", left: "/" },
    ],
    diagnosis: "1.双眼屈光不正 2.结膜炎",
    treatment: {
      inspection: { item: "无数据", quantity: "0", unit: "无数据", price: "0 元", total: "0 元" },
      prescription: { drug: "无数据", quantity: "0", spec: "无数据", unit: "无数据", price: "0 元", eye: "无数据", usage: "无数据", total: "0 元" },
      therapy: { item: "无数据", quantity: "0", unit: "无数据", price: "0 元", total: "0 元" },
      advice: "1.继续光学矫正(OK镜); 3月复查;",
      followupCycle: "3 / 月",
      estimatedDate: "2026-07-31",
      reminderDate: "2026-07-24",
    },
  },
  v2: {
    basicInfo: { doctor: "吴丽颖", optometrist: "/" },
    chiefHistory: {
      eye: "双眼",
      symptom: "复诊随访",
      duration: "3",
      durationUnit: "月",
      description: "离焦镜片复诊，配戴适应良好，家长反馈依从性高，无明显眼部不适。",
    },
    eyeExam: [
      { label: "眼位", right: "位正", left: "位正" },
      { label: "交替遮盖", right: "正常", left: "正常" },
      { label: "眼球运动", right: "无受限", left: "无受限" },
      { label: "眼前节", right: "阴性", left: "阴性", type: "boolean" },
      { label: "眼底", right: "阴性", left: "阴性", type: "boolean" },
    ],
    auxExam: [
      { label: "裸眼视力", right: "1.00", left: "1.00" },
      { label: "最佳矫正视力", right: "1.20", left: "1.20" },
      { label: "球镜", right: "-1.25", left: "-1.75" },
      { label: "柱镜", right: "-0.75", left: "-1.00" },
      { label: "轴位", right: "140", left: "35" },
      { label: "SE", right: "-1.63", left: "-2.25" },
      { label: "角膜曲率", right: "39.40", left: "39.80" },
      { label: "K1", right: "38.95", left: "39.10" },
      { label: "K2", right: "39.90", left: "40.20" },
      { label: "眼轴", right: "24.98", left: "25.11" },
      { label: "轴率比", right: "0.6391", left: "0.6352" },
      { label: "晶体厚度(mm)", right: "3.92", left: "3.86" },
      { label: "角膜厚度(um)", right: "543", left: "541" },
      { label: "角膜内皮计数", right: "3012", left: "3156" },
      { label: "CRT(um)", right: "", left: "" },
      { label: "RNFL(um)", right: "", left: "" },
      { label: "眼压(mmHg)", right: "15", left: "15" },
      { label: "泪膜破裂时间(s)", right: "/", left: "/" },
      { label: "泪液分泌试验(mm)", right: "/", left: "/" },
      { label: "立体视(s)", right: "/", left: "/" },
      { label: "色觉", right: "/", left: "/" },
    ],
    diagnosis: "双眼近视控制中",
    treatment: {
      inspection: { item: "复查检查套餐", quantity: "1", unit: "次", price: "320 元", total: "320 元" },
      prescription: { drug: "人工泪液", quantity: "1", spec: "10ml", unit: "瓶", price: "38 元", eye: "双眼", usage: "每日 3 次", total: "38 元" },
      therapy: { item: "离焦镜片复查", quantity: "1", unit: "次", price: "0 元", total: "0 元" },
      advice: "继续佩戴离焦镜片，保持用眼卫生，1个月后复查。",
      followupCycle: "1 / 月",
      estimatedDate: "2026-05-01",
      reminderDate: "2026-04-27",
    },
  },
  v3: {
    basicInfo: { doctor: "吴丽颖", optometrist: "/" },
    chiefHistory: {
      eye: "双眼",
      symptom: "首诊评估",
      duration: "6",
      durationUnit: "月",
      description: "首诊完成基础屈光与近视防控评估，拟进入离焦镜片干预方案。",
    },
    eyeExam: [
      { label: "眼位", right: "位正", left: "位正" },
      { label: "交替遮盖", right: "正常", left: "正常" },
      { label: "眼球运动", right: "无受限", left: "无受限" },
      { label: "眼前节", right: "阴性", left: "阴性", type: "boolean" },
      { label: "眼底", right: "阴性", left: "阴性", type: "boolean" },
    ],
    auxExam: [
      { label: "裸眼视力", right: "0.8", left: "0.8" },
      { label: "最佳矫正视力", right: "1.2", left: "1.2" },
      { label: "球镜", right: "-1.00", left: "-1.25" },
      { label: "柱镜", right: "-0.50", left: "-0.75" },
      { label: "轴位", right: "145", left: "42" },
      { label: "SE", right: "-1.25", left: "-1.63" },
      { label: "角膜曲率", right: "39.20", left: "39.70" },
      { label: "K1", right: "38.88", left: "39.02" },
      { label: "K2", right: "39.72", left: "40.05" },
      { label: "眼轴", right: "24.05", left: "24.18" },
      { label: "轴率比", right: "0.6180", left: "0.6206" },
      { label: "晶体厚度(mm)", right: "3.84", left: "3.79" },
      { label: "角膜厚度(um)", right: "538", left: "536" },
      { label: "角膜内皮计数", right: "3105", left: "3188" },
      { label: "CRT(um)", right: "", left: "" },
      { label: "RNFL(um)", right: "", left: "" },
      { label: "眼压(mmHg)", right: "14", left: "14" },
      { label: "泪膜破裂时间(s)", right: "/", left: "/" },
      { label: "泪液分泌试验(mm)", right: "/", left: "/" },
      { label: "立体视(s)", right: "/", left: "/" },
      { label: "色觉", right: "/", left: "/" },
    ],
    diagnosis: "青少年近视",
    treatment: {
      inspection: { item: "首诊评估", quantity: "1", unit: "次", price: "260 元", total: "260 元" },
      prescription: { drug: "无数据", quantity: "0", spec: "无数据", unit: "无数据", price: "0 元", eye: "无数据", usage: "无数据", total: "0 元" },
      therapy: { item: "离焦镜片评估", quantity: "1", unit: "次", price: "0 元", total: "0 元" },
      advice: "建议进入近视防控方案，复诊观察配戴适应情况。",
      followupCycle: "1 / 月",
      estimatedDate: "2026-03-28",
      reminderDate: "2026-03-24",
    },
  },
};
