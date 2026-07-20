import { Eye, EyeSlash, Lock, User } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { setAuthed } from "../../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => account.trim().length > 0 && password.trim().length > 0, [account, password]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4">
      <div className="grid min-h-[calc(100vh-2rem)] w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="relative hidden overflow-hidden rounded-[24px] bg-gradient-to-br from-primary-600 via-primary-600 to-primary-800 lg:flex">
          <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-white/10 blur-2xl"></div>
          <div className="pointer-events-none absolute -bottom-48 -right-36 h-[520px] w-[520px] rounded-full bg-black/10 blur-3xl"></div>

          <div className="relative z-10 flex w-full flex-col p-4">
            <div className="flex items-center gap-3 text-white">
              <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5362" width="32" height="32"><path d="M512 254.7c-188.2 0-332.1 119.7-512 313.5 155 165.3 282.3 313.5 512 313.5s395.8-188.1 512-310.6c-119-142.5-285.1-316.4-512-316.4m0 521.5c-113.5 0-204.8-94-204.8-208s91.3-208 204.8-208 204.8 94 204.8 208-91.4 208-204.8 208m0-330.5c-66.4 0-119 54.1-119 122.5s52.6 122.5 119 122.5 119-54.1 119-122.5-52.6-122.5-119-122.5" fill="#ffffff" p-id="5363"></path><path d="M560.5 169.7v111.8c0 15.4-13.2 28-29.3 28-16.2 0-29.3-12.6-29.3-28V169.7c0-15.4 13.2-28 29.3-28s29.3 12.5 29.3 28zM165.8 276.1l75.3 85.5c10.4 11.6 8.7 29.4-3.7 39.4-12.4 10-30.8 8.3-41.2-3.6l-75.2-85.5c-10.4-11.6-8.7-29.5 3.7-39.4 5.5-4.3 12.2-6.4 18.9-6.4 8.1 0 16.5 3.3 22.2 10z m772.9-3.3c12.4 10 13.9 27.5 3.7 39.4l-75.2 85.5c-10.2 11.9-28.8 13.3-41.2 3.6-12.4-10-13.9-27.5-3.7-39.4l75.2-85.5c5.7-6.9 13.9-10.2 22.4-10.2 6.7-0.1 13.4 2 18.8 6.6z" fill="#ffffff" p-id="5364"></path></svg>
              <div className="min-w-0">
                <div className="text-2xl font-bold tracking-tight">眼视光智慧诊疗平台</div>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="relative w-full max-w-[520px]">
                <div className="absolute -left-12 top-12 h-[340px] w-[340px] rounded-[44px] bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute -right-8 bottom-8 h-[360px] w-[360px] rounded-[48px] bg-white/15 backdrop-blur-sm"></div>

                <div className="relative z-10 rounded-[44px] bg-white/95 p-6 shadow-2xl shadow-primary-900/25">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">数据概览</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      实时
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-[1fr_auto] items-start gap-6">
                    <div className="space-y-3">
                      {[
                        { label: "客户档案", value: "3,482" },
                        { label: "待回访", value: "142" },
                        { label: "角膜塑形镜复查", value: "216" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                          <div className="mt-1 text-lg font-bold text-slate-900">{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="rounded-2xl bg-primary-50 px-4 py-3 text-right">
                        <div className="text-xs font-semibold text-primary-600">今日预约</div>
                        <div className="mt-1 text-2xl font-bold text-primary-700">28</div>
                      </div>
                      <div className="h-28 w-44 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-4 text-white">
                        <div className="text-xs font-semibold text-white/80">增长趋势</div>
                        <svg viewBox="0 0 160 60" className="mt-3 h-10 w-full" fill="none">
                          <path
                            d="M4 46C18 26 30 44 44 28C58 12 70 22 84 20C98 18 110 4 124 10C138 16 146 12 156 6"
                            stroke="rgba(255,255,255,0.95)"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-[28px] bg-[#f3f4f6] px-6 py-14">
          <div className="w-full max-w-[420px] rounded-[28px] border border-gray-200 bg-white px-8 py-10 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="text-2xl font-bold tracking-tight text-gray-900">欢迎回来</div>
            <div className="mt-2 text-sm text-gray-500">请输入机构/医生账号与密码登录系统。</div>

            <form
              className="mt-8 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                const nextAccount = account.trim();
                const nextPassword = password.trim();
                if (!nextAccount || !nextPassword) {
                  setError("请输入账号和密码");
                  return;
                }
                setError("");
                setAuthed();
                navigate("/", { replace: true });
              }}
            >
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">账号</label>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
                  <User weight="bold" className="h-5 w-5 text-gray-400" />
                  <input
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                    placeholder="请输入账号"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">密码</label>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
                  <Lock weight="bold" className="h-5 w-5 text-gray-400" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                    placeholder="请输入密码"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    title={showPassword ? "隐藏密码" : "显示密码"}
                  >
                    {showPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error ? <div className="text-sm font-semibold text-rose-600">{error}</div> : null}

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-2 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600 active:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-200"
              >
                登录
              </button>

              <div className="text-center text-xs text-gray-400">
                本系统不提供注册入口，如需开通账号请联系管理员。
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
