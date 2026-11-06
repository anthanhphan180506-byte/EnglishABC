import { useState } from 'react';
import { useStore } from '../store.jsx';
import { Btn, LinkBtn, Fld, In, Sel } from '../ui.jsx';
import { Reveal, CountUp, useScrolled, confetti } from '../fx.jsx';
import { R, U, CFG } from '../lib/rules.js';
import { by, vnd, dmy, ROLE } from '../lib/util.js';

export const SLOGAN = 'Nói tự tin, bắt đầu từ hôm nay.';

/* ── Icon wrapper ───────────────────────────────────────────────── */
const Ic = ({ name, className = '' }) => <i className={`fa-solid fa-${name} ${className}`} aria-hidden />;

/* ── Real image with elegant fallback ───────────────────────────── */
const RealImg = ({ src, alt, className = '', fallbackIcon = 'graduation-cap', fallbackBg = 'bg-slate-200' }) => {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div className={`flex items-center justify-center text-slate-400 ${fallbackBg} ${className}`}>
        <Ic name={fallbackIcon} className="text-2xl opacity-60" />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} loading="lazy" />;
};

/* ── Logo ─────────────────────────────────────────────────────── */
const Logo = ({ dark }) => (
  <a href="#/" className={`flex items-center gap-2.5 font-bold no-underline ${dark ? 'text-white' : 'text-slate-900'}`}>
    <span className="flex size-9 items-center justify-center rounded-lg bg-blue-700 font-display text-xl font-black text-white shadow-sm">A</span>
    <span className="font-display leading-tight">
      <span className="block text-xl">ABC English</span>
      <span className="block text-[11px] font-normal tracking-widest opacity-60 uppercase">Trung tâm tiếng Anh</span>
    </span>
  </a>
);

/* ── Lead form ─────────────────────────────────────────────────── */
function LeadForm({ compact }) {
  const { db, commit, toast } = useStore();
  const submit = (e) => {
    e.preventDefault(); const fd = new FormData(e.target);
    db.leads.push({ id: U.id('ld'), name: fd.get('name').trim(), phone: fd.get('phone').trim(), course: fd.get('course'), note: fd.get('note')?.trim() ?? '', status: 'Mới', createdAt: U.today() });
    if (commit('Gửi yêu cầu tư vấn')) { e.target.reset(); toast('Đã gửi! ABC sẽ liên hệ với bạn trong ngày.', 'ok'); confetti(); }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <Fld label="Họ và tên *"><In required name="name" placeholder="Nguyễn Văn A" /></Fld>
      <Fld label="Số điện thoại *"><In required name="phone" type="tel" pattern="0[0-9]{9,10}" placeholder="0901 234 567" /></Fld>
      <Fld label="Khóa học quan tâm"><Sel name="course" options={db.courses.map((c) => [c.name, c.name])} /></Fld>
      {!compact && <Fld label="Ghi chú"><In name="note" placeholder="Mong muốn đạt mục tiêu trong bao lâu..." /></Fld>}
      <button type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 text-base font-black text-white shadow-md shadow-blue-700/30 hover:bg-blue-800 active:scale-[.98] transition-all cursor-pointer">
        <Ic name="paper-plane" /> ĐĂNG KÝ TƯ VẤN MIỄN PHÍ
      </button>
    </form>
  );
}

/* ── Real teachers data (matching IELTS Fighter grid) ─────────────── */
const TEACHERS = [
  { name: 'Ms. Ngọc Anh', score: '8.5', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
  { name: 'Mr. Hoàng Duy', score: '8.5', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { name: 'Ms. Lê Nhi', score: '8.0', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
  { name: 'Mr. Tuấn Anh', score: '8.0', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
  { name: 'Ms. Mai Phương', score: '8.0', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { name: 'Mr. John Smith', score: '8.5', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' },
  { name: 'Ms. Thu Trang', score: '8.5', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
  { name: 'Mr. Quốc Bảo', score: '8.0', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
];

/* ── Quotes ────────────────────────────────────────────────────── */
const QUOTES = [
  ['Minh Châu', 'Học viên A2', 'Lớp ít người nên tôi được nói nhiều hơn hẳn. Sau một đợt đã dám gọi điện cho khách nước ngoài.'],
  ['Quốc Bảo', 'Học viên IELTS', 'Bài viết nào cũng được chấm chữa kỹ. Điểm Writing của tôi tăng rõ rệt sau hai đợt.'],
  ['Thanh Hương', 'Phụ huynh lớp thiếu nhi', 'Con tôi từng ngại nói, giờ về nhà còn tự kể lại bài hát tiếng Anh cho cả nhà nghe.'],
];

const COURSE_FA = { KID: 'child-reaching', A1: 'comments', A2: 'earth-asia', B1: 'book-open', B2: 'graduation-cap', IELTS: 'trophy' };

/* ══════════════════════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════════════════════ */
export function Landing() {
  const { db, user } = useStore();
  const scrolled = useScrolled(12);
  const open = db.classes.filter((c) => c.status === 'Mở đăng ký');
  const jump = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <>
      {/* ══ NAVBAR ══ */}
      <header className={`sticky top-0 z-30 transition-all duration-200 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95'}`}>
        <div className="mx-auto flex h-[70px] max-w-7xl items-center gap-6 px-5">
          <Logo />
          <nav className="ml-auto hidden gap-8 text-sm font-semibold text-slate-700 md:flex">
            {[['khoa-hoc', 'Về chúng tôi'], ['khoa-hoc', 'Khóa học'], ['lop-mo', 'Lớp đang mở'], ['chi-nhanh', 'Chi nhánh']].map(([id, l]) =>
              <a key={l} href={`#${id}`} onClick={jump(id)} className="hover:text-blue-700 transition-colors">{l}</a>
            )}
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <a href="#tu-van" onClick={jump('tu-van')}
              className="hidden items-center gap-2 rounded-full border-2 border-blue-700 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors md:inline-flex">
              <Ic name="phone" /> Tư vấn
            </a>
            <a href={user ? '#/app' : '#/login'}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-sm">
              <Ic name="right-to-bracket" />{user ? 'Vào hệ thống' : 'Đăng ký'}
            </a>
          </div>
        </div>
      </header>

      {/* ══ HERO (Marketing style: Yellow/Blue diagonal + Real student/certificate photo) ══ */}
      <section className="relative overflow-hidden bg-amber-400 min-h-[540px]">
        {/* Diagonal blue panel */}
        <div className="absolute inset-y-0 right-0 w-[55%] bg-blue-700"
          style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }} />

        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Decorative shapes */}
        <div className="absolute top-6 left-1/4 size-8 rotate-45 border-4 border-white/30" />
        <div className="absolute bottom-10 left-16 size-5 rotate-12 border-3 border-white/20" />
        <div className="absolute top-20 right-[42%] size-6 rounded-full bg-white/20" />
        <div className="absolute bottom-16 right-[20%] size-10 rotate-45 border-4 border-yellow-300/40" />

        <div className="relative mx-auto flex max-w-7xl items-center min-h-[540px] px-5 py-14">
          {/* LEFT: Marketing punch text */}
          <div className="w-full max-w-[52%] z-10 animate-slide-in-left">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-amber-900/80">
              TRUNG TÂM TIẾNG ANH ABC – HÀ NỘI
            </p>

            <div className="mb-5 flex flex-col items-start gap-2">
              <div className="-rotate-1 rounded-lg bg-fuchsia-600 px-5 py-2 shadow-lg">
                <span className="font-display text-lg font-black tracking-wide text-white md:text-xl uppercase">
                  HỌC PHÍ TỪ 89K / BUỔI
                </span>
              </div>
              <div className="rounded-lg bg-red-600 px-6 py-3 shadow-xl">
                <span className="font-display text-2xl font-black text-white md:text-4xl uppercase tracking-tight">
                  CAM KẾT ĐẦU RA
                </span>
              </div>
            </div>

            <h1 className="mb-6 font-display text-3xl font-black leading-tight text-slate-900 md:text-5xl">
              Nói{' '}
              <span className="relative inline-block text-blue-700">
                tự tin
                <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-blue-700/30" />
              </span>,<br />
              bắt đầu từ <span className="text-red-600">hôm nay.</span>
            </h1>

            <p className="mb-8 max-w-md text-base leading-relaxed text-slate-800 font-medium">
              Lớp nhỏ tối đa <b>{CFG.maxStudents} học viên</b> · Giáo viên theo sát từng người · Bảo lưu linh hoạt · <b>4 chi nhánh</b> tại Hà Nội.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#tu-van" onClick={jump('tu-van')}
                className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-8 py-3.5 text-base font-black text-white shadow-lg shadow-blue-900/30 hover:bg-blue-800 active:scale-95 transition-all">
                <Ic name="phone-volume" /> ĐĂNG KÝ TƯ VẤN MIỄN PHÍ
              </a>
              <a href="#khoa-hoc" onClick={jump('khoa-hoc')}
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white/90 px-7 py-3.5 text-base font-bold text-slate-900 hover:bg-white transition-colors">
                Xem khóa học <Ic name="arrow-right" />
              </a>
            </div>
          </div>

          {/* RIGHT: Real student & teacher certificate composition (like IELTS Fighter banner) */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden w-[45%] lg:flex items-center justify-center animate-slide-in-right">
            <div className="relative w-full max-w-[460px]">
              {/* Main photo frame */}
              <div className="overflow-hidden rounded-3xl border-4 border-white/80 shadow-2xl bg-slate-900/40">
                <RealImg
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80"
                  alt="Học viên ABC nhận chứng chỉ tiếng Anh"
                  className="h-[360px] w-full object-cover"
                />
              </div>

              {/* Certificate sticker 1: HỌC BỔNG 100% */}
              <div className="absolute -top-3 -left-4 rounded-xl bg-white p-3 shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
                <div className="flex size-10 items-center justify-center rounded-lg bg-red-600 text-white font-black text-lg">
                  <Ic name="award" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-red-600 uppercase tracking-wider">HỌC BỔNG 100%</div>
                  <div className="text-xs font-bold text-slate-800">Thủ khoa đầu ra Q3/2024</div>
                </div>
              </div>

              {/* Certificate sticker 2: CAM KẾT IELTS 7.5+ */}
              <div className="absolute -bottom-4 right-4 rounded-2xl bg-white/95 p-3.5 shadow-2xl border border-slate-100 backdrop-blur-sm flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-700 text-white font-black text-xl">
                  <Ic name="certificate" />
                </div>
                <div>
                  <div className="text-xs font-black text-blue-700 uppercase">CHỨNG CHỈ QUỐC TẾ</div>
                  <div className="text-sm font-extrabold text-slate-900">1,200+ Học viên đạt chuẩn</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom diagonal cut */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full" fill="white">
            <polygon points="0,40 1440,0 1440,40" />
          </svg>
        </div>
      </section>

      {/* ══ PHOTO GALLERY STRIP (Actual classroom photos like IELTS Fighter) ══ */}
      <section className="bg-white py-6 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Lớp học tương tác cao', sub: 'Tối đa 15 học viên', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80' },
              { title: 'Thực hành giao tiếp 1-1', sub: 'Giáo viên theo sát', img: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=400&q=80' },
              { title: 'Hoạt động nhóm sôi nổi', sub: 'Brainstorming & roleplay', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80' },
              { title: 'Vinh danh & Trao chứng chỉ', sub: 'Cam kết đầu ra chuẩn', img: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80' },
            ].map((item, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <RealImg src={item.img} alt={item.title} className="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-3 text-white">
                  <b className="text-xs font-bold leading-tight">{item.title}</b>
                  <span className="text-[11px] text-yellow-300 font-medium">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRUST BAR ══ */}
      <section className="bg-slate-50 py-5 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              ['fa-certificate', 'Giáo viên 100% có chứng chỉ 8.0+ / CELTA', 'text-blue-600'],
              ['fa-trophy', 'Top 10 trung tâm đào tạo tiếng Anh uy tín', 'text-amber-500'],
              ['fa-shield-halved', 'Cam kết hoàn tiền nếu không đạt mục tiêu', 'text-green-600'],
              ['fa-headset', 'Hỗ trợ học tập 24/7 qua Zalo & App', 'text-red-500'],
            ].map(([icon, text, color]) => (
              <div key={text} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                <i className={`fa-solid ${icon} text-base ${color}`} aria-hidden />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY ABC (Layout identical to IELTS Fighter image 2) ══ */}
      <section id="khoa-hoc" className="scroll-mt-16 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-4 text-center">
            <h2 className="font-display text-3xl font-black text-slate-900 md:text-4xl tracking-tight">
              TẠI SAO NÊN HỌC TIẾNG ANH TẠI <span className="text-blue-700">ABC?</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
              Bạn đang muốn tìm một nơi học tiếng Anh chất lượng, không nhàm chán với giá cả phải chăng? Các khóa học tại ABC sẽ giúp bạn đạt được điều đó.
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-600" />
          </Reveal>

          {/* 4 Cards Grid (matching Image 2) */}
          <div className="mt-12 grid gap-6 lg:grid-cols-4 items-stretch">
            {/* Card 1: Teachers with 8 avatars and 8.0+ badges */}
            <Reveal className="h-full">
              <div className="flex h-full flex-col rounded-3xl bg-blue-700 p-6 text-white shadow-xl shadow-blue-700/20">
                <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-white/20 text-2xl text-white shadow-inner">
                  <Ic name="users" />
                </div>
                <h3 className="mb-1 text-center font-display text-xl font-black">Đội ngũ giáo viên</h3>
                <p className="mb-5 text-center text-xs leading-relaxed text-blue-100">
                  Đội ngũ giáo viên "xịn sò" 8.0+ với hơn 5 năm kinh nghiệm giảng dạy và đầy nhiệt huyết.
                </p>

                {/* 8 teacher avatar cards */}
                <div className="grid grid-cols-4 gap-2 mt-auto">
                  {TEACHERS.map((t, idx) => (
                    <div key={idx} className="group flex flex-col items-center rounded-xl bg-blue-800/80 p-1.5 border border-white/10 hover:bg-blue-600 transition-colors">
                      <span className="mb-1 rounded-sm bg-amber-400 px-1 py-0.2 text-[9px] font-black text-amber-950 leading-tight">
                        {t.score}
                      </span>
                      <RealImg src={t.img} alt={t.name} className="size-10 rounded-full object-cover border border-white/40 shadow-xs" />
                      <span className="mt-1 block w-full truncate text-center text-[10px] font-bold text-white leading-tight">
                        {t.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Card 2: Engaging activities with photo */}
            <Reveal delay={80} className="h-full">
              <div className="flex h-full flex-col rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-700 shadow-inner">
                  <Ic name="person-running" />
                </div>
                <h3 className="mb-1 text-center font-display text-xl font-black text-slate-900">Nhiều hoạt động thú vị</h3>
                <p className="mb-4 text-center text-xs leading-relaxed text-slate-600">
                  Luyện tập qua brainstorming, teamwork, outdoor... giúp nhanh chóng "ngấm kiến thức".
                </p>
                <div className="overflow-hidden rounded-2xl border border-slate-100 mt-auto shadow-sm">
                  <RealImg
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80"
                    alt="Hoạt động thảo luận nhóm tại ABC"
                    className="h-44 w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>

            {/* Card 3: Class smiling photo */}
            <Reveal delay={160} className="h-full">
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
                <RealImg
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=500&q=80"
                  alt="Không khí lớp học thân thiện, vui vẻ"
                  className="h-full min-h-[300px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-black w-max uppercase mb-2">Không khí học tập</span>
                  <b className="font-display text-lg font-bold">Học tiếng Anh tràn đầy cảm hứng</b>
                  <p className="text-xs text-slate-300 mt-1">Không áp lực điểm số – Tự tin giao tiếp từ buổi đầu tiên</p>
                </div>
              </div>
            </Reveal>

            {/* Card 4: Students holding certificates with quote */}
            <Reveal delay={240} className="h-full">
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
                <RealImg
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=500&q=80"
                  alt="Học viên tốt nghiệp nhận chứng chỉ"
                  className="h-full min-h-[300px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="mb-2 rounded-xl bg-amber-400 p-2 text-slate-950 text-xs font-black shadow-md">
                    "Patience is a KEY element of SUCCESS"
                  </div>
                  <b className="font-display text-lg font-bold">100% Học viên đạt mục tiêu</b>
                  <p className="text-xs text-slate-300 mt-1">Cam kết bằng hợp đồng đào tạo rõ ràng, minh bạch.</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ══ COURSE LIST ══ */}
          <div className="mt-20">
            <Reveal>
              <h3 className="mb-8 text-center font-display text-2xl font-black text-slate-900 md:text-3xl">
                CÁC KHÓA HỌC HIỆN CÓ
              </h3>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {db.courses.map((c, i) => {
                const faIcon = COURSE_FA[c.code] ?? 'book';
                const palettes = [
                  { bg: 'bg-blue-700', text: 'text-white', sub: 'text-blue-100', badge: 'bg-blue-800', iconBg: 'bg-white/20 text-white' },
                  { bg: 'bg-white border-2 border-slate-200', text: 'text-slate-900', sub: 'text-slate-500', badge: 'bg-slate-100', iconBg: 'bg-blue-50 text-blue-600' },
                  { bg: 'bg-amber-400', text: 'text-slate-900', sub: 'text-amber-900', badge: 'bg-amber-500/50', iconBg: 'bg-white/30 text-amber-900' },
                ];
                const p = palettes[i % palettes.length];
                return (
                  <Reveal key={c.id} delay={(i % 3) * 70}>
                    <a href="#tu-van" onClick={jump('tu-van')}
                      className={`group flex h-full flex-col rounded-2xl ${p.bg} ${p.text} p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`flex size-12 items-center justify-center rounded-xl ${p.iconBg}`}>
                          <i className={`fa-solid fa-${faIcon} text-xl`} aria-hidden />
                        </span>
                        <div>
                          <span className={`text-xs font-black uppercase tracking-widest ${p.sub}`}>{c.code}</span>
                          <h3 className="font-display text-lg font-black leading-tight">{c.name}</h3>
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed flex-1 ${p.sub}`}>{c.desc}</p>
                      <div className={`mt-4 flex items-center justify-between rounded-xl ${p.badge} px-4 py-2`}>
                        <b className="text-base font-black">{vnd(c.fee)}</b>
                        <span className={`text-xs font-semibold flex items-center gap-1 ${p.sub}`}>
                          <i className="fa-regular fa-clock" aria-hidden />{c.sessions} buổi/khóa
                        </span>
                      </div>
                    </a>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BANNER ══ */}
      <section className="bg-blue-700 py-14 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            {[
              ['fa-user-graduate', '1,200+', 'Học viên đã tốt nghiệp'],
              ['fa-location-dot', 4, 'Chi nhánh tại Hà Nội'],
              ['fa-book-open', db.courses.length, 'Chương trình đào tạo'],
              ['fa-users', CFG.maxStudents, 'Học viên tối đa/lớp'],
            ].map(([icon, n, l], i) => (
              <Reveal key={l} delay={i * 60}>
                <div>
                  <i className={`fa-solid ${icon} mb-3 text-3xl text-yellow-300`} aria-hidden />
                  <div className="font-display text-5xl font-black text-yellow-300">
                    {typeof n === 'number' ? <CountUp to={n} /> : n}
                  </div>
                  <div className="mt-1 text-sm text-blue-200">{l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ROADMAP ══ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-12 text-center">
            <p className="mb-2 text-sm font-black uppercase tracking-widest text-red-600">— LỘ TRÌNH —</p>
            <h2 className="font-display text-3xl font-black text-slate-900 md:text-4xl">
              BẮT ĐẦU CHỈ VỚI <span className="text-blue-700">4 BƯỚC ĐƠN GIẢN</span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-red-600" />
          </Reveal>

          <div className="relative grid gap-8 md:grid-cols-4">
            <div className="pointer-events-none absolute top-10 left-16 right-16 hidden h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 md:block" />
            {[
              ['fa-comments', 'bg-blue-700', 'Tư vấn', 'Để lại thông tin, ABC gọi lại trong ngày và tư vấn khóa học phù hợp.'],
              ['fa-clipboard-list', 'bg-amber-400', 'Kiểm tra đầu vào', 'Làm bài test ngắn 15 phút để xếp đúng trình độ cá nhân.'],
              ['fa-file-signature', 'bg-blue-700', 'Đăng ký & giữ chỗ', `Đóng từ ${CFG.minPaidPct * 100}% học phí để giữ chỗ. Phần còn lại đóng sau.`],
              ['fa-chalkboard-user', 'bg-red-600', 'Khai giảng & học!', `Lớp đủ ${CFG.minStudents} học viên là bắt đầu. Học liền, nói được ngay.`],
            ].map(([icon, color, t, d], i) => (
              <Reveal key={t} delay={i * 90}>
                <div className="relative text-center">
                  <div className={`relative z-10 mx-auto flex size-20 items-center justify-center rounded-2xl ${color} text-white shadow-lg`}>
                    <i className={`fa-solid ${icon} text-2xl`} aria-hidden />
                    <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-slate-900 font-display text-xs font-black text-white">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-black text-slate-900">{t}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-12 text-center">
            <p className="mb-2 text-sm font-black uppercase tracking-widest text-red-600">— HỌC VIÊN NÓI GÌ —</p>
            <h2 className="font-display text-3xl font-black text-slate-900 md:text-4xl">
              CẢM ƠN VÌ <span className="text-blue-700">SỰ TIN TƯỞNG</span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-red-600" />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {QUOTES.map(([n, r, q], i) => (
              <Reveal key={n} delay={i * 90}>
                <figure className="h-full rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="mb-3 flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <i key={k} className="fa-solid fa-star text-sm" aria-hidden />
                    ))}
                  </div>
                  <i className="fa-solid fa-quote-left mb-3 text-2xl text-blue-100" aria-hidden />
                  <blockquote className="text-sm leading-relaxed text-slate-700">"{q}"</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 font-display text-sm font-black text-white">
                      {n[0]}
                    </span>
                    <div>
                      <b className="block text-sm text-slate-900">{n}</b>
                      <span className="text-xs text-slate-500">{r}</span>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">Phản hồi minh họa cho bản demo.</p>
        </div>
      </section>

      {/* ══ OPEN CLASSES ══ */}
      <section id="lop-mo" className="scroll-mt-16 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-10 text-center">
            <p className="mb-2 text-sm font-black uppercase tracking-widest text-red-600">— ĐĂNG KÝ NGAY —</p>
            <h2 className="font-display text-3xl font-black text-slate-900 md:text-4xl">
              LỚP <span className="text-blue-700">ĐANG MỞ</span> ĐĂNG KÝ
            </h2>
            <p className="mt-2 text-sm text-slate-500">Lớp được xác nhận khai giảng khi đủ {CFG.minStudents} học viên</p>
            <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-red-600" />
          </Reveal>
          <Reveal>
            <div className="overflow-auto rounded-2xl border-2 border-slate-200 shadow-sm">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    {['Lớp', 'Khóa học', 'Chi nhánh', 'Lịch học', 'Khai giảng', 'Còn chỗ', 'Học phí'].map((h) =>
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-black tracking-wider uppercase whitespace-nowrap">{h}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {open.length ? open.map((c, i) => (
                    <tr key={c.id} className={`border-t border-slate-100 hover:bg-blue-50 transition-colors ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                      <td className="px-4 py-3 font-black text-blue-700">{c.code}</td>
                      <td className="px-4 py-3 font-semibold">{by(db, 'courses', c.courseId).name}</td>
                      <td className="px-4 py-3 text-slate-600">{by(db, 'branches', c.branchId).name}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{R.scheduleText(c)}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold">{dmy(c.startDate)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700 border border-green-200">
                          <i className="fa-solid fa-circle-check text-green-600" aria-hidden />
                          {CFG.maxStudents - R.live(db, c.id).length} chỗ
                        </span>
                      </td>
                      <td className="px-4 py-3 font-black text-slate-800">{vnd(by(db, 'courses', c.courseId).fee)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <i className="fa-solid fa-inbox mb-3 text-4xl text-slate-300" aria-hidden />
                        <p className="text-slate-500 text-sm">Hiện chưa có lớp mở. Hãy để lại thông tin để được báo khi có lớp mới.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ BRANCHES ══ */}
      <section id="chi-nhanh" className="scroll-mt-16 bg-blue-700 py-16 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-10 text-center">
            <p className="mb-2 text-sm font-black uppercase tracking-widest text-yellow-300">— HỆ THỐNG CƠ SỞ —</p>
            <h2 className="font-display text-3xl font-black md:text-4xl">4 CHI NHÁNH TẠI HÀ NỘI</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-4">
            {db.branches.map((b, i) => (
              <Reveal key={b.id} delay={i * 70}>
                <div className="rounded-2xl bg-white/10 border border-white/20 p-5 hover:bg-white/15 transition-colors">
                  <i className="fa-solid fa-building mb-3 text-2xl text-yellow-300" aria-hidden />
                  <h3 className="font-display text-lg font-black text-yellow-300">{b.name}</h3>
                  <p className="my-2 flex items-start gap-2 text-sm text-blue-100">
                    <i className="fa-solid fa-map-marker-alt mt-0.5 flex-shrink-0 text-xs" aria-hidden />{b.address}
                  </p>
                  <a href={`tel:${b.phone}`} className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-yellow-300 transition-colors">
                    <i className="fa-solid fa-phone text-xs" aria-hidden />{b.phone}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONSULTATION FORM ══ */}
      <section id="tu-van" className="scroll-mt-0 bg-amber-400 py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-10 items-start md:grid-cols-2">
            <Reveal>
              <p className="mb-2 text-sm font-black uppercase tracking-widest text-amber-900">— TƯ VẤN MIỄN PHÍ —</p>
              <h2 className="font-display text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                ĐỂ LẠI THÔNG TIN,<br />
                <span className="text-blue-700">ABC GỌI LẠI TRONG NGÀY!</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-amber-900 font-medium">
                Nhân viên ghi danh sẽ tư vấn khóa học, lịch học và học phí phù hợp với từng bạn.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  ['fa-gift', 'Kiểm tra trình độ miễn phí'],
                  ['fa-phone-flip', 'Phản hồi trong 24 giờ làm việc'],
                  ['fa-magnifying-glass', 'Tư vấn chọn đúng cấp độ & khóa học'],
                  ['fa-graduation-cap', 'Học thử buổi đầu không mất phí'],
                  ['fa-shield-halved', 'Cam kết hoàn tiền nếu không đạt mục tiêu'],
                ].map(([icon, text]) => (
                  <li key={text} className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                    <span className="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-white">
                      <i className={`fa-solid ${icon} text-xs`} aria-hidden />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-2xl bg-white p-7 shadow-2xl shadow-amber-900/20 border border-amber-200">
                <h3 className="mb-5 font-display text-xl font-black text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-pen-to-square text-blue-700" aria-hidden />
                  Đăng ký ngay – Miễn phí!
                </h3>
                <LeadForm compact />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-slate-900 py-10 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <Logo dark />
            <p className="font-display text-base text-slate-300">{SLOGAN}</p>
            <p className="text-sm text-slate-500 text-center md:text-right">
              © {new Date().getFullYear()} Trung tâm tiếng Anh ABC<br />
              <span className="text-xs">Hệ thống quản lý DT06 (bản demo)</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════════════════ */
export function Login() {
  const { db, setUser } = useStore();
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault(); const fd = new FormData(e.target);
    const u = db.users.find((x) => x.username === fd.get('u').trim() && x.password === fd.get('p'));
    if (!u) return setErr('Sai tên đăng nhập hoặc mật khẩu.');
    setUser(u); location.hash = '#/app/dashboard';
  };
  const fill = (u) => { document.querySelector('[name=u]').value = u; document.querySelector('[name=p]').value = '123456'; setErr(''); };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      {/* ── Left: marketing panel with real photo ── */}
      <div className="relative hidden overflow-hidden bg-amber-400 lg:flex lg:flex-col">
        <div className="absolute inset-y-0 right-0 w-[45%] bg-blue-700"
          style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-24 left-16 size-10 rotate-45 border-4 border-white/30" />
        <div className="absolute bottom-32 left-32 size-6 rotate-12 border-4 border-white/20" />
        <div className="absolute top-1/2 right-16 size-8 rounded-full bg-white/20" />

        <div className="relative flex h-full flex-col justify-between p-12 z-10">
          <Logo />

          <div>
            <div className="mb-5 flex flex-col items-start gap-2">
              <div className="-rotate-1 rounded-lg bg-white px-5 py-2 shadow-lg">
                <span className="font-display text-xl font-black text-blue-700">HỆ THỐNG QUẢN LÝ</span>
              </div>
              <div className="rounded-lg bg-red-600 px-6 py-3 shadow-xl">
                <span className="font-display text-3xl font-black text-white">ABC ENGLISH</span>
              </div>
            </div>

            <h2 className="mt-4 font-display text-4xl font-black leading-tight text-slate-900">
              Nói <span className="text-blue-700">tự tin</span>,<br />
              bắt đầu từ hôm nay.
            </h2>
            <p className="mt-3 max-w-xs text-sm text-amber-900 font-medium">
              Quản lý lớp học, học phí và lịch dạy tại một nơi. Nhanh – Gọn – Chính xác.
            </p>

            {/* Testimonial quote box */}
            <div className="mt-8 rounded-2xl bg-white/80 p-4 backdrop-blur-xs border border-white/60 shadow-md max-w-sm">
              <div className="flex items-center gap-3 mb-2">
                <RealImg
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Avatar"
                  className="size-10 rounded-full object-cover border-2 border-blue-600"
                />
                <div>
                  <b className="text-xs text-slate-900 block">Minh Châu · IELTS 7.5</b>
                  <span className="text-[10px] text-slate-500">Học viên xuất sắc 2024</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Hệ thống quản lý điểm danh và bù học của ABC rất minh bạch, giúp tôi không bị lỡ buổi nào dù lịch đi làm bận rộn."
              </p>
            </div>
          </div>

          <p className="text-xs text-amber-800 opacity-70">© {new Date().getFullYear()} ABC English Center</p>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex items-center justify-center bg-slate-50 p-6">
        <form onSubmit={submit} className="w-full max-w-md animate-pop">
          <div className="mb-6 lg:hidden"><Logo /></div>

          <div className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/80 border border-slate-100">
            <div className="mb-6">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-700 shadow-md shadow-blue-700/30">
                <i className="fa-solid fa-lock text-xl text-white" aria-hidden />
              </div>
              <h1 className="font-display text-3xl font-black text-slate-900">Đăng nhập</h1>
              <p className="mt-1 text-sm text-slate-500">Hệ thống quản lý Trung tâm ABC English</p>
            </div>

            <Fld label="Tên đăng nhập">
              <div className="relative">
                <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" aria-hidden />
                <In required name="u" autoComplete="username" autoFocus placeholder="Nhập tên đăng nhập" className="pl-9" />
              </div>
            </Fld>
            <Fld label="Mật khẩu">
              <div className="relative">
                <i className="fa-solid fa-key absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" aria-hidden />
                <In required name="p" type="password" autoComplete="current-password" placeholder="••••••••" className="pl-9" />
              </div>
            </Fld>

            {err && (
              <p key={err} className="mb-3 animate-pop flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 border border-red-100">
                <i className="fa-solid fa-circle-exclamation" aria-hidden />{err}
              </p>
            )}

            <button type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 text-base font-black text-white shadow-md shadow-blue-700/30 hover:bg-blue-800 active:scale-[.98] transition-all cursor-pointer">
              <i className="fa-solid fa-right-to-bracket" aria-hidden />ĐĂNG NHẬP
            </button>

            <div className="mt-6 rounded-xl border-2 border-dashed border-slate-200 p-4">
              <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                <i className="fa-solid fa-circle-info text-slate-300" aria-hidden />
                Tài khoản demo (mật khẩu: 123456)
              </p>
              <div className="space-y-2">
                {db.users.map((u) => (
                  <button type="button" key={u.id} onClick={() => fill(u.username)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-slate-50 px-3 py-2 text-left text-sm transition hover:border-blue-200 hover:bg-blue-50">
                    <span className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 font-display text-xs font-black text-white">
                      {u.username[0]?.toUpperCase()}
                    </span>
                    <div>
                      <b className="text-slate-900">{u.username}</b>
                      <span className="text-slate-500"> · {ROLE[u.role]}{u.role === 'teacher' ? ` – ${u.name}` : ''}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right ml-auto text-xs text-slate-300" aria-hidden />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <a href="#/" className="mt-5 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-700 transition-colors">
            <i className="fa-solid fa-arrow-left text-xs" aria-hidden />Về trang giới thiệu
          </a>
        </form>
      </div>
    </div>
  );
}
