export type LogType = '系统日志' | '数据操作日志' | '登录审计';
export type LogResult = '成功' | '失败';
export type RiskLevel = '低风险' | '中风险' | '高风险';
export type LogAction = '新增' | '编辑' | '删除' | '查看' | '导出' | '登录' | '重置密码';

export type FieldChange = {
  field: string;
  before: string;
  after: string;
};

export type AuditLog = {
  id: number;
  time: string;
  type: LogType;
  module: string;
  operator: string;
  operatorName: string;
  operatorRole: string;
  center: string;
  objectType: string;
  objectId: string;
  objectName: string;
  patientName?: string;
  archiveNo?: string;
  action: LogAction;
  summary: string;
  detail: string;
  ip: string;
  terminal: string;
  result: LogResult;
  riskLevel: RiskLevel;
  requestPath: string;
  requestMethod: string;
  sourcePage: string;
  traceId: string;
  errorCode?: string;
  errorMessage?: string;
  fieldChanges?: FieldChange[];
};

export const TYPE_OPTIONS: LogType[] = ['系统日志', '数据操作日志', '登录审计'];

export const TYPE_BADGE_CLASS: Record<LogType, string> = {
  系统日志: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  数据操作日志: 'bg-sky-50 text-sky-700 border-sky-100',
  登录审计: 'bg-amber-50 text-amber-700 border-amber-100'
};

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
    detail: '账号密码校验通过，完成后台登录。',
    ip: '10.12.3.45',
    terminal: 'Chrome 136 / macOS',
    result: '成功',
    riskLevel: '低风险',
    requestPath: '/api/auth/login',
    requestMethod: 'POST',
    sourcePage: '/login',
    traceId: 'trace-auth-20260720-001'
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
    archiveNo: 'P000238',
    action: '编辑',
    summary: '修改患者联系方式、随访标签',
    detail: '更新患者联系电话与随访状态标签，便于后续重点跟踪。',
    ip: '10.12.3.45',
    terminal: 'Chrome 136 / macOS',
    result: '成功',
    riskLevel: '中风险',
    requestPath: '/api/archives/PA-202607-0238',
    requestMethod: 'PUT',
    sourcePage: '/index/archive/list',
    traceId: 'trace-archive-20260720-014',
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
    archiveNo: 'P000521',
    action: '删除',
    summary: '删除预约记录 1 条',
    detail: '因重复建档导致生成重复预约，已人工删除冗余记录。',
    ip: '10.12.4.19',
    terminal: 'Edge 136 / Windows',
    result: '成功',
    riskLevel: '高风险',
    requestPath: '/api/appointments/AP-20260720-118',
    requestMethod: 'DELETE',
    sourcePage: '/index/archive/appointments',
    traceId: 'trace-appointment-20260720-031',
    fieldChanges: []
  },
  {
    id: 4,
    time: '2026-07-20 10:24:09',
    type: '数据操作日志',
    module: '档案管理',
    operator: 'liuyan_doctor',
    operatorName: '刘妍',
    operatorRole: '医生',
    center: '上海爱尔眼科视光中心',
    objectType: '患者档案',
    objectId: 'PA-202607-0521',
    objectName: '患者档案 P000521',
    patientName: '王子轩',
    archiveNo: 'P000521',
    action: '查看',
    summary: '查看患者档案详情',
    detail: '进入患者档案详情页，查看近 6 个月随访与验光结果。',
    ip: '10.12.4.66',
    terminal: 'Safari 18 / iPadOS',
    result: '成功',
    riskLevel: '低风险',
    requestPath: '/api/archives/PA-202607-0521',
    requestMethod: 'GET',
    sourcePage: '/index/archive/list',
    traceId: 'trace-archive-20260720-044'
  },
  {
    id: 5,
    time: '2026-07-20 11:05:27',
    type: '数据操作日志',
    module: '档案管理',
    operator: 'zhangmin_admin',
    operatorName: '张敏',
    operatorRole: '中心管理员',
    center: '上海爱尔眼科视光中心',
    objectType: '患者列表',
    objectId: 'EXPORT-20260720-002',
    objectName: '患者档案批量导出',
    action: '导出',
    summary: '导出患者列表 28 条',
    detail: '按筛查标签导出患者列表，包含姓名、联系电话、复查时间等敏感信息。',
    ip: '10.12.3.45',
    terminal: 'Chrome 136 / macOS',
    result: '成功',
    riskLevel: '高风险',
    requestPath: '/api/archives/export',
    requestMethod: 'POST',
    sourcePage: '/index/archive/list',
    traceId: 'trace-export-20260720-008'
  },
  {
    id: 6,
    time: '2026-07-20 11:18:42',
    type: '登录审计',
    module: '认证授权',
    operator: 'unknown',
    operatorName: '未知用户',
    operatorRole: '未认证',
    center: '外部访问',
    objectType: '后台账号',
    objectId: 'USR-0047',
    objectName: 'sunny_test',
    action: '登录',
    summary: '账号登录失败，密码错误次数超限',
    detail: '连续 5 次密码错误触发风控，账号暂时锁定 30 分钟。',
    ip: '172.16.8.201',
    terminal: 'Chrome 136 / Windows',
    result: '失败',
    riskLevel: '高风险',
    requestPath: '/api/auth/login',
    requestMethod: 'POST',
    sourcePage: '/login',
    traceId: 'trace-auth-20260720-019',
    errorCode: 'AUTH-429',
    errorMessage: '密码错误次数超限，账号已被临时锁定。'
  },
  {
    id: 7,
    time: '2026-07-20 13:42:16',
    type: '数据操作日志',
    module: '用户管理',
    operator: 'wangwei_admin',
    operatorName: '王伟',
    operatorRole: '平台管理员',
    center: '集团运营中心',
    objectType: '后台账号',
    objectId: 'USR-0088',
    objectName: 'lijing_crc',
    action: '重置密码',
    summary: '重置账号密码并重新发送登录凭证',
    detail: '平台管理员为 CRC 账号重置密码，系统已通过短信下发临时密码。',
    ip: '10.20.1.8',
    terminal: 'Chrome 136 / macOS',
    result: '成功',
    riskLevel: '高风险',
    requestPath: '/api/users/USR-0088/reset-password',
    requestMethod: 'POST',
    sourcePage: '/index/users',
    traceId: 'trace-user-20260720-025'
  },
  {
    id: 8,
    time: '2026-07-20 14:08:54',
    type: '系统日志',
    module: '任务调度',
    operator: 'system',
    operatorName: '系统任务',
    operatorRole: 'system',
    center: '平台服务',
    objectType: '定时任务',
    objectId: 'JOB-night-archive',
    objectName: '夜间档案归档任务',
    action: '编辑',
    summary: '夜间归档任务执行失败',
    detail: '对象存储写入超时，导致夜间档案归档任务未完成。',
    ip: '127.0.0.1',
    terminal: 'Server / Linux',
    result: '失败',
    riskLevel: '中风险',
    requestPath: '/api/jobs/archive-nightly',
    requestMethod: 'POST',
    sourcePage: '/system/scheduler',
    traceId: 'trace-job-20260720-007',
    errorCode: 'OSS-504',
    errorMessage: '对象存储写入超时，请稍后重试。'
  }
];
