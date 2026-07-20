import { Plus, WarningCircle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ArchiveSelect, { type SelectOption } from "../../shared/components/ArchiveSelect";
import {
  initialTagDraft,
  initialTagManagementRows,
  tagCategoryOptions,
  tagColorPresets,
  type TagCategory,
  type TagDraft,
  type TagFilter,
  type TagManagementRow,
} from "../../shared/mock/tagManagementMockData";

const tagFilterSelectOptions: SelectOption[] = [...tagCategoryOptions].map((item) => ({ value: item, label: item }));
const tagCategorySelectOptions: SelectOption[] = [...tagCategoryOptions]
  .filter((item): item is TagCategory => item !== "全部类型")
  .map((item) => ({ value: item, label: item }));
const tagColorSelectOptions: SelectOption[] = tagColorPresets.map((item) => ({ value: item.label, label: item.label }));

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getPageItems(totalPages: number, currentPage: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const clipped = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
  const out: Array<number | "ellipsis"> = [];
  for (let index = 0; index < clipped.length; index++) {
    const prev = clipped[index - 1];
    const cur = clipped[index];
    if (index > 0 && prev != null && cur - prev > 1) out.push("ellipsis");
    out.push(cur);
  }
  return out;
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function ColorDot({ dotClass }: { dotClass: string }) {
  return <span className={`inline-flex h-5 w-5 rounded-md ${dotClass}`}></span>;
}

function TagChip({ value, className }: { value: string; className: string }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>{value}</span>;
}

export type TagManagementContentProps = {
  initialRows?: TagManagementRow[];
};

export default function TagManagementContent({ initialRows = initialTagManagementRows }: TagManagementContentProps) {
  const [tagRows, setTagRows] = useState(initialRows);
  const [tagFilter, setTagFilter] = useState<TagFilter>("全部类型");
  const [tagPage, setTagPage] = useState(1);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [tagDraft, setTagDraft] = useState<TagDraft>(initialTagDraft);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<TagManagementRow | null>(null);

  const filteredTagRows = useMemo(
    () => (tagFilter === "全部类型" ? tagRows : tagRows.filter((item) => item.category === tagFilter)),
    [tagFilter, tagRows]
  );
  const tagPageSize = 10;
  const totalTagPages = Math.max(1, Math.ceil(filteredTagRows.length / tagPageSize));
  const currentTagPage = Math.min(tagPage, totalTagPages);
  const pagedTagRows = useMemo(
    () => filteredTagRows.slice((currentTagPage - 1) * tagPageSize, currentTagPage * tagPageSize),
    [currentTagPage, filteredTagRows]
  );
  const pageItems = getPageItems(totalTagPages, currentTagPage);
  const selectedTagColor = tagColorPresets.find((item) => item.label === tagDraft.colorLabel) ?? tagColorPresets[tagColorPresets.length - 1];

  function closeTagModal() {
    setTagModalOpen(false);
    setEditingTagId(null);
    setTagDraft(initialTagDraft);
  }

  function openCreateTagModal() {
    setTagDraft(initialTagDraft);
    setEditingTagId(null);
    setTagModalOpen(true);
  }

  function openEditTagModal(row: TagManagementRow) {
    setTagDraft({
      category: row.category,
      colorLabel: row.colorLabel,
      value: row.value,
    });
    setEditingTagId(row.id);
    setTagModalOpen(true);
  }

  function openDeleteTagModal(row: TagManagementRow) {
    setDeleteCandidate(row);
  }

  function closeDeleteTagModal() {
    setDeleteCandidate(null);
  }

  function handleDeleteTag() {
    if (!deleteCandidate) return;
    setTagRows((prev) => prev.filter((item) => item.id !== deleteCandidate.id));
    closeDeleteTagModal();
  }

  function handleSaveTag() {
    const nextValue = tagDraft.value.trim();
    if (!nextValue) return;

    const color = tagColorPresets.find((item) => item.label === tagDraft.colorLabel) ?? tagColorPresets[tagColorPresets.length - 1];
    const today = getTodayDate();

    if (editingTagId) {
      setTagRows((prev) =>
        prev.map((item) =>
          item.id === editingTagId
            ? {
                ...item,
                category: tagDraft.category,
                value: nextValue,
                colorLabel: color.label,
                className: color.className,
                updatedAt: today,
              }
            : item
        )
      );
    } else {
      setTagRows((prev) => [
        {
          id: `tm-${Date.now()}`,
          category: tagDraft.category,
          value: nextValue,
          colorLabel: color.label,
          className: color.className,
          createdBy: "张店长",
          createdAt: today,
          updatedAt: today,
        },
        ...prev,
      ]);
      setTagPage(1);
    }

    closeTagModal();
  }

  const modalNode =
    tagModalOpen && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/35 px-4 py-8" onClick={closeTagModal}>
            <div
              className="w-full max-w-[720px] rounded-[32px] bg-white px-8 py-7 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[20px] font-bold leading-8 text-gray-900">{editingTagId ? "编辑标签" : "新增标签"}</div>
                  <div className="mt-1 text-sm font-medium leading-6 text-slate-500">通过弹窗快速配置类别、颜色与标签值。</div>
                </div>
                <button
                  className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                  onClick={closeTagModal}
                >
                  关闭
                </button>
              </div>

              <div className="mt-7 space-y-5">
                <div>
                  <div className="text-sm font-semibold text-slate-500">类别</div>
                  <ArchiveSelect
                    value={tagDraft.category}
                    onChange={(value) => setTagDraft((prev) => ({ ...prev, category: value as TagCategory }))}
                    options={tagCategorySelectOptions}
                    className="mt-3"
                    triggerClassName="h-14 rounded-[24px] px-5 text-base font-semibold focus:border-emerald-300 focus:ring-emerald-100"
                    dropdownClassName="rounded-[24px]"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
                  <div>
                    <div className="text-sm font-semibold text-slate-500">颜色</div>
                    <ArchiveSelect
                      value={tagDraft.colorLabel}
                      onChange={(value) => setTagDraft((prev) => ({ ...prev, colorLabel: value }))}
                      options={tagColorSelectOptions}
                      className="mt-3"
                      triggerClassName="h-14 rounded-[24px] px-5 text-base font-semibold"
                      dropdownClassName="rounded-[24px]"
                      renderValue={(option) => {
                        const color = tagColorPresets.find((item) => item.label === option?.value) ?? selectedTagColor;
                        return (
                          <span className="flex items-center gap-3">
                            <ColorDot dotClass={color.dotClass} />
                            <span>{color.label}</span>
                          </span>
                        );
                      }}
                      renderOption={(option, state) => {
                        const color = tagColorPresets.find((item) => item.label === option.value) ?? selectedTagColor;
                        return (
                          <>
                            <span className="flex items-center gap-3">
                              <ColorDot dotClass={color.dotClass} />
                              <span>{option.label}</span>
                            </span>
                            <span className={state.selected ? "text-primary-600" : "text-slate-300"}>{state.selected ? "✓" : ""}</span>
                          </>
                        );
                      }}
                    />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-500">值</div>
                    <input
                      value={tagDraft.value}
                      onChange={(e) => setTagDraft((prev) => ({ ...prev, value: e.target.value }))}
                      placeholder="请输入标签值"
                      className="mt-3 h-14 w-full rounded-[24px] border border-slate-200 bg-white px-5 text-base font-semibold text-slate-700 outline-none placeholder:font-medium placeholder:text-slate-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={closeTagModal}
                >
                  取消
                </button>
                <button
                  className="rounded-2xl bg-primary-500 px-6 py-3 text-base font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-primary-300"
                  disabled={!tagDraft.value.trim()}
                  onClick={handleSaveTag}
                >
                  确认保存
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  const deleteModal =
    deleteCandidate && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/35 px-4 py-8" onClick={closeDeleteTagModal}>
            <div
              className="w-full max-w-md rounded-[28px] border border-slate-100 bg-white px-6 py-7 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <WarningCircle size={24} weight="fill" />
              </div>
              <div className="mt-5 text-center text-xl font-bold text-slate-800">确认删除</div>
              <div className="mt-2 text-center text-sm leading-6 text-slate-500">
                确认删除标签 <span className="font-semibold text-slate-700">“{deleteCandidate.value}”</span> 吗？删除后将无法恢复。
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={closeDeleteTagModal}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleDeleteTag}
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="min-h-full flex flex-col gap-6">
      <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex flex-col gap-3 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <ArchiveSelect
                value={tagFilter}
                onChange={(value) => {
                  setTagFilter(value as TagFilter);
                  setTagPage(1);
                }}
                options={tagFilterSelectOptions}
                className="min-w-[124px]"
                triggerClassName="h-[46px] rounded-2xl border-gray-200 px-4"
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <span aria-hidden="true" className="hidden h-6 w-px bg-gray-200 xl:block"></span>
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600 active:bg-primary-700"
                onClick={openCreateTagModal}
              >
                <Plus weight="bold" className="h-4 w-4" />
                新增标签
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed text-center">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[18%]" />
              <col className="w-[14%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead className="bg-gray-50 text-xs uppercase tracking-[0.18em] text-gray-400">
              <tr>
                <th className="px-4 py-3 text-center font-semibold">类别</th>
                <th className="px-4 py-3 text-center font-semibold">值</th>
                <th className="px-4 py-3 text-center font-semibold">创建人</th>
                <th className="px-4 py-3 text-center font-semibold">创建日期</th>
                <th className="px-4 py-3 text-center font-semibold">更新日期</th>
                <th className="px-4 py-3 text-center font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {pagedTagRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center font-semibold text-gray-900 whitespace-nowrap">{row.category}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <TagChip value={row.value} className={row.className} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">{row.createdBy}</td>
                  <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">{row.createdAt}</td>
                  <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">{row.updatedAt}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        className="rounded-md bg-primary-50 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100 hover:text-primary-700"
                        onClick={() => openEditTagModal(row)}
                      >
                        编辑
                      </button>
                      <button
                        className="text-sm font-medium text-rose-500 hover:text-rose-600"
                        onClick={() => openDeleteTagModal(row)}
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 text-sm text-gray-500 lg:flex-row lg:items-center lg:justify-between">
          <div>共 {filteredTagRows.length} 条标签数据，当前第 {currentTagPage} / {totalTagPages} 页</div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
              disabled={currentTagPage === 1}
              onClick={() => setTagPage((prev) => clamp(prev - 1, 1, totalTagPages))}
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
                  onClick={() => setTagPage(item)}
                  className={
                    item === currentTagPage
                      ? "rounded-xl bg-primary-500 px-3 py-2 text-sm font-semibold text-white"
                      : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  }
                >
                  {item}
                </button>
              )
            )}
            <button
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
              disabled={currentTagPage === totalTagPages}
              onClick={() => setTagPage((prev) => clamp(prev + 1, 1, totalTagPages))}
            >
              下一页
            </button>
          </div>
        </div>
      </div>
      {modalNode}
      {deleteModal}
    </div>
  );
}
