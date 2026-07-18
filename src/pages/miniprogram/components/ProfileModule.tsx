import { Award, Calendar, ChevronLeft, ChevronRight, Circle, CreditCard, Edit3, FileText, MoreHorizontal, Plus, QrCode, User } from 'lucide-react';

type ProfileModuleProps = {
  onBack: () => void;
};

const PROFILE_LINKS = [
  { label: '积分明细', icon: <Award size={20} className="text-orange-500" /> },
  { label: '消费记录', icon: <CreditCard size={20} className="text-purple-500" /> },
  { label: '预约记录', icon: <Calendar size={20} className="text-blue-500" /> },
  { label: '萌主二维码', icon: <QrCode size={20} className="text-green-500" /> }
];

export function ProfileModule({ onBack }: ProfileModuleProps) {
  return (
    <div className="absolute inset-0 z-50 flex h-full flex-col bg-gradient-to-b from-purple-50 via-blue-50/30 to-gray-50">
      <div className="relative flex items-center justify-between px-4 pb-4 pt-12">
        <div className="-ml-2 cursor-pointer p-2" onClick={onBack}>
          <ChevronLeft size={24} className="text-gray-800" />
        </div>
        <div className="text-lg font-bold text-gray-800">个人中心</div>
        <div className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white/50 px-3 py-1.5 backdrop-blur-sm">
          <MoreHorizontal size={18} className="text-black" />
          <div className="h-4 w-px bg-gray-300" />
          <Circle size={18} className="text-black" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="mb-6 mt-2 flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-gray-200 shadow-sm">
            <User size={32} className="text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">未设置昵称</span>
            <Edit3 size={16} className="cursor-pointer text-gray-400" />
          </div>
        </div>

        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-base font-bold text-gray-800">添加萌主信息</span>
            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-blue-500 text-blue-500">
              <Plus size={16} />
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="relative flex h-20 flex-1 cursor-pointer flex-col justify-between overflow-hidden rounded-xl bg-teal-50 p-3">
              <div className="z-10 flex items-center text-sm font-medium text-teal-700">
                检查报告
                <ChevronRight size={14} className="ml-1 rounded-full bg-teal-200 text-teal-800" />
              </div>
              <FileText size={40} className="absolute -bottom-2 -right-2 text-teal-100 opacity-80" />
            </div>
            <div className="relative flex h-20 flex-1 cursor-pointer flex-col justify-between overflow-hidden rounded-xl bg-blue-50 p-3">
              <div className="z-10 flex items-center text-sm font-medium text-blue-700">
                就诊记录
                <ChevronRight size={14} className="ml-1 rounded-full bg-blue-200 text-blue-800" />
              </div>
              <Calendar size={40} className="absolute -bottom-2 -right-2 text-blue-100 opacity-80" />
            </div>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          {PROFILE_LINKS.map((item, index) => (
            <div key={item.label} className={`flex cursor-pointer items-center justify-between p-4 transition hover:bg-gray-50 ${index === PROFILE_LINKS.length - 1 ? '' : 'border-b border-gray-50'}`}>
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-gray-50 p-1.5">{item.icon}</div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          ))}
        </div>

        <button className="w-full rounded-2xl border border-gray-100 bg-white py-3.5 font-medium text-gray-600 shadow-sm transition active:bg-gray-50">
          退出登录
        </button>
      </div>
    </div>
  );
}
