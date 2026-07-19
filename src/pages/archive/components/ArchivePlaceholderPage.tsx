import { FolderClock, Sparkles } from 'lucide-react'

type ArchivePlaceholderPageProps = {
  title: string
  description: string
  actionLabel: string
}

export function ArchivePlaceholderPage({ title, description, actionLabel }: ArchivePlaceholderPageProps) {
  return (
    <div className="min-h-full p-6 space-y-6">
      <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
        <h3 className="text-sm font-bold text-brand-700">{title}</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-brand-700/90">
          <li>当前阶段先完成菜单、路由和页面框架接入。</li>
          <li>后续可在这个页面继续补真实业务表格、筛选区和操作抽屉。</li>
          <li>档案列表与档案详情主链路已经独立接入，不受这里占位影响。</li>
        </ul>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <FolderClock className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
            </div>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              页面占位
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Sparkles className="h-4 w-4 text-brand-500" />
              下一步推荐
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              后续如果你把源项目中的 {actionLabel} 页面也抽出来，我可以继续按同样方式补齐到当前模块下，并保持与左侧菜单结构一致。
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">本次已完成的接入范围</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              新增左侧“档案管理”一级菜单
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              接入“档案列表”与“档案详情”核心页面
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              预留“预约管理”“标签管理”二级页面入口
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
