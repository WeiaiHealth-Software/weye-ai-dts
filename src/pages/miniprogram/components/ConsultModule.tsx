import { ArrowUp, ClipboardList, Clock, FileText, Hash, Mic } from 'lucide-react';
import { EyeBao } from './EyeBao';

type ConsultModuleProps = {
  inputText: string;
  onInputChange: (value: string) => void;
};

const QUICK_QUESTIONS = [
  '戴眼镜会让度数越戴越深吗？',
  '孩子近视了，角膜塑形镜和离焦镜片哪个更好？',
  '近视多少度需要做手术？多大年龄可以做？'
];

export function ConsultModule({ inputText, onInputChange }: ConsultModuleProps) {
  return (
    <div className="relative flex h-full flex-col pb-24">
      <div className="relative mt-6 flex flex-col items-center">
        <div className="absolute -top-2 right-2 rounded-2xl rounded-bl-none border border-blue-100 bg-white px-4 py-2 text-sm text-blue-500 shadow-sm">
          点击创建档案，
          <br />
          获取专属用眼建议~
        </div>
        <div className="mt-6 drop-shadow-xl transition-transform duration-300 hover:scale-105">
          <EyeBao />
        </div>
        <div className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-xl font-bold text-transparent">
          Hi，我是Eye宝
        </div>
      </div>

      <div className="mt-6 px-4">
        <h3 className="mb-3 px-2 text-sm text-gray-500">你可以这样问我</h3>
        <div className="rounded-3xl border border-white bg-white/80 p-2 shadow-sm backdrop-blur-md">
          {QUICK_QUESTIONS.map((question) => (
            <div key={question} className="flex cursor-pointer items-start rounded-2xl border-b border-gray-50 p-3 transition hover:bg-blue-50 last:border-0">
              <div className="mr-3 mt-0.5 flex-shrink-0 rounded-full bg-blue-500 p-1 text-white">
                <Hash size={14} />
              </div>
              <div className="flex-1 text-sm leading-relaxed text-gray-700">{question}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white to-transparent px-4 pb-6 pt-10">
        <div className="no-scrollbar mb-4 flex space-x-3 overflow-x-auto pb-1">
          <button className="flex flex-shrink-0 items-center space-x-1 rounded-full bg-blue-50 px-4 py-2">
            <Clock size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-700">免费预约</span>
          </button>
          <button className="flex flex-shrink-0 items-center space-x-1 rounded-full bg-teal-50 px-4 py-2">
            <FileText size={16} className="text-teal-500" />
            <span className="text-sm font-medium text-teal-700">检查报告</span>
          </button>
          <button className="flex flex-shrink-0 items-center space-x-1 rounded-full bg-purple-50 px-4 py-2">
            <ClipboardList size={16} className="text-purple-500" />
            <span className="text-sm font-medium text-purple-700">就诊记录</span>
          </button>
        </div>

        <div className="flex items-center rounded-full bg-gray-50 p-1.5 shadow-inner">
          <button className="p-2 text-gray-500">
            <Mic size={22} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="有什么眼视光问题问我吗？"
            className="flex-1 border-none bg-transparent px-2 text-sm text-gray-700 focus:outline-none"
          />
          <button className={`rounded-full p-2 ${inputText.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-white'}`}>
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
