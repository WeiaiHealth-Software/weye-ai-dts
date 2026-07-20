import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alarm, ArrowLeft, LockKey, PencilSimple, Phone, Plus } from "@phosphor-icons/react";
import {
  Activity,
  ChevronDown,
  Cpu,
  FileText,
  Layers,
  Search,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  appointments,
  followups,
  historyVisits,
  patients,
  trainingRecords,
  visitDetailRecords,
  type Followup,
  type Patient,
  type Visit,
  type VisitDetailRecord,
} from "../../shared/mock/archiveMockData";
import { ArchiveGenderIcon, ArchiveProfileTags } from "../../shared/components/ArchiveCommon";
import { findMergedPatientById, isLocalPatientId } from "../../shared/store/patientArchiveStore";

function formatDateOnly(value?: string) {
  if (!value) return "-";
  return String(value).split(" ")[0];
}

const emptyVisitDetail: VisitDetailRecord = {
  basicInfo: { doctor: "", optometrist: "" },
  chiefHistory: { eye: "右眼", symptom: "", duration: "", durationUnit: "", description: "" },
  optometryExam: {
    date: "",
    optometrist: "",
    right: {
      axialLength: { value: "" },
      sphere: { value: "" },
      cylinder: { value: "" },
      keratometry: "",
    },
    left: {
      axialLength: { value: "" },
      sphere: { value: "" },
      cylinder: { value: "" },
      keratometry: "",
    },
  },
  eyeExam: [],
  auxExam: [],
  diagnosis: "",
  treatment: {
    inspection: { item: "", quantity: "", unit: "", price: "", total: "" },
    prescription: { drug: "", quantity: "", spec: "", unit: "", price: "", eye: "", usage: "", total: "" },
    therapy: { item: "", quantity: "", unit: "", price: "", total: "" },
    advice: "",
    followupCycle: "",
    estimatedDate: "",
    reminderDate: "",
  },
};

function isDateDue(value?: string) {
  if (!value) return false;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.getTime() <= Date.now();
}

function formatEyeLabel(value: string) {
  if (value === "右眼") return "右眼（OD）";
  if (value === "左眼") return "左眼（OS）";
  return value;
}

const tabs = [
  { key: "visits", label: "就诊记录" },
  { key: "training", label: "视光训练记录" },
  { key: "glasses", label: "配镜记录" },
  { key: "appointments", label: "预约记录" },
  { key: "followup", label: "回访记录" },
  { key: "consumption", label: "消费记录" },
] as const;

const optometryPanels = [
  {
    key: "right",
    title: "右眼 (OD)",
    dotClassName: "bg-sky-500",
    panelClassName: "border-sky-200 bg-sky-50/30",
  },
  {
    key: "left",
    title: "左眼 (OS)",
    dotClassName: "bg-violet-500",
    panelClassName: "border-violet-200 bg-violet-50/30",
  },
] as const;

type ArchiveAiMessageRole = "assistant" | "user";

type ArchiveAiMessage = {
  id: string;
  role: ArchiveAiMessageRole;
  content: string;
  tag?: string;
  time: string;
};

type ArchiveAiEngine = "WEyeAI" | "DeepSeek" | "Qwen";

type ArchiveAiQuickAction = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: LucideIcon;
  iconClassName: string;
};

function createAiMessage(role: ArchiveAiMessageRole, content: string, tag?: string): ArchiveAiMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    tag,
    time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
  };
}

function parseDeltaValue(value?: string) {
  const matched = String(value ?? "").match(/-?\d+(?:\.\d+)?/);
  return matched ? Number(matched[0]) : 0;
}

type TabKey = (typeof tabs)[number]["key"];

export type ArchiveDetailContentProps = {
  patientId: string;
  patientSource?: Patient[];
  onBack?: () => void;
  onCreateArchive?: (patientId: string) => void;
  onCreateFollowup?: (patientId: string) => void;
};

export default function ArchiveDetailContent({
  patientId,
  patientSource = patients,
  onBack,
  onCreateArchive,
  onCreateFollowup,
}: ArchiveDetailContentProps) {
  const patient = useMemo(() => findMergedPatientById(patientSource, patientId) ?? patientSource[0], [patientId, patientSource]);

  const localVisits = useMemo(() => {
    try {
      const raw = window.localStorage.getItem(`clientVisits:${patient.id}`);
      const parsed = JSON.parse(raw ?? "[]") as Visit[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [patient.id]);

  const hasVisitRecords = localVisits.length > 0 || Boolean(patient.latestVisit);

  const localVisitDetails = useMemo(() => {
    try {
      const raw = window.localStorage.getItem(`clientVisitDetails:${patient.id}`);
      const parsed = JSON.parse(raw ?? "{}") as Record<string, VisitDetailRecord>;
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }, [patient.id]);

  const combinedVisits = useMemo(() => {
    if (isLocalPatientId(patient.id)) {
      return [...localVisits].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    }
    if (!hasVisitRecords) {
      return [...localVisits].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    }
    const map = new Map<string, Visit>();
    for (const item of localVisits) map.set(item.id, item);
    for (const item of historyVisits) {
      if (!map.has(item.id)) map.set(item.id, item);
    }
    return Array.from(map.values()).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [hasVisitRecords, localVisits, patient.id]);

  const [activeTab, setActiveTab] = useState<TabKey>("visits");
  const [selectedVisitId, setSelectedVisitId] = useState<string>("");
  const [visitEditMode, setVisitEditMode] = useState(false);
  const [visitOverrides, setVisitOverrides] = useState<Record<string, VisitDetailRecord>>({});
  const baseVisitDetail = useMemo(
    () => (selectedVisitId ? localVisitDetails[selectedVisitId] ?? visitDetailRecords[selectedVisitId] ?? emptyVisitDetail : emptyVisitDetail),
    [localVisitDetails, selectedVisitId]
  );
  const effectiveVisitDetail = useMemo(
    () => visitOverrides[selectedVisitId] ?? baseVisitDetail,
    [baseVisitDetail, selectedVisitId, visitOverrides]
  );
  const [visitDraft, setVisitDraft] = useState<VisitDetailRecord>(effectiveVisitDetail);
  const [savedAt, setSavedAt] = useState(0);
  const [trainingRows, setTrainingRows] = useState(trainingRecords);
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<ArchiveAiMessage[]>([]);
  const [aiEngine, setAiEngine] = useState<ArchiveAiEngine>("WEyeAI");
  const [aiEngineMenuOpen, setAiEngineMenuOpen] = useState(false);
  const [aiQuickActionBatch, setAiQuickActionBatch] = useState(0);
  const aiEngineMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const nextVisitId = combinedVisits[0]?.id ?? "";
    setTimeout(() => {
      setSelectedVisitId(nextVisitId);
      setVisitEditMode(false);
    }, 0);
  }, [combinedVisits, patient.id]);

  useEffect(() => {
    if (visitEditMode) return;
    if (!selectedVisitId) {
      setTimeout(() => {
        setVisitDraft(emptyVisitDetail);
      }, 0);
      return;
    }
    const nextDraft =
      visitOverrides[selectedVisitId] ??
      localVisitDetails[selectedVisitId] ??
      visitDetailRecords[selectedVisitId] ??
      emptyVisitDetail;
    setTimeout(() => {
      setVisitDraft(nextDraft);
    }, 0);
  }, [localVisitDetails, selectedVisitId, visitEditMode, visitOverrides]);

  const patientAppointments = useMemo(
    () => appointments.filter((a) => a.patient === patient.name),
    [patient.name]
  );
  const localFollowups = useMemo(() => {
    try {
      const raw = window.localStorage.getItem(`clientFollowups:${patient.id}`);
      const parsed = JSON.parse(raw ?? "[]") as Followup[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [patient.id]);
  const patientFollowups = useMemo(
    () =>
      [...localFollowups, ...followups.filter((f) => f.patient === patient.name)].sort((a, b) =>
        String(b.reviewDate).localeCompare(String(a.reviewDate))
      ),
    [localFollowups, patient.name]
  );
  const patientTrainingRecords = useMemo(
    () => trainingRows.filter((item) => item.patient === patient.name),
    [patient.name, trainingRows]
  );
  const selectedTrainingRecord = useMemo(
    () => patientTrainingRecords.find((item) => item.id === selectedTrainingId) ?? patientTrainingRecords[0] ?? null,
    [patientTrainingRecords, selectedTrainingId]
  );
  const optometryExam = effectiveVisitDetail.optometryExam ?? emptyVisitDetail.optometryExam;
  const rightAxialDelta = parseDeltaValue(optometryExam.right.axialLength.delta);
  const leftAxialDelta = parseDeltaValue(optometryExam.left.axialLength.delta);
  const aiClinicalInsights = useMemo(
    () => ({
      patientName: patient.name,
      age: patient.age,
      diagnosis: effectiveVisitDetail.diagnosis || "待补充",
      symptom: effectiveVisitDetail.chiefHistory.symptom || "待补充",
      rightAxialDelta,
      leftAxialDelta,
      rightK: optometryExam.right.keratometry || "-",
      leftK: optometryExam.left.keratometry || "-",
      advice: effectiveVisitDetail.treatment.advice || "建议持续观察并按期复诊。",
    }),
    [effectiveVisitDetail, leftAxialDelta, optometryExam.left.keratometry, optometryExam.right.keratometry, patient.age, patient.name, rightAxialDelta]
  );
  const quickActionGroups = useMemo<ArchiveAiQuickAction[][]>(
    () => [
      [
        {
          id: "axial-trend",
          title: "分析近三个月眼轴变化趋势",
          description: "结合当前验光数据识别近视进展风险",
          prompt: `请分析患者 ${patient.name} 近三个月眼轴变化趋势，并提示风险。`,
          icon: Activity,
          iconClassName: "bg-blue-50 text-blue-600",
        },
        {
          id: "cornea-fit",
          title: "评估当前角膜地形图配适状态",
          description: "基于曲率与临床表现做配适判断",
          prompt: `请基于当前角膜曲率与就诊信息，评估患者角膜地形图配适状态。`,
          icon: Search,
          iconClassName: "bg-violet-50 text-violet-600",
        },
        {
          id: "followup-summary",
          title: "自动生成本次随访小结与医嘱",
          description: "输出可直接复用的随访总结文案",
          prompt: `请为患者 ${patient.name} 生成本次随访小结与医嘱。`,
          icon: FileText,
          iconClassName: "bg-emerald-50 text-emerald-600",
        },
      ],
      [
        {
          id: "risk-review",
          title: "总结当前近视防控风险点",
          description: "聚焦高风险眼别与执行风险",
          prompt: `请总结患者 ${patient.name} 当前近视防控风险点，并按优先级排序。`,
          icon: Sparkles,
          iconClassName: "bg-amber-50 text-amber-600",
        },
        {
          id: "visit-qa",
          title: "解释本次就诊关键结论",
          description: "面向医生快速梳理诊断与观察重点",
          prompt: `请解释患者 ${patient.name} 本次就诊的关键结论与下一步观察重点。`,
          icon: Layers,
          iconClassName: "bg-sky-50 text-sky-600",
        },
        {
          id: "followup-plan",
          title: "生成下次复诊关注清单",
          description: "输出复诊时需要重点追踪的指标",
          prompt: `请为患者 ${patient.name} 生成下次复诊关注清单。`,
          icon: FileText,
          iconClassName: "bg-rose-50 text-rose-600",
        },
      ],
    ],
    [patient.name]
  );
  const currentQuickActions = quickActionGroups[aiQuickActionBatch] ?? quickActionGroups[0];

  const initialAiMessage = useMemo(() => {
    const rightDeltaText = `${rightAxialDelta.toFixed(2)}mm`;
    const leftDeltaText = `${leftAxialDelta.toFixed(2)}mm`;
    const riskSentence =
      rightAxialDelta >= 0.2
        ? `该患者右眼（OD）近三个月眼轴增长 ${rightDeltaText}，超出当前生理发育预期，近视控制效果欠佳。`
        : `该患者右眼（OD）近三个月眼轴增长 ${rightDeltaText}，需要持续观察防控效果。`;
    const leftSentence =
      leftAxialDelta <= 0.05
        ? `左眼（OS）控制良好（增长 ${leftDeltaText}）。`
        : `左眼（OS）当前增长 ${leftDeltaText}，建议继续追踪变化。`;

    return [
      `我是 Eye宝临床助手。已为您加载患者 ${aiClinicalInsights.patientName} 的全量档案数据。`,
      "⚠️ 风险提示：",
      riskSentence,
      leftSentence,
      `建议重点复核右眼角膜塑形镜配适情况，并结合当前诊断“${aiClinicalInsights.diagnosis}”与医嘱继续随访。`,
      `依据：当前角膜曲率 OD ${aiClinicalInsights.rightK}，OS ${aiClinicalInsights.leftK}。`,
    ].join("\n");
  }, [aiClinicalInsights.diagnosis, aiClinicalInsights.leftK, aiClinicalInsights.patientName, aiClinicalInsights.rightK, leftAxialDelta, rightAxialDelta]);

  const buildAiReply = (prompt: string) => {
    const normalizedPrompt = prompt.toLowerCase();

    if (/眼轴|趋势|近三个月/.test(normalizedPrompt)) {
      return [
        "眼轴趋势分析：",
        "",
        `- 右眼增幅 ${rightAxialDelta.toFixed(2)}mm，${rightAxialDelta >= 0.2 ? "已达到重点风险阈值" : "需持续动态观察"}。`,
        `- 左眼增幅 ${leftAxialDelta.toFixed(2)}mm，${leftAxialDelta <= 0.05 ? "控制相对稳定" : "仍需关注进展"}。`,
        "- 建议优先复核右眼镜片配适、夜戴依从性与近距离用眼行为。",
      ].join("\n");
    }

    if (/角膜|配适/.test(normalizedPrompt)) {
      return [
        "角膜地形图配适评估：",
        "",
        `- 当前角膜曲率 OD ${aiClinicalInsights.rightK}，OS ${aiClinicalInsights.leftK}。`,
        `- 结合当前主诉“${aiClinicalInsights.symptom}”与眼部检查结果，右眼需重点排查镜片定位与压迫环稳定性。`,
        "- 建议下次复诊增加角膜荧光素染色与镜片配适复核。",
      ].join("\n");
    }

    if (/随访|小结|医嘱|复诊/.test(normalizedPrompt)) {
      return [
        "本次随访小结与医嘱：",
        "",
        `- 本次诊断：${aiClinicalInsights.diagnosis}。`,
        `- 主要风险：右眼眼轴进展偏快，左眼相对稳定。`,
        `- 建议医嘱：${aiClinicalInsights.advice}`,
        "- 下次复诊重点追踪眼轴、角膜曲率与配戴依从性。",
      ].join("\n");
    }

    return [
      "临床辅助结论：",
      "",
      `- 当前患者：${aiClinicalInsights.patientName}，${aiClinicalInsights.age} 岁。`,
      `- 当前诊断：${aiClinicalInsights.diagnosis}。`,
      `- 右眼风险高于左眼，建议优先关注右眼眼轴变化与镜片配适情况。`,
      `- 当前医嘱建议：${aiClinicalInsights.advice}`,
    ].join("\n");
  };

  const submitAiPrompt = (customPrompt?: string, tag?: string) => {
    const prompt = (customPrompt ?? aiInput).trim();
    if (!prompt) return;

    const reply = buildAiReply(prompt);
    setAiMessages((prev) => [...prev, createAiMessage("user", prompt, tag), createAiMessage("assistant", reply, "AI 分析")]);
    setAiInput("");
  };

  const handleQuickAction = (action: ArchiveAiQuickAction) => {
    setAiPanelOpen(true);
    submitAiPrompt(action.prompt, action.title);
  };

  useEffect(() => {
    if (!selectedVisitId) return;
    setTimeout(() => {
      setAiMessages([createAiMessage("assistant", initialAiMessage, "欢迎")]);
      setAiInput("");
    }, 0);
  }, [initialAiMessage, selectedVisitId]);

  useEffect(() => {
    if (!aiEngineMenuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const container = aiEngineMenuRef.current;
      if (!container) return;
      if (container.contains(event.target as Node)) return;
      setAiEngineMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAiEngineMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [aiEngineMenuOpen]);

  return (
    <>
      <div className={clsx("h-full flex flex-col gap-6", activeTab === "visits" && aiPanelOpen && "xl:pr-[496px]")}>
      <div className="bg-white rounded-2xl card-shadow border border-gray-100 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              onClick={() => onBack?.()}
            >
              <ArrowLeft weight="bold" className="h-4 w-4" />
              返回列表
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAiPanelOpen((value) => !value)}
              className={clsx(
                "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                aiPanelOpen
                  ? "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
                  : "border-violet-600 bg-violet-600 text-white hover:bg-violet-700"
              )}
            >
              <Sparkles className="h-4 w-4" />
              {aiPanelOpen ? "收起临床助手" : "Eye宝临床助手"}
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 active:bg-primary-700"
              onClick={() => onCreateArchive?.(patient.id)}
            >
              <Plus weight="bold" className="h-4 w-4" />
              新增档案
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              onClick={() => onCreateFollowup?.(patient.id)}
            >
              发起回访
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <ArchiveGenderIcon
                gender={patient.gender}
                className="h-8 w-8 rounded-xl border-gray-100 bg-white"
                iconClassName="h-6 w-6"
              />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">{patient.name}</span>
                  <span className="text-xs text-gray-400">{patient.age}岁</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="font-semibold text-gray-700">{patient.no}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Phone weight="bold" className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold text-gray-700">{patient.mobile}</span>
                  </span>
                  <span className="text-gray-400">
                    最近就诊：<span className="font-semibold text-gray-700">{formatDateOnly(patient.latestVisit)}</span>
                  </span>
                  <span className="text-gray-400">
                    复查：<span className="font-semibold text-gray-700">{formatDateOnly(patient.nextReview)}</span>
                  </span>
                </div>
              </div>
            </div>
            <ArchiveProfileTags profile={patient.profile} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-visible">
        <div className="border-b border-gray-100 bg-gray-50 px-5 pt-4">
          <div className="flex flex-wrap items-end gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setActiveTab(t.key);
                  if (t.key !== "visits") setAiPanelOpen(false);
                }}
                className={
                  activeTab === t.key
                    ? "rounded-t-xl border border-gray-200 border-b-white bg-white px-5 py-2 text-sm font-semibold text-primary-600 -mb-px"
                    : "rounded-t-xl border border-gray-200 bg-gray-50 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-white -mb-px"
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {activeTab === "visits" && (
            !hasVisitRecords ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm font-semibold text-gray-500">
                暂无档案信息
              </div>
            ) : (
              <div className={clsx("grid gap-5", aiPanelOpen ? "xl:grid-cols-[320px_minmax(0,1fr)]" : "xl:grid-cols-[320px_minmax(0,1fr)_240px]")}>
              <aside>
                <div className="rounded-2xl border border-gray-100 bg-white p-4 xl:sticky xl:top-4 xl:z-10 xl:max-h-[calc(100vh-2rem)] xl:overflow-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold text-gray-900">就诊时间轴</div>
                    </div>
                    <span className="rounded-xl bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      共 {combinedVisits.length} 次
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {combinedVisits.map((v, idx) => {
                      const isInitial = idx === combinedVisits.length - 1;
                      const tagClass = isInitial
                        ? "border-sky-200 bg-sky-50 text-sky-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700";
                      const tagLabel = isInitial ? "初诊" : "复诊";
                      const store = v.store;
                      const visitTypeText = (v.visitTypes?.length ? v.visitTypes : ["就诊"]).join(" · ");
                      return (
                      <button
                        key={v.id}
                        onClick={() => {
                          setVisitEditMode(false);
                          setVisitDraft(visitOverrides[v.id] ?? localVisitDetails[v.id] ?? visitDetailRecords[v.id] ?? visitDetailRecords.v1);
                          setSelectedVisitId(v.id);
                        }}
                        className={
                          v.id === selectedVisitId
                            ? "w-full rounded-xl border border-primary-100 bg-primary-50 p-3 text-left"
                            : "w-full rounded-xl border border-gray-100 bg-white p-3 text-left hover:bg-gray-50"
                        }
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-bold text-gray-900">{v.date}</div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tagClass}`}>
                              {tagLabel}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold text-gray-700 line-clamp-1">{visitTypeText}</span>
                          <span className="text-xs font-semibold text-gray-500">{store}</span>
                        </div>
                      </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5">
                <div id="visit-overview" className="scroll-mt-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-900">就诊详情</div>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span
                      className={
                        visitEditMode
                          ? "inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"
                          : "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                      }
                    >
                      {visitEditMode ? (
                        <>
                          <PencilSimple weight="bold" className="h-3.5 w-3.5" />
                          编辑中
                        </>
                      ) : (
                        <>
                          <LockKey weight="bold" className="h-3.5 w-3.5" />
                          只读
                        </>
                      )}
                    </span>
                    {!visitEditMode ? (
                      <button
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                        onClick={() => {
                          setVisitDraft(effectiveVisitDetail);
                          setVisitEditMode(true);
                        }}
                      >
                        编辑内容
                      </button>
                    ) : (
                      <>
                        <button
                          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                          onClick={() => {
                            setVisitEditMode(false);
                            setVisitDraft(effectiveVisitDetail);
                          }}
                        >
                          取消
                        </button>
                        <button
                          className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 active:bg-primary-700"
                          onClick={() => {
                            setVisitOverrides((prev) => ({ ...prev, [selectedVisitId]: visitDraft }));
                            setVisitEditMode(false);
                            setSavedAt(Date.now());
                          }}
                        >
                          保存
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {savedAt !== 0 && (
                  <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    已保存（本地 mock）
                  </div>
                )}
                </div>

                <div id="visit-basic" className="scroll-mt-6 mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    <div className="text-sm font-bold text-gray-900">基本信息</div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <div className="text-sm text-gray-500">接诊医生</div>
                        {visitEditMode ? (
                          <input
                            value={visitDraft.basicInfo.doctor}
                            onChange={(e) =>
                              setVisitDraft((prev) => ({
                                ...prev,
                                basicInfo: { ...prev.basicInfo, doctor: e.target.value },
                              }))
                            }
                            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                          />
                        ) : (
                          <div className="mt-2 font-semibold text-gray-900">{effectiveVisitDetail.basicInfo.doctor || "/"}</div>
                        )}
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <div className="text-sm text-gray-500">验光师</div>
                        {visitEditMode ? (
                          <input
                            value={visitDraft.basicInfo.optometrist}
                            onChange={(e) =>
                              setVisitDraft((prev) => ({
                                ...prev,
                                basicInfo: { ...prev.basicInfo, optometrist: e.target.value },
                              }))
                            }
                            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                          />
                        ) : (
                          <div className="mt-2 font-semibold text-gray-900">{effectiveVisitDetail.basicInfo.optometrist || "/"}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    <div className="text-sm font-bold text-gray-900">诊断</div>
                    {visitEditMode ? (
                      <textarea
                        rows={3}
                        value={visitDraft.diagnosis}
                        onChange={(e) => setVisitDraft((prev) => ({ ...prev, diagnosis: e.target.value }))}
                        className="mt-4 w-full min-h-[120px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                      />
                    ) : (
                      <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm font-semibold text-gray-700 leading-7">
                        {effectiveVisitDetail.diagnosis || "-"}
                      </div>
                    )}
                  </div>
                </div>

                <div id="visit-chief" className="scroll-mt-6 mt-5 rounded-2xl border border-gray-100 bg-white p-5">
                  <div className="text-sm font-bold text-gray-900">主诉与病史</div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-4">
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">眼别</div>
                      {visitEditMode ? (
                        <select
                          value={visitDraft.chiefHistory.eye}
                          onChange={(e) =>
                            setVisitDraft((prev) => ({
                              ...prev,
                              chiefHistory: { ...prev.chiefHistory, eye: e.target.value },
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                        >
                          <option value="双眼">双眼</option>
                          <option value="右眼">右眼（OD）</option>
                          <option value="左眼">左眼（OS）</option>
                        </select>
                      ) : (
                        <div className="mt-2 font-semibold text-gray-900">{formatEyeLabel(effectiveVisitDetail.chiefHistory.eye)}</div>
                      )}
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">症状</div>
                      {visitEditMode ? (
                        <input
                          value={visitDraft.chiefHistory.symptom}
                          onChange={(e) =>
                            setVisitDraft((prev) => ({
                              ...prev,
                              chiefHistory: { ...prev.chiefHistory, symptom: e.target.value },
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                        />
                      ) : (
                        <div className="mt-2 font-semibold text-gray-900">{effectiveVisitDetail.chiefHistory.symptom}</div>
                      )}
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">持续时长</div>
                      {visitEditMode ? (
                        <input
                          value={visitDraft.chiefHistory.duration}
                          onChange={(e) =>
                            setVisitDraft((prev) => ({
                              ...prev,
                              chiefHistory: { ...prev.chiefHistory, duration: e.target.value },
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                        />
                      ) : (
                        <div className="mt-2 font-semibold text-gray-900">
                          {effectiveVisitDetail.chiefHistory.duration || "-"}
                        </div>
                      )}
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">单位</div>
                      {visitEditMode ? (
                        <select
                          value={visitDraft.chiefHistory.durationUnit}
                          onChange={(e) =>
                            setVisitDraft((prev) => ({
                              ...prev,
                              chiefHistory: { ...prev.chiefHistory, durationUnit: e.target.value },
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                        >
                          <option value="日">日</option>
                          <option value="周">周</option>
                          <option value="月">月</option>
                          <option value="年">年</option>
                        </select>
                      ) : (
                        <div className="mt-2 font-semibold text-gray-900">{effectiveVisitDetail.chiefHistory.durationUnit || "-"}</div>
                      )}
                    </div>
                  </div>
                  {visitEditMode ? (
                    <textarea
                      value={visitDraft.chiefHistory.description}
                      onChange={(e) =>
                        setVisitDraft((prev) => ({
                          ...prev,
                          chiefHistory: { ...prev.chiefHistory, description: e.target.value },
                        }))
                      }
                      className="mt-4 w-full min-h-[140px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                    />
                  ) : (
                    <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                      {effectiveVisitDetail.chiefHistory.description}
                    </div>
                  )}
                </div>

                <div className="mt-5 rounded-3xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] overflow-hidden">
                  <div className="flex flex-col gap-2 border-b border-gray-100 bg-gray-50 px-6 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="text-[15px] font-bold text-gray-900">验光检查数据</div>
                    <div className="text-sm font-medium text-gray-500">
                      验光师：<span className="font-semibold text-gray-900">{optometryExam.optometrist || "/"}</span>
                    </div>
                  </div>
                  <div className="grid gap-4 p-5 lg:grid-cols-2">
                    {optometryPanels.map((panel) => {
                      const eyeData = panel.key === "right" ? optometryExam.right : optometryExam.left;
                      const metrics = [
                        { label: "眼轴长度 (AL)", metric: eyeData.axialLength },
                        { label: "球镜 (SPH)", metric: eyeData.sphere },
                        { label: "柱镜 (CYL)", metric: eyeData.cylinder },
                        { label: "角膜曲率 (K1/K2)", value: eyeData.keratometry || "-" },
                      ];

                      return (
                        <div
                          key={panel.key}
                          className={clsx("rounded-2xl border px-5 py-4", panel.panelClassName)}
                        >
                          <div className="flex items-center gap-3 text-[15px] font-bold text-gray-900">
                            <span className={clsx("h-2.5 w-2.5 rounded-full", panel.dotClassName)} />
                            <span>{panel.title}</span>
                          </div>
                          <div className="mt-5 space-y-4">
                            {metrics.map((item) => {
                              const metric = "metric" in item ? item.metric : undefined;
                              const isRightAxialRisk = panel.key === "right" && item.label === "眼轴长度 (AL)";

                              return (
                                <div key={item.label} className="flex items-center justify-between gap-4">
                                  <div className="text-[15px] font-medium text-gray-500">{item.label}</div>
                                  {metric ? (
                                    <div className="flex items-center gap-2 text-right">
                                      <span className="text-[15px] font-bold text-gray-900">{metric.value || "-"}</span>
                                      {metric.delta ? (
                                        <span
                                          className={clsx(
                                            "text-sm font-semibold",
                                            isRightAxialRisk
                                              ? "text-rose-500"
                                              : metric.trend === "down"
                                              ? "text-sky-600"
                                              : metric.trend === "flat"
                                                ? "text-gray-400"
                                                : "text-emerald-600"
                                          )}
                                        >
                                          {metric.delta}
                                        </span>
                                      ) : null}
                                    </div>
                                  ) : (
                                    <div className="text-[15px] font-bold text-gray-900">{item.value}</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div id="visit-exams" className="scroll-mt-6 mt-5 space-y-4">
                  <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50 px-5 py-4 text-sm font-bold text-gray-900">眼部检查</div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="text-xs uppercase tracking-[0.18em] text-gray-400">
                          <tr>
                            <th className="px-5 py-4 font-semibold">检查项目</th>
                            <th className="px-5 py-4 font-semibold">右眼（OD）</th>
                            <th className="px-5 py-4 font-semibold">左眼（OS）</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(visitEditMode ? visitDraft.eyeExam : effectiveVisitDetail.eyeExam).map((row, idx) => (
                            <tr key={`${row.label}-${idx}`} className="hover:bg-gray-50">
                              <td className="px-5 py-4 font-semibold text-gray-700 whitespace-nowrap">{row.label}</td>
                              <td className="px-5 py-4">
                                {visitEditMode ? (
                                  <input
                                    value={visitDraft.eyeExam[idx]?.right ?? ""}
                                    onChange={(e) =>
                                      setVisitDraft((prev) => ({
                                        ...prev,
                                        eyeExam: prev.eyeExam.map((r, i) => (i === idx ? { ...r, right: e.target.value } : r)),
                                      }))
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                                  />
                                ) : (
                                  <div className="w-full rounded-xl bg-gray-50 px-4 py-2 font-semibold text-gray-900">
                                    {row.right || "-"}
                                  </div>
                                )}
                              </td>
                              <td className="px-5 py-4">
                                {visitEditMode ? (
                                  <input
                                    value={visitDraft.eyeExam[idx]?.left ?? ""}
                                    onChange={(e) =>
                                      setVisitDraft((prev) => ({
                                        ...prev,
                                        eyeExam: prev.eyeExam.map((r, i) => (i === idx ? { ...r, left: e.target.value } : r)),
                                      }))
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                                  />
                                ) : (
                                  <div className="w-full rounded-xl bg-gray-50 px-4 py-2 font-semibold text-gray-900">
                                    {row.left || "-"}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50 px-5 py-4 text-sm font-bold text-gray-900">辅助检查</div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="text-xs uppercase tracking-[0.18em] text-gray-400">
                          <tr>
                            <th className="px-5 py-4 font-semibold">检查项目</th>
                            <th className="px-5 py-4 font-semibold">右眼（OD）</th>
                            <th className="px-5 py-4 font-semibold">左眼（OS）</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(visitEditMode ? visitDraft.auxExam : effectiveVisitDetail.auxExam).map((row, idx) => (
                            <tr key={`${row.label}-${idx}`} className="hover:bg-gray-50">
                              <td className="px-5 py-4 font-semibold text-gray-700 whitespace-nowrap">{row.label}</td>
                              <td className="px-5 py-4">
                                {visitEditMode ? (
                                  <input
                                    value={visitDraft.auxExam[idx]?.right ?? ""}
                                    onChange={(e) =>
                                      setVisitDraft((prev) => ({
                                        ...prev,
                                        auxExam: prev.auxExam.map((r, i) => (i === idx ? { ...r, right: e.target.value } : r)),
                                      }))
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                                  />
                                ) : (
                                  <div className="w-full rounded-xl bg-gray-50 px-4 py-2 font-semibold text-gray-900">
                                    {row.right || "-"}
                                  </div>
                                )}
                              </td>
                              <td className="px-5 py-4">
                                {visitEditMode ? (
                                  <input
                                    value={visitDraft.auxExam[idx]?.left ?? ""}
                                    onChange={(e) =>
                                      setVisitDraft((prev) => ({
                                        ...prev,
                                        auxExam: prev.auxExam.map((r, i) => (i === idx ? { ...r, left: e.target.value } : r)),
                                      }))
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                                  />
                                ) : (
                                  <div className="w-full rounded-xl bg-gray-50 px-4 py-2 font-semibold text-gray-900">
                                    {row.left || "-"}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div id="visit-treatment" className="scroll-mt-6 mt-5 space-y-4">
                  <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    <div className="text-sm font-bold text-gray-900">处理</div>
                    <div className="mt-4 space-y-4">
                      <div className="rounded-2xl bg-gray-50 p-5">
                        <div className="text-sm font-bold text-gray-900">检查</div>
                        <div className="mt-4 grid grid-cols-4 gap-3 text-xs font-semibold text-gray-400">
                          <div>项目</div>
                          <div>数量</div>
                          <div>单位</div>
                          <div>单价</div>
                        </div>
                        <div className="mt-2 grid grid-cols-4 gap-3 text-sm font-semibold text-gray-900">
                          <div>{effectiveVisitDetail.treatment.inspection.item || "无数据"}</div>
                          <div>{effectiveVisitDetail.treatment.inspection.quantity || "0"}</div>
                          <div>{effectiveVisitDetail.treatment.inspection.unit || "无数据"}</div>
                          <div>{effectiveVisitDetail.treatment.inspection.price || "0 元"}</div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          总价：<span className="font-semibold text-gray-900">{effectiveVisitDetail.treatment.inspection.total || "0 元"}</span>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-5">
                        <div className="text-sm font-bold text-gray-900">处方</div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-4">
                          {(
                            [
                              { key: "drug", label: "药品名" },
                              { key: "quantity", label: "数量" },
                              { key: "spec", label: "规格" },
                              { key: "unit", label: "单位" },
                            ] as const
                          ).map((f) => (
                            <div key={f.key}>
                              <div className="text-xs font-semibold text-gray-400">{f.label}</div>
                              <div className="mt-2 text-sm font-semibold text-gray-900">
                                {effectiveVisitDetail.treatment.prescription[f.key] || (f.key === "quantity" ? "0" : "无数据")}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                          {(
                            [
                              { key: "price", label: "单价" },
                              { key: "eye", label: "眼别" },
                              { key: "usage", label: "用法" },
                            ] as const
                          ).map((f) => (
                            <div key={f.key}>
                              <div className="text-xs font-semibold text-gray-400">{f.label}</div>
                              <div className="mt-2 text-sm font-semibold text-gray-900">
                                {effectiveVisitDetail.treatment.prescription[f.key] || "无数据"}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          总价：<span className="font-semibold text-gray-900">{effectiveVisitDetail.treatment.prescription.total || "0 元"}</span>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-5">
                        <div className="text-sm font-bold text-gray-900">治疗</div>
                        <div className="mt-4 grid grid-cols-4 gap-3 text-xs font-semibold text-gray-400">
                          <div>项目名</div>
                          <div>数量</div>
                          <div>单位</div>
                          <div>单价</div>
                        </div>
                        <div className="mt-2 grid grid-cols-4 gap-3 text-sm font-semibold text-gray-900">
                          <div>{effectiveVisitDetail.treatment.therapy.item || "无数据"}</div>
                          <div>{effectiveVisitDetail.treatment.therapy.quantity || "0"}</div>
                          <div>{effectiveVisitDetail.treatment.therapy.unit || "无数据"}</div>
                          <div>{effectiveVisitDetail.treatment.therapy.price || "0 元"}</div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          总价：<span className="font-semibold text-gray-900">{effectiveVisitDetail.treatment.therapy.total || "0 元"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                      <div className="text-sm font-bold text-emerald-900">医生建议</div>
                      {visitEditMode ? (
                        <textarea
                          value={visitDraft.treatment.advice}
                          onChange={(e) =>
                            setVisitDraft((prev) => ({
                              ...prev,
                              treatment: { ...prev.treatment, advice: e.target.value },
                            }))
                          }
                          className="mt-4 w-full min-h-[140px] rounded-2xl border border-emerald-100 bg-white/70 px-4 py-3 text-sm text-gray-800 outline-none focus:border-emerald-200 focus:ring-2 focus:ring-emerald-100"
                        />
                      ) : (
                        <div className="mt-4 text-sm leading-7 text-emerald-900 whitespace-pre-wrap">
                          {effectiveVisitDetail.treatment.advice || "-"}
                        </div>
                      )}
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                      <div className="text-sm font-bold text-gray-900">门诊随访</div>
                      <div className="mt-4 space-y-5">
                        <div>
                          <div className="text-sm text-gray-500">复诊周期</div>
                          {visitEditMode ? (
                            <input
                              value={visitDraft.treatment.followupCycle}
                              onChange={(e) =>
                                setVisitDraft((prev) => ({
                                  ...prev,
                                  treatment: { ...prev.treatment, followupCycle: e.target.value },
                                }))
                              }
                              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                            />
                          ) : (
                            <div className="mt-2 font-semibold text-gray-900">{effectiveVisitDetail.treatment.followupCycle || "-"}</div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">预计复诊日期</div>
                          {visitEditMode ? (
                            <input
                              value={visitDraft.treatment.estimatedDate}
                              onChange={(e) =>
                                setVisitDraft((prev) => ({
                                  ...prev,
                                  treatment: { ...prev.treatment, estimatedDate: e.target.value },
                                }))
                              }
                              type="date"
                              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                            />
                          ) : (
                            <div className="mt-2 font-semibold text-gray-900">{effectiveVisitDetail.treatment.estimatedDate || "-"}</div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">复诊提醒发出日期</div>
                          {visitEditMode ? (
                            <input
                              value={visitDraft.treatment.reminderDate}
                              onChange={(e) =>
                                setVisitDraft((prev) => ({
                                  ...prev,
                                  treatment: { ...prev.treatment, reminderDate: e.target.value },
                                }))
                              }
                              type="date"
                              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                            />
                          ) : (
                            <div className="mt-2 font-semibold text-gray-900">{effectiveVisitDetail.treatment.reminderDate || "-"}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {!aiPanelOpen ? (
                <aside className="hidden xl:block">
                  <div className="rounded-2xl border border-gray-100 bg-white p-4 xl:sticky xl:top-4 xl:z-10 xl:max-h-[calc(100vh-2rem)] xl:overflow-auto">
                    <div className="text-sm font-bold text-gray-900">目录</div>
                    <div className="mt-3 space-y-2 text-sm">
                      {[
                        { id: "visit-overview", label: "本次就诊详情" },
                        { id: "visit-basic", label: "基本信息 / 诊断" },
                        { id: "visit-chief", label: "主诉与病史" },
                        { id: "visit-exams", label: "检查" },
                        { id: "visit-treatment", label: "处理" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          className="block w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                          onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>
              ) : null}
            </div>
            )
          )}

          {activeTab === "glasses" && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="text-base font-bold text-gray-900">配镜记录</div>
              <div className="mt-2 text-sm text-gray-500">配镜相关记录卡片内容，与配镜管理相关联，暂且占位，后续开发。</div>
            </div>
          )}

          {activeTab === "training" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <div className="border-b border-gray-100 p-4">
                  <div className="text-base font-bold text-gray-900">视光训练记录</div>
                  <div className="mt-1 text-sm text-gray-500">按客户维度展示历史视训记录，支持查看详情与本地删除。</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase tracking-[0.18em] text-gray-400">
                      <tr>
                        <th className="px-4 py-3 font-semibold">视训时间</th>
                        <th className="px-4 py-3 font-semibold">视训师</th>
                        <th className="px-4 py-3 font-semibold">门店</th>
                        <th className="px-4 py-3 font-semibold">备注</th>
                        <th className="px-4 py-3 font-semibold">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {patientTrainingRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold text-gray-900">{record.trainingTime}</td>
                          <td className="px-4 py-3 text-gray-700">{record.trainer}</td>
                          <td className="px-4 py-3 text-gray-700">{record.store}</td>
                          <td className="px-4 py-3 text-gray-500">{record.note}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-50"
                                onClick={() => setSelectedTrainingId(record.id)}
                              >
                                查看
                              </button>
                              <button
                                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 font-semibold text-rose-600 hover:bg-rose-100"
                                onClick={() => {
                                  if (!window.confirm("确认删除该条视光训练记录吗？")) return;
                                  setTrainingRows((prev) => prev.filter((item) => item.id !== record.id));
                                  setSelectedTrainingId((prev) => (prev === record.id ? null : prev));
                                }}
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {patientTrainingRecords.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-500">
                            暂无数据
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedTrainingRecord && (
                <section className="rounded-2xl border border-gray-100 bg-white p-5">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-base font-bold text-gray-900">视训详情</div>
                      <div className="mt-1 text-sm text-gray-500">展示本次训练的核心信息，便于在档案页快速查看。</div>
                    </div>
                    <span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
                      {selectedTrainingRecord.project}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">视训时间</div>
                      <div className="mt-2 font-semibold text-gray-900">{selectedTrainingRecord.trainingTime}</div>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">视训师</div>
                      <div className="mt-2 font-semibold text-gray-900">{selectedTrainingRecord.trainer}</div>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">训练时长</div>
                      <div className="mt-2 font-semibold text-gray-900">{selectedTrainingRecord.duration} 分钟</div>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">完成度</div>
                      <div className="mt-2 font-semibold text-gray-900">{selectedTrainingRecord.completion}%</div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                    <div className="text-sm text-gray-500">备注</div>
                    <div className="mt-2 text-sm leading-7 text-gray-700">{selectedTrainingRecord.note}</div>
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
              <div className="border-b border-gray-100 p-4">
                <div className="text-base font-bold text-gray-900">预约记录</div>
                <div className="mt-1 text-sm text-gray-500">按原型示例数据展示该客户相关预约。</div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase tracking-[0.18em] text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">日期</th>
                      <th className="px-4 py-3 font-semibold">时间</th>
                      <th className="px-4 py-3 font-semibold">门店</th>
                      <th className="px-4 py-3 font-semibold">诊室</th>
                      <th className="px-4 py-3 font-semibold">来源</th>
                      <th className="px-4 py-3 font-semibold">状态</th>
                      <th className="px-4 py-3 font-semibold">备注</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {patientAppointments.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900">{a.date}</td>
                        <td className="px-4 py-3 font-semibold text-gray-700">{a.time}</td>
                        <td className="px-4 py-3 text-gray-700">{a.store}</td>
                        <td className="px-4 py-3 text-gray-700">{a.room}</td>
                        <td className="px-4 py-3 text-gray-700">{a.source}</td>
                        <td className="px-4 py-3 text-gray-700">{a.status}</td>
                        <td className="px-4 py-3 text-gray-500">{a.note}</td>
                      </tr>
                    ))}
                    {patientAppointments.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                          暂无数据
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "followup" && (
            <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
              <div className="border-b border-gray-100 p-4 flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-gray-900">回访记录</div>
                  <div className="mt-1 text-sm text-gray-500">按原型示例数据展示该客户相关回访，就诊档案完成的同时自动创建回访记录以及提醒日期。</div>
                </div>
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 active:bg-primary-700"
                  onClick={() => onCreateFollowup?.(patient.id)}
                >
                  发起回访
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase tracking-[0.18em] text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">最近就诊</th>
                      <th className="px-4 py-3 font-semibold">诊断</th>
                      <th className="px-4 py-3 font-semibold">项目</th>
                      <th className="px-4 py-3 font-semibold">复查日期</th>
                      <th className="px-4 py-3 font-semibold">提醒时间</th>
                      <th className="px-4 py-3 font-semibold">状态</th>
                      <th className="px-4 py-3 font-semibold">结果</th>
                      <th className="px-4 py-3 font-semibold">负责人</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {patientFollowups.map((f) => {
                      const due = isDateDue(f.reminderDate);
                      return (
                      <tr key={f.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900">{f.latestVisit}</td>
                        <td className="px-4 py-3 text-gray-700">{f.diagnosis}</td>
                        <td className="px-4 py-3 text-gray-700">{f.treatment}</td>
                        <td className="px-4 py-3 text-gray-700">{f.reviewDate}</td>
                        <td className="px-4 py-3 text-gray-700">
                          {f.reminderDate ? (
                            <span className="inline-flex items-center gap-2">
                              <Alarm
                                weight="bold"
                                className={clsx(
                                  "h-4 w-4 origin-top",
                                  due ? "text-red-500 animate-[alarm-shake_0.6s_ease-in-out_infinite]" : "text-gray-300"
                                )}
                              />
                              <span className={due ? "font-semibold text-red-600" : "text-gray-700"}>{f.reminderDate}</span>
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{f.status}</td>
                        <td className="px-4 py-3 text-gray-500">{f.result}</td>
                        <td className="px-4 py-3 text-gray-700">{f.owner}</td>
                      </tr>
                      );
                    })}
                    {patientFollowups.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-500">
                          暂无数据
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "consumption" && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="text-base font-bold text-gray-900">消费记录</div>
              <div className="mt-2 text-sm text-gray-500">该模块后续按原型与接口清单补齐，与消费管理页面关联，这里先占位。</div>
            </div>
          )}
        </div>
      </div>

      </div>

      {aiPanelOpen && activeTab === "visits" ? (
        <aside className="hidden xl:fixed xl:right-0 xl:top-20 xl:block xl:h-[calc(100vh-5rem)] xl:w-[472px]">
          <div className="flex h-full flex-col overflow-hidden rounded-none border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
            <div className="border-b border-slate-100 bg-white px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[24px] font-bold leading-none text-slate-900">Eye宝临床助手</h3>
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      双驱动大模型
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-400">AI 生成内容仅供临床参考，不作为最终诊断。</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAiPanelOpen(false)}
                  className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">快捷分析</div>
                    <div className="mt-1 text-xs text-slate-400">基于当前患者</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiQuickActionBatch((value) => (value + 1) % quickActionGroups.length)}
                    className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                  >
                    换一批
                  </button>
                </div>
                <div className="mt-3 space-y-2.5">
                  {currentQuickActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleQuickAction(action)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-left transition-all hover:border-violet-200 hover:bg-violet-50/30"
                    >
                      <div className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", action.iconClassName)}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900">{action.title}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
              {aiMessages.map((message) => (
                <div
                  key={message.id}
                  className={clsx("flex items-start gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "assistant" ? (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <Sparkles className="h-4 w-4 text-violet-600" />
                    </div>
                  ) : null}
                  <div
                    className={clsx(
                      "max-w-[94%] rounded-[24px] px-4 py-4 shadow-sm",
                      message.role === "user"
                        ? "rounded-br-md bg-blue-600 text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    <div
                      className={clsx(
                        "flex items-center gap-2 text-[11px] font-bold",
                        message.role === "user" ? "justify-end text-right" : "justify-start"
                      )}
                    >
                      {message.role === "user" ? <span className="text-white/70">{message.time}</span> : <span>AI 助手</span>}
                      {message.tag ? (
                        <span
                          className={clsx(
                            "rounded-full px-2 py-0.5",
                            message.role === "user" ? "bg-white/15 text-white/90" : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {message.tag}
                        </span>
                      ) : null}
                      {message.role === "assistant" ? <span className="text-slate-400">{message.time}</span> : null}
                    </div>
                    <div
                      className={clsx(
                        "mt-3 border-t pt-3 whitespace-pre-wrap text-sm leading-7",
                        message.role === "user" ? "border-white/25 text-white" : "border-slate-200 text-slate-700"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                  {message.role === "user" ? (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      你
                    </div>
                  ) : null}
                </div>
              ))}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-white px-5 py-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-3">
                <textarea
                  value={aiInput}
                  onChange={(event) => setAiInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      submitAiPrompt();
                    }
                  }}
                  rows={2}
                  placeholder="输入临床问题或指令..."
                  className="w-full resize-none bg-transparent px-1 py-1 text-sm leading-6 text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div ref={aiEngineMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setAiEngineMenuOpen((value) => !value)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      {aiEngine === "WEyeAI" ? (
                        <Sparkles className="h-4 w-4 text-violet-600" />
                      ) : aiEngine === "DeepSeek" ? (
                        <Cpu className="h-4 w-4 text-slate-600" />
                      ) : (
                        <Layers className="h-4 w-4 text-slate-600" />
                      )}
                      <span>{aiEngine === "WEyeAI" ? "WEyeAI" : aiEngine === "DeepSeek" ? "DeepSeek" : "千问"}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </button>
                    {aiEngineMenuOpen ? (
                      <div className="absolute bottom-full left-0 mb-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                        <button
                          type="button"
                          onClick={() => {
                            setAiEngine("WEyeAI");
                            setAiEngineMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Sparkles className="h-4 w-4 text-violet-600" />
                          <span className="font-bold">WEyeAI</span>
                          <span className="ml-auto text-xs text-slate-400">默认</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAiEngine("DeepSeek");
                            setAiEngineMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Cpu className="h-4 w-4 text-slate-600" />
                          <span className="font-bold">DeepSeek</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAiEngine("Qwen");
                            setAiEngineMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Layers className="h-4 w-4 text-slate-600" />
                          <span className="font-bold">千问</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => submitAiPrompt()}
                    className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-700"
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
