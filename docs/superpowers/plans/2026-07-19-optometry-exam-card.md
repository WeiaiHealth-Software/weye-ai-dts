# 档案详情验光检查数据卡片实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在档案详情页“主诉与病史”和“眼部检查”之间新增只读的验光检查数据卡片，并为所有 Mock 就诊详情补齐对应数据。

**架构：** 扩展 `VisitDetailRecord` 增加结构化验光数据，详情页读取该字段渲染独立卡片。卡片不参与编辑模式，保持当前页面的本地 mock 编辑链路不变。

**技术栈：** React、TypeScript、Tailwind CSS、Vite

---

### 任务 1：补齐验光检查数据结构

**文件：**
- 修改：`src/modules/archive/shared/mock/archiveMockData.ts`
- 测试：使用 TypeScript 类型检查验证结构完整性

- [ ] **步骤 1：为就诊详情新增验光数据类型**

```ts
export type VisitOptometryMetric = {
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
};

export type VisitOptometryEye = {
  axialLength: VisitOptometryMetric;
  sphere: VisitOptometryMetric;
  cylinder: VisitOptometryMetric;
  keratometry: string;
};

export type VisitOptometryExam = {
  date: string;
  optometrist: string;
  right: VisitOptometryEye;
  left: VisitOptometryEye;
};
```

- [ ] **步骤 2：把类型接入 `VisitDetailRecord`**

```ts
export type VisitDetailRecord = {
  basicInfo: { doctor: string; optometrist: string };
  chiefHistory: { ... };
  optometryExam: VisitOptometryExam;
  eyeExam: VisitExamRow[];
  auxExam: VisitExamRow[];
  diagnosis: string;
  treatment: { ... };
};
```

- [ ] **步骤 3：为默认空态补齐 `optometryExam`**

```ts
optometryExam: {
  date: "",
  optometrist: "",
  right: {
    axialLength: { value: "" },
    sphere: { value: "" },
    cylinder: { value: "" },
    keratometry: "",
  },
  left: {
    axialLength: { value: "" },
    sphere: { value: "" },
    cylinder: { value: "" },
    keratometry: "",
  },
},
```

- [ ] **步骤 4：为 `v1`、`v2`、`v3` 补齐验光检查 mock 数据**

```ts
optometryExam: {
  date: "2026-05-01",
  optometrist: "吴丽颖",
  right: {
    axialLength: { value: "25.36 mm", delta: "↑0.22", trend: "up" },
    sphere: { value: "-3.50 D" },
    cylinder: { value: "-0.75 D" },
    keratometry: "42.50 / 43.25",
  },
  left: {
    axialLength: { value: "25.54 mm", delta: "↑0.03", trend: "up" },
    sphere: { value: "-4.00 D" },
    cylinder: { value: "-0.50 D" },
    keratometry: "42.75 / 43.50",
  },
},
```

- [ ] **步骤 5：运行类型检查确认 mock 结构无报错**

运行：`npm run build`
预期：构建成功，无 `VisitDetailRecord` 类型报错

### 任务 2：在档案详情页插入只读卡片

**文件：**
- 修改：`src/modules/archive/pages/archive-detail/ArchiveDetailContent.tsx`
- 测试：页面类型检查与诊断检查

- [ ] **步骤 1：增加验光数据展示所需的辅助函数或常量**

```tsx
const optometrySections = [
  {
    key: "right",
    title: "右眼 (OD)",
    dotClassName: "bg-emerald-500",
    cardClassName: "border-emerald-100 bg-emerald-50/30",
  },
  {
    key: "left",
    title: "左眼 (OS)",
    dotClassName: "bg-violet-500",
    cardClassName: "border-violet-100 bg-violet-50/30",
  },
] as const;
```

- [ ] **步骤 2：实现只读卡片 UI**

```tsx
<div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
    <div className="text-sm font-bold text-gray-900">
      验光检查数据（{effectiveVisitDetail.optometryExam.date || "-"}）
    </div>
    <div className="text-sm font-medium text-gray-500">
      验光师：<span className="text-gray-900">{effectiveVisitDetail.optometryExam.optometrist || "/"}</span>
    </div>
  </div>
</div>
```

- [ ] **步骤 3：在卡片内部补齐左右眼四行数据展示**

```tsx
{[
  { label: "眼轴长度 (AL)", metric: eyeData.axialLength },
  { label: "球镜 (SPH)", metric: eyeData.sphere },
  { label: "柱镜 (CYL)", metric: eyeData.cylinder },
  { label: "角膜曲率 (K1/K2)", value: eyeData.keratometry },
].map((item) => (
  <div className="flex items-center justify-between gap-4">
    <div className="text-[15px] font-medium text-gray-500">{item.label}</div>
    <div className="text-right text-[15px] font-bold text-gray-900">{...}</div>
  </div>
))}
```

- [ ] **步骤 4：把卡片插入到“主诉与病史”和“眼部检查”之间**

```tsx
<div id="visit-chief" ...>...</div>
<div className="mt-5">...验光检查数据卡片...</div>
<div id="visit-exams" ...>...</div>
```

- [ ] **步骤 5：保持编辑模式下仍然只读**

```tsx
const optometryExam = effectiveVisitDetail.optometryExam;
```

说明：不要切换到 `visitDraft.optometryExam`，也不要新增输入框。

### 任务 3：完成验证与交付

**文件：**
- 修改：`src/modules/archive/shared/mock/archiveMockData.ts`
- 修改：`src/modules/archive/pages/archive-detail/ArchiveDetailContent.tsx`

- [ ] **步骤 1：运行构建验证页面可编译**

运行：`npm run build`
预期：PASS，Vite 构建成功

- [ ] **步骤 2：运行诊断检查最近修改文件**

检查：
- `src/modules/archive/shared/mock/archiveMockData.ts`
- `src/modules/archive/pages/archive-detail/ArchiveDetailContent.tsx`

预期：无新增 TypeScript / ESLint 诊断

- [ ] **步骤 3：整理变更说明并交付**

```md
- 新增档案详情验光检查数据卡片
- 所有 Mock 就诊详情补齐结构化验光数据
- 编辑态保持只读，不影响现有保存逻辑
```
