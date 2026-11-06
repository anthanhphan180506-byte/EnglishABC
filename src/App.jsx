import { Component, useEffect, useRef } from 'react';
import { StoreProvider, useStore, useHash } from './store.jsx';
import { Landing, Login } from './pages/public.jsx';
import { Dashboard, Classes, ClassDetail, Enrollments, Payments, Requests, Attendance, Timetable, Leads, Reports, AuditPage } from './pages/pages.jsx';
import { Students, Master, Staff } from './pages/master.jsx';
import { ROLE } from './lib/util.js';
import { useAsk } from './ui.jsx';
import { AmbientAura } from './fx.jsx';

const MENU = {
  dashboard: ['chart-pie', 'Tổng quan'],
  classes: ['chalkboard-user', 'Lớp học'],
  timetable: ['calendar-days', 'Thời khóa biểu'],
  students: ['user-graduate', 'Học viên'],
  enrollments: ['file-signature', 'Đăng ký học'],
  payments: ['credit-card', 'Học phí'],
  requests: ['arrows-rotate', 'Đơn yêu cầu'],
  attendance: ['clipboard-check', 'Điểm danh'],
  staff: ['users-gear', 'Nhân viên'],
  master: ['sliders', 'Danh mục'],
  leads: ['bullseye', 'Tư vấn'],
  reports: ['chart-line', 'Báo cáo'],
  audit: ['list-check', 'Nhật ký']
};
const ROLE_MENU = {
  manager: Object.keys(MENU),
  enroll: ['dashboard', 'students', 'classes', 'enrollments', 'requests', 'timetable', 'leads'],
  accountant: ['dashboard', 'payments', 'enrollments', 'reports'],
  teacher: ['dashboard', 'timetable', 'attendance']
};
const PAGES = {
  dashboard: Dashboard,
  classes: Classes,
  timetable: Timetable,
  students: Students,
  enrollments: Enrollments,
  payments: Payments,
  requests: Requests,
  attendance: Attendance,
  staff: Staff,
  master: Master,
  leads: Leads,
  reports: Reports,
  audit: AuditPage
};

function Shell({ page = 'dashboard', arg }) {
  const { user, setUser, reset, exportData, importData } = useStore(), ask = useAsk(), fileRef = useRef(null);
  const key = page === 'class' ? 'classes' : page, menu = ROLE_MENU[user.role];
  useEffect(() => { if (!menu.includes(key)) location.hash = '#/app/dashboard'; }, [key, menu]);
  if (!menu.includes(key)) return null;
  const Page = page === 'class' ? ClassDetail : PAGES[page] || Dashboard;
  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr] relative">
      <AmbientAura />
      <aside className="no-print flex flex-wrap gap-1 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 p-4 text-slate-300 md:sticky md:top-0 md:block md:h-screen md:overflow-auto md:px-4 md:py-6 shadow-xl border-r border-slate-800/80">
        <a href="#/" className="flex w-full items-center gap-3 px-2 pb-6 text-white group">
          <i className="font-display grid size-10 place-items-center rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-xl font-black text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200 not-italic">
            A
          </i>
          <span className="leading-tight">
            <b className="font-display block text-lg font-extrabold tracking-tight text-white">ABC English</b>
            <small className="text-[11px] font-medium tracking-wide text-blue-300 uppercase">Quản lý đào tạo</small>
          </span>
        </a>
        <nav className="space-y-1 w-full" aria-label="Menu chính">
          {menu.map((k) => (
            <a
              key={k}
              href={`#/app/${k}`}
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                k === key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <i className={`fa-solid fa-${MENU[k][0]} w-5 text-center text-sm group-hover:scale-110 transition-transform`} aria-hidden />
              <span className="flex-1">{MENU[k][1]}</span>
              {k === key && <span className="size-2 rounded-full bg-amber-400 animate-pulse shadow-sm" />}
            </a>
          ))}
        </nav>
        <div className="mt-6 w-full border-t border-white/10 pt-4 text-[13px]">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-2.5 border border-white/10 backdrop-blur-xs">
            <i className="grid size-9 place-items-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 font-bold text-white shadow-xs not-italic">
              {user.name.split(' ').slice(-1)[0][0]}
            </i>
            <div className="min-w-0 flex-1">
              <b className="block truncate text-white text-sm">{user.name}</b>
              <span className="inline-block text-[11px] font-medium text-amber-300">{ROLE[user.role]}</span>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <a href="#/" className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition">
              <i className="fa-solid fa-globe w-4 text-center" aria-hidden /> Trang giới thiệu
            </a>
            <a href="#/" onClick={() => setUser(null)} className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/15 transition">
              <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" aria-hidden /> Đăng xuất
            </a>
            {user.role === 'manager' && (
              <>
                <div className="my-2 border-t border-white/10" />
                <a href="#/app/dashboard" onClick={(e) => { e.preventDefault(); exportData(); }} className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition">
                  <i className="fa-solid fa-download w-4 text-center" aria-hidden /> Sao lưu dữ liệu (JSON)
                </a>
                <a href="#/app/dashboard" onClick={(e) => { e.preventDefault(); fileRef.current?.click(); }} className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition">
                  <i className="fa-solid fa-upload w-4 text-center" aria-hidden /> Nạp bản sao lưu
                </a>
                <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files[0]; e.target.value = ''; if (f) ask({ title: 'Nạp bản sao lưu?', message: 'Toàn bộ dữ liệu hiện tại sẽ được thay bằng nội dung tệp sao lưu.', ok: 'Nạp', danger: true, onConfirm: () => importData(f) }); }} />
                <a href="#/app/dashboard" onClick={() => ask({ title: 'Khôi phục dữ liệu demo?', message: 'Toàn bộ thay đổi bạn đã thực hiện sẽ bị xóa và dữ liệu demo ban đầu được nạp lại.', ok: 'Khôi phục', danger: true, onConfirm: reset })} className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-amber-400/90 hover:bg-amber-400/15 hover:text-amber-300 transition">
                  <i className="fa-solid fa-rotate-left w-4 text-center" aria-hidden /> Khôi phục dữ liệu demo
                </a>
              </>
            )}
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 md:px-8 md:py-8 lg:px-12 md:pb-24">
        <div key={`${page}/${arg}`} className="animate-fade-up mx-auto max-w-[1440px]">
          <Page id={arg} />
        </div>
      </main>
    </div>
  );
}

function Router() {
  const { user } = useStore();
  const [a, b, c] = useHash();
  useEffect(() => { if (a === 'app' && !user) location.hash = '#/login'; }, [a, user]);
  if (a === 'login') return <Login />;
  if (a === 'app') return user ? <Shell page={b || undefined} arg={c} /> : null;
  return <Landing />;
}

/* Chặn lỗi hiển thị */
class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(e) { console.error(e); }
  download = () => {
    const raw = localStorage.getItem('abc_center_db_react_v1') || '{}', a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([raw], { type: 'application/json' })); a.download = 'abc-english-du-lieu-hien-tai.json'; a.click();
  };
  restore = () => {
    const K = 'abc_center_db_react_v1', raw = localStorage.getItem(K);
    if (raw) localStorage.setItem(K + '_backup_' + Date.now(), raw);
    localStorage.removeItem(K); location.hash = '#/'; location.reload();
  };
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center p-6 bg-slate-50">
        <div className="max-w-lg rounded-3xl border border-red-200 bg-white p-8 shadow-2xl">
          <h1 className="text-xl font-extrabold text-red-700 flex items-center gap-2"><i className="fa-solid fa-triangle-exclamation" aria-hidden /> Ứng dụng gặp lỗi khi hiển thị</h1>
          <p className="mt-2 text-slate-600 text-sm">Dữ liệu của bạn chưa bị xóa. Bạn có thể tải lại trang, tải xuống bản sao dữ liệu hiện tại, hoặc nạp lại dữ liệu demo.</p>
          <pre className="mt-3 max-h-32 overflow-auto rounded-xl bg-slate-100 p-3 text-xs whitespace-pre-wrap">{String(this.state.error.message || this.state.error)}</pre>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-blue-700" onClick={() => location.reload()}>Tải lại trang</button>
            <button className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50" onClick={this.download}>Tải dữ liệu hiện tại</button>
            <button className="rounded-xl border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50" onClick={() => confirm('Nạp lại dữ liệu demo? Bản dữ liệu hiện tại được sao lưu trong trình duyệt.') && this.restore()}>Nạp lại dữ liệu demo</button>
          </div>
        </div>
      </div>
    );
  }
}

export default function App() { return <ErrorBoundary><StoreProvider><Router /></StoreProvider></ErrorBoundary>; }
