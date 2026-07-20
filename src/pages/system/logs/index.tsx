import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Drawer from '@/components/overlay/Drawer';
import { useHeaderStore } from '@/store/useHeaderStore';
import { AUDIT_LOGS, TYPE_BADGE_CLASS, TYPE_OPTIONS, type AuditLog, type RiskLevel } from './mock';

const pad2 = (n: number) => String(n).padStart(2, '0');
const formatDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const parseDateTime = (s: string) => new Date(s.replace(' ', 'T'));
const getDefaultDateRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);

  return {
    startDate: formatDate(start),
    endDate: formatDate(now)
  };
};
const getResultBadgeClass = (result: AuditLog['result']) =>
  result === '成功'
    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
    : 'bg-red-50 text-red-600 border-red-100';
const getRiskBadgeClass = (riskLevel: RiskLevel) =>
  riskLevel === '高风险'
    ? 'bg-red-50 text-red-600 border-red-100'
    : riskLevel === '中风险'
      ? 'bg-amber-50 text-amber-700 border-amber-100'
      : 'bg-emerald-50 text-emerald-600 border-emerald-100';
const getRowClassName = (row: AuditLog) =>
  row.riskLevel === '高风险'
    ? 'bg-red-50/50 hover:bg-red-50'
    : row.result === '失败'
      ? 'bg-rose-50/40 hover:bg-rose-50'
      : 'hover:bg-slate-50/80';

export const SystemLogs: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const defaultDateRange = useMemo(() => getDefaultDateRange(), []);
  const [typeFilter, setTypeFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [startDate, setStartDate] = useState(defaultDateRange.startDate);
  const [endDate, setEndDate] = useState(defaultDateRange.endDate);
  const [rows] = useState<AuditLog[]>(AUDIT_LOGS);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    setTitle('日志管理', '仅开发者账户可访问。查看系统日志、数据操作日志与登录审计日志，支持筛选检索', [
      { text: '开发者账户', color: 'indigo' }
    ]);
  }, [setTitle]);

  const filtered = useMemo(() => {
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`) : null;
    const keyword = keywordFilter.trim().toLowerCase();
    const moduleKey = moduleFilter.trim().toLowerCase();
    const operatorKey = operatorFilter.trim().toLowerCase();

    return rows.filter(r => {
      if (typeFilter && r.type !== typeFilter) return false;
      if (moduleKey && !`${r.module} ${r.objectType}`.toLowerCase().includes(moduleKey)) return false;
      if (operatorKey && !`${r.operator} ${r.operatorName}`.toLowerCase().includes(operatorKey)) return false;

      const keywordMatchTarget = [
        r.summary,
        r.objectName,
        r.objectId,
        r.patientName ?? '',
        r.archiveNo ?? '',
        r.operator,
        r.operatorName,
        r.ip,
        r.errorMessage ?? ''
      ]
        .join(' ')
        .toLowerCase();

      if (keyword && !keywordMatchTarget.includes(keyword)) return false;

      const t = parseDateTime(r.time);
      if (start && t < start) return false;
      if (end && t > end) return false;
      return true;
    });
  }, [rows, typeFilter, moduleFilter, operatorFilter, keywordFilter, startDate, endDate]);

  const resetFilters = () => {
    setTypeFilter('');
    setModuleFilter('');
    setOperatorFilter('');
    setKeywordFilter('');
    setStartDate('');
    setEndDate('');
  };

  const handleOpenDetail = (row: AuditLog) => setSelectedLog(row);
  const handleCloseDetail = () => setSelectedLog(null);

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-1">日志类型</label>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">全部</option>
                {TYPE_OPTIONS.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-1">模块</label>
              <input
                type="text"
                placeholder="如：档案管理"
                value={moduleFilter}
                onChange={e => setModuleFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-1">操作人</label>
              <input
                type="text"
                placeholder="账号/姓名"
                value={operatorFilter}
                onChange={e => setOperatorFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-1">关键字</label>
              <input
                type="text"
                placeholder="患者名/档案号/IP"
                value={keywordFilter}
                onChange={e => setKeywordFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">开始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">结束日期</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-slate-500">
              当前共 <span className="font-semibold text-slate-700">{filtered.length}</span> 条日志，重点追踪高风险、失败与患者档案相关操作
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
              >
                重置
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-xl bg-brand-600 text-sm font-bold text-white hover:bg-brand-700 shadow-sm flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> 筛选
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1180px] w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-4 font-semibold">时间</th>
                  <th className="px-4 py-4 font-semibold">类型</th>
                  <th className="px-4 py-4 font-semibold">模块</th>
                  <th className="px-4 py-4 font-semibold">操作人</th>
                  <th className="px-4 py-4 font-semibold">动作</th>
                  <th className="px-4 py-4 font-semibold">IP / 终端</th>
                  <th className="px-4 py-4 font-semibold">结果</th>
                  <th className="px-4 py-4 font-semibold">风险等级</th>
                  <th className="px-4 py-4 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map(r => {
                  const [datePart, timePart] = r.time.split(' ');

                  return (
                    <tr key={r.id} className={`${getRowClassName(r)} transition-colors`}>
                      <td className="px-4 py-4 text-slate-500">
                        <div className="font-mono text-sm">{datePart}</div>
                        <div className="font-mono text-xs text-slate-400 mt-1">{timePart}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${TYPE_BADGE_CLASS[r.type]}`}
                        >
                          {r.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-700 whitespace-nowrap">{r.module}</td>
                      <td className="px-4 py-4 text-slate-700">
                        <div className="font-semibold text-slate-800 whitespace-nowrap">{r.operatorName}</div>
                        <div className="text-xs text-slate-500 mt-1 whitespace-nowrap">
                          {r.operator} · {r.operatorRole}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-700 whitespace-nowrap">{r.action}</td>
                      <td className="px-4 py-4 text-slate-500 min-w-[180px]">
                        <div className="font-mono text-sm whitespace-nowrap">{r.ip}</div>
                        <div className="text-xs text-slate-400 mt-1 whitespace-nowrap">{r.terminal}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getResultBadgeClass(r.result)}`}
                        >
                          {r.result}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getRiskBadgeClass(r.riskLevel)}`}
                        >
                          {r.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(r)}
                          className="text-sm font-medium text-brand-600 hover:text-brand-700"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                      没有找到符合条件的日志
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Drawer
        open={Boolean(selectedLog)}
        onClose={handleCloseDetail}
        title={selectedLog ? `${selectedLog.objectName} · 审计详情` : '审计详情'}
        subtitle={selectedLog ? `${selectedLog.time} · ${selectedLog.operatorName} / ${selectedLog.operator}` : undefined}
        width={760}
        bodyClassName="p-6 bg-slate-50/60"
      >
        {selectedLog && <AuditLogDetailContent log={selectedLog} />}
      </Drawer>
    </>
  );
};

function AuditLogDetailContent({ log }: { log: AuditLog }) {
  return (
    <div className="space-y-5">
      <DetailSection title="事件摘要">
        <DetailGridItem label="日志编号" value={`LOG-${String(log.id).padStart(5, '0')}`} />
        <DetailGridItem label="日志类型" value={log.type} />
        <DetailGridItem label="所属模块" value={log.module} />
        <DetailGridItem label="操作结果" value={log.result} />
        <DetailGridItem label="风险等级" value={log.riskLevel} />
        <DetailGridItem label="事件说明" value={log.detail} />
      </DetailSection>

      <DetailSection title="操作主体">
        <DetailGridItem label="操作人账号" value={log.operator} />
        <DetailGridItem label="操作人姓名" value={log.operatorName} />
        <DetailGridItem label="角色" value={log.operatorRole} />
        <DetailGridItem label="所属中心" value={log.center} />
      </DetailSection>

      <DetailSection title="操作对象">
        <DetailGridItem label="对象类型" value={log.objectType} />
        <DetailGridItem label="对象标识" value={log.objectId} />
        <DetailGridItem label="对象名称" value={log.objectName} />
        <DetailGridItem label="患者姓名" value={log.patientName ?? '-'} />
        <DetailGridItem label="档案号" value={log.archiveNo ?? '-'} />
        <DetailGridItem label="动作" value={log.action} />
      </DetailSection>

      <DetailSection title="变更详情">
        {log.fieldChanges && log.fieldChanges.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-[140px_1fr_1fr] bg-slate-50 text-xs font-semibold text-slate-500">
              <div className="px-4 py-3">字段名</div>
              <div className="px-4 py-3">修改前</div>
              <div className="px-4 py-3">修改后</div>
            </div>
            {log.fieldChanges.map(change => (
              <div key={change.field} className="grid grid-cols-[140px_1fr_1fr] border-t border-slate-100 text-sm">
                <div className="bg-slate-50 px-4 py-3 font-medium text-slate-600">{change.field}</div>
                <div className="px-4 py-3 text-slate-500 break-all">{change.before || '-'}</div>
                <div className="px-4 py-3 text-slate-700 break-all">{change.after || '-'}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">无字段变更信息</div>
        )}
      </DetailSection>

      <DetailSection title="访问上下文">
        <DetailGridItem label="IP 地址" value={log.ip} />
        <DetailGridItem label="终端设备" value={log.terminal} />
        <DetailGridItem label="请求方法" value={log.requestMethod} />
        <DetailGridItem label="接口路径" value={log.requestPath} />
        <DetailGridItem label="来源页面" value={log.sourcePage} />
        <DetailGridItem label="traceId" value={log.traceId} />
      </DetailSection>

      {(log.errorCode || log.errorMessage) && (
        <DetailSection title="失败信息" className="rounded-2xl border border-red-100 bg-red-50/70 p-5">
          <DetailGridItem label="错误码" value={log.errorCode ?? '-'} valueClassName="text-red-700" />
          <DetailGridItem label="失败原因" value={log.errorMessage ?? '未知错误'} valueClassName="text-red-700" />
        </DetailSection>
      )}
    </div>
  );
}

function DetailSection({
  title,
  children,
  className = 'rounded-2xl border border-slate-200 bg-white p-5'
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function DetailGridItem({
  label,
  value,
  valueClassName
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
      <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</div>
      <div className={`mt-2 text-sm text-slate-700 break-all ${valueClassName ?? ''}`}>{value}</div>
    </div>
  );
}
