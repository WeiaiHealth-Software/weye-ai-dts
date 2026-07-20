import { MoreHorizontal, User } from 'lucide-react';
import { useState } from 'react';
import { AgentsModule } from './components/AgentsModule';
import { ConsultModule } from './components/ConsultModule';
import { ProfileModule } from './components/ProfileModule';
import { RecordsModule } from './components/RecordsModule';
import { ToolsModule } from './components/ToolsModule';

type MainTab = '问诊' | '档案' | '工具' | '智能体';

const TABS: MainTab[] = ['问诊', '档案', '工具', '智能体'];

export function MiniProgram() {
  const [currentView, setCurrentView] = useState<'main' | 'profile'>('main');
  const [activeTab, setActiveTab] = useState<MainTab>('问诊');
  const [inputText, setInputText] = useState('');
  const [agentDetailOpen, setAgentDetailOpen] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      case '问诊':
        return <ConsultModule inputText={inputText} onInputChange={setInputText} />;
      case '档案':
        return <RecordsModule />;
      case '工具':
        return <ToolsModule />;
      case '智能体':
        return <AgentsModule onDetailVisibilityChange={setAgentDetailOpen} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-gray-200 p-4 font-sans">
      <div className="relative flex h-[812px] w-[375px] flex-col overflow-hidden rounded-[40px] border-[8px] border-gray-900 bg-white shadow-2xl">
        <div className="absolute inset-x-0 top-0 z-50 mx-auto h-6 w-40 rounded-b-3xl bg-gray-900" />

        {currentView === 'main' ? (
          <div className="relative flex h-full flex-col bg-blue-50/50">
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-1/2 bg-gradient-to-b from-indigo-100 via-blue-50 to-transparent" />

            <div className="relative z-10 flex items-center justify-between px-4 pb-2 pt-12">
              <div
                className="cursor-pointer rounded-full bg-white/80 p-2 text-blue-600 shadow-sm backdrop-blur-sm transition hover:bg-blue-100"
                onClick={() => setCurrentView('profile')}
              >
                <User size={20} />
              </div>
              <div className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white/50 px-3 py-1.5 backdrop-blur-sm">
                <MoreHorizontal size={20} className="text-black" />
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] border-black">
                  <div className="h-2.5 w-2.5 rounded-full bg-black" />
                </div>
              </div>
            </div>

            {!(activeTab === '智能体' && agentDetailOpen) ? (
              <div className="relative z-10 flex items-center justify-between px-6 pb-2 pt-2">
                {TABS.map((tab) => (
                  <div
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      if (tab !== '智能体') {
                        setAgentDetailOpen(false);
                      }
                    }}
                    className={`relative cursor-pointer pb-1.5 text-base transition-all duration-300 ${
                      activeTab === tab ? 'text-lg font-bold text-gray-900' : 'font-medium text-gray-500'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-blue-500" />}
                  </div>
                ))}
              </div>
            ) : null}

            <div className="relative z-10 flex-1 overflow-hidden">
              <div className="no-scrollbar h-full overflow-y-auto">{renderActiveModule()}</div>
            </div>
          </div>
        ) : (
          <ProfileModule onBack={() => setCurrentView('main')} />
        )}
      </div>
    </div>
  );
}
