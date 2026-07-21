import { useState } from 'react';
import { ArrowUp, CheckCircle2, ClipboardList, Clock, FileText, Hash, Mic } from 'lucide-react';
import { EyeBao } from './EyeBao';

type ConsultModuleProps = {
  inputText: string;
  onInputChange: (value: string) => void;
};

type BookingAgentDoctor = {
  id: string;
  name: string;
  hospital: string;
  title: string;
};

type BookingAgentSlot = {
  id: string;
  label: string;
  date: string;
  time: string;
};

type BookingAgentStep = 'idle' | 'confirm' | 'slots' | 'done';

const QUICK_QUESTIONS = [
  '戴眼镜会让度数越戴越深吗？',
  '孩子近视了，角膜塑形镜和离焦镜片哪个更好？',
  '近视多少度需要做手术？多大年龄可以做？'
];

const LAST_VISITED_DOCTOR: BookingAgentDoctor = {
  id: 'xu-wei',
  name: '徐蔚',
  hospital: '上海眼病防治中心',
  title: '主任',
};

const BOOKING_SLOTS: BookingAgentSlot[] = [
  { id: 'tue-am', label: '周二 07/22 09:30', date: '07/22', time: '09:30' },
  { id: 'thu-pm', label: '周四 07/24 14:00', date: '07/24', time: '14:00' },
  { id: 'sat-am', label: '周六 07/26 10:00', date: '07/26', time: '10:00' },
];

const ASSISTANT_BUBBLE_WIDTH = 'w-[calc(100%-0.75rem)]';
const ASSISTANT_BUBBLE_BASE =
  'rounded-[22px] rounded-tl-[10px] border border-slate-100 bg-white/96 px-4 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)]';
const ASSISTANT_PLAIN_BUBBLE =
  'rounded-[22px] rounded-tl-[10px] border border-slate-100 bg-white px-4 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)]';
const ASSISTANT_SUCCESS_BUBBLE =
  'rounded-[22px] rounded-tl-[10px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700 shadow-[0_10px_22px_rgba(16,185,129,0.08)]';

export function ConsultModule({ inputText, onInputChange }: ConsultModuleProps) {
  const [bookingAgentStep, setBookingAgentStep] = useState<BookingAgentStep>('idle');
  const [selectedBookingSlotId, setSelectedBookingSlotId] = useState<string | null>(null);
  const [bookingPageHintVisible, setBookingPageHintVisible] = useState(false);

  const selectedSlot = BOOKING_SLOTS.find((slot) => slot.id === selectedBookingSlotId) ?? null;

  function handleOpenBookingAgent() {
    setBookingAgentStep('confirm');
    setSelectedBookingSlotId(null);
    setBookingPageHintVisible(false);
  }

  function handleOpenBookingPage() {
    setBookingPageHintVisible(true);
    setBookingAgentStep('confirm');
  }

  function handleDirectBooking() {
    setBookingPageHintVisible(false);
    setBookingAgentStep('slots');
  }

  function handleSelectBookingSlot(slotId: string) {
    setSelectedBookingSlotId(slotId);
    setBookingPageHintVisible(false);
    setBookingAgentStep('done');
  }

  return (
    <div className="relative flex min-h-full flex-col pb-6">
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

      {bookingAgentStep !== 'idle' && (
        <div className="mt-5 px-4">
          <div className="space-y-3">
            <div className="flex items-start pl-2">
              <div className={`${ASSISTANT_BUBBLE_WIDTH} ${ASSISTANT_BUBBLE_BASE}`}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-500">Eye Bao</div>
                <div className="mt-1 text-xs text-blue-700/80">预约小助手</div>
                <div className="mt-3 text-sm leading-6 text-gray-700">
                  您上次看的是{LAST_VISITED_DOCTOR.hospital}
                  {LAST_VISITED_DOCTOR.name}
                  {LAST_VISITED_DOCTOR.title}，是否直接帮您挂号？
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleOpenBookingPage}
                    className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:bg-white hover:text-blue-600"
                  >
                    去预约页面挂号
                  </button>
                  <button
                    type="button"
                    onClick={handleDirectBooking}
                    className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(59,130,246,0.2)] transition hover:bg-blue-600"
                  >
                    直接挂号
                  </button>
                </div>
                {bookingPageHintVisible && (
                  <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-700">
                    预约页入口待接入，当前先为您保留 Agent 直挂流程。
                  </div>
                )}
              </div>
            </div>

            {(bookingAgentStep === 'slots' || bookingAgentStep === 'done') && (
              <div className="flex justify-end pl-12">
                <div className="max-w-[72%] rounded-[22px] rounded-tr-[10px] bg-blue-500 px-4 py-3 text-sm leading-6 text-white shadow-[0_10px_22px_rgba(59,130,246,0.22)]">
                  好的，直接帮我挂号
                </div>
              </div>
            )}

            {(bookingAgentStep === 'slots' || bookingAgentStep === 'done') && (
              <div className="flex items-start pl-2">
                <div className={`${ASSISTANT_BUBBLE_WIDTH} ${ASSISTANT_PLAIN_BUBBLE}`}>
                  <div className="text-sm leading-6 text-gray-700">徐主任未来一周这几天有号，帮您筛好了。</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {BOOKING_SLOTS.map((slot) => {
                      const active = selectedBookingSlotId === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleSelectBookingSlot(slot.id)}
                          className={
                            active
                              ? 'rounded-full bg-blue-500 px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(59,130,246,0.2)]'
                              : 'rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100'
                          }
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {bookingAgentStep === 'done' && selectedSlot && (
              <div className="flex justify-end pl-12">
                <div className="max-w-[72%] rounded-[22px] rounded-tr-[10px] bg-blue-500 px-4 py-3 text-sm leading-6 text-white shadow-[0_10px_22px_rgba(59,130,246,0.22)]">
                  那就约 {selectedSlot.label}
                </div>
              </div>
            )}

            {bookingAgentStep === 'done' && selectedSlot && (
              <div className="flex items-start pl-2">
                <div className={`${ASSISTANT_BUBBLE_WIDTH} ${ASSISTANT_SUCCESS_BUBBLE}`}>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                    <div>
                      <div>已为您锁定徐蔚主任 {selectedSlot.label} 的号源。</div>
                      <div className="mt-1 text-xs text-emerald-600/80">稍后可在预约记录中查看。</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm"
                  >
                    查看预约
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto bg-gradient-to-t from-white via-white to-transparent px-4 pb-6 pt-8">
        <div className="no-scrollbar mb-4 flex space-x-3 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={handleOpenBookingAgent}
            className="flex flex-shrink-0 items-center space-x-1 rounded-full bg-blue-50 px-4 py-2"
          >
            <Clock size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-700">免费预约</span>
          </button>
          <button type="button" className="flex flex-shrink-0 items-center space-x-1 rounded-full bg-teal-50 px-4 py-2">
            <FileText size={16} className="text-teal-500" />
            <span className="text-sm font-medium text-teal-700">检查报告</span>
          </button>
          <button type="button" className="flex flex-shrink-0 items-center space-x-1 rounded-full bg-purple-50 px-4 py-2">
            <ClipboardList size={16} className="text-purple-500" />
            <span className="text-sm font-medium text-purple-700">就诊记录</span>
          </button>
        </div>

        <div className="flex items-center rounded-full bg-gray-50 p-1.5 shadow-inner">
          <button type="button" className="p-2 text-gray-500">
            <Mic size={22} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="有什么眼视光问题问我吗？"
            className="flex-1 border-none bg-transparent px-2 text-sm text-gray-700 focus:outline-none"
          />
          <button type="button" className={`rounded-full p-2 ${inputText.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-white'}`}>
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
