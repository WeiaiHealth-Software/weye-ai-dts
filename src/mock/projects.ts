export type ProjectSummary = {
  id: string;
  code: string;
  status: '未开始' | '进行中' | '已结束';
  title: string;
  leader?: string;
  centers?: string[];
  totalCount: number;
  description: string;
};

export const PROJECTS: ProjectSummary[] = [
  {
    id: 'project_myopia',
    code: 'MYOPIA_2026',
    status: '进行中',
    title: '青少年近视防控临床研究',
    leader: '徐蔚',
    centers: ['上海市眼病防治中心', '徐州眼视光中心'],
    totalCount: 100,
    description: '围绕青少年近视防控开展多中心协作研究，覆盖受试者招募、访视管理与长期随访。'
  },
  {
    id: 'project_dry_eye',
    code: 'DRYEYE_2025',
    status: '已结束',
    title: '成人干眼症临床数据采集研究',
    leader: '周医生',
    centers: ['上海市眼病防治中心'],
    totalCount: 50,
    description: '聚焦成人干眼症诊疗过程中的真实世界数据收集，用于疗效分析与质量改进。'
  },
  {
    id: 'project_glaucoma',
    code: 'GLAUCOMA_PH3',
    status: '进行中',
    title: '新型降眼压滴眼液 III 期临床试验',
    leader: '赵医生',
    centers: ['上海眼病防治中心'],
    totalCount: 240,
    description: '评估试验药物在青光眼患者中的疗效和安全性，支持中心协作与过程留痕。'
  },
  {
    id: 'project_rwe',
    code: 'RWE_2024_018',
    status: '未开始',
    title: '创新药真实世界研究项目',
    leader: '李主任',
    centers: ['广州中山医院', '北京同仁医院'],
    totalCount: 180,
    description: '用于后续真实世界数据采集与观察性分析的项目准备库。'
  }
];
