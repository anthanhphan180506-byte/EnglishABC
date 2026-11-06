import { useState } from 'react';
import { useStore } from '../store.jsx';
import { Btn, LinkBtn, Fld, In, Sel } from '../ui.jsx';
import { Reveal, CountUp, useScrolled, confetti } from '../fx.jsx';
import { R, U, CFG } from '../lib/rules.js';
import { by, vnd, dmy, ROLE } from '../lib/util.js';

export const SLOGAN = 'Nói tự tin, bắt đầu từ hôm nay.';

/* ── Icon wrapper ───────────────────────────────────────────────── */
const Ic = ({ name, className = '' }) => <i className={`fa-solid fa-${name} ${className}`} aria-hidden />;

/* ── Real image with fallback ───────────────────────────────────── */
const RealImg = ({ src, alt, className = '', fallbackIcon = 'graduation-cap', fallbackBg = 'bg-slate-100' }) => {
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

/* ── Logo thương hiệu ABC English ───────────────────────────────── */
const Logo = ({ dark }) => (
  <a href="#/" className={`flex items-center gap-2.5 font-bold no-underline ${dark ? 'text-white' : 'text-slate-900'}`}>
    <span className="flex size-10 items-center justify-center rounded-xl bg-red-600 font-display text-2xl font-black text-white shadow-md shadow-red-600/30">
      A
    </span>
    <span className="font-display leading-tight">
      <span className="block text-2xl font-black tracking-tight text-red-600">ABC ENGLISH</span>
      <span className={`block text-[10px] font-bold tracking-widest uppercase ${dark ? 'text-slate-300' : 'text-slate-500'}`}>
        Trung tâm đào tạo tiếng Anh
      </span>
    </span>
  </a>
);

/* ── Form đăng ký nhận tư vấn lộ trình & học phí ───────────────── */
function LeadForm({ compact, buttonText = 'ĐĂNG KÝ TƯ VẤN NGAY' }) {
  const { db, commit, toast } = useStore();
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    db.leads.push({
      id: U.id('ld'),
      name: fd.get('name').trim(),
      phone: fd.get('phone').trim(),
      course: fd.get('course'),
      branch: fd.get('branch') || '',
      note: fd.get('note')?.trim() ?? '',
      status: 'Mới',
      createdAt: U.today()
    });
    if (commit('Gửi yêu cầu tư vấn')) {
      e.target.reset();
      toast('Đã gửi thành công! ABC sẽ gọi lại cho bạn trong vòng 24h.', 'ok');
      confetti();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <Fld label="Họ và tên của bạn *">
        <In required name="name" placeholder="Ví dụ: Nguyễn Văn An" className="h-11 rounded-lg" />
      </Fld>
      <Fld label="Số điện thoại nhận tư vấn *">
        <In required name="phone" type="tel" pattern="0[0-9]{9,10}" placeholder="Ví dụ: 0912 345 678" className="h-11 rounded-lg" />
      </Fld>
      <div className="grid gap-3 sm:grid-cols-2">
        <Fld label="Khóa học quan tâm">
          <Sel name="course" options={db.courses.map((c) => [c.name, c.name])} className="h-11 rounded-lg" />
        </Fld>
        <Fld label="Cơ sở gần bạn">
          <Sel name="branch" options={db.branches.map((b) => [b.name, b.name])} className="h-11 rounded-lg" />
        </Fld>
      </div>
      {!compact && (
        <Fld label="Mục tiêu của bạn (tùy chọn)">
          <In name="note" placeholder="Ví dụ: Cần đạt 6.5 trong 6 tháng, đi làm..." className="h-11 rounded-lg" />
        </Fld>
      )}
      <button
        type="submit"
        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-base font-black text-white shadow-lg shadow-red-600/40 hover:bg-red-700 active:scale-[.98] transition-all"
      >
        <Ic name="paper-plane" /> {buttonText}
      </button>
      <p className="text-center text-xs text-slate-500">
        🔒 Thông tin của bạn được bảo mật tuyệt đối theo cam kết của ABC English.
      </p>
    </form>
  );
}

/* ── Dữ liệu giảng viên tiêu biểu (ảnh chân dung thật từ IELTS Fighter) ── */
const TEACHERS_HIGHLIGHT = [
  {
    name: 'Ms. Băng Thương',
    title: 'Senior Teacher · 8.5 IELTS',
    tag: 'Sweet Fighter',
    exp: '6 năm kinh nghiệm luyện thi',
    desc: 'Cựu sinh viên ĐH Ngoại Thương, truyền cảm hứng cho hơn 2,000 học viên đạt 7.0+.',
    img: 'https://w.ladicdn.com/s500x600/5b57f38472976020da8e5611/msthuong-20220927075909-z9llr.jpg'
  },
  {
    name: 'Mr. Hoàng Nam',
    title: 'Head Teacher · 8.5 IELTS',
    tag: 'Cheerful Fighter',
    exp: '8 năm kinh nghiệm giảng dạy',
    desc: 'Thạc sĩ Ngôn ngữ học ứng dụng, chuyên gia chiến thuật Writing & Speaking thực chiến.',
    img: 'https://w.ladicdn.com/s500x600/5b57f38472976020da8e5611/mrnam-20220923103600-_ky1x.jpg'
  },
  {
    name: 'Ms. Trang Chuối',
    title: 'Lead Trainer · 8.0 IELTS',
    tag: 'Dynamic Fighter',
    exp: '5 năm kinh nghiệm',
    desc: 'Phương pháp dạy tương tác, phản xạ nhanh, giúp học viên mất gốc tự tin nói trôi chảy.',
    img: 'https://w.ladicdn.com/s500x600/5b57f38472976020da8e5611/mstrang-20220927081018-qk4ou.jpg'
  },
  {
    name: 'Ms. Võ Yến Nhi',
    title: 'Academic Specialist · 8.0 IELTS',
    tag: 'Positive Fighter',
    exp: '5 năm kinh nghiệm',
    desc: 'Chuyên gia xử lý phát âm chuẩn IPA và tư duy logic trong bài đọc Reading.',
    img: 'https://w.ladicdn.com/s500x600/5b57f38472976020da8e5611/msnhi-20220923103335-h3mex.jpg'
  }
];

/* ── Dữ liệu lộ trình học tinh gọn từ 0 - 7.0+ ────────────────── */
const ROADMAP_STEPS = [
  {
    level: 'Basic / Mất gốc',
    target: '0 - 3.0 / A1',
    time: '2 - 2.5 tháng',
    desc: 'Lấy lại nền tảng phát âm chuẩn IPA, ngữ pháp cốt lõi và 800+ từ vựng căn bản hàng ngày.',
    badge: 'Khởi động'
  },
  {
    level: 'Pre-Foundation',
    target: '3.0 - 4.5 / A2',
    time: '2.5 - 3 tháng',
    desc: 'Làm quen các dạng câu hỏi Speaking Part 1, cách phát triển ý mạch lạc và nghe hiểu hội thoại cơ bản.',
    badge: 'Xây nền'
  },
  {
    level: 'Bứt phá mục tiêu',
    target: '4.5 - 5.5 / B1',
    time: '3 tháng',
    desc: 'Chiến thuật làm bài Reading & Listening, cách viết đoạn Task 1 & mở rộng ý tưởng Speaking Part 2.',
    badge: 'Tăng tốc'
  },
  {
    level: 'Chuyên sâu & Luyện đề',
    target: '5.5 - 6.5 / B2',
    time: '3 tháng',
    desc: 'Nâng cấp từ vựng Collocation/Idiom, tối ưu thời gian làm bài, chữa bài viết 1-1 chuyên sâu.',
    badge: 'Bứt phá'
  },
  {
    level: 'Master Band điểm',
    target: '7.0+ / C1',
    time: '2 - 3 tháng',
    desc: 'Hoàn thiện tư duy học thuật phản biện, làm chủ 4 kỹ năng ở cấp độ du học & định cư quốc tế.',
    badge: 'Về đích'
  }
];

/* ── Gallery bảng vàng bảng điểm IELTS học viên ─────────────────── */
const HIGHSCORE_STUDENTS = [
  {
    name: 'Nguyễn Minh Châu',
    score: '8.0 IELTS',
    school: 'ĐH Ngoại Thương',
    sub: 'L: 8.5 · R: 8.5 · W: 7.5 · S: 7.5',
    img: 'https://w.ladicdn.com/s650x500/5b57f38472976020da8e5611/hv1-20220301035922.jpg'
  },
  {
    name: 'Trần Quốc Bảo',
    score: '7.5 IELTS',
    school: 'ĐH Bách Khoa HN',
    sub: 'L: 8.0 · R: 7.5 · W: 7.0 · S: 7.0',
    img: 'https://w.ladicdn.com/s650x500/5b57f38472976020da8e5611/hv2-20220301035922.jpg'
  },
  {
    name: 'Lê Hoàng Yến',
    score: '7.5 IELTS',
    school: 'THPT Chu Văn An',
    sub: 'L: 8.0 · R: 8.0 · W: 7.0 · S: 6.5',
    img: 'https://w.ladicdn.com/s650x500/5b57f38472976020da8e5611/hv3-20220301035922.jpg'
  },
  {
    name: 'Phạm Đức Anh',
    score: '8.0 IELTS',
    school: 'ĐH Kinh Tế Quốc Dân',
    sub: 'L: 8.5 · R: 8.5 · W: 7.0 · S: 7.5',
    img: 'https://w.ladicdn.com/s650x500/5b57f38472976020da8e5611/hv4-20220301035922.jpg'
  },
  {
    name: 'Vũ Mai Phương',
    score: '7.0 IELTS',
    school: 'ĐH Quốc Gia Hà Nội',
    sub: 'L: 7.5 · R: 7.0 · W: 6.5 · S: 7.0',
    img: 'https://w.ladicdn.com/s650x500/5b57f38472976020da8e5611/hv5-20220301035922.jpg'
  },
  {
    name: 'Đặng Tuấn Kiệt',
    score: '7.5 IELTS',
    school: 'THPT Kim Liên',
    sub: 'L: 8.0 · R: 7.5 · W: 7.0 · S: 7.0',
    img: 'https://w.ladicdn.com/s650x500/5b57f38472976020da8e5611/hv6-20220301035922.jpg'
  },
];

/* ══════════════════════════════════════════════════════════════════
   LANDING PAGE (Cấu trúc chuẩn IELTS Fighter)
══════════════════════════════════════════════════════════════════ */
export function Landing() {
  const { db, user } = useStore();
  const scrolled = useScrolled(12);
  const open = db.classes.filter((c) => c.status === 'Mở đăng ký');
  const jump = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ══ 1. HEADER & NAVIGATION ══ */}
      <header className={`sticky top-0 z-30 transition-all duration-200 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95'}`}>
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-6 px-5">
          <Logo />

          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-700 md:flex">
            <a href="#ve-chung-toi" onClick={jump('ve-chung-toi')} className="hover:text-red-600 transition-colors">Về chúng tôi</a>
            <a href="#giang-vien" onClick={jump('giang-vien')} className="hover:text-red-600 transition-colors">Giảng viên</a>
            <a href="#hoc-vien" onClick={jump('hoc-vien')} className="hover:text-red-600 transition-colors">Học viên</a>
            <a href="#khoa-hoc" onClick={jump('khoa-hoc')} className="hover:text-red-600 transition-colors">Khóa học</a>
            <a href="#lop-mo" onClick={jump('lop-mo')} className="hover:text-red-600 transition-colors">Lớp mở đăng ký</a>
            <a href="#chi-nhanh" onClick={jump('chi-nhanh')} className="hover:text-red-600 transition-colors">Cơ sở</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="#tu-van"
              onClick={jump('tu-van')}
              className="hidden items-center gap-2 rounded-full border-2 border-red-600 px-5 py-2 text-sm font-extrabold text-red-600 hover:bg-red-50 transition-colors md:inline-flex"
            >
              <Ic name="phone" /> Tư vấn
            </a>
            <a
              href={user ? '#/app' : '#/login'}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm font-black text-white hover:bg-red-700 shadow-md shadow-red-600/30 transition-all active:scale-95"
            >
              <Ic name="right-to-bracket" /> {user ? 'Vào hệ thống' : 'Đăng ký'}
            </a>
          </div>
        </div>
      </header>

      {/* ══ 2. HERO BANNER (Chính xác cấu trúc ảnh 1 IELTS Fighter) ══ */}
      <section className="relative overflow-hidden bg-amber-400 min-h-[560px]">
        {/* Nền xanh tháp Big Ben bên phải */}
        <div
          className="absolute inset-y-0 right-0 w-full lg:w-[58%] bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://w.ladicdn.com/s1440x572/5c7362c6c417ab07e5196b05/gheydt-20201109080812.jpg")',
            clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)'
          }}
        >
          {/* Lớp phủ xanh đặc trưng */}
          <div className="absolute inset-0 bg-blue-800/40 mix-blend-multiply" />
        </div>

        {/* Họa tiết chấm bi & khối hình học */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
        />
        <div className="absolute top-6 left-1/4 size-8 rotate-45 border-4 border-white/40" />
        <div className="absolute bottom-12 left-12 size-6 rotate-12 border-3 border-white/30" />
        <div className="absolute top-16 right-[38%] size-7 rounded-full bg-yellow-300/60" />

        <div className="relative mx-auto flex max-w-7xl items-center min-h-[560px] px-5 py-14">
          {/* CỘT TRÁI: Text & nút kêu gọi hành động */}
          <div className="w-full max-w-[54%] z-10 animate-slide-in-left">
            <p className="mb-2 text-xs md:text-sm font-extrabold uppercase tracking-widest text-amber-950">
              TRUNG TÂM LUYỆN THI TIẾNG ANH ABC
            </p>

            {/* Badges slogan lớn */}
            <div className="mb-5 flex flex-col items-start gap-2.5">
              <div className="-rotate-1 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-5 py-2.5 shadow-xl border border-white/30">
                <span className="font-display text-xl font-black tracking-wide text-white md:text-2xl uppercase">
                  HỌC PHÍ 89K / GIỜ
                </span>
              </div>
              <div className="rounded-xl bg-red-600 px-6 py-3 shadow-2xl border-2 border-amber-300">
                <span className="font-display text-2xl font-black text-white md:text-4xl uppercase tracking-tight">
                  CAM KẾT ĐẦU RA BẰNG VĂN BẢN
                </span>
              </div>
            </div>

            <h1 className="mb-6 font-display text-3xl font-black leading-tight text-slate-900 md:text-5xl">
              Nói <span className="relative inline-block text-blue-800">tự tin<span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-blue-800/30" /></span>,<br />
              bắt đầu từ <span className="text-red-600">hôm nay.</span>
            </h1>

            <p className="mb-8 max-w-lg text-base leading-relaxed text-slate-800 font-medium">
              Lớp học tối đa <b>{CFG.maxStudents} học viên</b>. Giáo viên 8.0+ theo sát từng học viên. Hỗ trợ bảo lưu, đổi lịch và học bù linh hoạt không phát sinh chi phí.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href="#tu-van"
                onClick={jump('tu-van')}
                className="inline-flex items-center gap-2.5 rounded-full bg-blue-800 px-8 py-4 text-base font-black text-white shadow-xl shadow-blue-900/40 hover:bg-blue-900 active:scale-95 transition-all cursor-pointer"
              >
                <Ic name="phone-volume" /> NHẬN TƯ VẤN & HỌC THỬ MIỄN PHÍ
              </a>
              <a
                href="#khoa-hoc"
                onClick={jump('khoa-hoc')}
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white/90 px-7 py-4 text-base font-bold text-slate-900 hover:bg-white transition-colors cursor-pointer"
              >
                Xem các khóa học <Ic name="arrow-right" />
              </a>
            </div>
          </div>

          {/* CỘT PHẢI: Hình ảnh học viên nhận học bổng & chứng chỉ (ảnh thật từ IELTS Fighter) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden w-[48%] lg:flex items-center justify-end pr-4 animate-slide-in-right">
            <div className="relative">
              <img
                src="https://w.ladicdn.com/s1000x750/5b57f38472976020da8e5611/hle_0556-removebg-preview-20211104103950.png"
                alt="Học viên nhận chứng chỉ IELTS Fighter"
                className="h-[490px] w-auto max-w-none object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)]"
              />
              {/* Badge nổi bật góc dưới */}
              <div className="absolute -bottom-2 -left-6 rounded-2xl bg-white/95 p-3.5 shadow-2xl border border-slate-100 backdrop-blur-sm flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-red-600 text-white font-black text-xl">
                  <Ic name="award" />
                </div>
                <div>
                  <div className="text-xs font-black text-red-600 uppercase">HỌC BỔNG XUẤT SẮC 100%</div>
                  <div className="text-xs font-bold text-slate-700">Trao giải thưởng vinh danh đợt mới</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cắt góc chéo dưới đáy hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 36" preserveAspectRatio="none" className="w-full" fill="white">
            <polygon points="0,36 1440,0 1440,36" />
          </svg>
        </div>
      </section>

      {/* ══ 3. DẢI BANNER ẢNH HOẠT ĐỘNG THỰC TẾ (Dưới Hero) ══ */}
      <section className="bg-white py-6 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: 'Lớp học sĩ số nhỏ',
                desc: 'Tối đa 15 học viên / lớp',
                img: 'https://w.ladicdn.com/s700x600/5b57f38472976020da8e5611/lop-hoc-ielts-25-20201005153013.jpg'
              },
              {
                title: 'Học tương tác & thảo luận',
                desc: 'Nói tiếng Anh tự nhiên',
                img: 'https://w.ladicdn.com/s550x500/5b57f38472976020da8e5611/30b11c5b-c8a3-4632-a481-4ce53f873209-20221017082126-mfwro.jpg'
              },
              {
                title: 'Workshop bổ trợ hàng tuần',
                desc: 'Miễn phí cho mọi học viên',
                img: 'https://st.ebomb.edu.vn/src/ielts-fighter/2020/04/15/workshop-truc-tuyen-ielts-fighter-3.jpg'
              },
              {
                title: 'Cam kết chuẩn đầu ra',
                desc: 'Học lại miễn phí 100%',
                img: 'https://w.ladicdn.com/s550x550/5b57f38472976020da8e5611/242-20220224105742.jpg'
              }
            ].map((item, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <RealImg src={item.img} alt={item.title} className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent flex flex-col justify-end p-3 text-white">
                  <b className="text-xs font-bold leading-tight">{item.title}</b>
                  <span className="text-[11px] text-amber-300 font-medium">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. TẠI SAO NÊN HỌC TẠI ABC? (Chính xác cấu trúc ảnh 2) ══ */}
      <section id="ve-chung-toi" className="scroll-mt-16 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-4 text-center">
            <h2 className="font-display text-3xl font-black text-slate-900 md:text-4xl tracking-tight uppercase">
              TẠI SAO NÊN HỌC TIẾNG ANH TẠI <span className="text-blue-800">ABC ENGLISH ?</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
              Bạn đang muốn tìm một nơi học tiếng Anh chất lượng, không nhàm chán với giá cả phải chăng? Các khóa học tại ABC sẽ giúp bạn điều đó.
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-600" />
          </Reveal>

          {/* 4 khối hiển thị giống ảnh 2 user cung cấp */}
          <div className="mt-12 grid gap-6 lg:grid-cols-4 items-stretch">
            {/* Khối 1: Đội ngũ giáo viên (Thẻ xanh đậm + Lưới ảnh giáo viên) */}
            <Reveal className="h-full">
              <div className="flex h-full flex-col rounded-3xl bg-blue-800 p-6 text-white shadow-xl shadow-blue-800/20">
                <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-white/20 text-2xl text-white">
                  <Ic name="users" />
                </div>
                <h3 className="mb-1 text-center font-display text-xl font-black">Đội ngũ giáo viên</h3>
                <p className="mb-4 text-center text-xs leading-relaxed text-blue-100">
                  Đội ngũ giáo viên "xịn sò" 8.0+ với hơn 5 năm kinh nghiệm giảng dạy và đầy nhiệt huyết.
                </p>

                {/* Ảnh dàn giáo viên có điểm 8.0+ / 8.5+ y hệt ảnh 2 */}
                <div className="mt-auto overflow-hidden rounded-2xl border border-white/20 bg-blue-900/60 p-2 shadow-sm">
                  <img
                    src="https://w.ladicdn.com/s650x550/5b57f38472976020da8e5611/dn-1-20220227102608.png"
                    alt="Đội ngũ giáo viên ABC English 8.0+"
                    className="w-full rounded-xl object-contain"
                  />
                </div>
              </div>
            </Reveal>

            {/* Khối 2: Nhiều hoạt động thú vị (Thẻ trắng + ảnh lớp ngồi vòng tròn) */}
            <Reveal delay={80} className="h-full">
              <div className="flex h-full flex-col rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-800">
                  <Ic name="person-running" />
                </div>
                <h3 className="mb-1 text-center font-display text-xl font-black text-slate-900">Nhiều hoạt động thú vị</h3>
                <p className="mb-4 text-center text-xs leading-relaxed text-slate-600">
                  Luyện tập qua brainstorming, teamwork, outdoor... giúp nhanh chóng "ngấm kiến thức".
                </p>
                <div className="mt-auto overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                  <img
                    src="https://w.ladicdn.com/s550x500/5b57f38472976020da8e5611/30b11c5b-c8a3-4632-a481-4ce53f873209-20221017082126-mfwro.jpg"
                    alt="Hoạt động lớp học vui vẻ tại ABC"
                    className="h-48 w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>

            {/* Khối 3: Ảnh tập thể lớp học (Góc trên bên phải ảnh 2) */}
            <Reveal delay={160} className="h-full">
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 shadow-sm min-h-[320px]">
                <img
                  src="https://w.ladicdn.com/s550x500/5b57f38472976020da8e5611/hoc-ielts-o-dau-quan-8-trung-tam-luyen-thi-ielts-fighter-quan-8-4-20220310072423.jpg"
                  alt="Tập thể lớp học tại trung tâm"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <b className="font-display text-lg font-bold">Môi trường gắn kết & truyền cảm hứng</b>
                  <p className="text-xs text-slate-300 mt-1">Học không áp lực, thầy cô như người bạn đồng hành.</p>
                </div>
              </div>
            </Reveal>

            {/* Khối 4: Ảnh học viên nhận chứng chỉ với câu nói Bill Gates (Góc dưới bên phải ảnh 2) */}
            <Reveal delay={240} className="h-full">
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 shadow-sm min-h-[320px]">
                <img
                  src="https://w.ladicdn.com/s550x550/5b57f38472976020da8e5611/242-20220224105742.jpg"
                  alt="Học viên nhận chứng chỉ hoàn thành khóa học"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="mb-2 rounded-lg bg-amber-400 px-2.5 py-1 text-slate-950 text-xs font-black inline-block w-max">
                    "Patience is a KEY element of SUCCESS"
                  </div>
                  <b className="font-display text-base font-bold">Cam kết chuẩn đầu ra 100%</b>
                  <p className="text-xs text-slate-300 mt-1">Đảm bảo mục tiêu cho từng học viên bằng hợp đồng.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 5. LỘ TRÌNH HỌC TINH GỌN TỪ 0 - 7.0+ ══ */}
      <section className="bg-white py-20 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-4 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-red-600">— LỘ TRÌNH TINH GỌN —</p>
            <h2 className="font-display text-3xl font-black text-slate-900 md:text-4xl tracking-tight">
              LỘ TRÌNH HỌC TINH GỌN <span className="text-red-600">TỪ 0 - 7.0+</span>
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl mx-auto">
              Thiết kế theo chuẩn quốc tế, rút ngắn 50% thời gian tự mày mò mà vẫn đảm bảo hiệu quả tối đa.
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-600" />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {ROADMAP_STEPS.map((step, idx) => (
              <Reveal key={idx} delay={idx * 60}>
                <div className="group relative flex h-full flex-col rounded-2xl border-2 border-slate-200 bg-white p-5 hover:border-red-600 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-red-100 font-display text-sm font-black text-red-600">
                      0{idx + 1}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-black text-slate-900 group-hover:text-red-600 transition-colors">
                    {step.level}
                  </h3>
                  <div className="my-2 inline-block rounded-md bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-800 border border-amber-200">
                    Mục tiêu: {step.target}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
                    {step.desc}
                  </p>
                  <div className="border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <Ic name="clock" /> Thời gian: {step.time}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#tu-van"
              onClick={jump('tu-van')}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all cursor-pointer"
            >
              <Ic name="calendar-check" /> ĐĂNG KÝ TEST TRÌNH ĐỘ ĐẦU VÀO MIỄN PHÍ
            </a>
          </div>
        </div>
      </section>

      {/* ══ 6. GẶP GỠ ĐỘI NGŨ GIÁO VIÊN TRUYỀN CẢM HỨNG ══ */}
      <section id="giang-vien" className="scroll-mt-16 bg-slate-50 py-20 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-4 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-red-600">— ĐỘI NGŨ CHUYÊN GIA —</p>
            <h2 className="font-display text-3xl font-black text-slate-900 md:text-4xl tracking-tight">
              GẶP GỠ <span className="text-blue-800">GIÁO VIÊN TRUYỀN CẢM HỨNG</span>
            </h2>
            <p className="mt-3 text-slate-600 text-sm max-w-2xl mx-auto">
              100% giáo viên có chứng chỉ giảng dạy quốc tế, được tuyển chọn khắt khe và đào tạo liên tục.
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-600" />
          </Reveal>

          {/* 4 Tiêu chí giáo viên chuẩn IELTS Fighter */}
          <div className="mt-8 mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: 'certificate', title: '100% Đạt 8.0+ / CELTA', desc: 'Sở hữu chứng chỉ giảng dạy Anh ngữ theo tiêu chuẩn quốc tế.' },
              { icon: 'chalkboard-user', title: 'Phương pháp RIPL độc quyền', desc: 'Thông minh, tinh gọn, logic, kích thích tối đa năng lượng học tập.' },
              { icon: 'graduation-cap', title: 'Học vị cao & Uy tín', desc: 'Là Thạc sĩ, Cử nhân, Du học sinh các trường ĐH danh tiếng.' },
              { icon: 'heart', title: 'Tận tâm & Nhiệt huyết', desc: 'Chấm chữa bài chi tiết, đồng hành cùng học viên 24/7.' },
            ].map((crit, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl bg-white p-4.5 border border-slate-200 shadow-xs">
                <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 text-lg">
                  <Ic name={crit.icon} />
                </span>
                <div>
                  <b className="block text-sm text-slate-900">{crit.title}</b>
                  <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{crit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Danh sách 4 giảng viên tiêu biểu */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEACHERS_HIGHLIGHT.map((t, idx) => (
              <Reveal key={idx} delay={idx * 80}>
                <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-60 overflow-hidden bg-slate-100">
                    <RealImg
                      src={t.img}
                      alt={t.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white shadow-md">
                      {t.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-black text-slate-900">{t.name}</h3>
                    <p className="text-xs font-bold text-red-600 mt-0.5">{t.title}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{t.exp}</p>
                    <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {t.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. CÁC KHÓA HỌC & BẢNG LỚP ĐANG MỞ (Nghiệp vụ cốt lõi) ══ */}
      <section id="khoa-hoc" className="scroll-mt-16 bg-white py-20 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-4 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-red-600">— CHƯƠNG TRÌNH ĐÀO TẠO —</p>
            <h2 className="font-display text-3xl font-black text-slate-900 md:text-4xl tracking-tight">
              CÁC KHÓA HỌC TẠI <span className="text-red-600">ABC ENGLISH</span>
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl mx-auto">
              Chương trình đào tạo đa dạng, thiết kế chuyên biệt cho học sinh, sinh viên và người đi làm.
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-600" />
          </Reveal>

          {/* Danh sách khóa học */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {db.courses.map((c, i) => {
              const coursePhotos = [
                'https://w.ladicdn.com/s600x500/5b57f38472976020da8e5611/hoc-online-20211223075126.jpg',
                'https://w.ladicdn.com/s600x500/5b57f38472976020da8e5611/mat-goc-3-20211223081418.jpg',
                'https://w.ladicdn.com/s550x500/5b57f38472976020da8e5611/sach-20210412075245.png',
                'https://w.ladicdn.com/s550x550/5b57f38472976020da8e5611/lan-phuong-lop-hoc-5-20201005153705.jpg',
                'https://w.ladicdn.com/s550x500/5b57f38472976020da8e5611/manh-tuong-ielts-fighter-20201127075355.jpg',
                'https://w.ladicdn.com/s700x600/5b57f38472976020da8e5611/lop-hoc-ielts-25-20201005153013.jpg',
              ];
              const img = coursePhotos[i % coursePhotos.length];

              return (
                <Reveal key={c.id} delay={(i % 3) * 70}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <RealImg src={img} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-3 left-3 rounded-md bg-red-600 px-2.5 py-1 text-xs font-black text-white shadow-sm">
                        Mã: {c.code}
                      </span>
                      <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/80 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white">
                        <Ic name="calendar-days" className="mr-1" /> {c.sessions} buổi / khóa
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors">
                        {c.name}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed flex-1">
                        {c.desc}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div>
                          <small className="block text-[11px] font-semibold text-slate-400 uppercase">Học phí trọn khóa</small>
                          <b className="font-display text-xl font-black text-red-600">{vnd(c.fee)}</b>
                        </div>
                        <a
                          href="#tu-van"
                          onClick={jump('tu-van')}
                          className="rounded-xl bg-blue-800 px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-900 transition-colors cursor-pointer"
                        >
                          Đăng ký học
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* BẢNG LỚP ĐANG MỞ ĐĂNG KÝ (Giữ nguyên toàn bộ logic dữ liệu của hệ thống) */}
          <div id="lop-mo" className="mt-20 scroll-mt-20">
            <Reveal>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-600 uppercase">
                    Đợt tuyển sinh mới nhất
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-black text-slate-900 md:text-3xl">
                    LỚP ĐANG MỞ ĐĂNG KÝ GIỮ CHỖ
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Lớp được xác nhận khai giảng khi đủ {CFG.minStudents} học viên. Giữ chỗ chỉ với từ {CFG.minPaidPct * 100}% học phí.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400">Hiện có: </span>
                  <b className="text-sm font-extrabold text-blue-700">{open.length} lớp đang nhận học viên</b>
                </div>
              </div>

              <div className="overflow-auto rounded-2xl border-2 border-slate-200 shadow-sm bg-white">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-blue-800 text-white">
                      {['Mã lớp', 'Khóa đào tạo', 'Cơ sở', 'Lịch học trong tuần', 'Khai giảng', 'Chỗ trống', 'Học phí', 'Thao tác'].map((h) => (
                        <th key={h} className="px-4 py-3.5 text-left text-xs font-black tracking-wider uppercase whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {open.length ? (
                      open.map((c, i) => (
                        <tr key={c.id} className={`border-t border-slate-100 hover:bg-blue-50/60 transition-colors ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                          <td className="px-4 py-3.5 font-black text-blue-800">{c.code}</td>
                          <td className="px-4 py-3.5 font-bold text-slate-900">{by(db, 'courses', c.courseId).name}</td>
                          <td className="px-4 py-3.5 text-slate-600">{by(db, 'branches', c.branchId).name}</td>
                          <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{R.scheduleText(c)}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-800">{dmy(c.startDate)}</td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 border border-emerald-200">
                              <Ic name="circle-check" className="text-emerald-600" />
                              Còn {CFG.maxStudents - R.live(db, c.id).length} chỗ
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-black text-red-600">{vnd(by(db, 'courses', c.courseId).fee)}</td>
                          <td className="px-4 py-3.5">
                            <a
                              href="#tu-van"
                              onClick={jump('tu-van')}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors inline-block"
                            >
                              Giữ chỗ
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <Ic name="inbox" className="text-3xl mb-2 block" />
                          Hiện các lớp đang trong giai đoạn đào tạo. Hãy để lại thông tin để được ưu tiên mở lớp mới!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 8. SECTION TƯ VẤN NHẬN ƯU ĐÃI (Giống form IELTS Fighter) ══ */}
      <section id="tu-van" className="scroll-mt-16 relative overflow-hidden bg-gradient-to-br from-amber-400 via-amber-400 to-orange-400 py-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            {/* Cột trái: Lợi ích khi đăng ký */}
            <Reveal>
              <span className="rounded-md bg-red-600 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-white">
                Ưu đãi tuyển sinh tháng này
              </span>
              <h2 className="mt-4 font-display text-3xl font-black leading-tight text-slate-900 md:text-5xl">
                NHẬN ƯU ĐÃI HỌC PHÍ<br />
                <span className="text-red-700">LÊN TỚI 15.000.000 VNĐ</span>
              </h2>
              <p className="mt-4 text-base text-amber-950 font-medium leading-relaxed">
                Để lại thông tin để nhận lộ trình học tinh gọn cá nhân hóa và bài test trình độ tiếng Anh 4 kỹ năng hoàn toàn miễn phí cùng giảng viên 8.5 IELTS!
              </p>

              <div className="mt-8 space-y-3.5">
                {[
                  ['gift', 'Tặng bộ tài liệu độc quyền Giải đề IELTS & Ngữ pháp căn bản.'],
                  ['clock-rotate-left', 'Bảo lưu linh hoạt lên đến 3 tháng nếu bận công việc/lịch học.'],
                  ['arrows-rotate', 'Hỗ trợ học bù, chuyển lớp cùng cấp độ hoàn toàn miễn phí.'],
                  ['shield-halved', 'Cam kết hoàn tiền hoặc học lại miễn phí nếu không đạt đầu ra.'],
                ].map(([icon, text], i) => (
                  <div key={i} className="flex items-center gap-3.5 rounded-xl bg-white/70 p-3.5 backdrop-blur-xs border border-white/80 shadow-xs">
                    <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-lg bg-red-600 text-white text-sm">
                      <Ic name={icon} />
                    </span>
                    <span className="text-sm font-bold text-slate-800">{text}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Cột phải: Khung điền thông tin LeadForm */}
            <Reveal delay={120}>
              <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-amber-950/20 border-2 border-white">
                <div className="mb-6 text-center">
                  <h3 className="font-display text-2xl font-black text-slate-900">
                    ĐĂNG KÝ TƯ VẤN LỘ TRÌNH & HỌC PHÍ
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Giải đáp mọi thắc mắc về học phí, lịch học, giáo viên phụ trách
                  </p>
                </div>
                <LeadForm buttonText="TƯ VẤN CHO TÔI NGAY" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 9. HỌC VIÊN NÓI GÌ & BẢNG VÀNG THÀNH TÍCH ══ */}
      <section id="hoc-vien" className="scroll-mt-16 bg-white py-20 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-4 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-red-600">— BẢNG VÀNG HỌC VIÊN —</p>
            <h2 className="font-display text-3xl font-black text-slate-900 md:text-4xl tracking-tight uppercase">
              HỌC VIÊN NÓI GÌ VỀ <span className="text-blue-800">ABC ENGLISH ?</span>
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl mx-auto">
              Hơn 1,200+ học viên đã tự tin chinh phục mục tiêu tiếng Anh và đạt điểm số mơ ước.
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-600" />
          </Reveal>

          {/* Lưới chứng chỉ / Bảng vàng điểm cao IELTS (Khung chữ nhật rõ nét, đúng chuẩn bảng điểm) */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHSCORE_STUDENTS.map((st, i) => (
              <div key={i} className="group overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm hover:border-red-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                {/* Khung hiển thị bảng điểm IELTS chữ nhật chuẩn */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <RealImg
                    src={st.img}
                    alt={`Bảng điểm IELTS ${st.name}`}
                    className="h-48 w-full object-contain bg-white p-1 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 right-2.5 rounded-md bg-red-600 px-2.5 py-1 text-xs font-black text-white shadow-md">
                    {st.score}
                  </span>
                </div>

                <div className="mt-4 pt-1">
                  <div className="flex items-center justify-between">
                    <b className="text-base font-black text-slate-900 group-hover:text-red-600 transition-colors">
                      {st.name}
                    </b>
                    <span className="rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-xs font-black text-red-600">
                      {st.score}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-600">{st.school}</span>
                    <span className="font-bold text-slate-700">{st.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              ['Minh Châu', 'Học viên A2 → B1', 'Lớp ít người nên tôi được thực hành nói liên tục mỗi buổi. Sau 3 tháng tôi đã có thể tự tin trao đổi công việc bằng tiếng Anh với đối tác nước ngoài.'],
              ['Quốc Bảo', 'Học viên IELTS 7.5', 'Thầy cô sửa từng lỗi ngữ pháp và cách dùng từ trong bài viết Writing rất kỹ. Điểm của tôi tăng từ 5.5 lên 7.5 chỉ sau 2 đợt học tinh gọn.'],
              ['Thanh Hương', 'Phụ huynh học viên', 'Con tôi từng rất rụt rè và sợ học tiếng Anh. Sau khi học tại trung tâm ABC, con về nhà hào hứng tự kể chuyện và nói chuyện bằng tiếng Anh với mẹ.'],
            ].map(([n, r, q], i) => (
              <Reveal key={n} delay={i * 90}>
                <figure className="h-full rounded-2xl bg-slate-50 p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="mb-3 flex gap-1 text-amber-400 text-sm">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Ic key={k} name="star" />
                      ))}
                    </div>
                    <blockquote className="text-sm leading-relaxed text-slate-700 italic">
                      "{q}"
                    </blockquote>
                  </div>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-200/60 pt-4">
                    <span className="flex size-10 items-center justify-center rounded-full bg-red-600 font-display text-sm font-black text-white">
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
        </div>
      </section>

      {/* ══ 10. HỆ THỐNG CƠ SỞ TRÊN TOÀN QUỐC ══ */}
      <section id="chi-nhanh" className="scroll-mt-16 bg-blue-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-10 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-amber-400">— HỆ THỐNG CƠ SỞ —</p>
            <h2 className="font-display text-3xl font-black md:text-4xl mt-1">
              4 CHI NHÁNH TẠI HÀ NỘI
            </h2>
            <p className="text-sm text-blue-200 mt-2">Vị trí thuận tiện, phòng học trang bị máy lạnh, máy chiếu và thư viện tự học hiện đại</p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-4">
            {db.branches.map((b, i) => (
              <Reveal key={b.id} delay={i * 70}>
                <div className="rounded-2xl bg-white/10 border border-white/20 p-5 hover:bg-white/15 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl text-amber-400"><Ic name="building" /></span>
                    <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white uppercase">Cơ sở {i + 1}</span>
                  </div>
                  <h3 className="font-display text-lg font-black text-amber-300">{b.name}</h3>
                  <p className="my-2.5 text-xs text-blue-100 leading-relaxed flex items-start gap-2">
                    <Ic name="location-dot" className="mt-0.5 text-amber-400 flex-shrink-0" />
                    <span>{b.address}</span>
                  </p>
                  <a
                    href={`tel:${b.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-amber-300 transition-colors mt-2"
                  >
                    <Ic name="phone" /> Hotline: {b.phone}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 11. FOOTER (Chuẩn website trung tâm tiếng Anh) ══ */}
      <footer className="bg-slate-950 py-14 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-10 md:grid-cols-4 pb-12 border-b border-slate-800">
            {/* Cột 1: Thông tin trung tâm */}
            <div>
              <Logo dark />
              <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                Hệ thống đào tạo tiếng Anh ABC – Đồng hành cùng học viên Việt Nam chinh phục các mục tiêu giao tiếp và chứng chỉ quốc tế.
              </p>
              <div className="mt-4 flex gap-3 text-slate-400">
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-red-600 transition-colors"><Ic name="envelope" /></span>
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-red-600 transition-colors"><Ic name="phone" /></span>
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-red-600 transition-colors"><Ic name="globe" /></span>
              </div>
            </div>

            {/* Cột 2: Về chúng tôi */}
            <div>
              <h4 className="font-display text-sm font-black text-amber-400 uppercase tracking-wider mb-4">Về chúng tôi</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#ve-chung-toi" className="hover:text-white transition-colors">Giới thiệu ABC English</a></li>
                <li><a href="#giang-vien" className="hover:text-white transition-colors">Đội ngũ giảng viên 8.0+</a></li>
                <li><a href="#chi-nhanh" className="hover:text-white transition-colors">Hệ thống cơ sở đào tạo</a></li>
                <li><a href="#hoc-vien" className="hover:text-white transition-colors">Bảng vàng thành tích học viên</a></li>
              </ul>
            </div>

            {/* Cột 3: Khóa học */}
            <div>
              <h4 className="font-display text-sm font-black text-amber-400 uppercase tracking-wider mb-4">Chương trình</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {db.courses.map((c) => (
                  <li key={c.id}>
                    <a href="#khoa-hoc" className="hover:text-white transition-colors">{c.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cột 4: Hỗ trợ học viên */}
            <div>
              <h4 className="font-display text-sm font-black text-amber-400 uppercase tracking-wider mb-4">Liên hệ & Hỗ trợ</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hotline tư vấn: <b className="text-white">0903 411 666</b><br />
                Email: <span className="text-white">tuyensinh@abc-english.edu.vn</span><br />
                Giờ làm việc: 08:00 - 21:30 (Thứ 2 - Chủ Nhật)
              </p>
              <div className="mt-4">
                <a
                  href="#/login"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-white/20 transition-colors"
                >
                  <Ic name="lock" /> Cổng đăng nhập nội bộ (Nhân viên)
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 md:flex-row">
            <p>© {new Date().getFullYear()} ABC English Center · Hệ thống quản lý đào tạo DT06.</p>
            <p>Bản quyền thuộc về Trung tâm tiếng Anh ABC.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LOGIN PAGE (Giữ nguyên toàn bộ logic đăng nhập và demo accounts)
══════════════════════════════════════════════════════════════════ */
export function Login() {
  const { db, setUser } = useStore();
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const u = db.users.find((x) => x.username === fd.get('u').trim() && x.password === fd.get('p'));
    if (!u) return setErr('Sai tên đăng nhập hoặc mật khẩu.');
    setUser(u);
    location.hash = '#/app/dashboard';
  };
  const fill = (u) => {
    document.querySelector('[name=u]').value = u;
    document.querySelector('[name=p]').value = '123456';
    setErr('');
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* ── Cột trái: Poster phong cách IELTS Fighter ── */}
      <div className="relative hidden overflow-hidden bg-amber-400 lg:flex lg:flex-col">
        <div
          className="absolute inset-y-0 right-0 w-[45%] bg-blue-800"
          style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Logo />

          <div>
            <div className="mb-4 flex flex-col items-start gap-2">
              <div className="-rotate-1 rounded-lg bg-red-600 px-5 py-2 shadow-lg">
                <span className="font-display text-lg font-black text-white uppercase tracking-wider">
                  HỆ THỐNG QUẢN LÝ ĐÀO TẠO
                </span>
              </div>
            </div>

            <h2 className="mt-2 font-display text-4xl font-black leading-tight text-slate-900">
              Nói <span className="text-blue-800">tự tin</span>,<br />
              bắt đầu từ hôm nay.
            </h2>
            <p className="mt-3 max-w-sm text-sm font-medium text-amber-950 leading-relaxed">
              Quản lý lớp học, điểm danh, xếp lịch dạy và học phí tập trung tại một nơi. Nhanh – Chuẩn – Minh bạch.
            </p>

            {/* Khung trích dẫn học viên */}
            <div className="mt-8 rounded-2xl bg-white/90 p-4.5 backdrop-blur-xs border border-white shadow-lg max-w-sm">
              <div className="flex items-center gap-3 mb-2">
                <RealImg
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Minh Châu"
                  className="size-11 rounded-full object-cover border-2 border-red-600"
                />
                <div>
                  <b className="text-xs text-slate-900 block font-bold">Nguyễn Minh Châu · 8.0 IELTS</b>
                  <span className="text-[11px] text-red-600 font-semibold">Học viên xuất sắc 2024</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Hệ thống quản lý lịch học và bù buổi của trung tâm rất tiện lợi, giúp tôi theo dõi sát sao tiến trình học tập của mình."
              </p>
            </div>
          </div>

          <p className="text-xs text-amber-950 font-semibold opacity-75">
            © {new Date().getFullYear()} ABC English Center · All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Cột phải: Form đăng nhập ── */}
      <div className="flex items-center justify-center bg-slate-50 p-6">
        <form onSubmit={submit} className="w-full max-w-md animate-pop">
          <div className="mb-6 lg:hidden">
            <Logo />
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/80 border border-slate-100">
            <div className="mb-6">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-600/30 text-white">
                <Ic name="lock" className="text-xl" />
              </div>
              <h1 className="font-display text-3xl font-black text-slate-900">Đăng nhập</h1>
              <p className="mt-1 text-xs text-slate-500">Hệ thống quản lý nội bộ Trung tâm tiếng Anh ABC</p>
            </div>

            <Fld label="Tên đăng nhập">
              <div className="relative">
                <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" aria-hidden />
                <In required name="u" autoComplete="username" autoFocus placeholder="Nhập tên đăng nhập" className="pl-10 h-11" />
              </div>
            </Fld>
            <Fld label="Mật khẩu">
              <div className="relative">
                <i className="fa-solid fa-key absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" aria-hidden />
                <In required name="p" type="password" autoComplete="current-password" placeholder="••••••••" className="pl-10 h-11" />
              </div>
            </Fld>

            {err && (
              <p key={err} className="mb-3 animate-pop flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 border border-red-100">
                <Ic name="circle-exclamation" /> {err}
              </p>
            )}

            <button
              type="submit"
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-base font-black text-white shadow-lg shadow-red-600/30 hover:bg-red-700 active:scale-[.98] transition-all"
            >
              <Ic name="right-to-bracket" /> ĐĂNG NHẬP HỆ THỐNG
            </button>

            {/* Danh sách tài khoản demo */}
            <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-200 p-4 bg-slate-50/50">
              <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                <Ic name="circle-info" className="text-slate-400" />
                Tài khoản demo (mật khẩu: 123456)
              </p>
              <div className="space-y-2">
                {db.users.map((u) => (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => fill(u.username)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-white px-3 py-2 text-left text-xs transition hover:border-red-200 hover:bg-red-50/40 shadow-2xs"
                  >
                    <span className="flex size-7 flex-shrink-0 items-center justify-center rounded-lg bg-red-600 font-display text-xs font-black text-white">
                      {u.username[0]?.toUpperCase()}
                    </span>
                    <div>
                      <b className="text-slate-900">{u.username}</b>
                      <span className="text-slate-500"> · {ROLE[u.role]}{u.role === 'teacher' ? ` – ${u.name}` : ''}</span>
                    </div>
                    <Ic name="chevron-right" className="ml-auto text-xs text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <a href="#/" className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors">
            <Ic name="arrow-left" /> Quay lại trang giới thiệu
          </a>
        </form>
      </div>
    </div>
  );
}
