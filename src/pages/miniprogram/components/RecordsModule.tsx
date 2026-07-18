import { ClipboardList, User } from 'lucide-react';
import { EyeBao } from './EyeBao';

export function RecordsModule() {
  return (
    <div className="flex h-full flex-col px-4 pb-6 pt-2">
      <div className="mb-2 flex justify-center">
        <EyeBao className="h-24 w-24 drop-shadow-md" />
      </div>

      <div className="relative z-0 h-28 rounded-t-2xl bg-gradient-to-r from-blue-400 to-blue-500 p-4 text-white shadow-md">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-sm">
            <User size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-lg font-bold">
              <span>周末</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-normal">男/11岁</span>
            </div>
            <div className="mt-1 text-xs text-blue-100">档案号: OPT-20260718</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-6 flex min-h-[300px] flex-1 flex-col rounded-2xl bg-white p-4 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
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
            <button className="rounded-md bg-blue-500 px-3 py-1 text-xs text-white shadow-sm">眼轴</button>
            <button className="rounded-md px-3 py-1 text-xs text-gray-500">屈光度</button>
          </div>
        </div>

        <div className="mt-4 flex flex-1 flex-col items-center justify-center space-y-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-50">
            <ClipboardList size={40} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">暂无检查记录~</p>
          <button className="w-48 rounded-full bg-blue-500 px-10 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-600">
            去预约
          </button>
        </div>
      </div>
    </div>
  );
}
