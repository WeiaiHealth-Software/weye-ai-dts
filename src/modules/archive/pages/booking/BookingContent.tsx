import { useMemo, useState } from "react";
import { DownloadSimple, Plus } from "@phosphor-icons/react";
import Select, { type SelectOption } from "@/components/form/Select";
import { appointments, type Appointment, patients, type Patient } from "../../shared/mock/archiveMockData";

function normalizeForSearch(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getPageItems(totalPages: number, currentPage: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const clipped = Array.from(pages).filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: Array<number | "ellipsis"> = [];
  for (let i = 0; i < clipped.length; i++) {
    const prev = clipped[i - 1];
    const cur = clipped[i];
    if (i > 0 && prev != null && cur - prev > 1) out.push("ellipsis");
    out.push(cur);
  }
  return out;
}

function statusClass(status: Appointment["status"]) {
  if (status === "已确认") return "border-emerald-100 bg-emerald-50 text-emerald-700";
  if (status === "待到诊") return "border-orange-100 bg-orange-50 text-orange-700";
  if (status === "已改期") return "border-amber-100 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function toSelectOptions(values: string[]): SelectOption[] {
  return values.map((value) => ({ value, label: value }));
}

export type BookingContentProps = {
  appointmentSource?: Appointment[];
  patientSource?: Patient[];
  onCalendarView?: () => void;
  onExport?: () => void;
  onCreateBooking?: () => void;
  onReschedule?: (appointment: Appointment) => void;
  onCancelBooking?: (appointment: Appointment) => void;
  onCheckIn?: (appointment: Appointment) => void;
};

export default function BookingContent({
  appointmentSource = appointments,
  patientSource = patients,
  onCalendarView,
  onExport,
  onCreateBooking,
  onReschedule,
  onCancelBooking,
  onCheckIn,
}: BookingContentProps) {
  const [keyword, setKeyword] = useState("");
  const [date, setDate] = useState("");
  const [store, setStore] = useState("全部门店");
  const [status, setStatus] = useState("全部状态");
  const [source, setSource] = useState("全部来源");
  const [page, setPage] = useState(1);
  const [applied, setApplied] = useState({
    keyword: "",
    date: "",
    store: "全部门店",
    status: "全部状态",
    source: "全部来源",
  });

  const storeOptions = useMemo(() => {
    const values = Array.from(new Set(appointmentSource.map((a) => a.store).filter(Boolean))).sort();
    return toSelectOptions(["全部门店", ...values]);
  }, [appointmentSource]);

  const statusOptions = useMemo(() => {
    const values = Array.from(new Set(appointmentSource.map((a) => a.status).filter(Boolean))).sort();
    return toSelectOptions(["全部状态", ...values]);
  }, [appointmentSource]);

  const sourceOptions = useMemo(() => {
    const values = Array.from(new Set(appointmentSource.map((a) => a.source).filter(Boolean))).sort();
    return toSelectOptions(["全部来源", ...values]);
  }, [appointmentSource]);

  const filtered = useMemo(() => {
    const query = normalizeForSearch(applied.keyword);
    return appointmentSource.filter((a) => {
      if (query) {
        const haystack = normalizeForSearch(`${a.patient}${a.id}`);
        if (!haystack.includes(query)) return false;
        const patient = patientSource.find((p) => p.name === a.patient);
        if (patient) {
          const extra = normalizeForSearch(`${patient.mobile}${patient.no}`);
          if (!(`${haystack}${extra}`.includes(query))) return false;
        }
      }
      if (applied.date && a.date !== applied.date) return false;
      if (applied.store !== "全部门店" && a.store !== applied.store) return false;
      if (applied.status !== "全部状态" && a.status !== applied.status) return false;
      if (applied.source !== "全部来源" && a.source !== applied.source) return false;
      return true;
    });
  }, [applied, appointmentSource, patientSource]);

  const total = filtered.length;
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = clamp(page, 1, totalPages);
  const pageStartIdx = (currentPage - 1) * pageSize;
  const pageEndIdx = Math.min(pageStartIdx + pageSize, total);
  const paged = filtered.slice(pageStartIdx, pageEndIdx);
  const pageItems = getPageItems(totalPages, currentPage);

  const waitingCount = useMemo(() => filtered.filter((a) => a.status === "待到诊").length, [filtered]);

  function handleResetFilters() {
    setKeyword("");
    setDate("");
    setStore("全部门店");
    setStatus("全部状态");
    setSource("全部来源");
    setApplied({
      keyword: "",
      date: "",
      store: "全部门店",
      status: "全部状态",
      source: "全部来源",
    });
    setPage(1);
  }

  return (
    <div className="min-h-full flex flex-col gap-6">
      <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 p-5">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-lg font-bold text-gray-900">预约全量视图</div>
              <div className="mt-1 text-sm text-gray-500">
                以“排班资源 + 患者预约 + 状态流转”为主线，保留旧字段并增强门店、诊室、来源、到诊和通知信息。
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-[140px_140px_140px_minmax(0,220px)_180px_auto_auto]">
              <Select
                value={store}
                onChange={setStore}
                options={storeOptions}
                triggerClassName="h-[42px] rounded-xl border-gray-200 px-4 text-sm text-gray-700 focus:border-primary-300 focus:ring-primary-100"
              />
              <Select
                value={status}
                onChange={setStatus}
                options={statusOptions}
                triggerClassName="h-[42px] rounded-xl border-gray-200 px-4 text-sm text-gray-700 focus:border-primary-300 focus:ring-primary-100"
              />
              <Select
                value={source}
                onChange={setSource}
                options={sourceOptions}
                triggerClassName="h-[42px] rounded-xl border-gray-200 px-4 text-sm text-gray-700 focus:border-primary-300 focus:ring-primary-100"
              />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                placeholder="搜索姓名 / 手机号"
              />
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
              <button
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                onClick={handleResetFilters}
              >
                重置
              </button>
              <button
                className="rounded-xl bg-primary-500 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-600 active:bg-primary-700"
                onClick={() => {
                  setApplied({ keyword, date, store, status, source });
                  setPage(1);
                }}
              >
                搜索
              </button>
            </div>
            <div className="flex items-center gap-2 xl:border-l xl:border-gray-200 xl:pl-4">
              <button
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                onClick={() => onCalendarView?.()}
              >
                日历视图
              </button>
              <button
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                onClick={() => onExport?.()}
              >
                <span className="inline-flex items-center gap-2">
                  <DownloadSimple weight="bold" className="h-4 w-4" />
                  导出
                </span>
              </button>
              <button
                className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 active:bg-primary-700"
                onClick={() => onCreateBooking?.()}
              >
                <span className="inline-flex items-center gap-2">
                  <Plus weight="bold" className="h-4 w-4" />
                  新增预约
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">今日视图</span>
            {applied.store !== "全部门店" && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{applied.store}</span>
            )}
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">待到诊 {waitingCount}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-[0.18em] text-gray-400">
              <tr>
                <th className="px-5 py-4 font-semibold">预约日期 / 时段</th>
                <th className="px-5 py-4 font-semibold">患者</th>
                <th className="px-5 py-4 font-semibold">门店 / 诊室</th>
                <th className="px-5 py-4 font-semibold">问题 / 解决方案</th>
                <th className="px-5 py-4 font-semibold">标签 / 来源</th>
                <th className="px-5 py-4 font-semibold">状态</th>
                <th className="px-5 py-4 font-semibold">备注</th>
                <th className="px-5 py-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paged.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{item.date}</div>
                    <div className="mt-1 text-xs text-gray-500">{item.time}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{item.patient}</div>
                    <div className="mt-1 text-xs text-gray-500">联系方式待展示</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-700">{item.store}</div>
                    <div className="mt-1 text-xs text-gray-500">{item.room}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-700">{item.issue}</div>
                    <div className="mt-1 text-xs text-gray-500">{item.solution}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-700">{item.tags}</div>
                    <div className="mt-1 text-xs text-gray-500">{item.source}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{item.note}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-xl bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-600 hover:bg-primary-100 active:bg-primary-200"
                        onClick={() => onCheckIn?.(item)}
                      >
                        到诊录入
                      </button>
                      <button
                        className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                        onClick={() => onReschedule?.(item)}
                      >
                        改期
                      </button>
                      <button
                        className="rounded-xl bg-transparent px-3 py-2 text-xs font-semibold text-red-600"
                        onClick={() => onCancelBooking?.(item)}
                      >
                        取消
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-gray-500">
            共 <span className="font-bold text-gray-900">{total}</span> 条预约记录，当前显示{" "}
            <span className="font-bold text-gray-900">{total ? pageStartIdx + 1 : 0}</span> -{" "}
            <span className="font-bold text-gray-900">{pageEndIdx}</span> 条
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setPage((p) => clamp(p - 1, 1, totalPages))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              上一页
            </button>
            {pageItems.map((item, idx) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-sm text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  className={
                    item === currentPage
                      ? "rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white"
                      : "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  }
                >
                  {item}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => clamp(p + 1, 1, totalPages))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
