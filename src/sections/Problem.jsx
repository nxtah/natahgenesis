import { useScrollFade } from '../hooks/useScrollFade';
import '../css/problem.css';

export default function Problem() {
  const [headingRef, headingStyle] = useScrollFade({
    fadeIntensity: 0.8,
    blurIntensity: 0.90,
    scaleIntensity: 0.03,
    parallaxFactor: 0.20,
    effectZone: 700
  });

  // List masalah umum
  const problems = [
    "Sulit dapat pelanggan baru karena tidak punya website",
    "Calon customer sering tanya hal yang sama, capek jawab manual",
    "Brand bisnis kurang dipercaya karena hanya ada di Instagram/WA",
    "Proses order & komunikasi lambat, customer kabur ke kompetitor",
    "Sulit tracking data penjualan & pertumbuhan bisnis",
    "Bisnis susah berkembang karena tidak muncul di Google"
  ];

  // Gunakan efek scroll untuk setiap item
  const listRefs = problems.map(() => useScrollFade({
    fadeIntensity: 0.8,
    blurIntensity: 0.90,
    effectZone: 500,
    parallaxFactor: 0.20,
    scaleIntensity: 0.03
  }));

  return (
    <section className="problem-section flex flex-col items-center justify-center min-h-screen w-full bg-white relative z-20" id="problem" data-section="problem" data-theme="light">
      <h2
        ref={headingRef}
        style={{
          ...headingStyle,
          color: headingStyle.opacity === undefined ? 'red' : undefined
        }}
        className="problem-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-center leading-tight max-w-5xl mx-auto"
      >
        <span className="problem-line">Bisnismu</span>
        <br className="desktop-break" />
        <span className="problem-line">punya <span style={{ background: 'linear-gradient(90deg, rgba(0, 122, 255, 1), rgba(34, 197, 94, 1))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic', display: 'inline-block', paddingRight: '0.12em', overflow: 'visible' }}>masalah</span></span>
        <br className="desktop-break" />
        <span className="problem-line">ini?</span>
      </h2>
      <div className="problem-list-wrapper mt-16 w-full max-w-6xl flex flex-col items-center">
        <ul className="problem-list w-full max-w-5xl flex flex-col gap-4 mx-auto">
          {problems.map((text, i) => {
            const [ref, style] = listRefs[i];
            // Format nomor: 01, 02, dst
            const number = (i + 1).toString().padStart(2, '0');
            return (
              <li
                key={i}
                ref={ref}
                style={{ ...style, willChange: 'opacity, filter, transform' }}
                className="problem-list-item problem-list-item--with-number"
              >
                <span className="problem-list-number">{number}</span>
                <span className="problem-list-center">
                  <span className="problem-list-text">{text}</span>
                  <span
                    className={
                      `problem-list-line${style.opacity > 0.55 ? ' problem-list-line--active' : ''}`
                    }
                    style={{
                      opacity: style.opacity,
                      margin: '0.5em auto 0',
                    }}
                  />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}