# 小程序智能体页优化实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 优化小程序 `智能体` 页的列表与医生 AI 分身详情交互，实现整卡点击、分类筛选和进入详情后的全屏沉浸式浅蓝页面。

**架构：** 在 `AgentsModule.tsx` 内补充医生数据结构、分类状态、筛选派生和浅色详情态；在 `MiniProgram` 外层增加“智能体详情全屏态”判断，用于在进入医生 AI 分身后隐藏顶部分栏和搜索上方导航区域。整体仍保持单页原型结构，不新增路由。

**技术栈：** React、TypeScript、Tailwind CSS、Vite、Lucide React

---

### 任务 1：调整小程序外层容器以支持智能体详情全屏态

**文件：**
- 修改：`src/pages/miniprogram/index.tsx`

- [ ] **步骤 1：为 `AgentsModule` 提供详情显隐回调接口**

```tsx
const [agentDetailOpen, setAgentDetailOpen] = useState(false);

case '智能体':
  return <AgentsModule onDetailVisibilityChange={setAgentDetailOpen} />;
```

- [ ] **步骤 2：在智能体详情打开时隐藏顶部 Tab 导航**

```tsx
{!(activeTab === '智能体' && agentDetailOpen) ? (
  <div className="relative z-10 flex items-center justify-between px-6 pb-2 pt-2">
    {TABS.map((tab) => (...))}
  </div>
) : null}
```

- [ ] **步骤 3：在切换非智能体 Tab 时重置详情态**

```tsx
onClick={() => {
  setActiveTab(tab);
  if (tab !== '智能体') setAgentDetailOpen(false);
}}
```

### 任务 2：重构医生 mock 与分类筛选

**文件：**
- 修改：`src/pages/miniprogram/components/AgentsModule.tsx`

- [ ] **步骤 1：扩充分类类型和医生数据结构**

```tsx
type AgentCategory = '全部名医' | '近视防控' | '斜弱视专区' | '角膜塑形镜';

type DoctorProfile = {
  id: string;
  name: string;
  categories: AgentCategory[];
  hospital: string;
  specialty: string;
  consultCount: string;
  quickPrompts: string[];
};
```

- [ ] **步骤 2：新增多名医生 mock，并覆盖所有分类**

```tsx
const DOCTORS: DoctorProfile[] = [
  { id: 'xu-wei', name: '徐蔚 教授', categories: ['全部名医', '近视防控', '角膜塑形镜'], ... },
  { id: 'lin-ruoning', name: '林若宁 主任', categories: ['全部名医', '斜弱视专区'], ... },
  { id: 'chen-yusheng', name: '陈雨生 主任', categories: ['全部名医', '角膜塑形镜'], ... },
];
```

- [ ] **步骤 3：增加分类状态与筛选派生**

```tsx
const [activeCategory, setActiveCategory] = useState<AgentCategory>('全部名医');

const filteredDoctors = useMemo(
  () => DOCTORS.filter((doctor) => activeCategory === '全部名医' || doctor.categories.includes(activeCategory)),
  [activeCategory]
);
```

- [ ] **步骤 4：将分类栏改为可点击按钮**

```tsx
{AGENT_CATEGORIES.map((category) => (
  <button type="button" onClick={() => setActiveCategory(category)}>
    {category}
  </button>
))}
```

### 任务 3：优化列表卡片布局与整卡点击交互

**文件：**
- 修改：`src/pages/miniprogram/components/AgentsModule.tsx`

- [ ] **步骤 1：删除卡片右侧引导按钮**

```tsx
- <div className="self-center rounded-full ...">点击进入 AI 分身</div>
```

- [ ] **步骤 2：调整卡片内容布局，恢复信息区宽度**

```tsx
<button className="w-full rounded-2xl border border-gray-50 bg-white p-4 text-left shadow-sm">
  <div className="flex items-start gap-3">
    <div className="relative">...</div>
    <div className="min-w-0 flex-1">...</div>
  </div>
</button>
```

- [ ] **步骤 3：点击卡片时进入对应 AI 分身页并重置详情 Tab**

```tsx
onClick={() => {
  setSelectedDoctorId(doctor.id);
  setActiveProfileTab('专业擅长');
}}
```

### 任务 4：将 AI 分身详情页改为浅色全屏态

**文件：**
- 修改：`src/pages/miniprogram/components/AgentsModule.tsx`

- [ ] **步骤 1：接收外层详情显隐回调并同步状态**

```tsx
type AgentsModuleProps = {
  onDetailVisibilityChange?: (open: boolean) => void;
};

useEffect(() => {
  onDetailVisibilityChange?.(Boolean(selectedDoctor));
}, [onDetailVisibilityChange, selectedDoctor]);
```

- [ ] **步骤 2：将详情页头图区改为浅蓝渐变**

```tsx
<div className="absolute inset-x-0 top-0 h-[260px] bg-gradient-to-b from-sky-300 via-blue-400 to-indigo-300" />
```

- [ ] **步骤 3：调整详情页卡片与按钮到问诊首页风格**

```tsx
<div className="rounded-[28px] bg-white/88 shadow-[0_18px_36px_rgba(60,72,120,0.14)] backdrop-blur-xl">
  ...
</div>
```

- [ ] **步骤 4：保留返回能力并返回列表态**

```tsx
<button type="button" onClick={() => setSelectedDoctorId(null)}>
  <ArrowLeft size={18} />
</button>
```

### 任务 5：验证与交付

**文件：**
- 修改：`src/pages/miniprogram/index.tsx`
- 修改：`src/pages/miniprogram/components/AgentsModule.tsx`

- [ ] **步骤 1：运行构建验证**

运行：`npm run build`
预期：PASS，Vite 构建成功

- [ ] **步骤 2：检查最近修改文件诊断**

检查：
- `src/pages/miniprogram/index.tsx`
- `src/pages/miniprogram/components/AgentsModule.tsx`

预期：无新增 TypeScript / ESLint 阻塞错误

- [ ] **步骤 3：整理交付说明**

```md
- 智能体列表删除右侧引导按钮，改为整卡点击
- 新增多名医生 mock，并支持按分类筛选
- 进入医生 AI 分身后隐藏顶部分栏，详情页改为浅蓝全屏态
```
