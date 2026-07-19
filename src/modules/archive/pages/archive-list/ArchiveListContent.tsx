import { useMemo, useState } from "react";
import { DownloadSimple, Plus } from "@phosphor-icons/react";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { ArchiveGenderIcon, ArchiveProfileTags } from "../../shared/components/ArchiveCommon";
import ArchiveSelect from "../../shared/components/ArchiveSelect";
import { patients, type Patient } from "../../shared/mock/archiveMockData";
import { getMergedPatients, isLocalPatientId, removeLocalPatient } from "../../shared/store/patientArchiveStore";

function formatDateOnly(value?: string) {
  if (!value) return "--";
  return String(value).split(" ")[0];
}

function normalizeForSearch(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatFixed2(value?: number) {
  if (value == null || Number.isNaN(value)) return "-";
  return value.toFixed(2);
}

function getAxialDeltaTagClass(delta: number) {
  if (delta <= 0) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return delta >= 0.2 ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function AxialDeltaTag({ delta }: { delta?: number | null }) {
  const missing = delta == null || Number.isNaN(delta);
  const className = missing ? "border-gray-200 bg-gray-50 text-gray-500" : getAxialDeltaTagClass(delta);
  return (
    <span className={`ml-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${className}`}>
      {missing ? (
        <span>--</span>
      ) : (
        <>
          <span aria-hidden="true">{delta >= 0 ? "▲" : "▼"}</span>
          <span>{formatFixed2(Math.abs(delta))}</span>
        </>
      )}
    </span>
  );
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

export type ArchiveListContentProps = {
  patientSource?: Patient[];
  onOpenDetail?: (patientId: string) => void;
  onCreateArchive?: () => void;
  onExport?: () => void;
};

export default function ArchiveListContent({
  patientSource = patients,
  onOpenDetail,
  onCreateArchive,
  onExport,
}: ArchiveListContentProps) {
  const { RangePicker } = DatePicker;
  const [data, setData] = useState<Patient[]>(() => getMergedPatients(patientSource));
  const [keyword, setKeyword] = useState("");
  const [followupType, setFollowupType] = useState("就诊类型");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [page, setPage] = useState(1);
  const [deleteCandidate, setDeleteCandidate] = useState<Patient | null>(null);
  const [applied, setApplied] = useState({
    keyword: "",
    followupType: "就诊类型",
    startDate: "",
    endDate: "",
  });

  const filtered = useMemo(() => {
    const query = normalizeForSearch(applied.keyword);
    const start = applied.startDate ? new Date(applied.startDate) : null;
    const end = applied.endDate ? new Date(applied.endDate) : null;

    return data.filter((p) => {
      if (query) {
        const haystack = normalizeForSearch(`${p.name}${p.mobile}${p.no}`);
        if (!haystack.includes(query)) return false;
      }

      if (applied.followupType !== "就诊类型") {
        if ((p.followupType ?? "") !== applied.followupType) return false;
      }

      if (start || end) {
        const date = formatDateOnly(p.latestVisit);
        if (date === "--") return false;
        const d = new Date(date);
        if (start && d < start) return false;
        if (end) {
          const endInclusive = new Date(end);
          endInclusive.setHours(23, 59, 59, 999);
          if (d > endInclusive) return false;
        }
      }

      return true;
    });
  }, [applied, data]);

  const pageSize = 9;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = clamp(page, 1, totalPages);
  const pageStartIdx = (currentPage - 1) * pageSize;
  const pageEndIdx = Math.min(pageStartIdx + pageSize, total);
  const paged = filtered.slice(pageStartIdx, pageEndIdx);
  const pageItems = getPageItems(totalPages, currentPage);

  return (
    <div className="min-h-full flex flex-col gap-6">
      <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="p-5 grid gap-3 xl:grid-cols-[1.42fr_0.82fr_1.42fr_auto] xl:items-center">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              placeholder="搜索姓名 / 手机号 / 患者编号"
            />
            <ArchiveSelect
              value={followupType === "就诊类型" ? undefined : followupType}
              onChange={(next) => setFollowupType(next)}
              placeholder="就诊类型"
              className="w-full"
              triggerClassName="border-gray-200 text-gray-700 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              options={[
                { value: "初诊", label: "初诊" },
                { value: "复查", label: "复查" },
                { value: "视训", label: "视训" },
                { value: "配镜", label: "配镜" },
                { value: "角膜塑形镜", label: "角膜塑形镜" },
                { value: "离焦框架镜", label: "离焦框架镜" },
                { value: "离焦软镜", label: "离焦软镜" },
                { value: "哺光仪", label: "哺光仪" },
                { value: "用药", label: "用药" },
                { value: "定期复查", label: "定期复查" },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <RangePicker
                size="large"
                className="col-span-2 w-full"
                value={dateRange}
                onChange={(next) => setDateRange((next as [Dayjs | null, Dayjs | null]) ?? [null, null])}
                placeholder={["开始日期", "结束日期"]}
                format="YYYY/MM/DD"
                allowEmpty={[true, true]}
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setKeyword("");
                  setFollowupType("就诊类型");
                  setDateRange([null, null]);
                  setApplied({
                    keyword: "",
                    followupType: "就诊类型",
                    startDate: "",
                    endDate: "",
                  });
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              >
                重置
              </button>
              <button
                onClick={() => {
                  const [start, end] = dateRange;
                  setApplied({
                    keyword,
                    followupType,
                    startDate: start ? dayjs(start).format("YYYY-MM-DD") : "",
                    endDate: end ? dayjs(end).format("YYYY-MM-DD") : "",
                  });
                  setPage(1);
                }}
                className="rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600 active:bg-primary-700"
              >
                搜索
              </button>
              <span aria-hidden="true" className="h-6 w-px bg-gray-200"></span>
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                onClick={() => onExport?.()}
              >
                <DownloadSimple weight="bold" className="h-4 w-4" />
                导出
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600 active:bg-primary-700"
                onClick={() => onCreateArchive?.()}
              >
                <Plus weight="bold" className="h-4 w-4" />
                新增档案
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-[0.18em] text-gray-400">
              <tr>
                <th className="px-5 py-4 font-semibold">客户信息</th>
                <th className="px-5 py-4 font-semibold">用户标签</th>
                <th className="px-5 py-4 font-semibold">就诊日期</th>
                <th className="px-5 py-4 font-semibold">就诊类型</th>
                <th className="px-5 py-4 font-semibold">数据记录</th>
                <th className="px-5 py-4 font-semibold w-[200px]">诊断</th>
                <th className="px-5 py-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paged.map((p) => (
                <tr key={p.id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <button type="button" className="text-left" onClick={() => onOpenDetail?.(p.id)}>
                      <div className="flex items-center gap-3">
                        <ArchiveGenderIcon gender={p.gender} />
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-gray-900 hover:text-primary-600">{p.name}</span>
                            <span className="text-xs text-gray-400">{p.age}岁</span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">{p.mobile}</div>
                        </div>
                      </div>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <ArchiveProfileTags profile={p.profile} hideReviewStatus />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-900">{formatDateOnly(p.latestVisit)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {p.followupType ? (
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        {p.followupType}
                      </span>
                    ) : (
                      <div className="text-sm font-semibold text-gray-400">--</div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {p.axial ? (
                      <div className="max-w-[520px] truncate whitespace-nowrap text-sm font-semibold text-gray-800">
                        <span className="text-gray-500">眼轴：</span>
                        <span className="text-gray-900">
                          OD {formatFixed2(p.axial.od)}
                          <AxialDeltaTag delta={p.axialDelta?.od} />
                          <span aria-hidden="true" className="mx-3 inline-flex h-4 w-px bg-gray-200 align-middle"></span>
                          OS {formatFixed2(p.axial.os)}
                          <AxialDeltaTag delta={p.axialDelta?.os} />
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-gray-400">--</div>
                    )}
                  </td>
                  <td className="px-5 py-4 w-[200px]">
                    {p.diagnosisNote ? (
                      <div className="w-[200px] truncate whitespace-nowrap text-sm font-semibold text-gray-800">
                        {p.diagnosisNote}
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-gray-400">--</div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        className="rounded-lg bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-600 hover:bg-primary-100 active:bg-primary-200"
                        onClick={() => onOpenDetail?.(p.id)}
                      >
                        查看档案
                      </button>
                      <button
                        className="text-sm font-semibold text-rose-600 hover:text-rose-700 active:text-rose-800"
                        onClick={() => setDeleteCandidate(p)}
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-gray-500">
            共 <span className="font-bold text-gray-900">{total}</span> 条患者记录，当前显示{" "}
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
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="text-lg font-bold text-gray-900">确认删除</div>
              <div className="mt-1 text-sm text-gray-500">
                确认删除 <span className="font-semibold text-gray-900">{deleteCandidate.name}</span>（{deleteCandidate.no}）的档案吗？
              </div>
            </div>
            <div className="p-5 flex items-center justify-end gap-3">
              <button
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                onClick={() => setDeleteCandidate(null)}
              >
                取消
              </button>
              <button
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 active:bg-rose-800"
                onClick={() => {
                  const id = deleteCandidate.id;
                  if (isLocalPatientId(id)) removeLocalPatient(id);
                  setData((prev) => prev.filter((x) => x.id !== id));
                  setDeleteCandidate(null);
                  const nextTotal = Math.max(0, total - 1);
                  const nextTotalPages = Math.max(1, Math.ceil(nextTotal / pageSize));
                  setPage((p) => clamp(p, 1, nextTotalPages));
                }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
