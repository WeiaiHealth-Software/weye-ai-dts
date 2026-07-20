# 档案详情验光检查数据卡片设计

**背景**

档案详情页当前在“主诉与病史”和“眼部检查”之间存在视觉留白，且就诊详情中的验光相关数据散落在“辅助检查”表格内，不便于快速查看。需求是在两者之间新增一个独立的“验光检查数据”卡片，样式 1:1 贴近参考图，所有 Mock 用户同步具备该数据。

**目标**

- 在 `ArchiveDetailContent.tsx` 中新增只读卡片，插入到“主诉与病史”和“眼部检查”之间
- 卡片头部左侧显示 `验光检查数据（日期）`，右侧显示 `验光师：姓名`
- 卡片主体为左右双栏，分别展示右眼 `OD` 和左眼 `OS`
- 每栏固定展示 4 项：眼轴长度、球镜、柱镜、角膜曲率 `K1/K2`
- 编辑模式下仍保持只读，不引入新的表单控件
- `visitDetailRecords` 中所有 Mock 就诊详情均补齐对应数据

**设计方案**

1. 数据结构扩展

在 `VisitDetailRecord` 中新增 `optometryExam` 字段，结构如下：

```ts
type VisitOptometryMetric = {
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
};

type VisitOptometryEye = {
  axialLength: VisitOptometryMetric;
  sphere: VisitOptometryMetric;
  cylinder: VisitOptometryMetric;
  keratometry: string;
};

type VisitOptometryExam = {
  date: string;
  optometrist: string;
  right: VisitOptometryEye;
  left: VisitOptometryEye;
};
```

说明：

- `value` 承接主数值展示
- `delta` 用于展示参考图中的变化值，例如 `↑0.22`
- `trend` 控制增量的颜色，当前主要使用 `up`
- `keratometry` 直接用单行字符串承载 `K1/K2`

2. 视图结构

卡片整体沿用详情页现有大卡片圆角与边框体系，内部做成两列子卡：

- 外层卡片：浅灰背景头部 + 白底内容区，保持与页面既有卡片风格一致
- 左右子卡：分别使用浅绿和浅紫描边与标题点缀，贴近参考图
- 行布局：左侧标签、右侧数值右对齐；若存在增量则在主值后展示彩色增量

3. 编辑态策略

该卡片在查看态和编辑态均使用同一只读展示组件，不参与 `visitDraft` 的编辑交互，不新增保存逻辑。这样可以保证：

- 不影响现有“编辑内容”功能
- 不需要新增输入、校验和本地保存行为
- 满足用户“只做 1:1 展示还原”的边界

**影响文件**

- 修改 `src/modules/archive/shared/mock/archiveMockData.ts`
- 修改 `src/modules/archive/pages/archive-detail/ArchiveDetailContent.tsx`

**不做事项**

- 不重构既有“辅助检查”表格
- 不把验光数据从辅助检查中删除
- 不新增接口联调或持久化逻辑
- 不新增自动化测试，优先用类型检查和页面诊断做本次验证
