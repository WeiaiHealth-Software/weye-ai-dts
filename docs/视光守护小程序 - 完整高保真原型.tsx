import React, { useState } from 'react';
import { 
  MoreHorizontal, Circle, Mic, ArrowUp, Clock, FileText, ClipboardList, 
  User, Hash, ChevronLeft, Search, Plus, ChevronRight, Activity, 
  Eye, Sun, Gamepad2, Award, Edit3, QrCode, Calendar, CreditCard
} from 'lucide-react';

// --- 可复用的 Eye宝 SVG 组件 ---
const EyeBao = ({ className = "w-36 h-36" }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="30" y="40" width="140" height="130" rx="65" fill="#ffffff" stroke="#bae6fd" strokeWidth="6"/>
    <rect x="45" y="60" width="110" height="85" rx="42.5" fill="#f0f9ff"/>
    <circle cx="75" cy="100" r="22" fill="none" stroke="#0ea5e9" strokeWidth="5"/>
    <circle cx="125" cy="100" r="22" fill="none" stroke="#0ea5e9" strokeWidth="5"/>
    <line x1="97" y1="100" x2="103" y2="100" stroke="#0ea5e9" strokeWidth="5"/>
    <circle cx="75" cy="100" r="12" fill="#0369a1"/>
    <circle cx="125" cy="100" r="12" fill="#0369a1"/>
    <circle cx="78" cy="96" r="4" fill="#ffffff"/>
    <circle cx="128" cy="96" r="4" fill="#ffffff"/>
    <path d="M 90 125 Q 100 135 110 125" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round"/>
    <line x1="100" y1="40" x2="100" y2="15" stroke="#7dd3fc" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="100" cy="10" r="8" fill="#38bdf8"/>
    <circle cx="50" cy="115" r="7" fill="#fecaca" opacity="0.8"/>
    <circle cx="150" cy="115" r="7" fill="#fecaca" opacity="0.8"/>
    {/* 小脚丫 */}
    <path d="M 70 170 Q 60 190 80 190 Q 90 190 85 170" fill="#f59e0b"/>
    <path d="M 130 170 Q 140 190 120 190 Q 110 190 115 170" fill="#f59e0b"/>
  </svg>
);

const MiniProgramPrototype = () => {
  const [currentView, setCurrentView] = useState('main'); // 'main' | 'profile'
  const [activeTab, setActiveTab] = useState('问诊');
  const [inputText, setInputText] = useState('');

  const tabs = ['问诊', '档案', '工具', '智能体'];

  // --- 页面：问诊 (Home) ---
  const renderConsult = () => (
    <div className="flex flex-col h-full relative pb-24">
      <div className="flex flex-col items-center mt-4 relative">
        <div className="absolute -top-4 right-8 bg-white px-4 py-2 rounded-2xl rounded-bl-none shadow-sm text-sm text-blue-500 border border-blue-100 animate-bounce">
          点击创建档案，<br/>获取专属用眼建议~
        </div>
        <div className="mt-6 drop-shadow-xl hover:scale-105 transition-transform duration-300">
          <EyeBao />
        </div>
        <div className="mt-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          Hi，我是Eye宝
        </div>
      </div>
      <div className="mt-8 px-4">
        <h3 className="text-gray-500 text-sm mb-3 px-2">你可以这样问我</h3>
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-2 shadow-sm border border-white">
          {["戴眼镜会让度数越戴越深吗？", "孩子近视了，角膜塑形镜和离焦镜片哪个更好？", "近视多少度需要做手术？多大年龄可以做？"].map((q, index) => (
            <div key={index} className="flex items-start p-3 cursor-pointer hover:bg-blue-50 rounded-2xl transition border-b border-gray-50 last:border-0">
              <div className="bg-blue-500 text-white rounded-full p-1 mt-0.5 mr-3 flex-shrink-0"><Hash size={14} /></div>
              <div className="text-gray-700 text-sm leading-relaxed flex-1">{q}</div>
            </div>
          ))}
        </div>
      </div>
      {/* 底部输入区 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-4 z-20">
        <div className="flex space-x-3 mb-4 overflow-x-auto no-scrollbar pb-1">
          <button className="flex items-center space-x-1 bg-blue-50 px-4 py-2 rounded-full flex-shrink-0"><Clock size={16} className="text-blue-500" /><span className="text-sm text-blue-700 font-medium">免费预约</span></button>
          <button className="flex items-center space-x-1 bg-teal-50 px-4 py-2 rounded-full flex-shrink-0"><FileText size={16} className="text-teal-500" /><span className="text-sm text-teal-700 font-medium">检查报告</span></button>
          <button className="flex items-center space-x-1 bg-purple-50 px-4 py-2 rounded-full flex-shrink-0"><ClipboardList size={16} className="text-purple-500" /><span className="text-sm text-purple-700 font-medium">就诊记录</span></button>
        </div>
        <div className="flex items-center bg-gray-100 rounded-full p-1.5 shadow-inner">
          <button className="p-2 text-gray-500"><Mic size={22} /></button>
          <input type="text" placeholder="有什么眼视光问题问我吗？" className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 text-gray-700" value={inputText} onChange={(e) => setInputText(e.target.value)} />
          <button className={`p-2 rounded-full ${inputText.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-white'}`}><ArrowUp size={20} /></button>
        </div>
      </div>
    </div>
  );

  // --- 页面：档案 (Records) ---
  const renderRecords = () => (
    <div className="flex flex-col h-full px-4 pt-2 pb-6">
      <div className="flex justify-center mb-2">
        <EyeBao className="w-24 h-24 drop-shadow-md" />
      </div>
      
      {/* 用户信息卡片 */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-t-2xl p-4 text-white shadow-md relative z-0 h-28">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/50 backdrop-blur-sm">
            <User size={24} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-bold flex items-center space-x-2">
              <span>周末</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-normal">男/11岁</span>
            </div>
            <div className="text-blue-100 text-xs mt-1">档案号: OPT-20260718</div>
          </div>
        </div>
      </div>

      {/* 数据面板 (向上重叠) */}
      <div className="bg-white rounded-2xl p-4 shadow-lg -mt-6 relative z-10 min-h-[300px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4 text-sm font-medium">
            <div className="flex items-center space-x-1"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-gray-700">右眼</span></div>
            <div className="flex items-center space-x-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-gray-700">左眼</span></div>
          </div>
          <div className="flex bg-blue-50 rounded-lg p-1">
            <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-md shadow-sm">眼轴</button>
            <button className="text-gray-500 text-xs px-3 py-1 rounded-md">屈光度</button>
          </div>
        </div>
        
        {/* 空状态 */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 mt-4">
          <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center">
            <ClipboardList size={40} className="text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm">暂无检查记录~</p>
          <button className="bg-blue-500 text-white px-10 py-2.5 rounded-full font-medium shadow-md hover:bg-blue-600 transition w-48">
            去预约
          </button>
        </div>
      </div>
    </div>
  );

  // --- 页面：工具 (Tools) ---
  const renderTools = () => (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-800 px-1">护眼小工具</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-2 active:scale-95 transition">
          <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-1"><Sun size={24} /></div>
          <div className="font-medium text-gray-800 text-sm">户外打卡</div>
          <div className="text-xs text-gray-400">每日2小时防近视</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-2 active:scale-95 transition">
          <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-1"><Eye size={24} /></div>
          <div className="font-medium text-gray-800 text-sm">视力自测</div>
          <div className="text-xs text-gray-400">居家E字表粗测</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-2 active:scale-95 transition">
          <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center mb-1"><Activity size={24} /></div>
          <div className="font-medium text-gray-800 text-sm">眼操监督</div>
          <div className="text-xs text-gray-400">AI视觉姿势纠正</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-2 active:scale-95 transition">
          <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-1"><Gamepad2 size={24} /></div>
          <div className="font-medium text-gray-800 text-sm">护眼小游戏</div>
          <div className="text-xs text-gray-400">训练睫状肌调节</div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-teal-400 to-emerald-400 rounded-2xl p-4 text-white shadow-md mt-4 flex justify-between items-center">
        <div>
          <div className="font-bold text-lg">护眼能量树</div>
          <div className="text-xs text-teal-50 mt-1">坚持打卡，兑换免费复查券</div>
        </div>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );

  // --- 页面：智能体 (Agents) ---
  const renderAgents = () => (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="px-4 pt-2 pb-2">
        <div className="bg-white rounded-full flex items-center px-4 py-2 shadow-sm border border-gray-100">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="搜索眼科专家/服务" className="flex-1 bg-transparent border-none text-sm focus:outline-none" />
        </div>
      </div>
      <div className="flex px-4 py-3 space-x-6 overflow-x-auto no-scrollbar border-b border-gray-100">
        <span className="text-blue-600 font-bold border-b-2 border-blue-600 pb-1 whitespace-nowrap text-sm">全部名医</span>
        <span className="text-gray-500 text-sm whitespace-nowrap">近视防控</span>
        <span className="text-gray-500 text-sm whitespace-nowrap">斜弱视专区</span>
        <span className="text-gray-500 text-sm whitespace-nowrap">角膜塑形镜</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-8">
        {/* 医生卡片 1 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-start space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                <User size={24} className="text-blue-500" />
              </div>
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white">AI</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900 text-base">徐蔚 教授</span>
                <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">眼视光领域</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">三甲</span>
                <span>上海市眼病防治中心 视光中心</span>
              </div>
              <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                擅长：儿童青少年近视防控、角膜塑形镜及各类特殊接触镜的验配、斜弱视诊治。
              </p>
              <div className="text-xs text-gray-400 mt-2 flex items-center">
                <Clock size={12} className="mr-1" /> 12.5 万人咨询
              </div>
            </div>
          </div>
        </div>
        {/* 医生卡片 2 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-start space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center overflow-hidden">
                <User size={24} className="text-teal-500" />
              </div>
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white">AI</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900 text-base">王明 专家</span>
                <span className="text-xs text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">眼底病科</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">三甲</span>
                <span>复旦大学附属眼耳鼻喉科医院</span>
              </div>
              <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                擅长：高度近视眼底病变、视网膜脱离、黄斑变性等复杂眼底疾病的影像学诊断。
              </p>
              <div className="text-xs text-gray-400 mt-2 flex items-center">
                <Clock size={12} className="mr-1" /> 8.2 万人咨询
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- 页面：个人中心 (Profile) ---
  const renderProfile = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-50 via-blue-50/30 to-gray-50 absolute inset-0 z-50">
      {/* 顶部导航 */}
      <div className="px-4 pt-12 pb-4 flex justify-between items-center relative">
        <div className="p-2 -ml-2 cursor-pointer" onClick={() => setCurrentView('main')}>
          <ChevronLeft size={24} className="text-gray-800" />
        </div>
        <div className="font-bold text-gray-800 text-lg">个人中心</div>
        <div className="flex items-center space-x-2 bg-white/50 border border-gray-200 rounded-full px-3 py-1.5 backdrop-blur-sm">
          <MoreHorizontal size={18} className="text-black" />
          <div className="w-px h-4 bg-gray-300"></div>
          <Circle size={18} className="text-black" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* 头像区 */}
        <div className="flex items-center space-x-4 mt-2 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            <User size={32} className="text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">未设置昵称</span>
            <Edit3 size={16} className="text-gray-400 cursor-pointer" />
          </div>
        </div>

        {/* 信息卡片区 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-800 text-base">添加萌主信息</span>
            <div className="w-6 h-6 rounded-full border border-blue-500 text-blue-500 flex items-center justify-center cursor-pointer">
              <Plus size={16} />
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="flex-1 bg-teal-50 rounded-xl p-3 relative overflow-hidden h-20 flex flex-col justify-between cursor-pointer">
              <div className="flex items-center text-teal-700 font-medium text-sm z-10">
                检查报告 <ChevronRight size={14} className="ml-1 bg-teal-200 rounded-full text-teal-800" />
              </div>
              <FileText size={40} className="absolute -bottom-2 -right-2 text-teal-100 opacity-80" />
            </div>
            <div className="flex-1 bg-blue-50 rounded-xl p-3 relative overflow-hidden h-20 flex flex-col justify-between cursor-pointer">
              <div className="flex items-center text-blue-700 font-medium text-sm z-10">
                就诊记录 <ChevronRight size={14} className="ml-1 bg-blue-200 rounded-full text-blue-800" />
              </div>
              <Calendar size={40} className="absolute -bottom-2 -right-2 text-blue-100 opacity-80" />
            </div>
          </div>
        </div>

        {/* 列表区 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {[
            { icon: <Award size={20} className="text-orange-500" />, label: '积分明细' },
            { icon: <CreditCard size={20} className="text-purple-500" />, label: '消费记录' },
            { icon: <Calendar size={20} className="text-blue-500" />, label: '预约记录' },
            { icon: <QrCode size={20} className="text-green-500" />, label: '萌主二维码' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-50 p-1.5 rounded-lg">{item.icon}</div>
                <span className="text-gray-700 text-sm">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          ))}
        </div>

        {/* 退出按钮 */}
        <button className="w-full bg-white text-gray-600 font-medium py-3.5 rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50 transition">
          退出登录
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 font-sans">
      
      {/* 手机外壳模拟器 */}
      <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-900 overflow-hidden flex flex-col">
        
        {/* 手机刘海 (Notch) */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-3xl w-40 mx-auto z-50"></div>

        {currentView === 'main' ? (
          <div className="flex flex-col h-full relative bg-blue-50/50">
            {/* 背景渐变 */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-indigo-100 via-blue-50 to-transparent z-0 pointer-events-none"></div>

            {/* 顶部状态栏 */}
            <div className="relative z-10 px-4 pt-12 pb-2 flex justify-between items-center">
              <div 
                className="bg-white/80 p-2 rounded-full text-blue-600 shadow-sm cursor-pointer hover:bg-blue-100 transition backdrop-blur-sm"
                onClick={() => setCurrentView('profile')}
              >
                <User size={20} />
              </div>
              <div className="flex items-center space-x-2 bg-white/50 border border-gray-200 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <MoreHorizontal size={18} className="text-black" />
                <div className="w-px h-4 bg-gray-300"></div>
                <Circle size={18} className="text-black" />
              </div>
            </div>

            {/* 导航 Tabs */}
            <div className="relative z-10 px-6 pt-2 pb-2 flex justify-between items-center">
              {tabs.map((tab) => (
                <div 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer relative pb-1.5 text-base transition-all duration-300 ${activeTab === tab ? 'text-gray-900 font-bold text-lg' : 'text-gray-500 font-medium'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-1 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* 内容区路由 */}
            <div className="relative z-10 flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto no-scrollbar">
                {activeTab === '问诊' && renderConsult()}
                {activeTab === '档案' && renderRecords()}
                {activeTab === '工具' && renderTools()}
                {activeTab === '智能体' && renderAgents()}
              </div>
            </div>
          </div>
        ) : (
          renderProfile()
        )}

      </div>
    </div>
  );
};

export default MiniProgramPrototype;