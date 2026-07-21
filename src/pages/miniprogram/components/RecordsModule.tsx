import { ClipboardList, Mars, Plus, User, Venus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EyeBao } from './EyeBao';

type MetricTab = '眼轴' | '屈光度';

type MetricSnapshot = {
  rightLabel: string;
  rightValue: string;
  leftLabel: string;
  leftValue: string;
  conclusion?: string;
};

type VisitRecord = {
  id: string;
  phaseLabel: string;
  date: string;
  summary: string;
  axial: MetricSnapshot;
  refraction: MetricSnapshot;
};

type ArchiveProfile = {
  id: string;
  name: string;
  gender: string;
  age: string;
  archiveNo: string;
  visitCount: number;
  emptyHint?: string;
  visits: VisitRecord[];
  isAddEntry?: boolean;
};

const METRIC_TABS: MetricTab[] = ['眼轴', '屈光度'];

const ARCHIVE_PROFILES: ArchiveProfile[] = [
  {
    id: 'weekend',
    name: '周末',
    gender: '男',
    age: '11岁',
    archiveNo: 'OPT-20260718',
    visitCount: 2,
    visits: [
      {
        id: 'visit-weekend-2',
        phaseLabel: '第 2 次复查',
        date: '2026-08-03',
        summary: '复查评估 / 眼轴趋势 / 屈光变化',
        axial: {
          rightLabel: '右眼眼轴',
          rightValue: '24.36 mm',
          leftLabel: '左眼眼轴',
          leftValue: '24.28 mm',
          conclusion: '建议继续复查'
        },
        refraction: {
          rightLabel: '右眼屈光度',
          rightValue: '-2.25D',
          leftLabel: '左眼屈光度',
          leftValue: '-2.00D',
          conclusion: '角膜塑形镜适配中'
        }
      },
      {
        id: 'visit-weekend-1',
        phaseLabel: '第 1 次初诊',
        date: '2026-07-18',
        summary: '初诊建档 / 裸眼视力 / 屈光度',
        axial: {
          rightLabel: '右眼眼轴',
          rightValue: '24.18 mm',
          leftLabel: '左眼眼轴',
          leftValue: '24.12 mm',
          conclusion: '建立基线数据'
        },
        refraction: {
          rightLabel: '右眼屈光度',
          rightValue: '-1.75D',
          leftLabel: '左眼屈光度',
          leftValue: '-1.50D',
          conclusion: '建议定期观察'
        }
      }
    ]
  },
  {
    id: 'anna',
    name: '安安',
    gender: '女',
    age: '8岁',
    archiveNo: 'OPT-20260726',
    visitCount: 1,
    visits: [
      {
        id: 'visit-anna-1',
        phaseLabel: '第 1 次检查',
        date: '2026-07-26',
        summary: '视功能筛查 / 眼轴评估 / 用眼建议',
        axial: {
          rightLabel: '右眼眼轴',
          rightValue: '23.84 mm',
          leftLabel: '左眼眼轴',
          leftValue: '23.79 mm',
          conclusion: '目前趋势平稳'
        },
        refraction: {
          rightLabel: '右眼屈光度',
          rightValue: '-0.75D',
          leftLabel: '左眼屈光度',
          leftValue: '-0.50D',
          conclusion: '建议减少近距离用眼'
        }
      }
    ]
  },
  {
    id: 'new-profile',
    name: '新成员',
    gender: '待补充',
    age: '待补充',
    archiveNo: '创建后生成',
    visitCount: 0,
    emptyHint: '新增后可以先绑定基础档案，暂无检查记录时也能直接去预约。',
    visits: [],
    isAddEntry: true
  }
];

function getLatestVisitId(visits: VisitRecord[]) {
  if (visits.length === 0) {
    return '';
  }

  return [...visits]
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())[0]
    .id;
}

function getProfileTone(gender: string) {
  if (gender === '女') {
    return {
      icon: Venus,
      activeButton: 'border-pink-200 bg-pink-50 text-pink-600',
      activeIcon: 'bg-pink-100 text-pink-500',
      pill: 'bg-pink-50 text-pink-500'
    };
  }

  return {
    icon: Mars,
    activeButton: 'border-blue-200 bg-blue-50 text-blue-600',
    activeIcon: 'bg-blue-100 text-blue-500',
    pill: 'bg-blue-50 text-blue-500'
  };
}

export function RecordsModule() {
  const defaultExpandedVisitIdByProfile = useMemo(
    () =>
      Object.fromEntries(
        ARCHIVE_PROFILES.filter((profile) => profile.visits.length > 0).map((profile) => [
          profile.id,
          getLatestVisitId(profile.visits)
        ])
      ) as Record<string, string>,
    []
  );
  const [activeProfileId, setActiveProfileId] = useState('weekend');
  const [expandedVisitIdByProfile, setExpandedVisitIdByProfile] = useState<Record<string, string>>(defaultExpandedVisitIdByProfile);
  const [metricTabByVisit, setMetricTabByVisit] = useState<Record<string, MetricTab>>({
    'visit-weekend-2': '眼轴',
    'visit-weekend-1': '眼轴',
    'visit-anna-1': '眼轴'
  });

  const activeProfile = useMemo(
    () => ARCHIVE_PROFILES.find((profile) => profile.id === activeProfileId) ?? ARCHIVE_PROFILES[0],
    [activeProfileId]
  );

  const expandedVisitId = expandedVisitIdByProfile[activeProfile.id];

  return (
    <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-2">
      <div className="mb-2 flex justify-center">
        <EyeBao className="h-24 w-24 drop-shadow-md" />
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {ARCHIVE_PROFILES.map((profile) => {
          const isActive = profile.id === activeProfile.id;
          const tone = getProfileTone(profile.gender);
          const GenderIcon = tone.icon;

          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => {
                setActiveProfileId(profile.id);

                const latestVisitId = getLatestVisitId(profile.visits);
                if (!latestVisitId) {
                  return;
                }

                setExpandedVisitIdByProfile((prev) => ({
                  ...prev,
                  [profile.id]: prev[profile.id] || latestVisitId
                }));
              }}
              className={`min-w-[88px] rounded-2xl border px-3 py-3 text-left shadow-sm transition ${
                isActive
                  ? tone.activeButton
                  : profile.isAddEntry
                    ? 'border-dashed border-blue-200 bg-white/80 text-blue-500'
                    : 'border-blue-100 bg-white/85 text-gray-700'
              }`}
            >
              {profile.isAddEntry ? (
                <div className="flex items-center justify-center text-sm font-semibold">
                  <Plus size={16} className="mr-1.5" />
                  新增
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      isActive ? tone.activeIcon : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <GenderIcon size={13} />
                  </div>
                  <div className="text-sm font-bold">{profile.name}</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="no-scrollbar h-full overflow-y-auto pb-28">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-lg">
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 px-4 pb-4 pt-4 text-white shadow-md">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-sm">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-lg font-bold">
                    <span>{activeProfile.name}</span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-normal">
                      {activeProfile.gender}/{activeProfile.age}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-blue-100">档案号: {activeProfile.archiveNo}</div>
                </div>
              </div>
            </div>

            <div className="bg-white px-4 pb-4 pt-4">
              <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-400">当前档案信息</div>
                    <div className="mt-1 text-sm font-semibold text-slate-700">{activeProfile.name} 的档案主页</div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      activeProfile.gender === '女' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    共 {activeProfile.visitCount} 次就诊
                  </span>
                </div>
              </div>

              {activeProfile.visitCount === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-blue-100 bg-slate-50/70 px-4 py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <ClipboardList size={28} className="text-slate-300" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-500">暂无检查记录</p>
                  <p className="mt-2 text-xs leading-6 text-slate-400">{activeProfile.emptyHint}</p>
                </div>
              ) : null}
            </div>
          </div>

          {activeProfile.visitCount > 0 ? (
            <div className="mt-3 space-y-3">
              {activeProfile.visits.map((visit) => {
                const expanded = visit.id === expandedVisitId;
                const activeMetricTab = metricTabByVisit[visit.id] ?? '眼轴';
                const metric = activeMetricTab === '眼轴' ? visit.axial : visit.refraction;

                return (
                  <div key={visit.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md">
                    <button
                      type="button"
                      onClick={() => {
                        if (expanded) {
                          return;
                        }

                        setExpandedVisitIdByProfile((prev) => ({
                          ...prev,
                          [activeProfile.id]: visit.id
                        }));
                      }}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-700">
                          {visit.phaseLabel} · {visit.date}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">{visit.summary}</div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                          expanded ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                        }`}
                      >
                        {expanded ? '已展开' : '点击查看'}
                      </span>
                    </button>

                    {expanded ? (
                      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex space-x-4 text-sm font-medium">
                            <div className="flex items-center space-x-1">
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                              <span className="text-gray-700">右眼</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="h-2 w-2 rounded-full bg-purple-500" />
                              <span className="text-gray-700">左眼</span>
                            </div>
                          </div>
                          <div className="flex rounded-lg bg-blue-50 p-1">
                            {METRIC_TABS.map((tab) => (
                              <button
                                key={tab}
                                type="button"
                                onClick={() =>
                                  setMetricTabByVisit((prev) => ({
                                    ...prev,
                                    [visit.id]: tab
                                  }))
                                }
                                className={`rounded-md px-3 py-1 text-xs ${
                                  tab === activeMetricTab ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500'
                                }`}
                              >
                                {tab}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-b from-blue-50 to-white p-3">
                          <div className="relative h-28 overflow-hidden rounded-xl bg-[linear-gradient(180deg,rgba(59,130,246,0.08),rgba(59,130,246,0.02))]">
                            <div className="absolute inset-x-3 top-12 h-0.5 -rotate-6 rounded-full bg-green-400" />
                            <div className="absolute inset-x-3 top-16 h-0.5 -rotate-3 rounded-full bg-purple-400" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_58%)]" />
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="rounded-xl border border-slate-100 bg-white p-2">
                              <div className="text-[10px] text-slate-400">{metric.rightLabel}</div>
                              <div className="mt-1 text-xs font-bold text-slate-700">{metric.rightValue}</div>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-white p-2">
                              <div className="text-[10px] text-slate-400">{metric.leftLabel}</div>
                              <div className="mt-1 text-xs font-bold text-slate-700">{metric.leftValue}</div>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-white p-2">
                              <div className="text-[10px] text-slate-400">检查结论</div>
                              <div className="mt-1 text-xs font-bold text-slate-700">{metric.conclusion ?? '建议观察'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <button
            type="button"
            className="w-full rounded-full bg-blue-500 px-10 py-3 font-medium text-white shadow-[0_10px_24px_rgba(59,130,246,0.28)] transition hover:bg-blue-600"
          >
            去预约
          </button>
        </div>
      </div>
    </div>
  );
}
