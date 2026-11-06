import { useState } from 'react';
import { useStore } from './store.jsx';
import { cx } from './lib/util.js';
import { confetti } from './fx.jsx';

const V = {
  pri: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30',
  ghost: 'bg-white/90 border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/60 hover:text-blue-700 shadow-2xs hover:shadow-xs',
  ok: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm shadow-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/30',
  bad: 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-700 hover:to-red-700 shadow-sm shadow-rose-500/20 hover:shadow-md hover:shadow-rose-500/30',
  warn: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-sm shadow-orange-500/20 hover:shadow-md hover:shadow-orange-500/30',
  line: 'bg-transparent border border-white/60 text-white hover:bg-white/15 backdrop-blur-xs',
};
const btnCls = (v, sm, extra) => cx('inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none', sm ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm', V[v || 'pri'], extra);
export const Btn = ({ v, sm, className, type = 'button', ...p }) => <button type={type} {...p} className={btnCls(v, sm, className)} />;
export const LinkBtn = ({ v, sm, className, ...p }) => <a {...p} className={btnCls(v, sm, className)} />;

const BC = {
  'Mở đăng ký': 'blue', 'Đã hủy': 'red', 'Đang học': 'green', 'Chờ đóng phí': 'amber', 'Đã xác nhận': 'green', 'Bảo lưu': 'purple', 'Hoàn thành': 'teal',
  'Chờ duyệt': 'amber', 'Đã duyệt': 'green', 'Từ chối': 'red', 'Hoạt động': 'green', 'Ngừng': 'red', 'Đang dạy': 'green', 'Nghỉ': 'red', 'Đang bảo lưu': 'purple',
  'Đã học lại': 'teal', 'Hết hạn': 'red', 'Mới': 'amber', 'Đã liên hệ': 'blue', 'Đã ghi danh': 'green', 'Có mặt': 'green', 'Vắng': 'red', 'Học bù': 'purple', 'Đã học': 'green', 'Đủ điều kiện mở': 'green', 'Hôm nay': 'blue',
};
const BCL = {
  gray: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200/80',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
  amber: 'bg-amber-50 text-amber-800 border border-amber-200/80',
  red: 'bg-rose-50 text-rose-700 border border-rose-200/80',
  purple: 'bg-violet-50 text-violet-700 border border-violet-200/80',
  teal: 'bg-teal-50 text-teal-800 border border-teal-200/80',
};
const PENDING = ['Chờ duyệt', 'Mới', 'Chờ đóng phí'];
export const Badge = ({ t, c }) => (
  <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-2xs', BCL[c || BC[t] || 'gray'])}>
    {PENDING.includes(t) && <i className="size-1.5 animate-pulse rounded-full bg-current" />}
    {t}
  </span>
);

export const Card = ({ className, ...p }) => <div {...p} className={cx('rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-xs hover:shadow-md hover:border-blue-100 transition-all duration-200 backdrop-blur-xs', className)} />;
export const Note = ({ children }) => (
  <div className="mb-4 animate-fade-up rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 via-amber-50/80 to-orange-50/50 p-3.5 text-[13.5px] text-amber-900 shadow-2xs flex items-start gap-2.5">
    <i className="fa-solid fa-lightbulb text-amber-500 mt-0.5 text-base flex-shrink-0" aria-hidden />
    <div className="flex-1 leading-relaxed">{children}</div>
  </div>
);
export const Empty = ({ children }) => <div className="p-8 text-center text-slate-400 font-medium">{children}</div>;
export const H3 = ({ children }) => <h3 className="font-display mb-3 text-lg font-bold text-slate-800 flex items-center gap-2">{children}</h3>;
export const Bar = ({ v, max, c }) => (
  <div className="h-2.5 min-w-[90px] overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/60 shadow-inner">
    <i className={cx('block h-full animate-grow rounded-full shadow-2xs', c || 'bg-gradient-to-r from-blue-500 to-indigo-600')} style={{ width: `${Math.min(100, max ? (v / max) * 100 : 0)}%` }} />
  </div>
);
export const Meter = ({ v, min }) => <Bar v={v} max={min} c={v >= min ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'} />;

export function Table({ head, rows, right = [] }) {
  return (
    <div className="mb-5 animate-fade-in overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-xs backdrop-blur-xs">
      <div className="overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200/80">
              {head.map((h, i) => (
                <th key={i} className={cx('px-4 py-3.5 text-xs font-bold tracking-wider whitespace-nowrap text-slate-500 uppercase', right.includes(i) ? 'text-right' : 'text-left')}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 [&_td]:px-4 [&_td]:py-3 [&_td]:align-middle [&_tr:hover]:bg-blue-50/30 [&_tr]:transition-colors">
            {rows.length ? rows : <tr><td colSpan={head.length}><Empty>Chưa có dữ liệu.</Empty></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const INP = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 transition duration-150 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 focus:outline-none shadow-2xs';
export const Fld = ({ label, children }) => <label className="mb-3 flex flex-col gap-1.5 text-[13.5px] font-semibold text-slate-600"><span>{label}</span>{children}</label>;
export const In = ({ className, ...p }) => <input {...p} className={cx(INP, className)} />;
export const Area = ({ className, ...p }) => <textarea rows={3} {...p} className={cx(INP, className)} />;
export const Sel = ({ options, ph, className, ...p }) => (
  <select {...p} className={cx(INP, className)}>
    {ph !== undefined && <option value="">{ph}</option>}
    {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
  </select>
);
export const Filter = ({ className, ...p }) => <Sel {...p} className={cx('w-auto min-w-[150px]', className)} />;

/* Hộp thoại xác nhận */
export function Confirm({ title, message, ok = 'Xác nhận', danger, onConfirm }) {
  const { closeModal } = useStore();
  return (
    <div className="fixed inset-0 z-50 grid animate-fade-in place-items-center bg-slate-950/40 backdrop-blur-xs p-4" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
      <div role="alertdialog" className="w-full max-w-md animate-pop rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className={cx('mb-3.5 grid size-12 place-items-center rounded-2xl text-xl shadow-inner', danger ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-blue-50 text-blue-600 border border-blue-100')}>
          {danger ? <i className="fa-solid fa-triangle-exclamation" aria-hidden /> : <i className="fa-solid fa-circle-question" aria-hidden />}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {message && <p className="mt-2 text-slate-600 leading-relaxed text-sm">{message}</p>}
        <div className="mt-6 flex justify-end gap-2.5">
          <Btn v="ghost" onClick={closeModal}>Hủy</Btn>
          <Btn autoFocus v={danger ? 'bad' : 'pri'} onClick={() => { closeModal(); onConfirm(); }}>{ok}</Btn>
        </div>
      </div>
    </div>
  );
}

export const useAsk = () => { const { openModal } = useStore(); return (o) => openModal(<Confirm {...o} />); };

/* Hộp thoại có biểu mẫu */
export function Form({ title, children, onSubmit, ok = 'Lưu', lg, confirm, celebrate, onDone }) {
  const { closeModal, commit, toast } = useStore();
  const [err, setErr] = useState(''), [asking, setAsking] = useState(false);
  const submit = (e) => {
    e.preventDefault(); if (!onSubmit) return;
    if (confirm && !asking) { setErr(''); setAsking(true); return; }
    try {
      const msg = onSubmit(new FormData(e.target));
      closeModal();
      if (commit(msg || title)) {
        toast(msg || 'Đã lưu', 'ok');
        if (celebrate) confetti();
        if (onDone) onDone();
      }
    } catch (x) {
      setErr(x.message);
      setAsking(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 grid animate-fade-in place-items-center bg-slate-950/40 backdrop-blur-xs p-4" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
      <div className={cx('flex max-h-[92vh] w-full animate-pop flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden', lg ? 'max-w-4xl' : 'max-w-xl')}>
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4.5">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button type="button" aria-label="Đóng" onClick={closeModal} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition cursor-pointer text-xl">
            ×
          </button>
        </div>
        <form onSubmit={submit} className="flex min-h-0 flex-col">
          <div className="overflow-auto px-6 py-5">{children}</div>
          {err && <div className="px-6 pb-3 font-semibold whitespace-pre-wrap text-rose-600 text-sm bg-rose-50/50 py-2 mx-6 mb-3 rounded-xl border border-rose-100 flex items-center gap-2"><i className="fa-solid fa-triangle-exclamation" aria-hidden />{err}</div>}
          {asking ? (
            <div className="flex animate-fade-in flex-wrap items-center justify-end gap-2.5 border-t border-amber-200 bg-amber-50 px-6 py-4">
              <span className="mr-auto font-semibold text-amber-900 text-sm flex items-center gap-1.5"><i className="fa-solid fa-triangle-exclamation text-amber-600" aria-hidden />{confirm}</span>
              <Btn v="ghost" onClick={() => setAsking(false)}>Quay lại</Btn>
              <Btn type="submit" autoFocus>Xác nhận</Btn>
            </div>
          ) : (
            <div className="flex justify-end gap-2.5 border-t border-slate-100 bg-slate-50/40 px-6 py-4">
              <Btn v="ghost" onClick={closeModal}>{onSubmit ? 'Hủy' : 'Đóng'}</Btn>
              {onSubmit && <Btn type="submit">{ok}</Btn>}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export const Row2 = ({ children }) => <div className="grid gap-x-4 sm:grid-cols-2">{children}</div>;

export const PAGE_SIZE = 15;
export function paginate(list, page, setPage, size = PAGE_SIZE) {
  const pages = Math.max(1, Math.ceil(list.length / size)), cur = Math.min(page, pages);
  const pager = (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
      <span>{list.length} bản ghi · trang {cur}/{pages}</span>
      <div className="flex gap-1.5">
        <Btn v="ghost" sm disabled={cur <= 1} onClick={() => setPage(cur - 1)}>‹ Trước</Btn>
        <Btn v="ghost" sm disabled={cur >= pages} onClick={() => setPage(cur + 1)}>Sau ›</Btn>
      </div>
    </div>
  );
  return { rows: list.slice((cur - 1) * size, cur * size), pager };
}
