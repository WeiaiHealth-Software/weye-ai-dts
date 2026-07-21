# 小程序问诊页免费预约 Agent 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在小程序 `问诊` 页为 `免费预约` 增加原地浮出的 Agent 式挂号交互，完成“确认医生 -> 选择未来一周号源 -> 成功反馈”的 Mock 闭环。

**架构：** 继续沿用当前单文件原型方式，在 `ConsultModule.tsx` 内新增轻量 Mock 数据、预约状态机和悬浮卡片 UI，不接入全局 store、路由或真实接口。交互入口仍放在底部快捷胶囊区，浮层卡片挂在输入区上方，通过本地 `useState` 控制显示步骤、选中号源和成功反馈。

**技术栈：** React、TypeScript、Tailwind CSS、Lucide React、Vite

---

## 文件结构

- 修改：`src/pages/miniprogram/components/ConsultModule.tsx`
  - 增加预约 Agent Mock 数据、状态、事件处理函数
  - 渲染确认卡片、号源卡片、成功反馈和按钮状态
- 验证：`src/pages/miniprogram/components/ConsultModule.tsx`
  - 使用 VS Code Diagnostics 检查 TS / JSX 报错
  - 使用 `npm run build` 验证原型构建通过

### 任务 1：在问诊模块中定义预约 Agent 的本地状态与 Mock 数据

**文件：**
- 修改：`src/pages/miniprogram/components/ConsultModule.tsx`

- [ ] **步骤 1：补充 React 状态依赖并定义预约 Agent 类型**

```tsx
import { useState } from 'react';
import { ArrowUp, ClipboardList, Clock, FileText, Hash, Mic } from 'lucide-react';

type BookingAgentDoctor = {
  id: string;
  name: string;
  hospital: string;
  title: string;
};

type BookingAgentSlot = {
  id: string;
  label: string;
  date: string;
  time: string;
};

type BookingAgentStep = 'idle' | 'confirm' | 'slots' | 'done';
```

- [ ] **步骤 2：在文件顶部声明固定医生与未来一周号源 Mock**

```tsx
const LAST_VISITED_DOCTOR: BookingAgentDoctor = {
  id: 'xu-wei',
  name: '徐蔚',
  hospital: '上海眼病防治中心',
  title: '主任',
};

const BOOKING_SLOTS: BookingAgentSlot[] = [
  { id: 'tue-am', label: '周二 07/22 09:30', date: '07/22', time: '09:30' },
  { id: 'thu-pm', label: '周四 07/24 14:00', date: '07/24', time: '14:00' },
  { id: 'sat-am', label: '周六 07/26 10:00', date: '07/26', time: '10:00' },
];
```

- [ ] **步骤 3：在 `ConsultModule` 内增加预约状态和交互函数**

```tsx
const [bookingAgentStep, setBookingAgentStep] = useState<BookingAgentStep>('idle');
const [selectedBookingSlotId, setSelectedBookingSlotId] = useState<string | null>(null);
const [bookingPageHintVisible, setBookingPageHintVisible] = useState(false);

const selectedSlot = BOOKING_SLOTS.find((slot) => slot.id === selectedBookingSlotId) ?? null;

function handleOpenBookingAgent() {
  setBookingAgentStep('confirm');
  setSelectedBookingSlotId(null);
  setBookingPageHintVisible(false);
}

function handleOpenBookingPage() {
  setBookingPageHintVisible(true);
  setBookingAgentStep('confirm');
}

function handleDirectBooking() {
  setBookingPageHintVisible(false);
  setBookingAgentStep('slots');
}

function handleSelectBookingSlot(slotId: string) {
  setSelectedBookingSlotId(slotId);
  setBookingPageHintVisible(false);
  setBookingAgentStep('done');
}
```

- [ ] **步骤 4：运行构建前静态检查，确认新增状态命名无冲突**

运行：人工检查 `ConsultModule.tsx`
预期：不存在与 `inputText`、`onInputChange`、`QUICK_QUESTIONS` 冲突的重复标识符

### 任务 2：在底部输入区上方渲染第一张确认卡片

**文件：**
- 修改：`src/pages/miniprogram/components/ConsultModule.tsx`

- [ ] **步骤 1：给最外层容器增加足够底部留白，为浮层卡片预留空间**

```tsx
return (
  <div className="relative flex h-full flex-col pb-44">
```

- [ ] **步骤 2：把 `免费预约` 按钮接入 Agent 打开事件**

```tsx
<button
  type="button"
  onClick={handleOpenBookingAgent}
  className="flex flex-shrink-0 items-center space-x-1 rounded-full bg-blue-50 px-4 py-2"
>
  <Clock size={16} className="text-blue-500" />
  <span className="text-sm font-medium text-blue-700">免费预约</span>
</button>
```

- [ ] **步骤 3：在底部输入区上方插入第一张确认卡片**

```tsx
{bookingAgentStep !== 'idle' && (
  <div className="absolute bottom-28 left-4 right-4 z-30">
    <div className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 shadow-[0_18px_40px_rgba(59,130,246,0.18)] backdrop-blur-sm">
      <div className="text-xs font-semibold tracking-[0.18em] text-blue-500">EYE宝</div>
      <div className="mt-2 text-sm leading-6 text-gray-700">
        您上次看的是{LAST_VISITED_DOCTOR.hospital}{LAST_VISITED_DOCTOR.name}{LAST_VISITED_DOCTOR.title}，是否直接帮您挂号？
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={handleOpenBookingPage} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600">
          去预约页面挂号
        </button>
        <button type="button" onClick={handleDirectBooking} className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm">
          直接挂号
        </button>
      </div>
    </div>
  </div>
)}
```

- [ ] **步骤 4：为“去预约页面挂号”补一个轻量占位反馈**

```tsx
{bookingPageHintVisible && (
  <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-700">
    预约页入口待接入，当前先为您保留 Agent 直挂流程。
  </div>
)}
```

### 任务 3：追加第二张号源卡片与完成态反馈，形成一问一答闭环

**文件：**
- 修改：`src/pages/miniprogram/components/ConsultModule.tsx`

- [ ] **步骤 1：在第一张卡片下方渲染第二张号源卡片，仅在 `slots` / `done` 显示**

```tsx
{(bookingAgentStep === 'slots' || bookingAgentStep === 'done') && (
  <div className="mt-3 rounded-[24px] border border-white/80 bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
    <div className="text-xs font-semibold tracking-[0.18em] text-blue-500">EYE宝</div>
    <div className="mt-2 text-sm leading-6 text-gray-700">
      徐主任未来一周这几天有号，帮您筛好了。
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      {BOOKING_SLOTS.map((slot) => (
        <button
          key={slot.id}
          type="button"
          onClick={() => handleSelectBookingSlot(slot.id)}
          className={
            selectedBookingSlotId === slot.id
              ? 'rounded-full bg-blue-500 px-3 py-2 text-xs font-semibold text-white shadow-sm'
              : 'rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700'
          }
        >
          {slot.label}
        </button>
      ))}
    </div>
  </div>
)}
```

- [ ] **步骤 2：在 `done` 态下追加成功反馈文案和查看预约按钮**

```tsx
{bookingAgentStep === 'done' && selectedSlot && (
  <div className="mt-3 rounded-[20px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
    <div>已为您锁定徐蔚主任 {selectedSlot.label} 的号源。</div>
    <button type="button" className="mt-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700">
      查看预约
    </button>
  </div>
)}
```

- [ ] **步骤 3：确认重复点击 `免费预约` 会重置步骤和选中号源**

```tsx
function handleOpenBookingAgent() {
  setBookingAgentStep('confirm');
  setSelectedBookingSlotId(null);
  setBookingPageHintVisible(false);
}
```

- [ ] **步骤 4：压测视觉层级，确保卡片、胶囊和输入区不互相遮挡**

运行：本地人工预览 `问诊` 页
预期：
- 第一张卡片位于输入区上方
- 第二张卡片追加后不压住输入框
- 成功反馈出现后底部区域仍保持可读

### 任务 4：整理样式细节并完成验证

**文件：**
- 修改：`src/pages/miniprogram/components/ConsultModule.tsx`

- [ ] **步骤 1：检查按钮与卡片是否补充 `type=\"button\"`，避免隐式提交行为**

```tsx
<button type="button" ...>免费预约</button>
<button type="button" ...>去预约页面挂号</button>
<button type="button" ...>直接挂号</button>
<button type="button" ...>{slot.label}</button>
```

- [ ] **步骤 2：运行构建验证**

运行：`npm run build`
预期：PASS，Vite 构建成功，无新增 TypeScript 编译错误

- [ ] **步骤 3：检查文件诊断**

检查：`file:///Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/src/pages/miniprogram/components/ConsultModule.tsx`
预期：无新增 TypeScript / JSX 诊断错误

- [ ] **步骤 4：Commit**

```bash
git add src/pages/miniprogram/components/ConsultModule.tsx
git commit -m "feat: add miniprogram booking agent flow"
```

## 自检结论

- 规格覆盖度：已覆盖入口位置、A 叠层卡片方案、两步主路径、成功反馈、重复打开重置逻辑、Mock 数据边界与验证方式
- 占位符扫描：计划中的占位反馈已明确写为“预约页入口待接入”，没有使用“TODO / 后续实现”等模糊描述
- 类型一致性：`BookingAgentDoctor`、`BookingAgentSlot`、`BookingAgentStep`、`selectedBookingSlotId`、`bookingAgentStep` 命名在全部任务中保持一致
