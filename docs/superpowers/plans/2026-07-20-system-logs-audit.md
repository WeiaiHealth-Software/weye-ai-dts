# 日志管理页审计追责改造实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将 `日志管理` 页面改造成以全页表格为主、支持医疗审计 mock 数据展示，并通过操作列打开右侧 `Drawer` 查看完整事件详情的后台页面。

**架构：** 保留 `src/pages/system/logs/index.tsx` 作为页面入口，将审计日志类型、筛选枚举和 mock 数据抽离到 `src/pages/system/logs/mock.ts`，避免页面文件继续膨胀。页面本身负责筛选、表格渲染和选中态管理，详情层复用已有 `Drawer` 组件承载事件摘要、操作主体、操作对象、字段变更和访问上下文等区块。

**技术栈：** React 19、TypeScript、Vite、Tailwind CSS、`lucide-react`、现有 `Drawer` 组件

---

## 文件结构

- 修改：`/Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/src/pages/system/logs/index.tsx`
  - 负责筛选状态、表格渲染、风险/结果样式、`Drawer` 打开关闭和详情内容编排
- 创建：`/Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/src/pages/system/logs/mock.ts`
  - 存放日志类型定义、风险等级类型、字段变更类型、筛选枚举与医疗审计 mock 数据
- 参考：`/Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/src/components/overlay/Drawer.tsx`
  - 复用抽屉，不修改公共组件
- 参考：`/Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/docs/superpowers/specs/2026-07-20-system-logs-audit-design.md`
  - 与规格逐项对照，确保表格字段和 `Drawer` 分区一致

### 任务 1：抽离日志模型与医疗审计 mock 数据

**文件：**
- 创建：`/Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/src/pages/system/logs/mock.ts`
- 修改：`/Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/src/pages/system/logs/index.tsx`

- [ ] **步骤 1：创建日志领域类型和枚举**

```ts
export type LogType = '系统日志' | '数据操作日志' | '登录审计'
export type LogResult = '成功' | '失败'
export type RiskLevel = '低风险' | '中风险' | '高风险'
export type LogAction = '新增' | '编辑' | '删除' | '查看' | '导出' | '登录' | '重置密码'

export type FieldChange = {
  field: string
  before: string
  after: string
}

export type AuditLog = {
  id: number
  time: string
  type: LogType
  module: string
  operator: string
  operatorName: string
  operatorRole: string
  center: string
  objectType: string
  objectId: string
  objectName: string
  patientName?: string
  action: LogAction
  summary: string
  ip: string
  terminal: string
  result: LogResult
  riskLevel: RiskLevel
  requestPath: string
  requestMethod: string
  sourcePage: string
  traceId: string
  errorCode?: string
  errorMessage?: string
  detail: string
  fieldChanges?: FieldChange[]
}
```

- [ ] **步骤 2：补充页面要复用的常量**

```ts
export const TYPE_OPTIONS: LogType[] = ['系统日志', '数据操作日志', '登录审计']

export const RISK_OPTIONS: RiskLevel[] = ['低风险', '中风险', '高风险']

export const TYPE_BADGE_CLASS: Record<LogType, string> = {
  系统日志: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  数据操作日志: 'bg-sky-50 text-sky-700 border-sky-100',
  登录审计: 'bg-amber-50 text-amber-700 border-amber-100'
}
```

- [ ] **步骤 3：写入医疗审计 mock 数据**

```ts
export const AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    time: '2026-07-20 08:12:45',
    type: '登录审计',
    module: '认证授权',
    operator: 'zhangmin_admin',
    operatorName: '张敏',
    operatorRole: '中心管理员',
    center: '上海爱尔眼科视光中心',
    objectType: '后台账号',
    objectId: 'USR-0018',
    objectName: 'zhangmin_admin',
    action: '登录',
    summary: '管理员账号登录后台成功',
    ip: '10.12.3.45',
    terminal: 'Chrome 136 / macOS',
    result: '成功',
    riskLevel: '低风险',
    requestPath: '/api/auth/login',
    requestMethod: 'POST',
    sourcePage: '/login',
    traceId: 'trace-auth-20260720-001',
    detail: '账号密码校验通过，完成后台登录'
  },
  {
    id: 2,
    time: '2026-07-20 09:26:13',
    type: '数据操作日志',
    module: '档案管理',
    operator: 'zhangmin_admin',
    operatorName: '张敏',
    operatorRole: '中心管理员',
    center: '上海爱尔眼科视光中心',
    objectType: '患者档案',
    objectId: 'PA-202607-0238',
    objectName: '患者档案 P000238',
    patientName: '李嘉宁',
    action: '编辑',
    summary: '修改患者联系方式、随访标签',
    ip: '10.12.3.45',
    terminal: 'Chrome 136 / macOS',
    result: '成功',
    riskLevel: '中风险',
    requestPath: '/api/archives/PA-202607-0238',
    requestMethod: 'PUT',
    sourcePage: '/index/archive/list',
    traceId: 'trace-archive-20260720-014',
    detail: '更新患者联系电话与随访状态标签',
    fieldChanges: [
      { field: '联系电话', before: '13800138000', after: '13900139000' },
      { field: '随访标签', before: '三个月复查', after: '重点随访' }
    ]
  },
  {
    id: 3,
    time: '2026-07-20 10:03:51',
    type: '数据操作日志',
    module: '预约管理',
    operator: 'chenhao_crc',
    operatorName: '陈昊',
    operatorRole: 'CRC',
    center: '上海爱尔眼科视光中心',
    objectType: '预约记录',
    objectId: 'AP-20260720-118',
    objectName: '近视防控复查预约',
    patientName: '王子轩',
    action: '删除',
    summary: '删除预约记录 1 条',
    ip: '10.12.4.19',
    terminal: 'Edge 136 / Windows',
    result: '成功',
    riskLevel: '高风险',
    requestPath: '/api/appointments/AP-20260720-118',
    requestMethod: 'DELETE',
    sourcePage: '/index/archive/appointments',
    traceId: 'trace-appointment-20260720-031',
    detail: '人工删除重复预约记录',
    fieldChanges: []
  }
]
```

- [ ] **步骤 4：在页面中改为导入 mock 数据而不是内联数组**

```ts
import { AUDIT_LOGS, TYPE_BADGE_CLASS, TYPE_OPTIONS, type AuditLog } from './mock'

const [rows] = useState<AuditLog[]>(AUDIT_LOGS)
```

- [ ] **步骤 5：运行定向静态检查**

运行：`npx eslint src/pages/system/logs/index.tsx src/pages/system/logs/mock.ts`
预期：输出为空或只返回 0 个 error

- [ ] **步骤 6：Commit**

```bash
git add src/pages/system/logs/index.tsx src/pages/system/logs/mock.ts
git commit -m "feat: extract audit log mock data"
```

### 任务 2：重构主表字段与筛选逻辑

**文件：**
- 修改：`/Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/src/pages/system/logs/index.tsx`

- [ ] **步骤 1：扩展筛选匹配逻辑**

```ts
const keyword = keywordFilter.trim()
const keywordMatchTarget = [r.summary, r.objectName, r.objectId, r.ip, r.patientName ?? ''].join(' ')

if (keyword && !keywordMatchTarget.includes(keyword)) return false
```

- [ ] **步骤 2：把表格列改成审计摘要结构**

```tsx
<th className="px-4 py-4 font-semibold">时间</th>
<th className="px-4 py-4 font-semibold">类型</th>
<th className="px-4 py-4 font-semibold">模块</th>
<th className="px-4 py-4 font-semibold">操作人</th>
<th className="px-4 py-4 font-semibold">操作对象</th>
<th className="px-4 py-4 font-semibold">动作</th>
<th className="px-4 py-4 font-semibold">改动摘要</th>
<th className="px-4 py-4 font-semibold">IP / 终端</th>
<th className="px-4 py-4 font-semibold">结果</th>
<th className="px-4 py-4 font-semibold">风险等级</th>
<th className="px-4 py-4 font-semibold text-right">操作</th>
```

- [ ] **步骤 3：按风险和结果调整表格行样式**

```tsx
const rowClassName =
  r.riskLevel === '高风险'
    ? 'bg-red-50/50 hover:bg-red-50'
    : r.result === '失败'
      ? 'bg-rose-50/40 hover:bg-rose-50'
      : 'hover:bg-slate-50/80'
```

```tsx
<tr key={r.id} className={`${rowClassName} transition-colors`}>
```

- [ ] **步骤 4：为结果和风险等级补齐标签样式**

```tsx
const riskBadgeClass =
  r.riskLevel === '高风险'
    ? 'bg-red-50 text-red-600 border-red-100'
    : r.riskLevel === '中风险'
      ? 'bg-amber-50 text-amber-700 border-amber-100'
      : 'bg-emerald-50 text-emerald-600 border-emerald-100'
```

```tsx
<span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${riskBadgeClass}`}>
  {r.riskLevel}
</span>
```

- [ ] **步骤 5：在操作列加入查看详情按钮**

```tsx
<button
  type="button"
  onClick={() => handleOpenDetail(r)}
  className="text-sm font-medium text-brand-600 hover:text-brand-700"
>
  查看详情
</button>
```

- [ ] **步骤 6：调整空状态列数**

```tsx
<td colSpan={11} className="px-6 py-12 text-center text-slate-400">
  没有找到符合条件的日志
</td>
```

- [ ] **步骤 7：运行页面 lint 校验**

运行：`npx eslint src/pages/system/logs/index.tsx`
预期：无 error，未使用变量为 0

- [ ] **步骤 8：Commit**

```bash
git add src/pages/system/logs/index.tsx
git commit -m "feat: upgrade audit log table layout"
```

### 任务 3：接入右侧 Drawer 并展示完整审计详情

**文件：**
- 修改：`/Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/src/pages/system/logs/index.tsx`
- 参考：`/Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/src/components/overlay/Drawer.tsx`

- [ ] **步骤 1：新增选中态和抽屉开关**

```ts
const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

const handleOpenDetail = (row: AuditLog) => setSelectedLog(row)
const handleCloseDetail = () => setSelectedLog(null)
```

- [ ] **步骤 2：引入 Drawer 组件**

```ts
import Drawer from '@/components/overlay/Drawer'
```

- [ ] **步骤 3：在页面底部挂载 Drawer**

```tsx
<Drawer
  open={Boolean(selectedLog)}
  onClose={handleCloseDetail}
  title={selectedLog ? `${selectedLog.objectName} · 审计详情` : '审计详情'}
  subtitle={selectedLog ? `${selectedLog.time} · ${selectedLog.operatorName} / ${selectedLog.operator}` : undefined}
  width={760}
>
  {selectedLog && <AuditLogDetailContent log={selectedLog} />}
</Drawer>
```

- [ ] **步骤 4：在同文件内补充详情渲染函数**

```tsx
function AuditLogDetailContent({ log }: { log: AuditLog }) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800">事件摘要</h3>
      </section>
      <section className="rounded-2xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800">操作主体</h3>
      </section>
      <section className="rounded-2xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800">操作对象</h3>
      </section>
      <section className="rounded-2xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800">变更详情</h3>
      </section>
      <section className="rounded-2xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800">访问上下文</h3>
      </section>
    </div>
  )
}
```

- [ ] **步骤 5：将字段对比渲染为双列网格**

```tsx
{log.fieldChanges && log.fieldChanges.length > 0 ? (
  <div className="overflow-hidden rounded-xl border border-slate-200">
    {log.fieldChanges.map(change => (
      <div key={change.field} className="grid grid-cols-[140px_1fr_1fr] border-b border-slate-100 last:border-b-0">
        <div className="bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">{change.field}</div>
        <div className="px-4 py-3 text-sm text-slate-500">{change.before || '-'}</div>
        <div className="px-4 py-3 text-sm text-slate-700">{change.after || '-'}</div>
      </div>
    ))}
  </div>
) : (
  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">无字段变更信息</div>
)}
```

- [ ] **步骤 6：只在失败日志中显示失败信息块**

```tsx
{(log.errorCode || log.errorMessage) && (
  <section className="rounded-2xl border border-red-100 bg-red-50/60 p-4">
    <h3 className="text-sm font-semibold text-red-700">失败信息</h3>
    <div className="mt-3 text-sm text-red-600">{log.errorMessage ?? '未知错误'}</div>
  </section>
)}
```

- [ ] **步骤 7：运行 lint 和类型构建**

运行：`npx eslint src/pages/system/logs/index.tsx src/pages/system/logs/mock.ts && npm run build`
预期：`vite build` 成功结束，终端输出包含 `built in`

- [ ] **步骤 8：Commit**

```bash
git add src/pages/system/logs/index.tsx src/pages/system/logs/mock.ts
git commit -m "feat: add audit log detail drawer"
```

### 任务 4：收尾检查与人工验收

**文件：**
- 修改：`/Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/src/pages/system/logs/index.tsx`
- 修改：`/Users/luffyzh/luffyzh/github/weiai-healthcare/weye-ai-dts/src/pages/system/logs/mock.ts`

- [ ] **步骤 1：检查筛选默认日期与重置行为**

```ts
const resetFilters = () => {
  setTypeFilter('')
  setModuleFilter('')
  setOperatorFilter('')
  setKeywordFilter('')
  setStartDate('')
  setEndDate('')
}
```

确认是否保留“清空为不限制日期”的行为；如果希望重置后回到近 7 天，则改为：

```ts
const resetFilters = () => {
  setTypeFilter('')
  setModuleFilter('')
  setOperatorFilter('')
  setKeywordFilter('')
  setStartDate(defaultStartDate)
  setEndDate(defaultEndDate)
}
```

- [ ] **步骤 2：使用诊断工具检查最近编辑文件**

运行：在 IDE 中对以下文件执行诊断检查
- `src/pages/system/logs/index.tsx`
- `src/pages/system/logs/mock.ts`

预期：无 TypeScript 或 ESLint 诊断错误

- [ ] **步骤 3：人工核验 5 个交互场景**

运行：`npm run dev`
预期：本地页面能打开 `http://localhost:5173` 或 Vite 输出的可访问地址

人工检查：
- 点击不同日志行的 `查看详情`，抽屉标题、副标题和内容与当前行一致
- 高风险日志行明显区别于普通日志
- 失败日志抽屉会显示失败信息块
- 无字段变更的日志显示“无字段变更信息”
- 关键字输入患者姓名、对象 ID、IP 时均能筛出目标日志

- [ ] **步骤 4：最终 Commit**

```bash
git add src/pages/system/logs/index.tsx src/pages/system/logs/mock.ts
git commit -m "feat: polish medical audit logs page"
```

## 自检结果

- 规格覆盖度：已覆盖主表字段、`Drawer` 详情区块、医疗审计 mock 数据、失败态、高风险态、筛选增强与验证方式
- 占位符扫描：计划中未使用 “TODO / 后续实现 / 类似任务” 等占位描述
- 类型一致性：统一使用 `AuditLog`、`FieldChange`、`RiskLevel`，`Drawer` 详情渲染始终基于 `selectedLog`
