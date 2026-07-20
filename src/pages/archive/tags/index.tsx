import { useEffect } from 'react'
import { TagManagementContent } from '@/modules/archive'
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
    <div className="archive-extract-root p-6">
      <TagManagementContent />
    </div>
  )
}
