import { useEffect } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ArchiveListContent } from '@/modules/archive'
import { useHeaderStore } from '@/store/useHeaderStore'

export function ArchiveListPage() {
  const navigate = useNavigate()
  const setTitle = useHeaderStore(state => state.setTitle)

  useEffect(() => {
    setTitle('档案管理', '统一管理患者档案、标签与后续动作入口', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ])
  }, [setTitle])

  return (
    <div className="archive-extract-root p-6">
      <ArchiveListContent
        onOpenDetail={(patientId) => navigate(`/index/archive/${patientId}`)}
        onCreateArchive={() => message.info('当前仅接入档案列表与详情主链路，新增档案入口待后续业务页接入。')}
        onExport={() => message.info('导出能力待后续对接真实接口或文件导出逻辑。')}
      />
    </div>
  )
}
