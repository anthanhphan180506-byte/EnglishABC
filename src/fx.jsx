import { useEffect, useRef, useState } from 'react';

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Hiện dần khi cuộn tới */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null), [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || reduced() || !('IntersectionObserver' in window)) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <Tag ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition duration-700 ease-out ${on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${className}`}>{children}</Tag>;
}

/* Số chạy từ 0 lên giá trị đích mượt mà */
export function CountUp({ to = 0, format, ms = 900 }) {
  const [n, setN] = useState(reduced() ? to : 0);
  useEffect(() => {
    if (reduced()) { setN(to); return; }
    let raf, t0;
    const step = (t) => {
      t0 ??= t;
      const p = Math.min(1, (t - t0) / ms);
      setN(Math.round(to * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return <>{format ? format(n) : n}</>;
}

export function useScrolled(px = 12) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const f = () => setS(scrollY > px);
    f();
    addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, [px]);
  return s;
}

/* Ánh sáng nền bay bổng nhẹ nhàng tạo cảm giác tươi mới, hiện đại */
export function AmbientAura() {
  if (reduced()) return null;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-32 size-96 rounded-full bg-blue-400/10 blur-3xl animate-float" />
      <div className="absolute top-1/3 -right-32 size-80 rounded-full bg-amber-400/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-32 left-1/3 size-96 rounded-full bg-indigo-400/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
    </div>
  );
}

/* Pháo giấy rực rỡ khi hoàn tất thao tác quan trọng */
export function confetti() {
  if (reduced()) return;
  const colors = ['#2563eb', '#f97316', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'], box = document.createElement('div');
  box.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:120;overflow:hidden';
  for (let i = 0; i < 48; i++) {
    const p = document.createElement('i'),
      x = 50 + (Math.random() - 0.5) * 35,
      dx = (Math.random() - 0.5) * 600,
      dy = 180 + Math.random() * 420;
    p.style.cssText = `position:absolute;left:${x}%;top:50%;width:${6 + Math.random() * 4}px;height:${10 + Math.random() * 6}px;background:${colors[i % colors.length]};border-radius:2px`;
    p.animate(
      [
        { transform: 'translate(0,0) rotate(0)', opacity: 1 },
        { transform: `translate(${dx}px,${-dy * 0.7}px) rotate(${Math.random() * 400}deg)`, opacity: 1, offset: 0.35 },
        { transform: `translate(${dx * 1.3}px,${dy}px) rotate(${Math.random() * 800}deg)`, opacity: 0 }
      ],
      { duration: 1400 + Math.random() * 700, easing: 'cubic-bezier(.2,.8,.3,1)' }
    );
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 2200);
}
