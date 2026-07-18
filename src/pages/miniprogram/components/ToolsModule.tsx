import { Activity, ChevronRight, Eye, Gamepad2, Sun } from 'lucide-react';

const TOOL_CARDS = [
  {
    title: '户外打卡',
    description: '每日2小时防近视',
    icon: Sun,
    colorClass: 'bg-green-100 text-green-500'
  },
  {
    title: '视力自测',
    description: '居家E字表粗测',
    icon: Eye,
    colorClass: 'bg-blue-100 text-blue-500'
  },
  {
    title: '眼操监督',
    description: 'AI视觉姿势纠正',
    icon: Activity,
    colorClass: 'bg-purple-100 text-purple-500'
  },
  {
    title: '护眼小游戏',
    description: '训练睫状肌调节',
    icon: Gamepad2,
    colorClass: 'bg-orange-100 text-orange-500'
  }
];

export function ToolsModule() {
  return (
    <div className="space-y-4 px-4 pb-6 pt-4">
      <h2 className="px-1 text-lg font-bold text-gray-800">护眼小工具</h2>
      <div className="grid grid-cols-2 gap-4">
        {TOOL_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="flex flex-col items-center space-y-2 rounded-2xl border border-gray-50 bg-white p-4 text-center shadow-sm transition active:scale-95">
              <div className={`mb-1 flex h-12 w-12 items-center justify-center rounded-full ${card.colorClass}`}>
                <Icon size={24} />
              </div>
              <div className="text-sm font-medium text-gray-800">{card.title}</div>
              <div className="text-xs text-gray-400">{card.description}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 p-4 text-white shadow-md">
        <div>
          <div className="text-lg font-bold">护眼能量树</div>
          <div className="mt-1 text-xs text-teal-50">坚持打卡，兑换免费复查券</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-sm">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
}
