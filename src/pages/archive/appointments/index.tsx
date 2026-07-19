import { useEffect } from 'react'
import { ArchivePlaceholderPage } from '@/pages/archive/components/ArchivePlaceholderPage'
import { useHeaderStore } from '@/store/useHeaderStore'

export function ArchiveAppointmentPage() {
  const setTitle = useHeaderStore(state => state.setTitle)

  useEffect(() => {
    setTitle('档案预约管理', '这里将承接档案相关的预约排期、到访安排和提醒能力', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ])
  }, [setTitle])

  return (
    <ArchivePlaceholderPage
      title="预约管理"
      description="当前先完成档案管理模块的菜单和路由占位，这里后续适合接入预约记录表格、状态筛选、到访提醒和批量跟进动作。"
      actionLabel="预约管理"
    />
  )
}
