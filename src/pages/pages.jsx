import { useState } from 'react';
import { CountUp } from '../fx.jsx';
import { paginate, useAsk, Btn, LinkBtn, Badge, Card, Note, H3, Bar, Meter, Table, In, Sel, Filter } from '../ui.jsx';
import { useStore } from '../store.jsx';
import { R, U, CFG } from '../lib/rules.js';
import { by, vnd, dmy, TYPE, ROLE, reqDesc, enLabel, canViewClass } from '../lib/util.js';
import { CancelForm, RescheduleForm, VoidForm, RefundForm, FinishForm, NewClassForm, ClassEditForm, ScheduleForm, EnrollForm, PayForm, ReserveForm, TransferForm, MakeupForm, RejectForm } from '../forms.jsx';

export const Head = ({ title, children }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">{title}</h1>
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  </div>
);
const Stu = ({ id }) => { const { db } = useStore(); const s = by(db, 'students', id); return <span className="font-semibold text-slate-800">{s.name} <small className="text-slate-400 font-normal">({s.code})</small></span>; };
const Muted = ({ children }) => <small className="text-slate-400">{children}</small>;
const statuses = (a) => a.map((s) => [s, s]);

/* ---------------- Tổng quan ---------------- */
export function Dashboard() {
  const { db, user } = useStore();
  const today = U.today(), month = today.slice(0, 7);
  if (user.role === 'teacher') {
    const mine = db.sessions.filter((s) => s.teacherId === user.teacherId && s.date >= today).sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start)).slice(0, 8);
    return (
      <>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 md:p-8 text-white shadow-lg mb-8">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs text-blue-100 mb-2 border border-white/20">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Giáo viên · {dmy(today)}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Xin chào, {user.name} 👋</h1>
              <p className="mt-2 text-blue-100 text-sm max-w-xl">Chúc bạn có những giờ dạy tràn đầy năng lượng và niềm vui cùng học viên!</p>
            </div>
            <div className="flex gap-2">
              <LinkBtn v="line" href="#/app/timetable"><i className="fa-solid fa-calendar-days mr-1.5" aria-hidden /> Xem lịch dạy</LinkBtn>
              <LinkBtn v="warn" href="#/app/attendance"><i className="fa-solid fa-clipboard-check mr-1.5" aria-hidden /> Điểm danh</LinkBtn>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-10 -bottom-10 size-60 rounded-full bg-white/10 blur-2xl" />
        </div>
        <H3>Các buổi dạy sắp tới</H3>
        <Table head={['Ngày', 'Giờ', 'Lớp', 'Phòng', 'Buổi']} rows={mine.map((s) => <tr key={s.id}><td>{dmy(s.date)} {s.date === today && <Badge t="Hôm nay" />}</td><td>{s.start}-{s.end}</td><td>{by(db, 'classes', s.classId).code}</td><td>{by(db, 'rooms', s.roomId).name}</td><td>{s.no}</td></tr>)} />
      </>
    );
  }
  const rev = db.payments.filter((p) => p.type === 'Thu' && p.date.startsWith(month)).reduce((s, p) => s + p.amount, 0);
  const debt = db.enrollments.filter((e) => R.COLLECTIBLE.includes(e.status)).reduce((s, e) => s + R.due(db, e), 0);
  const stat = [
    ['Lớp đang học', db.classes.filter((c) => c.status === 'Đang học').length, 'fa-chalkboard-user', 'from-blue-500 to-indigo-600', 'bg-blue-50 text-blue-700'],
    ['Lớp mở đăng ký', db.classes.filter((c) => c.status === 'Mở đăng ký').length, 'fa-bullhorn', 'from-amber-400 to-orange-500', 'bg-amber-50 text-amber-700'],
    ['Học viên đang học', db.enrollments.filter((e) => e.status === 'Đã xác nhận').length, 'fa-user-graduate', 'from-emerald-400 to-teal-500', 'bg-emerald-50 text-emerald-700'],
    ['Thu trong tháng', rev, 'fa-sack-dollar', 'from-emerald-500 to-green-600', 'bg-green-50 text-green-700'],
    ['Học phí còn nợ', debt, 'fa-hourglass-half', 'from-orange-400 to-rose-500', 'bg-rose-50 text-rose-700'],
    ['Yêu cầu chờ duyệt', db.requests.filter((r) => r.status === 'Chờ duyệt').length, 'fa-envelope-open-text', 'from-violet-500 to-purple-600', 'bg-purple-50 text-purple-700'],
  ];
  const risk = db.classes.filter((c) => c.status === 'Mở đăng ký'), ts = db.sessions.filter((s) => s.date === today).sort((a, b) => a.start.localeCompare(b.start));
  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 md:p-8 text-white shadow-lg mb-8">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs text-blue-100 mb-3 border border-white/20">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{ROLE[user.role]} · {dmy(today)}</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">Xin chào, {user.name} 👋</h1>
            <p className="mt-2 text-blue-100 text-sm md:text-base max-w-xl">
              Hôm nay trung tâm có <b>{db.sessions.filter((s) => s.date === today).length} buổi học</b>. Chúc bạn một ngày làm việc tràn đầy năng lượng và hiệu quả!
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <LinkBtn v="line" href="#/app/classes" className="backdrop-blur-xs"><i className="fa-solid fa-chalkboard-user mr-1.5" aria-hidden /> Xem lớp học</LinkBtn>
            <LinkBtn v="warn" href="#/app/requests"><i className="fa-solid fa-envelope-open-text mr-1.5" aria-hidden /> Yêu cầu chờ duyệt</LinkBtn>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-10 -bottom-10 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute top-0 right-1/4 size-32 rounded-full bg-amber-400/20 blur-xl" />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stat.map(([l, v, icon, grad, badgeCls], i) => (
          <Card key={l} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-up relative overflow-hidden p-5 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className={`grid size-9 place-items-center rounded-xl text-base shadow-2xs ${badgeCls}`}><i className={`fa-solid ${icon}`} aria-hidden /></span>
              <span className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${grad}`} />
            </div>
            <span className="text-xs font-medium text-slate-500 block truncate">{l}</span>
            <b className="font-display block text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              <CountUp to={v} format={typeof v === 'number' && /thu|nợ/i.test(l) ? vnd : undefined} />
            </b>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div>
          <H3><i className="fa-solid fa-bullhorn text-blue-600" aria-hidden /> Lớp đang mở đăng ký ({risk.length})</H3>
          <Table head={['Lớp', 'Chi nhánh', 'Khai giảng', 'Đã xác nhận', 'Trạng thái']} rows={risk.map((c) => {
            const n = R.confirmed(db, c.id).length;
            return (
              <tr key={c.id}>
                <td>{canViewClass(user) ? <a className="font-bold text-blue-600 hover:text-blue-800 transition" href={`#/app/class/${c.id}`}>{c.code}</a> : <b>{c.code}</b>}</td>
                <td>{by(db, 'branches', c.branchId).name}</td>
                <td>{dmy(c.startDate)}</td>
                <td><div className="w-36">{n}/{CFG.minStudents}<Meter v={n} min={CFG.minStudents} /></div></td>
                <td>{n >= CFG.minStudents ? <Badge t="Đủ điều kiện mở" /> : <Badge t={`Thiếu ${CFG.minStudents - n}`} c="amber" />}</td>
              </tr>
            );
          })} />
        </div>
        <div>
          <H3><i className="fa-solid fa-calendar-day text-blue-600" aria-hidden /> Buổi học hôm nay ({ts.length})</H3>
          <Table head={['Giờ', 'Lớp', 'Chi nhánh', 'Phòng', 'Giáo viên']} rows={ts.map((s) => (
            <tr key={s.id}>
              <td><span className="font-semibold text-blue-600">{s.start}-{s.end}</span></td>
              <td className="font-bold">{by(db, 'classes', s.classId).code}</td>
              <td>{by(db, 'branches', by(db, 'classes', s.classId).branchId).name}</td>
              <td><span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{by(db, 'rooms', s.roomId).name}</span></td>
              <td>{by(db, 'teachers', s.teacherId).name}</td>
            </tr>
          ))} />
        </div>
      </div>
    </>
  );
}

/* ---------------- Lớp học ---------------- */
export function Classes() {
  const { db, user, act, openModal } = useStore(), ask = useAsk();
  const [cb, setCb] = useState(''), [ct, setCt] = useState(''), [cs, setCs] = useState('');
  const list = db.classes.filter((c) => (!cb || c.branchId === cb) && (!ct || c.termId === ct) && (!cs || c.status === cs)).sort((a, b) => a.code.localeCompare(b.code));
  return (
    <>
      <Head title="Quản lý lớp học">{R.can(user, 'klass') && <Btn onClick={() => openModal(<NewClassForm />)}>+ Tạo lớp mới</Btn>}</Head>
      <Note>Lớp chỉ được <b>xác nhận mở</b> khi có ≥ {CFG.minStudents} học viên đã xác nhận (đóng ≥ {CFG.minPaidPct * 100}% học phí); tối đa {CFG.maxStudents} học viên/lớp; lịch học không trùng phòng hoặc giáo viên.</Note>
      <div className="mb-4 flex flex-wrap gap-2.5">
        <Filter value={cb} onChange={(e) => setCb(e.target.value)} ph="Tất cả chi nhánh" options={db.branches.map((b) => [b.id, b.name])} />
        <Filter value={ct} onChange={(e) => setCt(e.target.value)} ph="Tất cả đợt" options={db.terms.map((t) => [t.id, t.name])} />
        <Filter value={cs} onChange={(e) => setCs(e.target.value)} ph="Tất cả trạng thái" options={statuses(['Nháp', 'Mở đăng ký', 'Đang học', 'Kết thúc', 'Đã hủy'])} />
      </div>
      <Table head={['Lớp', 'Khóa học', 'Chi nhánh', 'Đợt', 'Lịch học', 'Sĩ số', 'Trạng thái', '']} rows={list.map((c) => {
        const conf = R.confirmed(db, c.id).length, live = R.live(db, c.id).length;
        return (
          <tr key={c.id}>
            <td className="font-bold text-slate-900">{c.code}</td>
            <td>{by(db, 'courses', c.courseId).name}</td>
            <td>{by(db, 'branches', c.branchId).name}</td>
            <td><span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{by(db, 'terms', c.termId).name}</span></td>
            <td>{R.scheduleText(c)}<br /><Muted>{c.roomId ? `${by(db, 'rooms', c.roomId).name} · ${by(db, 'teachers', c.teacherId).name}` : ''}</Muted></td>
            <td className="min-w-40">{live}/{CFG.maxStudents} <Muted>(xác nhận {conf}, tối thiểu {CFG.minStudents})</Muted><Meter v={conf} min={CFG.minStudents} /></td>
            <td><Badge t={c.status} /></td>
            <td><div className="flex gap-1.5"><LinkBtn v="ghost" sm href={`#/app/class/${c.id}`}>Chi tiết</LinkBtn>
              {R.can(user, 'klass') && c.status === 'Nháp' && <Btn v="ghost" sm onClick={() => openModal(<ClassEditForm id={c.id} />)}>Sửa</Btn>}
              {R.can(user, 'klass') && ['Nháp', 'Đã hủy'].includes(c.status) && <Btn v="ghost" sm onClick={() => ask({ title: 'Bạn có chắc chắn muốn xóa lớp?', message: `Lớp ${c.code} sẽ bị xóa vĩnh viễn. Chỉ xóa được lớp chưa có dữ liệu đăng ký.`, ok: 'Xóa lớp', danger: true, onConfirm: () => act(() => R.deleteClass(db, user, c.id)) })}>Xóa</Btn>}
            </div></td>
          </tr>
        );
      })} />
    </>
  );
}

export function ClassDetail({ id }) {
  const { db, user, act, openModal } = useStore(), ask = useAsk();
  const c = by(db, 'classes', id);
  if (!c.id) return <><Head title="Không tìm thấy lớp" /><LinkBtn v="ghost" href="#/app/classes">← Danh sách lớp</LinkBtn></>;
  const co = by(db, 'courses', c.courseId), ss = R.sessions(db, id), ens = db.enrollments.filter((e) => e.classId === id), conf = R.confirmed(db, id).length;
  const k = R.can(user, 'klass'), en = R.can(user, 'enroll'), open = ['Mở đăng ký', 'Đang học'].includes(c.status), pre = ['Nháp', 'Mở đăng ký'].includes(c.status);
  const KV = ({ l, children }) => <><dt className="text-slate-400 font-medium">{l}</dt><dd className="font-semibold text-slate-800">{children}</dd></>;
  return (
    <>
      <Head title={<>Lớp {c.code} <Badge t={c.status} /></>}>
        <LinkBtn v="ghost" href="#/app/classes">← Danh sách</LinkBtn>
        {en && open && <Btn onClick={() => openModal(<EnrollForm cid={id} />)}>+ Đăng ký học viên</Btn>}
        {k && pre && <Btn v="ghost" onClick={() => openModal(<ScheduleForm id={id} />)}>{ss.length ? 'Sửa lịch' : 'Xếp lịch'}</Btn>}
        {k && c.status === 'Nháp' && <Btn onClick={() => ask({ title: 'Mở đăng ký cho lớp này?', message: 'Sau khi mở, nhân viên ghi danh có thể đăng ký học viên vào lớp.', ok: 'Mở đăng ký', onConfirm: () => act(() => R.openRegistration(db, user, id), 'Lớp đã mở đăng ký') })}>Mở đăng ký</Btn>}
        {k && c.status === 'Mở đăng ký' && <Btn v="ok" onClick={() => ask({ title: 'Xác nhận mở lớp?', message: 'Lớp sẽ chuyển sang “Đang học”. Hệ thống kiểm tra lại sĩ số tối thiểu và lịch học.', ok: 'Xác nhận mở lớp', onConfirm: () => act(() => { R.confirmOpen(db, user, id); }, 'Lớp đã được xác nhận mở – bắt đầu đào tạo', true) })}>Xác nhận mở lớp</Btn>}
        {k && c.status === 'Đang học' && <Btn v="warn" onClick={() => openModal(<FinishForm id={id} />)}>Kết thúc lớp</Btn>}
        {k && c.status === 'Nháp' && <Btn v="ghost" onClick={() => openModal(<ClassEditForm id={id} />)}><i className="fa-solid fa-pen-to-square mr-1" aria-hidden /> Sửa thông tin</Btn>}
        {k && ['Nháp', 'Đã hủy'].includes(c.status) && <Btn v="bad" onClick={() => ask({ title: 'Bạn có chắc chắn muốn xóa lớp?', message: `Lớp ${c.code} sẽ bị xóa vĩnh viễn cùng lịch học. Chỉ xóa được lớp chưa có dữ liệu đăng ký.`, ok: 'Xóa lớp', danger: true, onConfirm: () => { if (act(() => R.deleteClass(db, user, id))) location.hash = '#/app/classes'; } })}><i className="fa-solid fa-trash-can mr-1" aria-hidden /> Xóa lớp</Btn>}
        {k && pre && <Btn v="bad" onClick={() => ask({ title: 'Bạn có chắc chắn muốn hủy lớp?', message: `Lớp ${c.code} sẽ bị hủy, lịch học bị xóa và học phí đã đóng chuyển vào số dư của từng học viên.`, ok: 'Hủy lớp', danger: true, onConfirm: () => act(() => R.cancelClass(db, user, id), 'Đã hủy lớp') })}>Hủy lớp</Btn>}
      </Head>
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card><dl className="grid grid-cols-[140px_1fr] gap-2 text-sm">
          <KV l="Khóa học">{co.name}</KV><KV l="Học phí">{vnd(co.fee)}</KV><KV l="Chi nhánh">{by(db, 'branches', c.branchId).name}</KV><KV l="Đợt đào tạo">{by(db, 'terms', c.termId).name}</KV>
          <KV l="Lịch học">{R.scheduleText(c)}</KV><KV l="Phòng / Giáo viên">{c.roomId ? `${by(db, 'rooms', c.roomId).name} · ${by(db, 'teachers', c.teacherId).name}` : '—'}</KV><KV l="Thời gian">{c.startDate ? `${dmy(c.startDate)} → ${dmy(c.endDate)}` : '—'}</KV>
        </dl></Card>
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Sĩ số học viên</span>
              <span className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs font-semibold border border-blue-100">Tối đa {CFG.maxStudents}</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">{R.live(db, id).length}</span>
              <span className="text-slate-400 font-semibold text-sm">/ {CFG.maxStudents} học viên</span>
            </div>
            <p className="my-1.5 text-sm text-slate-600">Đã xác nhận: <b className="text-emerald-600">{conf}</b> / tối thiểu {CFG.minStudents}</p>
            <Meter v={conf} min={CFG.minStudents} />
          </div>
          <p className="mt-3 text-xs text-slate-400">Đã hoàn thành {R.held(db, id)}/{ss.length} buổi học</p>
        </Card>
      </div>
      <H3>Học viên trong lớp ({ens.length})</H3>
      <Table head={['Học viên', 'Trạng thái', 'Học phí', 'Đã đóng', 'Còn nợ', '']} right={[2, 3, 4]} rows={ens.map((e) => {
        const live = R.COLLECTIBLE.includes(e.status);
        return <tr key={e.id}><td><Stu id={e.studentId} /></td><td><Badge t={e.status} /></td><td className="text-right font-medium">{vnd(e.fee)}</td><td className="text-right text-emerald-600 font-medium">{vnd(R.paid(db, e.id))}</td><td className="text-right font-bold text-rose-600">{vnd(live ? R.due(db, e) : 0)}</td><td>{R.can(user, 'pay') && live && R.due(db, e) > 0 && <Btn sm onClick={() => openModal(<PayForm eid={e.id} />)}>Thu phí</Btn>}</td></tr>;
      })} />
      <H3>Các buổi học ({ss.length})</H3>
      <Table head={['Buổi', 'Ngày', 'Thứ', 'Giờ', 'Phòng', 'Giáo viên', 'Trạng thái', '']} rows={ss.map((s) => <tr key={s.id}><td className="font-semibold text-slate-500">{s.no}</td><td>{dmy(s.date)}</td><td>{U.DOW[U.dow(s.date)]}</td><td><span className="font-medium text-blue-600">{s.start}-{s.end}</span></td><td>{by(db, 'rooms', s.roomId).name}</td><td>{by(db, 'teachers', s.teacherId).name}</td><td><div className="flex flex-wrap gap-1">{s.held ? <Badge t="Đã học" /> : s.date < U.today() ? <Badge t="Chưa điểm danh" c="red" /> : <Badge t="Sắp tới" />}{s.history && s.history.length > 0 && <span title={`Đổi lần cuối: ${s.history[s.history.length - 1].reason}`}><Badge t="Đã đổi" c="amber" /></span>}</div></td><td>{k && !s.held && ['Mở đăng ký', 'Đang học'].includes(c.status) && <Btn v="ghost" sm onClick={() => openModal(<RescheduleForm sid={s.id} />)}>Đổi buổi</Btn>}</td></tr>)} />
    </>
  );
}

/* ---------------- Đăng ký học & học phí ---------------- */
export function Enrollments() {
  const { db, user, openModal } = useStore();
  const [q, setQ] = useState(''), [es, setEs] = useState('');
  const rows = db.enrollments.filter((e) => (!es || e.status === es) && (!q || enLabel(db, e).toLowerCase().includes(q.toLowerCase()))).slice().reverse();
  const canPay = R.can(user, 'pay'), canReq = R.can(user, 'request');
  return (
    <>
      <Head title="Quản lý đăng ký học" />
      <Note>Đăng ký mới được tạo tại <b>Lớp học → chi tiết lớp → Đăng ký học viên</b>. Bảo lưu, chuyển lớp, học bù tạo yêu cầu chờ Quản lý đào tạo duyệt.</Note>
      <div className="mb-4 flex flex-wrap gap-2.5"><In className="max-w-xs" placeholder="Tìm học viên / lớp…" value={q} onChange={(e) => setQ(e.target.value)} /><Filter value={es} onChange={(e) => setEs(e.target.value)} ph="Mọi trạng thái" options={statuses(['Chờ đóng phí', 'Đã xác nhận', 'Bảo lưu', 'Đã chuyển lớp', 'Hoàn thành', 'Đã hủy'])} /></div>
      <Table head={['Học viên', 'Lớp', 'Học phí', 'Đã đóng', 'Còn nợ', 'Trạng thái', '']} right={[2, 3, 4]} rows={rows.map((e) => {
        const live = ['Chờ đóng phí', 'Đã xác nhận'].includes(e.status), coll = R.COLLECTIBLE.includes(e.status);
        return (
          <tr key={e.id}><td><Stu id={e.studentId} /></td><td>{canViewClass(user) ? <a className="text-blue-600 font-semibold hover:text-blue-800" href={`#/app/class/${e.classId}`}>{by(db, 'classes', e.classId).code}</a> : by(db, 'classes', e.classId).code}</td><td className="text-right font-medium">{vnd(e.fee)}</td><td className="text-right text-emerald-600 font-medium">{vnd(R.paid(db, e.id))}</td><td className="text-right font-bold text-rose-600">{coll ? vnd(R.due(db, e)) : '—'}</td><td><Badge t={e.status} /></td>
            <td><div className="flex flex-wrap gap-1.5">
              {canPay && coll && R.due(db, e) > 0 && <Btn sm onClick={() => openModal(<PayForm eid={e.id} />)}>Thu phí</Btn>}
              {canReq && e.status === 'Đã xác nhận' && <Btn v="ghost" sm onClick={() => openModal(<ReserveForm eid={e.id} />)}>Bảo lưu</Btn>}
              {canReq && live && <Btn v="ghost" sm onClick={() => openModal(<TransferForm eid={e.id} />)}>Chuyển lớp</Btn>}
              {canReq && e.status === 'Đã xác nhận' && <Btn v="ghost" sm onClick={() => openModal(<MakeupForm eid={e.id} />)}>Học bù</Btn>}
              {canReq && live && <Btn v="ghost" sm onClick={() => openModal(<CancelForm eid={e.id} />)}>Hủy đăng ký</Btn>}
            </div></td></tr>
        );
      })} />
    </>
  );
}

export function Payments() {
  const { db, user, openModal } = useStore();
  const [q, setQ] = useState(''), [from, setFrom] = useState(''), [to, setTo] = useState(''), [showVoid, setShowVoid] = useState(true), [page, setPage] = useState(1);
  const can = R.can(user, 'pay');
  const debts = db.enrollments.filter((e) => R.COLLECTIBLE.includes(e.status) && R.due(db, e) > 0);
  const filtered = db.payments.slice().reverse().filter((p) => (showVoid || !p.voided) && (!from || p.date >= from) && (!to || p.date <= to)
    && (!q || `${p.no} ${by(db, 'students', p.studentId).name} ${by(db, 'students', p.studentId).code}`.toLowerCase().includes(q.toLowerCase())));
  const { rows, pager } = paginate(filtered, page, setPage);
  const withBalance = db.students.filter((s) => s.balance > 0);
  return (
    <>
      <Head title="Quản lý học phí & phiếu thu" />
      <H3>Công nợ cần thu ({debts.length})</H3>
      <Table head={['Học viên', 'Lớp', 'Học phí', 'Đã đóng', 'Còn nợ', 'Trạng thái', '']} right={[2, 3, 4]} rows={debts.map((e) => <tr key={e.id}><td><Stu id={e.studentId} /></td><td>{by(db, 'classes', e.classId).code}</td><td className="text-right font-medium">{vnd(e.fee)}</td><td className="text-right text-emerald-600 font-medium">{vnd(R.paid(db, e.id))}</td><td className="text-right font-bold text-rose-600">{vnd(R.due(db, e))}</td><td><Badge t={e.status} /></td><td>{can && <Btn sm onClick={() => openModal(<PayForm eid={e.id} />)}>Thu phí</Btn>}</td></tr>)} />
      {withBalance.length > 0 && <>
        <H3>Học viên có số dư cần hoàn ({withBalance.length})</H3>
        <Table head={['Học viên', 'Số dư', '']} right={[1]} rows={withBalance.map((s) => <tr key={s.id}><td><Stu id={s.id} /></td><td className="text-right font-bold text-emerald-600">{vnd(s.balance)}</td><td>{can && <Btn v="ghost" sm onClick={() => openModal(<RefundForm studentId={s.id} />)}>Hoàn tiền</Btn>}</td></tr>)} />
      </>}
      <H3>Danh sách phiếu thu</H3>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <In className="max-w-xs" placeholder="Tìm số phiếu / học viên…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <label className="flex items-center gap-1.5 text-sm text-slate-500">Từ <In type="date" className="w-auto" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} /></label>
        <label className="flex items-center gap-1.5 text-sm text-slate-500">đến <In type="date" className="w-auto" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} /></label>
        <label className="flex items-center gap-1.5 text-sm text-slate-500"><input type="checkbox" checked={showVoid} onChange={(e) => setShowVoid(e.target.checked)} /> Hiện phiếu đã hủy</label>
      </div>
      <Table head={['Số phiếu', 'Ngày', 'Học viên', 'Lớp', 'Hình thức', 'Số tiền', 'Người thu', '']} right={[5]} rows={rows.map((p) => (
        <tr key={p.id} className={p.voided ? 'text-slate-400' : ''}><td className={p.voided ? 'line-through' : 'font-semibold'}>{p.no}</td><td>{dmy(p.date)}</td><td><Stu id={p.studentId} /></td><td>{by(db, 'classes', by(db, 'enrollments', p.enrollmentId).classId).code}</td>
          <td>{p.method}{p.note && <><br /><Muted>{p.note}</Muted></>}{p.voided && <><br /><Badge t="Đã hủy" c="red" /> <Muted>{p.voidReason} ({p.voidBy}, {dmy(p.voidAt)})</Muted></>}</td>
          <td className={`text-right font-semibold ${p.voided ? 'line-through text-slate-400' : 'text-slate-900'}`}>{vnd(p.amount)}</td><td>{p.by}</td>
          <td>{can && !p.voided && ['Thu', 'Trừ số dư'].includes(p.type) && <Btn v="ghost" sm onClick={() => openModal(<VoidForm pid={p.id} />)}>Hủy phiếu</Btn>}</td></tr>
      ))} />
      {pager}
    </>
  );
}

/* ---------------- Yêu cầu đặc biệt ---------------- */
export function Requests() {
  const { db, user, act, openModal } = useStore(), ask = useAsk();
  const [rt, setRt] = useState(''), [rs, setRs] = useState('');
  const can = R.can(user, 'approve'), rows = db.requests.filter((r) => (!rt || r.type === rt) && (!rs || r.status === rs)).slice().reverse();
  return (
    <>
      <Head title="Bảo lưu · Chuyển lớp · Học bù" />
      <Note>Tạo yêu cầu từ trang <b>Đăng ký học</b>. Chỉ <b>Quản lý đào tạo</b> được duyệt; khi duyệt, hệ thống kiểm tra lại toàn bộ điều kiện và hoàn tác nếu có lỗi.</Note>
      <div className="mb-4 flex flex-wrap gap-2.5"><Filter value={rt} onChange={(e) => setRt(e.target.value)} ph="Mọi loại" options={Object.entries(TYPE)} /><Filter value={rs} onChange={(e) => setRs(e.target.value)} ph="Mọi trạng thái" options={statuses(['Chờ duyệt', 'Đã duyệt', 'Từ chối', 'Đã hủy'])} /></div>
      <Table head={['Loại', 'Học viên', 'Nội dung', 'Lý do', 'Người tạo', 'Trạng thái / kết quả', '']} rows={rows.map((r) => (
        <tr key={r.id}><td><b>{TYPE[r.type]}</b><br /><Muted>{dmy(r.createdAt)}</Muted></td><td><Stu id={r.studentId} /></td><td>{reqDesc(db, r)}</td><td>{r.reason}</td><td>{r.createdBy}</td>
          <td><Badge t={r.status} />{r.result && <><br /><small className="text-emerald-700 font-medium">{r.result}</small></>}{r.status === 'Từ chối' && <><br /><small className="text-rose-600">{r.note}</small></>}</td>
          <td>{can && r.status === 'Chờ duyệt' && <div className="flex gap-1.5"><Btn v="ok" sm onClick={() => ask({ title: 'Duyệt yêu cầu này?', message: `${TYPE[r.type]}: ${reqDesc(db, r)}. Hệ thống sẽ áp dụng thay đổi ngay sau khi duyệt.`, ok: 'Duyệt', onConfirm: () => act(() => R.approve(db, user, r.id).result, 'Đã duyệt', true) })}>Duyệt</Btn><Btn v="bad" sm onClick={() => openModal(<RejectForm id={r.id} />)}>Từ chối</Btn></div>}</td></tr>
      ))} />
      <H3>Phiếu bảo lưu hiện có</H3>
      <Table head={['Học viên', 'Lớp đã bảo lưu', 'Học phí giữ lại', 'Hạn bảo lưu', 'Trạng thái']} rows={db.reservations.map((v) => <tr key={v.id}><td><Stu id={v.studentId} /></td><td>{by(db, 'classes', by(db, 'enrollments', v.enrollmentId).classId).code}</td><td className="font-semibold text-emerald-600">{vnd(v.credit)}</td><td>{dmy(v.expires)}</td><td><Badge t={R.rvStatus(v)} /></td></tr>)} />
    </>
  );
}

/* ---------------- Điểm danh ---------------- */
export function Attendance() {
  const { db, user, act } = useStore();
  const today = U.today();
  const [from, setFrom] = useState(U.addDays(today, -45)), [to, setTo] = useState(today), [pick, setPick] = useState(null), [draft, setDraft] = useState({}), [reason, setReason] = useState('');
  const attendable = (s) => { const st = by(db, 'classes', s.classId).status; return st === 'Đang học' || (st === 'Kết thúc' && user.role === 'manager'); };
  const list = db.sessions.filter((s) => s.date <= today && s.date >= from && s.date <= to && attendable(s) && (user.role !== 'teacher' || s.teacherId === user.teacherId)).sort((a, b) => b.date.localeCompare(a.date) || b.start.localeCompare(a.start));
  const filters = (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <label className="flex items-center gap-1.5 text-sm text-slate-500">Từ ngày <In type="date" className="w-auto" value={from} max={to} onChange={(e) => { setFrom(e.target.value); setPick(null); }} /></label>
      <label className="flex items-center gap-1.5 text-sm text-slate-500">đến <In type="date" className="w-auto" value={to} max={today} onChange={(e) => { setTo(e.target.value); setPick(null); }} /></label>
    </div>
  );
  if (!list.length) return <><Head title="Điểm danh" />{filters}<Note>Không có buổi học nào cần điểm danh trong khoảng thời gian này (chỉ lớp đang học).</Note></>;
  const sid = list.some((s) => s.id === pick) ? pick : list[0].id, s = by(db, 'sessions', sid), rows = R.attendees(db, sid);
  const old = s.held && s.date < U.addDays(today, -CFG.attendanceEditDays);
  const val = (e) => draft[`${sid}:${e.id}`] ?? (db.attendance.find((x) => x.sessionId === sid && x.enrollmentId === e.id) || {}).status ?? 'Có mặt';
  const save = () => act(() => { R.markAttendance(db, user, sid, rows.map(({ e }) => ({ enrollmentId: e.id, status: val(e) })), reason); setDraft({}); setReason(''); }, 'Đã lưu điểm danh');
  return (
    <>
      <Head title="Điểm danh buổi học" />
      {filters}
      <div className="mb-4"><Sel className="max-w-md" value={sid} onChange={(e) => { setPick(e.target.value); setDraft({}); setReason(''); }} options={list.map((x) => [x.id, `${dmy(x.date)} ${x.start} · ${by(db, 'classes', x.classId).code} · buổi ${x.no}${x.held ? ' ✔' : ''}`])} /></div>
      {old && <Note>Buổi học đã quá {CFG.attendanceEditDays} ngày: {user.role === 'teacher' ? 'chỉ Quản lý đào tạo được sửa điểm danh.' : 'sửa điểm danh cần nhập lý do và mọi thay đổi được lưu lịch sử.'}</Note>}
      <Table head={['Học viên', 'Ghi chú', 'Có mặt', 'Vắng']} rows={rows.map(({ e, makeup }) => {
        const rec = db.attendance.find((x) => x.sessionId === sid && x.enrollmentId === e.id);
        return (
          <tr key={e.id}><td><Stu id={e.studentId} /></td><td><div className="flex gap-1">{makeup && <Badge t="Học bù" />}{rec && rec.history && rec.history.length > 0 && <span title={rec.history.map((h) => `${dmy(h.at)} ${h.by}: ${h.from} → ${h.to}${h.reason ? ' (' + h.reason + ')' : ''}`).join('\n')}><Badge t="Đã sửa" c="amber" /></span>}</div></td>
            {['Có mặt', 'Vắng'].map((v) => <td key={v}><input type="radio" name={`st_${e.id}`} checked={val(e) === v} onChange={() => setDraft({ ...draft, [`${sid}:${e.id}`]: v })} /></td>)}</tr>
        );
      })} />
      {old && user.role !== 'teacher' && <div className="mb-3 max-w-md"><In placeholder="Lý do sửa điểm danh (bắt buộc)" value={reason} onChange={(e) => setReason(e.target.value)} /></div>}
      <Btn disabled={old && user.role === 'teacher'} onClick={save}>{s.held ? 'Cập nhật điểm danh' : 'Lưu điểm danh'}</Btn>
    </>
  );
}

/* ---------------- Thời khóa biểu ---------------- */
export function Timetable() {
  const { db, user } = useStore();
  const [mon, setMon] = useState(U.monday(U.today())), [tb, setTb] = useState('');
  const today = U.today(), days = [...Array(7)].map((_, i) => U.addDays(mon, i));
  const mine = (s) => (user.role !== 'teacher' || s.teacherId === user.teacherId) && (!tb || by(db, 'classes', s.classId).branchId === tb);
  return (
    <>
      <Head title="Thời khóa biểu đào tạo">
        <Btn v="ghost" onClick={() => setMon(U.addDays(mon, -7))}>‹ Tuần trước</Btn>
        <Btn v="ghost" onClick={() => setMon(U.monday(today))}>Tuần này</Btn>
        <Btn v="ghost" onClick={() => setMon(U.addDays(mon, 7))}>Tuần sau ›</Btn>
      </Head>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="font-bold text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2">
          <i className="fa-solid fa-calendar-week text-blue-600" aria-hidden /> {dmy(days[0])} – {dmy(days[6])}
        </span>
        {user.role !== 'teacher' && <Filter value={tb} onChange={(e) => setTb(e.target.value)} ph="Tất cả chi nhánh" options={db.branches.map((b) => [b.id, b.name])} />}
      </div>
      <div className="grid grid-cols-[repeat(7,minmax(130px,1fr))] gap-3 overflow-auto pb-4">
        {days.map((d) => (
          <div key={d} className={`min-h-36 rounded-2xl border p-3 transition-all duration-200 ${d === today ? 'border-blue-500 bg-blue-50/25 shadow-md ring-2 ring-blue-400/20' : 'border-slate-200/80 bg-white shadow-2xs hover:border-blue-200'}`}>
            <h4 className={`mb-2.5 text-xs font-bold tracking-wider uppercase ${d === today ? 'text-blue-600' : 'text-slate-500'}`}>
              {U.DOW[U.dow(d)]} · {dmy(d).slice(0, 5)} {d === today && <span className="ml-1 rounded-full bg-blue-600 text-white text-[10px] px-1.5 py-0.5">Hôm nay</span>}
            </h4>
            {db.sessions.filter((s) => s.date === d && mine(s)).sort((a, b) => a.start.localeCompare(b.start)).map((s) => (
              <div key={s.id} className={`mb-2 rounded-xl border-l-4 px-2.5 py-2 text-xs shadow-2xs transition hover:scale-[1.02] ${s.held ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950' : 'border-blue-500 bg-blue-50/70 text-blue-950'}`}>
                <b className="block text-[13px]">{s.start} - {s.end}</b>
                <div className="font-semibold text-slate-800">{by(db, 'classes', s.classId).code} · Buổi {s.no}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{by(db, 'rooms', s.roomId).name} · {by(db, 'teachers', s.teacherId).name.split(' ').slice(-1)[0]}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Tư vấn, báo cáo, kiểm thử ---------------- */
export function Leads() {
  const { db, commit } = useStore();
  return (
    <>
      <Head title="Yêu cầu tư vấn tuyển sinh" />
      <Table head={['Ngày', 'Họ tên', 'Điện thoại', 'Khóa quan tâm', 'Ghi chú', 'Trạng thái']} rows={db.leads.slice().reverse().map((l) => <tr key={l.id}><td>{dmy(l.createdAt)}</td><td className="font-semibold">{l.name}</td><td>{l.phone}</td><td>{l.course}</td><td>{l.note}</td><td><Sel className="w-auto" value={l.status} onChange={(e) => { l.status = e.target.value; commit('Cập nhật trạng thái tư vấn'); }} options={statuses(['Mới', 'Đã liên hệ', 'Đã ghi danh'])} /></td></tr>)} />
    </>
  );
}

export function Reports() {
  const { db } = useStore();
  const [termId, setTermId] = useState(''), [from, setFrom] = useState(''), [to, setTo] = useState('');
  const r = R.report(db, { termId, from, to }), maxRev = Math.max(1, ...r.byBranch.map((x) => x.revenue)), cls = db.classes.filter((c) => ['Mở đăng ký', 'Đang học'].includes(c.status) && (!termId || c.termId === termId));
  const exportCsv = () => {
    const rowsCsv = [['Chi nhánh', 'Số lớp', 'Đang học', 'Số đăng ký', 'Học viên (không trùng)', 'Doanh thu đã thu', 'Còn phải thu'], ...r.byBranch.map((x) => [x.b.name, x.classes, x.running, x.students, x.uniqueStudents, x.revenue, x.receivable]), [], ['Khóa học', 'Số lớp', 'Số đăng ký', 'Học viên (không trùng)'], ...r.byCourse.map((x) => [x.co.name, x.classes, x.students, x.uniqueStudents])];
    const csv = '\ufeff' + rowsCsv.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = `bao-cao-${U.today()}.csv`; a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <>
      <Head title="Báo cáo đào tạo & doanh thu"><Btn v="ghost" className="no-print" onClick={exportCsv}><i className="fa-solid fa-file-csv mr-1.5" aria-hidden /> Xuất CSV</Btn><Btn v="ghost" className="no-print" onClick={() => window.print()}><i className="fa-solid fa-print mr-1.5" aria-hidden /> In báo cáo</Btn></Head>
      <div className="no-print mb-4 flex flex-wrap items-center gap-2.5">
        <Filter value={termId} onChange={(e) => setTermId(e.target.value)} ph="Tất cả các đợt" options={db.terms.map((t) => [t.id, t.name])} />
        <label className="flex items-center gap-1.5 text-sm text-slate-500">Thu từ <In type="date" className="w-auto" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="flex items-center gap-1.5 text-sm text-slate-500">đến <In type="date" className="w-auto" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <span className="text-sm text-slate-500">Khoảng ngày áp dụng cho doanh thu, hoàn tiền và chuyên cần.</span>
      </div>
      <H3>Theo chi nhánh</H3>
      <Table head={['Chi nhánh', 'Số lớp', 'Đang học', 'Số đăng ký', 'Học viên (không trùng)', 'Doanh thu đã thu', '', 'Còn phải thu']} right={[5, 7]} rows={r.byBranch.map((x) => <tr key={x.b.id}><td><b>{x.b.name}</b></td><td>{x.classes}</td><td>{x.running}</td><td>{x.students}</td><td>{x.uniqueStudents}</td><td className="text-right font-semibold text-emerald-600">{vnd(x.revenue)}</td><td className="w-36"><Bar v={x.revenue} max={maxRev} /></td><td className="text-right font-semibold text-rose-600">{vnd(x.receivable)}</td></tr>)} />
      <H3>Theo khóa học</H3>
      <Table head={['Khóa học', 'Số lớp', 'Số đăng ký', 'Học viên (không trùng)']} rows={r.byCourse.map((x) => <tr key={x.co.id}><td>{x.co.name}</td><td>{x.classes}</td><td>{x.students}</td><td>{x.uniqueStudents}</td></tr>)} />
      <H3>Mức độ lấp đầy lớp đang mở</H3>
      <Table head={['Lớp', 'Sĩ số', 'Tỷ lệ lấp đầy']} rows={cls.map((c) => { const n = R.live(db, c.id).length; return <tr key={c.id}><td>{c.code}</td><td>{n}/{CFG.maxStudents}</td><td className="w-64"><Bar v={n} max={CFG.maxStudents} /></td></tr>; })} />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><span className="text-slate-500 text-xs block mb-1">Học viên không trùng đang học</span><b className="text-2xl font-bold text-slate-900">{r.uniqueStudents}</b></Card>
        <Card><span className="text-slate-500 text-xs block mb-1">Tỷ lệ chuyên cần</span><b className="text-2xl font-bold text-slate-900">{r.attRate == null ? '—' : Math.round(r.attRate * 100) + '%'}</b></Card>
        <Card><span className="text-slate-500 text-xs block mb-1">Đã hoàn tiền</span><b className="text-2xl font-bold text-rose-600">{vnd(r.refunded)}</b></Card>
      </div>
    </>
  );
}

/* ---------------- Nhật ký thao tác ---------------- */
export function AuditPage() {
  const { db } = useStore();
  const [q, setQ] = useState(''), [page, setPage] = useState(1);
  const list = (db.audit || []).slice().reverse().filter((a) => !q || `${a.by} ${a.action} ${a.summary.join(' ')}`.toLowerCase().includes(q.toLowerCase()));
  const { rows, pager } = paginate(list, page, setPage, 12);
  const COL = { students: 'Học viên', classes: 'Lớp', sessions: 'Buổi học', enrollments: 'Đăng ký', payments: 'Phiếu thu', requests: 'Yêu cầu', users: 'Tài khoản', rooms: 'Phòng', courses: 'Khóa học', terms: 'Đợt', teachers: 'Giáo viên', branches: 'Chi nhánh', attendance: 'Điểm danh', reservations: 'Bảo lưu', leads: 'Tư vấn', ledger: 'Sổ số dư' };
  return (
    <>
      <Head title="Nhật ký thao tác hệ thống" />
      <Note>Mỗi lần lưu dữ liệu, hệ thống tự động ghi lại <b>ai</b> đã làm gì, <b>lúc nào</b> và giá trị <b>trước → sau</b>. Giữ tối đa 500 mục gần nhất.</Note>
      <div className="mb-4"><In className="max-w-sm" placeholder="Tìm theo người thực hiện, thao tác…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div>
      <Table head={['Thời gian', 'Người thực hiện', 'Thao tác', 'Thay đổi']} rows={rows.map((a) => (
        <tr key={a.id}><td className="whitespace-nowrap font-medium text-slate-500 text-xs">{new Date(a.at).toLocaleString('vi-VN')}</td><td><span className="font-semibold text-slate-800">{a.by}</span><br /><Muted>{ROLE[a.role] || 'Khách'}</Muted></td><td className="font-semibold text-slate-900">{a.action}</td>
          <td><div className="flex flex-wrap gap-1">{a.summary.map((s) => <Badge key={s} t={s} c="blue" />)}</div>
            {a.details.length > 0 && <details className="mt-1.5 text-xs"><summary className="cursor-pointer text-indigo-600 hover:text-indigo-800">Chi tiết ({a.details.length})</summary>
              <ul className="mt-1 space-y-0.5">{a.details.map((d, i) => <li key={i}><b>{COL[d.col] || d.col}</b> {d.op} <b>{d.label}</b>{d.fields && Object.entries(d.fields).map(([k, [o, n]]) => <span key={k} className="ml-2 text-slate-500">{k}: <s>{o || '∅'}</s> → {n || '∅'}</span>)}</li>)}</ul></details>}</td></tr>
      ))} />
      {pager}
    </>
  );
}
