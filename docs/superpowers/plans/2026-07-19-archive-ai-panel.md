# 档案详情 AI 辅助面板实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在档案详情页 `就诊记录` Tab 中接入与项目详情页 1:1 对齐的页面级右侧 `Eye宝临床助手` 固定 AI 面板，并用本地 mock 数据驱动临床分析话术。

**架构：** 复用项目详情页 AI 面板的页面级固定 `aside` 结构，在 `ArchiveDetailContent.tsx` 内新增档案场景状态、快捷分析配置和 mock 回复生成逻辑。AI 面板挂载在整个页面主体容器最右侧，档案详情内部三栏结构保持不变，只在展开时给主体增加右侧预留宽度。

**技术栈：** React、TypeScript、Tailwind CSS、Vite、Phosphor Icons、Lucide React

---

### 任务 1：建立档案详情 AI 状态与数据派生

**文件：**
- 修改：`src/modules/archive/pages/archive-detail/ArchiveDetailContent.tsx`

- [ ] **步骤 1：补充 AI 消息、模式、快捷操作类型定义**

```tsx
type ArchiveAiMessageRole = "assistant" | "user";

type ArchiveAiMessage = {
  id: string;
  role: ArchiveAiMessageRole;
  content: string;
  tag?: string;
  time: string;
};

type ArchiveAiMode = "default" | "analysis";

type ArchiveAiQuickAction = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: LucideIcon;
  iconClassName: string;
  mode?: ArchiveAiMode;
};
```

- [ ] **步骤 2：新增 AI 面板本地状态**

```tsx
const [aiPanelOpen, setAiPanelOpen] = useState(false);
const [aiMode, setAiMode] = useState<ArchiveAiMode>("default");
const [aiInput, setAiInput] = useState("");
const [aiMessages, setAiMessages] = useState<ArchiveAiMessage[]>([]);
const [aiQuickActionsCollapsed, setAiQuickActionsCollapsed] = useState(false);
```

- [ ] **步骤 3：派生临床 AI 所需摘要数据**

```tsx
const aiClinicalInsights = useMemo(() => ({
  patientName: patient.name,
  age: patient.age,
  diagnosis: effectiveVisitDetail.diagnosis || "待补充",
  rightAxialDelta: optometryExam.right.axialLength.delta || "",
  leftAxialDelta: optometryExam.left.axialLength.delta || "",
  suggestion: effectiveVisitDetail.treatment.advice || "建议持续观察",
}), [patient, effectiveVisitDetail, optometryExam]);
```

- [ ] **步骤 4：定义临床快捷分析项**

```tsx
const quickActions = useMemo<ArchiveAiQuickAction[]>(() => ([
  {
    id: "axial-trend",
    title: "分析近三个月眼轴变化趋势",
    description: "结合当前验光数据识别近视进展风险",
    prompt: `请分析患者 ${patient.name} 近三个月眼轴变化趋势，并提示风险。`,
    icon: Activity,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    id: "cornea-fit",
    title: "评估当前角膜地形图配适状态",
    description: "基于曲率与临床表现做配适判断",
    prompt: `请基于当前角膜曲率与就诊信息，评估患者角膜地形图配适状态。`,
    icon: ScanSearch,
    iconClassName: "bg-violet-50 text-violet-600",
  },
  {
    id: "followup-summary",
    title: "自动生成本次随访小结与医嘱",
    description: "输出可直接复用的随访总结文案",
    prompt: `请为患者 ${patient.name} 生成本次随访小结与医嘱。`,
    icon: FileText,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
]), [patient.name]);
```

### 任务 2：生成本地 AI 对话与风险文案

**文件：**
- 修改：`src/modules/archive/pages/archive-detail/ArchiveDetailContent.tsx`

- [ ] **步骤 1：实现消息创建函数**

```tsx
const createAiMessage = (role: ArchiveAiMessageRole, content: string, tag?: string): ArchiveAiMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  tag,
  time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
});
```

- [ ] **步骤 2：实现默认欢迎与风险提示文案生成器**

```tsx
const buildInitialAiMessage = () => {
  const rightRisk = optometryExam.right.axialLength.delta || "↑0.00";
  const leftRisk = optometryExam.left.axialLength.delta || "↑0.00";

  return [
    `我是 Eye宝临床助手。已为您加载患者 ${patient.name} 的全量档案数据。`,
    "",
    "⚠️ 风险提示：",
    `该患者右眼（OD）近三个月眼轴增长 ${rightRisk}，提示近视控制风险需重点关注。`,
    `左眼（OS）当前增长 ${leftRisk}，整体相对稳定。`,
    "",
    `建议结合当前诊断“${effectiveVisitDetail.diagnosis || "待补充"}”与医嘱继续随访，并复核配适与依从性。`,
  ].join("\n");
};
```

- [ ] **步骤 3：实现快捷分析与手动提问回复逻辑**

```tsx
const buildAiReply = (prompt: string) => {
  if (/眼轴|趋势|近三个月/.test(prompt)) {
    return `眼轴趋势分析：\n\n- 右眼增幅 ${optometryExam.right.axialLength.delta || "↑0.00"}，高于当前预期。\n- 左眼增幅 ${optometryExam.left.axialLength.delta || "↑0.00"}，控制相对平稳。\n- 建议优先复核右眼配适状态与家庭用眼执行情况。`;
  }
  if (/角膜|配适/.test(prompt)) {
    return `角膜配适评估：\n\n- 当前角膜曲率 OD ${optometryExam.right.keratometry || "-"}，OS ${optometryExam.left.keratometry || "-"}。\n- 结合当前主诉与眼部检查，建议重点排查右眼配适稳定性与角膜塑形镜贴合情况。`;
  }
  return `随访小结建议：\n\n- 本次诊断：${effectiveVisitDetail.diagnosis || "待补充"}。\n- 风险侧：右眼眼轴进展偏快。\n- 医嘱建议：${effectiveVisitDetail.treatment.advice || "持续观察，按期复诊。"}。`;
};
```

- [ ] **步骤 4：在就诊切换时重置 AI 初始消息**

```tsx
useEffect(() => {
  if (!selectedVisitId) return;
  setAiMessages([createAiMessage("assistant", buildInitialAiMessage(), "欢迎")]);
  setAiInput("");
  setAiMode("default");
}, [selectedVisitId, patient.name, effectiveVisitDetail, optometryExam]);
```

### 任务 3：把 AI 面板接入页面级右侧布局

**文件：**
- 修改：`src/modules/archive/pages/archive-detail/ArchiveDetailContent.tsx`

- [ ] **步骤 1：在页面顶部操作区增加 AI 按钮，并放在“新增档案”左侧**

```tsx
<button
  type="button"
  onClick={() => setAiPanelOpen((value) => !value)}
  className={aiPanelOpen ? "..." : "..."}
>
  <Sparkle weight="bold" className="h-4 w-4" />
  {aiPanelOpen ? "收起临床助手" : "Eye宝临床助手"}
</button>
```

- [ ] **步骤 2：把 AI 面板从内部三栏移到页面最右侧固定 `aside`**

```tsx
<div className={clsx("space-y-6", aiPanelOpen && activeTab === "visits" && "xl:pr-[560px]")}>
  ...主体内容...
</div>

{aiPanelOpen && activeTab === "visits" ? (
  <aside className="hidden xl:fixed xl:right-3 xl:top-20 xl:block xl:h-[calc(100vh-5rem)] xl:w-[520px]">
    ...AI 面板...
  </aside>
) : null}
```

- [ ] **步骤 3：保留内部目录侧栏，不再与 AI 面板互斥**

```tsx
<aside className="hidden xl:block">
  ...目录...
</aside>
```

- [ ] **步骤 4：实现与项目详情页 1:1 对齐的 AI 面板顶部与快捷分析区**

```tsx
<div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
  <div className="border-b border-slate-100 px-5 py-5">
    <h3 className="text-2xl font-bold text-slate-900">Eye宝临床助手</h3>
    <div className="mt-2 inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700">
      双驱动大模型
    </div>
  </div>
</div>
```

- [ ] **步骤 5：实现消息流与输入区**

```tsx
<div className="flex-1 overflow-y-auto px-5 py-4">
  {aiMessages.map((message) => (...))}
</div>

<textarea
  value={aiInput}
  onChange={(event) => setAiInput(event.target.value)}
  placeholder="输入临床问题或指令..."
/>
```

- [ ] **步骤 6：保留模型切换和发送按钮的演示态 UI**

```tsx
<button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
  <Sparkles className="h-4 w-4 text-violet-600" />
  <span>WEyeAI</span>
</button>
```

### 任务 4：验证与交付

**文件：**
- 修改：`src/modules/archive/pages/archive-detail/ArchiveDetailContent.tsx`

- [ ] **步骤 1：运行构建验证**

运行：`npm run build`
预期：PASS，Vite 构建成功

- [ ] **步骤 2：检查最近修改文件诊断**

检查：
- `src/modules/archive/pages/archive-detail/ArchiveDetailContent.tsx`

预期：无新增 TypeScript / ESLint 阻塞错误

- [ ] **步骤 3：整理交付说明**

```md
- 档案详情页新增 Eye宝临床助手按钮与右侧 AI 面板
- 打开 AI 时替换原目录侧栏，关闭后恢复目录
- 快捷分析、风险提示、聊天回复均基于当前档案 mock 数据生成
```
