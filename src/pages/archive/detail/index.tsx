import { useEffect } from 'react'
import { message } from 'antd'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArchiveDetailContent } from '@/modules/archive'
import { useHeaderStore } from '@/store/useHeaderStore'

export function ArchiveDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const setTitle = useHeaderStore(state => state.setTitle)
  const patientId = String(params.patientId ?? '')

  useEffect(() => {
    setTitle('档案详情', '查看患者档案、就诊记录与预约回访信息', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ])
  }, [setTitle])

  if (!patientId) {
    return <Navigate to="/index/archive/list" replace />
  }

  return (
    <div className="archive-extract-root p-6">
      <ArchiveDetailContent
        patientId={patientId}
        onBack={() => navigate('/index/archive/list')}
        onCreateArchive={() => message.info('新增档案入口待后续业务页接入。')}
        onCreateFollowup={() => message.info('发起回访入口待后续业务页接入。')}
      />
    </div>
  )
}
