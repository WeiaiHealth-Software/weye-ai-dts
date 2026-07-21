# 小程序档案页多人档案 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将小程序 `档案` 页从单人空状态改造成支持多人档案、0/1/多次就诊记录、记录子卡片展开详情和底部固定预约入口的原型页。

**架构：** 继续把页面逻辑收敛在 `RecordsModule.tsx`，用本地 typed mock 数据驱动成员切换、记录展开和指标 tab 切换。优先复用当前 `RecordsModule` 的卡片样式语义，不引入新的全局状态或图表依赖；只有当页面滚动或固定底部浮层与外层容器冲突时，才最小化调整 `MiniProgram` 外层容器。

**技术栈：** React 19、TypeScript、Tailwind CSS、`lucide-react`

---

### 任务 1：建立多人档案数据模型和页面状态

**文件：**
- 修改：`src/pages/miniprogram/components/RecordsModule.tsx`
- 验证：`src/pages/miniprogram/components/RecordsModule.tsx`

- [ ] **步骤 1：把 `RecordsModule.tsx` 改造成有状态组件骨架**

在文件顶部把 `useMemo`、`useState` 一并引入，并新增页面所需的类型定义与 mock 数据常量。先保留原有 `EyeBao` 和 `lucide-react` 图标导入。

```tsx
import { ClipboardList, ChevronDown, Plus, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EyeBao } from './EyeBao';

type MetricTab = '眼轴' | '屈光度';

type MetricSnapshot = {
  rightLabel: string;
  rightValue: string;
  leftLabel: string;
  leftValue: string;
  conclusion?: string;
};

type VisitRecord = {
  id: string;
  phaseLabel: string;
  date: string;
  summary: string;
  axial: MetricSnapshot;
  refraction: MetricSnapshot;
};

type ArchiveProfile = {
  id: string;
  name: string;
  gender: string;
  age: string;
  archiveNo: string;
  visitCount: number;
  emptyHint?: string;
  visits: VisitRecord[];
  isAddEntry?: boolean;
};
```

- [ ] **步骤 2：补齐 3 个成员的本地 mock 数据**

直接在 `RecordsModule.tsx` 内新增 `ARCHIVE_PROFILES` 常量，覆盖以下状态：

- `周末`：2 条记录
- `安安`：1 条记录
- `新增成员`：0 条记录，`isAddEntry: true`

```tsx
const ARCHIVE_PROFILES: ArchiveProfile[] = [
  {
    id: 'zhoumo',
    name: '周末',
    gender: '男',
    age: '11岁',
    archiveNo: 'OPT-20260718',
    visitCount: 2,
    visits: [
      {
        id: 'visit-zhoumo-2',
        phaseLabel: '第 2 次复查',
        date: '2026-08-03',
        summary: '复查评估 / 眼轴趋势 / 屈光变化',
        axial: {
          rightLabel: '右眼眼轴',
          rightValue: '24.36 mm',
          leftLabel: '左眼眼轴',
          leftValue: '24.28 mm',
          conclusion: '继续复查',
        },
        refraction: {
          rightLabel: '右眼屈光度',
          rightValue: '-2.25D',
          leftLabel: '左眼屈光度',
          leftValue: '-2.00D',
          conclusion: '角膜塑形镜适配中',
        },
      },
    ],
  },
];
```

要求：最终常量中必须写满 2 条 `周末` 记录、1 条 `安安` 记录和 1 个 `0 次记录` 成员，不允许再依赖硬编码 JSX。

- [ ] **步骤 3：增加页面状态并建立默认选中规则**

在组件内部增加 3 类状态：

- 当前选中的成员 `activeProfileId`
- 每个成员当前展开的记录 `expandedVisitIdByProfile`
- 当前展开记录的指标 tab `metricTabByVisit`

```tsx
const realProfiles = ARCHIVE_PROFILES.filter((item) => !item.isAddEntry);

const [activeProfileId, setActiveProfileId] = useState(realProfiles[0]?.id ?? '');
const [expandedVisitIdByProfile, setExpandedVisitIdByProfile] = useState<Record<string, string>>({
  zhoumo: 'visit-zhoumo-2',
  anan: 'visit-anan-1',
});
const [metricTabByVisit, setMetricTabByVisit] = useState<Record<string, MetricTab>>({
  'visit-zhoumo-2': '眼轴',
  'visit-zhoumo-1': '眼轴',
  'visit-anan-1': '眼轴',
});

const activeProfile = useMemo(
  () => ARCHIVE_PROFILES.find((item) => item.id === activeProfileId) ?? ARCHIVE_PROFILES[0],
  [activeProfileId]
);
```

- [ ] **步骤 4：运行文件级 ESLint，确认状态和类型定义无语法错误**

运行：

```bash
npx eslint src/pages/miniprogram/components/RecordsModule.tsx
```

预期：无报错；如果出现 `no-unused-vars`，继续下一任务前删掉还没用上的草稿变量或临时图标。

- [ ] **步骤 5：Commit**

```bash
git add src/pages/miniprogram/components/RecordsModule.tsx
git commit -m "feat: add miniprogram records data model"
```

### 任务 2：实现成员切换条和主档案卡片结构

**文件：**
- 修改：`src/pages/miniprogram/components/RecordsModule.tsx`
- 验证：`src/pages/miniprogram/components/RecordsModule.tsx`

- [ ] **步骤 1：把根布局改成“顶部成员切换 + 中间滚动内容 + 底部预约浮层”**

先重写 `return` 顶层布局，给滚动区预留底部浮层空间，避免 `去预约` 挡住内容。

```tsx
return (
  <div className="flex h-full flex-col px-4 pb-4 pt-2">
    <div className="mb-2 flex justify-center">
      <EyeBao className="h-24 w-24 drop-shadow-md" />
    </div>

    <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
      {ARCHIVE_PROFILES.map((profile) => {
        const isActive = profile.id === activeProfileId;
        return (
          <button
            key={profile.id}
            type="button"
            onClick={() => !profile.isAddEntry && setActiveProfileId(profile.id)}
            className={isActive ? '...' : '...'}
          >
            ...
          </button>
        );
      })}
    </div>

    <div className="relative min-h-0 flex-1">
      <div className="h-full overflow-y-auto pb-28">...</div>
      <div className="absolute inset-x-0 bottom-0">...</div>
    </div>
  </div>
);
```

- [ ] **步骤 2：实现成员切换条样式**

成员切换条需要区分 3 类按钮：

- 当前成员：蓝色渐变高亮
- 普通成员：白底浅描边
- `+ 新增`：白底虚线或弱高亮，文案强调新增

建议直接按下列分支渲染：

```tsx
{profile.isAddEntry ? (
  <div className="flex min-w-[92px] items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white/80 px-4 py-3 text-sm font-semibold text-blue-500 shadow-sm">
    <Plus size={16} className="mr-1.5" />
    新增
  </div>
) : (
  <>
    <div className="text-sm font-bold">{profile.name}</div>
    <div className="mt-1 text-[11px] opacity-85">{profile.visitCount} 次记录</div>
  </>
)}
```

- [ ] **步骤 3：实现主档案卡片头部，改成跟当前系统一致的蓝色信息头**

主卡片头部继续沿用现有样式语义：头像、姓名、性别年龄胶囊、档案号。

```tsx
<div className="relative z-0 rounded-t-2xl bg-gradient-to-r from-blue-400 to-blue-500 p-4 text-white shadow-md">
  <div className="flex items-center space-x-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-sm">
      <User size={24} className="text-white" />
    </div>
    <div>
      <div className="flex items-center space-x-2 text-lg font-bold">
        <span>{activeProfile.name}</span>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-normal">
          {activeProfile.gender}/{activeProfile.age}
        </span>
      </div>
      <div className="mt-1 text-xs text-blue-100">档案号: {activeProfile.archiveNo}</div>
    </div>
  </div>
</div>
```

- [ ] **步骤 4：运行文件级 ESLint，确认切换条和主卡片 JSX 正常**

运行：

```bash
npx eslint src/pages/miniprogram/components/RecordsModule.tsx
```

预期：无报错；如果出现可访问性或 className 过长问题，直接在本任务内收敛。

- [ ] **步骤 5：Commit**

```bash
git add src/pages/miniprogram/components/RecordsModule.tsx
git commit -m "feat: add profile switcher to miniprogram records"
```

### 任务 3：实现就诊记录子卡片和展开详情

**文件：**
- 修改：`src/pages/miniprogram/components/RecordsModule.tsx`
- 验证：`src/pages/miniprogram/components/RecordsModule.tsx`

- [ ] **步骤 1：实现“有记录”成员的记录子卡片列表**

在主卡片内容区先渲染摘要行，再 `map(activeProfile.visits)` 输出每条记录。每条卡片头部整体可点击，并基于 `expandedVisitIdByProfile` 决定是否展开。

```tsx
const expandedVisitId = expandedVisitIdByProfile[activeProfile.id];

...

<div className="mb-3 flex items-center justify-between">
  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
    共 {activeProfile.visitCount} 次就诊记录
  </span>
  <span className="text-xs text-slate-400">点击记录查看详情</span>
</div>

<div className="space-y-3">
  {activeProfile.visits.map((visit) => {
    const expanded = visit.id === expandedVisitId;
    return (
      <div key={visit.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70">
        <button
          type="button"
          onClick={() =>
            setExpandedVisitIdByProfile((prev) => ({ ...prev, [activeProfile.id]: visit.id }))
          }
          className="flex w-full items-center justify-between px-3 py-3 text-left"
        >
          ...
        </button>
        {expanded ? <div>...</div> : null}
      </div>
    );
  })}
</div>
```

- [ ] **步骤 2：实现展开详情里的左右眼图例和指标 tab**

展开区内复用现有 `右眼 / 左眼` 图例和 `眼轴 / 屈光度` 切换按钮，但改成与当前记录状态绑定。

```tsx
const activeMetricTab = metricTabByVisit[visit.id] ?? '眼轴';
const metric = activeMetricTab === '眼轴' ? visit.axial : visit.refraction;

<div className="mb-4 flex items-center justify-between">
  <div className="flex space-x-4 text-sm font-medium">
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 rounded-full bg-green-500" />
      <span className="text-gray-700">右眼</span>
    </div>
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 rounded-full bg-purple-500" />
      <span className="text-gray-700">左眼</span>
    </div>
  </div>
  <div className="flex rounded-lg bg-blue-50 p-1">
    {(['眼轴', '屈光度'] as const).map((tab) => (
      <button
        key={tab}
        type="button"
        onClick={() => setMetricTabByVisit((prev) => ({ ...prev, [visit.id]: tab }))}
        className={tab === activeMetricTab ? 'rounded-md bg-blue-500 px-3 py-1 text-xs text-white shadow-sm' : 'rounded-md px-3 py-1 text-xs text-gray-500'}
      >
        {tab}
      </button>
    ))}
  </div>
</div>
```

- [ ] **步骤 3：实现详情区的趋势占位和关键指标卡**

不引入图表库，直接用 Tailwind 渐变背景和 3 个指标卡模拟趋势感。

```tsx
<div className="rounded-2xl bg-gradient-to-b from-blue-50 to-white p-3">
  <div className="h-28 rounded-xl bg-[linear-gradient(180deg,rgba(59,130,246,0.08),rgba(59,130,246,0.02))]" />
  <div className="mt-3 grid grid-cols-3 gap-2">
    <div className="rounded-xl border border-slate-100 bg-white p-2">
      <div className="text-[10px] text-slate-400">{metric.rightLabel}</div>
      <div className="mt-1 text-xs font-bold text-slate-700">{metric.rightValue}</div>
    </div>
    <div className="rounded-xl border border-slate-100 bg-white p-2">
      <div className="text-[10px] text-slate-400">{metric.leftLabel}</div>
      <div className="mt-1 text-xs font-bold text-slate-700">{metric.leftValue}</div>
    </div>
    <div className="rounded-xl border border-slate-100 bg-white p-2">
      <div className="text-[10px] text-slate-400">检查结论</div>
      <div className="mt-1 text-xs font-bold text-slate-700">{metric.conclusion ?? '建议观察'}</div>
    </div>
  </div>
</div>
```

- [ ] **步骤 4：运行 ESLint，确认记录列表和展开详情无 JSX / hooks 问题**

运行：

```bash
npx eslint src/pages/miniprogram/components/RecordsModule.tsx
```

预期：无报错。

- [ ] **步骤 5：Commit**

```bash
git add src/pages/miniprogram/components/RecordsModule.tsx
git commit -m "feat: add expandable visit cards to records module"
```

### 任务 4：实现 0 次记录空状态和底部固定预约浮层

**文件：**
- 修改：`src/pages/miniprogram/components/RecordsModule.tsx`
- 可选修改：`src/pages/miniprogram/index.tsx`
- 验证：`src/pages/miniprogram/components/RecordsModule.tsx`

- [ ] **步骤 1：为 0 次记录成员渲染空状态，不再复用旧版整页空白**

把“暂无检查记录”改成主卡片内空状态，而不是整页空盒子。只在 `activeProfile.visitCount === 0` 时显示。

```tsx
{activeProfile.visitCount === 0 ? (
  <div className="mt-2 rounded-2xl border border-dashed border-blue-100 bg-slate-50/70 px-4 py-8 text-center">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
      <ClipboardList size={28} className="text-slate-300" />
    </div>
    <p className="mt-4 text-sm font-medium text-slate-500">暂无检查记录</p>
    <p className="mt-2 text-xs leading-6 text-slate-400">{activeProfile.emptyHint}</p>
  </div>
) : (
  <div className="space-y-3">...</div>
)}
```

- [ ] **步骤 2：在滚动内容区底部增加“新增成员档案”提示卡**

这个卡片始终位于内容区底部，用来强化第 3 位成员入口，而不是只放在顶部切换条里。

```tsx
<div className="mt-3 rounded-2xl border border-dashed border-blue-200 bg-white/80 px-4 py-4 text-center shadow-sm">
  <div className="text-sm font-semibold text-slate-600">第三位成员可从这里新增</div>
  <div className="mt-1 text-xs text-slate-400">新增后先有档案，暂无检查记录，也可直接预约</div>
  <div className="mt-3 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
    <Plus size={14} className="mr-1.5" />
    新增成员档案
  </div>
</div>
```

- [ ] **步骤 3：实现页面底部固定预约浮层**

固定浮层始终显示，按钮不再跟空状态绑定。

```tsx
<div className="absolute inset-x-0 bottom-0 rounded-3xl border border-blue-100 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(59,130,246,0.12)] backdrop-blur">
  <p className="mb-2 text-center text-xs text-slate-400">预约入口始终保留，可直接发起预约</p>
  <button
    type="button"
    className="w-full rounded-full bg-blue-500 px-10 py-3 font-medium text-white shadow-md transition hover:bg-blue-600"
  >
    去预约
  </button>
</div>
```

- [ ] **步骤 4：如果底部浮层与外层滚动容器冲突，再最小化调整 `MiniProgram`**

只有出现裁剪或滚动冲突时，才修改 `src/pages/miniprogram/index.tsx`，优先调整档案页内容容器为：

```tsx
<div className="relative z-10 flex-1 overflow-hidden">
  <div className="no-scrollbar h-full overflow-y-auto overscroll-contain">{renderActiveModule()}</div>
</div>
```

如果当前布局已正常，不要改 `MiniProgram`。

- [ ] **步骤 5：Commit**

```bash
git add src/pages/miniprogram/components/RecordsModule.tsx src/pages/miniprogram/index.tsx
git commit -m "feat: keep booking action fixed in records page"
```

提交前如果没有改动 `src/pages/miniprogram/index.tsx`，从 `git add` 命令中去掉这个文件。

### 任务 5：最终验证和交付

**文件：**
- 验证：`src/pages/miniprogram/components/RecordsModule.tsx`
- 验证：`src/pages/miniprogram/index.tsx`

- [ ] **步骤 1：运行 ESLint 检查相关页面文件**

运行：

```bash
npx eslint src/pages/miniprogram/components/RecordsModule.tsx src/pages/miniprogram/index.tsx
```

预期：无报错、无未使用变量。

- [ ] **步骤 2：运行项目构建，确认 TSX 改造没有影响 Vite 打包**

运行：

```bash
npm run build
```

预期：`vite build` 成功完成，无 TypeScript 编译报错。

- [ ] **步骤 3：运行编辑器诊断，确认文件级无新增问题**

检查以下文件诊断：

- `src/pages/miniprogram/components/RecordsModule.tsx`
- `src/pages/miniprogram/index.tsx`

预期：无新增 TypeScript / JSX 诊断错误。

- [ ] **步骤 4：人工走查页面状态**

在本地预览中确认 4 个交互结果：

- 切换 `周末` 时，默认展开最近一次复查记录
- 切换 `安安` 时，默认只展开她的唯一记录
- 点击 `第 1 次初诊` 后，原先展开的 `第 2 次复查` 自动收起
- 切到 `新增成员` 对应的 0 次记录状态时，底部 `去预约` 仍然存在

- [ ] **步骤 5：Commit**

```bash
git add src/pages/miniprogram/components/RecordsModule.tsx src/pages/miniprogram/index.tsx
git commit -m "feat: finalize multi-profile records module"
```

提交前如果 `src/pages/miniprogram/index.tsx` 无改动，按实际改动文件调整 `git add`。
