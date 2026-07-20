export type TagCategory = "会员类型" | "复查状态" | "客户来源" | "其他";
export type TagFilter = "全部类型" | TagCategory;

export type TagManagementRow = {
  id: string;
  category: TagCategory;
  value: string;
  colorLabel: string;
  className: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type TagDraft = {
  category: TagCategory;
  colorLabel: string;
  value: string;
};

export const tagCategoryOptions: readonly TagFilter[] = ["全部类型", "会员类型", "复查状态", "客户来源", "其他"] as const;

export const tagColorPresets = [
  { label: "蓝色", dotClass: "bg-primary-500", className: "border-primary-100 bg-primary-50 text-primary-600" },
  { label: "黄色", dotClass: "bg-yellow-400", className: "border-yellow-100 bg-yellow-50 text-yellow-700" },
  { label: "橙色", dotClass: "bg-orange-400", className: "border-orange-100 bg-orange-50 text-orange-700" },
  { label: "绿色", dotClass: "bg-emerald-500", className: "border-emerald-100 bg-emerald-50 text-emerald-700" },
  { label: "紫色", dotClass: "bg-violet-500", className: "border-violet-100 bg-violet-50 text-violet-700" },
  { label: "红色", dotClass: "bg-rose-500", className: "border-rose-100 bg-rose-50 text-rose-700" },
  { label: "灰色", dotClass: "bg-slate-400", className: "border-slate-200 bg-slate-100 text-slate-600" },
] as const;

export const initialTagDraft: TagDraft = {
  category: "会员类型",
  colorLabel: "灰色",
  value: "",
};

export const initialTagManagementRows: TagManagementRow[] = [
  { id: "tm1", category: "会员类型", value: "普通用户", colorLabel: "灰色", className: "border-slate-200 bg-slate-100 text-slate-600", createdBy: "张店长", createdAt: "2026-04-01", updatedAt: "2026-05-05" },
  { id: "tm2", category: "会员类型", value: "VIP", colorLabel: "紫色", className: "border-violet-100 bg-violet-50 text-violet-700", createdBy: "徐蔚", createdAt: "2026-04-02", updatedAt: "2026-05-06" },
  { id: "tm3", category: "会员类型", value: "SVIP", colorLabel: "紫色", className: "border-fuchsia-100 bg-fuchsia-50 text-fuchsia-700", createdBy: "王护士", createdAt: "2026-04-03", updatedAt: "2026-05-07" },
  { id: "tm4", category: "复查状态", value: "跟进中", colorLabel: "绿色", className: "border-emerald-100 bg-emerald-50 text-emerald-700", createdBy: "张店长", createdAt: "2026-04-06", updatedAt: "2026-05-10" },
  { id: "tm5", category: "复查状态", value: "待复查", colorLabel: "橙色", className: "border-orange-100 bg-orange-50 text-orange-700", createdBy: "陈顾问", createdAt: "2026-04-07", updatedAt: "2026-05-11" },
  { id: "tm6", category: "复查状态", value: "已就诊", colorLabel: "蓝色", className: "border-primary-100 bg-primary-50 text-primary-600", createdBy: "系统管理员", createdAt: "2026-04-08", updatedAt: "2026-05-12" },
  { id: "tm7", category: "复查状态", value: "已终止", colorLabel: "灰色", className: "border-slate-200 bg-slate-100 text-slate-600", createdBy: "李前台", createdAt: "2026-04-09", updatedAt: "2026-05-13" },
  { id: "tm8", category: "客户来源", value: "徐蔚", colorLabel: "蓝色", className: "border-sky-100 bg-sky-50 text-sky-700", createdBy: "张店长", createdAt: "2026-04-11", updatedAt: "2026-05-15" },
  { id: "tm9", category: "客户来源", value: "美团", colorLabel: "黄色", className: "border-amber-100 bg-amber-50 text-amber-700", createdBy: "王护士", createdAt: "2026-04-12", updatedAt: "2026-05-16" },
  { id: "tm10", category: "客户来源", value: "小红书", colorLabel: "红色", className: "border-rose-100 bg-rose-50 text-rose-700", createdBy: "陈顾问", createdAt: "2026-04-13", updatedAt: "2026-05-17" },
  { id: "tm11", category: "客户来源", value: "海华", colorLabel: "绿色", className: "border-teal-100 bg-teal-50 text-teal-700", createdBy: "系统管理员", createdAt: "2026-04-14", updatedAt: "2026-05-18" },
  { id: "tm12", category: "其他", value: "新客户", colorLabel: "蓝色", className: "border-sky-100 bg-sky-50 text-sky-700", createdBy: "李前台", createdAt: "2026-04-16", updatedAt: "2026-05-20" },
  { id: "tm13", category: "其他", value: "老客户", colorLabel: "黄色", className: "border-amber-100 bg-amber-50 text-amber-700", createdBy: "张店长", createdAt: "2026-04-17", updatedAt: "2026-05-21" },
  { id: "tm14", category: "其他", value: "高关注", colorLabel: "红色", className: "border-rose-100 bg-rose-50 text-rose-700", createdBy: "徐蔚", createdAt: "2026-04-18", updatedAt: "2026-05-22" },
  { id: "tm15", category: "其他", value: "复诊", colorLabel: "灰色", className: "border-slate-200 bg-slate-100 text-slate-600", createdBy: "系统管理员", createdAt: "2026-04-19", updatedAt: "2026-05-23" },
];
