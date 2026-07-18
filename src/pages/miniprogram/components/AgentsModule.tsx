import { Clock, Search, User } from 'lucide-react';

const AGENT_CATEGORIES = ['全部名医', '近视防控', '斜弱视专区', '角膜塑形镜'];

const DOCTORS = [
  {
    name: '徐蔚 教授',
    tag: '博导团队',
    tagClass: 'bg-blue-50 text-blue-600',
    hospital: '上海市眼病防治中心 视光中心',
    specialty: '擅长：儿童青少年近视防控、角膜塑形镜及各类特殊接触镜的验配、斜弱视诊治。',
    consultCount: '12.5 万人咨询',
    avatarClass: 'bg-blue-100 text-blue-500'
  },
  {
    name: '王明 专家',
    tag: '眼底病科',
    tagClass: 'bg-teal-50 text-teal-600',
    hospital: '复旦大学附属眼耳鼻喉科医院',
    specialty: '擅长：高度近视眼底病变、视网膜脱离、黄斑变性等复杂眼底疾病的影像学诊断。',
    consultCount: '8.2 万人咨询',
    avatarClass: 'bg-teal-100 text-teal-500'
  }
];

export function AgentsModule() {
  return (
    <div className="flex h-full flex-col bg-gray-50/50">
      <div className="px-4 pb-2 pt-2">
        <div className="flex items-center rounded-full border border-gray-100 bg-white px-4 py-2 shadow-sm">
          <Search size={18} className="mr-2 text-gray-400" />
          <input type="text" placeholder="搜索眼科专家/服务" className="flex-1 border-none bg-transparent text-sm focus:outline-none" />
        </div>
      </div>

      <div className="no-scrollbar flex space-x-6 overflow-x-auto border-b border-gray-100 px-4 py-3">
        {AGENT_CATEGORIES.map((category, index) => (
          <span
            key={category}
            className={`whitespace-nowrap pb-1 text-sm ${index === 0 ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`}
          >
            {category}
          </span>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 pb-8">
        {DOCTORS.map((doctor) => (
          <div key={doctor.name} className="rounded-2xl border border-gray-50 bg-white p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ${doctor.avatarClass}`}>
                  <User size={24} />
                </div>
                <div className="absolute -right-1 -top-1 rounded-full border-2 border-white bg-blue-500 px-1 text-[10px] font-bold text-white">AI</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold text-gray-900">{doctor.name}</span>
                  <span className={`rounded px-1.5 py-0.5 text-xs ${doctor.tagClass}`}>{doctor.tag}</span>
                </div>
                <div className="mt-1 flex items-center space-x-1 text-xs text-gray-500">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px]">三甲</span>
                  <span>{doctor.hospital}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">{doctor.specialty}</p>
                <div className="mt-2 flex items-center text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  {doctor.consultCount}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
