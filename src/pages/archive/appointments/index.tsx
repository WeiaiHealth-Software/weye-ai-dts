import { useEffect } from 'react'
import { message } from 'antd'
import { BookingContent } from '@/modules/archive'
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
    <div className="archive-extract-root p-6">
      <BookingContent
        onCalendarView={() => message.info('日历视图待后续接入排班看板或月历页面。')}
        onExport={() => message.info('导出能力待后续对接真实接口或文件导出逻辑。')}
        onCreateBooking={() => message.info('新增预约入口待后续接入预约创建流程。')}
        onReschedule={() => message.info('改期能力待后续接入预约编辑流程。')}
        onCancelBooking={() => message.info('取消预约能力待后续接入真实业务逻辑。')}
        onCheckIn={() => message.info('到诊录入能力待后续接入到诊登记流程。')}
      />
    </div>
  )
}
