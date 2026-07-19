# 档案管理与个人档案详情提取包

这个目录是从当前项目中抽离出来的 `主体组件包`，已经去掉现有项目的 `layout` 和页面级路由耦合，适合放进另一个已有路由和布局的 React 项目中直接接入。

## 目录说明

- `pages/archive-list/ArchiveListContent.tsx`
  - 档案管理列表主体内容
- `pages/archive-detail/ArchiveDetailContent.tsx`
  - 个人档案详情主体内容
- `shared/mock/archiveMockData.ts`
  - 两页所需的类型定义和 mock 数据
- `shared/store/patientArchiveStore.ts`
  - 本地 `localStorage` 读写、合并、删除逻辑
- `shared/components/ArchiveSelect.tsx`
  - 列表页筛选下拉组件
- `shared/components/ArchiveCommon.tsx`
  - 男女图标、档案标签渲染
- `shared/types.ts`
  - 统一类型导出
- `styles/archive-extract.css`
  - 提取包需要的 Tailwind 主题变量、Antd reset、补充动画与阴影
- `examples/ArchiveListRouteExample.tsx`
  - 档案管理页路由包裹示例
- `examples/ArchiveDetailRouteExample.tsx`
  - 个人档案详情页路由包裹示例
- `index.ts`
  - 对外导出入口

## 两个页面分别需要哪些文件

### 档案管理页

- `pages/archive-list/ArchiveListContent.tsx`
- `shared/mock/archiveMockData.ts`
- `shared/store/patientArchiveStore.ts`
- `shared/components/ArchiveSelect.tsx`
- `shared/components/ArchiveCommon.tsx`
- `shared/types.ts`
- `styles/archive-extract.css`

### 个人档案详情页

- `pages/archive-detail/ArchiveDetailContent.tsx`
- `shared/mock/archiveMockData.ts`
- `shared/store/patientArchiveStore.ts`
- `shared/components/ArchiveCommon.tsx`
- `shared/types.ts`
- `styles/archive-extract.css`

## 已保留的逻辑

- 档案列表搜索、筛选、分页
- 列表本地删除逻辑
- 档案详情 Tab 切换
- 档案详情本地 mock 编辑
- 就诊/回访/训练等 mock 数据展示
- 基于 `localStorage` 的本地患者合并能力

## 已解耦的部分

- 不再依赖原项目 `MainLayout`
- 不再直接依赖当前项目路由表
- 跳转改为外部回调传入：
  - `ArchiveListContent`
    - `onOpenDetail`
    - `onCreateArchive`
    - `onExport`
  - `ArchiveDetailContent`
    - `patientId`
    - `onBack`
    - `onCreateArchive`
    - `onCreateFollowup`

## 接入方式

1. 复制整个 `archive-extract` 目录到新项目。
2. 在新项目入口样式中引入 `styles/archive-extract.css`。
3. 确保新项目具备以下依赖：
   - `react`
   - `react-router`
   - `antd`
   - `dayjs`
   - `clsx`
   - `@phosphor-icons/react`
   - `tailwindcss`（建议 v4）
4. 参考 `examples` 目录，把新项目自己的路由和 layout 包到主体组件外层。

## 重要说明

- 该提取包仍使用 `bg-primary-500` 这一套 Tailwind 主题色命名，所以建议直接引入 `styles/archive-extract.css`。
- 当前 mock 持久化 key 为 `weiai.crm.patients`，如果你担心与新项目已有本地存储冲突，可以自行改 `shared/store/patientArchiveStore.ts` 中的 `STORAGE_KEY`。
- 详情页中“新增档案”“发起回访”现在只负责抛出回调，不再直接控制你新项目的路由。
