import { useEffect } from 'react'
import { ArchivePlaceholderPage } from '@/pages/archive/components/ArchivePlaceholderPage'
import { useHeaderStore } from '@/store/useHeaderStore'

export function ArchiveTagsPage() {
  const setTitle = useHeaderStore(state => state.setTitle)

  useEffect(() => {
    setTitle('档案标签管理', '这里将承接档案标签体系、分层规则和标签运营能力', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ])
  }, [setTitle])

  return (
    <ArchivePlaceholderPage
      title="标签管理"
      description="当前先保留菜单与页面骨架，后续可继续接入标签字典、患者标签分组、规则维护和标签命中统计。"
      actionLabel="标签管理"
    />
  )
}
