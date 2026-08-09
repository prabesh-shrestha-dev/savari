import { useEffect, useRef } from 'react';
import VideoLogo from "../../../assets/Grow.mp4";
import Logo from "../../../assets/3.png";
import './LandingPage.css';

const STOPS = [
  {
    n: '01',
    title: 'Register & verify',
    text: 'Create an account with your name and email or phone, then confirm it with a 6-digit OTP.',
  },
  {
    n: '02',
    title: 'Apply for a licence',
    text: 'Enter personal and address details and pick a category - A, B, K, or H.',
    badge: 'A · B · K · H',
  },
  {
    n: '03',
    title: 'Upload documents',
    text: 'Submit your citizenship or NID, passport photo, and blood group report for review.',
  },
  {
    n: '04',
    title: 'Biometric & exams',
    text: 'Book an open biometric slot, then sit the written and practical tests when scheduled.',
  },
  {
    n: '05',
    title: 'Pay online',
    text: 'Cover application, exam, and issuance fees securely through eSewa, with a running payment history.',
  },
  {
    n: '06',
    title: 'Licence issued',
    text: 'Get notified the moment your card is ready, and know exactly where to collect it.',
  },
];

const ROAD_D =
  'M45,20 C10,100 80,180 45,260 C10,340 80,420 45,500 C10,580 80,660 45,740 C10,820 80,900 45,928';

export default function LandingPage() {
  const progressPathRef = useRef(null);
  const carGroupRef = useRef(null);
  const vehUseRef = useRef(null);
  const trackRef = useRef(null);
  const stopRefs = useRef([]);

  // Scroll-synced "road" animation: the marker drives from stop 01 to stop 06
  // as the journey track scrolls through the viewport, cycling scooter -> car -> bus.
  useEffect(() => {
    const path = progressPathRef.current;
    const carDot = carGroupRef.current;
    const vehUse = vehUseRef.current;
    const track = trackRef.current;
    if (!path || !carDot || !vehUse || !track) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);

    const vehicles = ['#veh-scooter', '#veh-car', '#veh-bus'];
    let currentVeh = 0;

    function update() {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the track's top just enters the viewport,
      // 1 once its bottom has scrolled past the top.
      let progress = (vh - rect.top) / (rect.height + vh);
      progress = Math.max(0, Math.min(1, progress));

      path.style.strokeDashoffset = String(len * (1 - progress));
      const pt = path.getPointAtLength(len * progress);
      carDot.setAttribute('transform', `translate(${pt.x},${pt.y})`);

      const stepIndex = Math.min(vehicles.length - 1, Math.floor(progress * vehicles.length));
      if (stepIndex !== currentVeh) {
        currentVeh = stepIndex;
        vehUse.setAttribute('href', vehicles[currentVeh]);
      }

      const stops = stopRefs.current;
      stops.forEach((el, i) => {
        if (!el) return;
        const threshold = (i + 0.5) / stops.length;
        el.classList.toggle('active', progress >= threshold);
      });
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="sawari-landing">
      <header>
        <nav>
          <div className="logo">
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: "90px",
                height: "90px",
                objectFit: "contain"
              }}
            />
            <span>
              SAVARI
              <small>Less wait. Drive More.</small>
            </span>
          </div>
          <ul className="nav-links">
            <li><a href="#journey">Journey</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#admin">For offices</a></li>
            <li><a href="#footer">Team</a></li>
          </ul>
          <div className="nav-cta">
            <a href="/register" className="nav-signin">Sign in</a>
            <a href="/register" className="btn btn-primary">Apply for a licence</a>
          </div>
        </nav>
      </header>

      <main>
        {/* ---------- HERO ---------- */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <div className="eyebrow">Digital prototype · Department of Transport Management</div>
              <h1>
                Less wait.<br />
                <span className="accent">Drive More.</span>
              </h1>
              <p className="lead">
                SAVARI replaces the queue at the transport office with one online path from application to
                license card documents, biometric, exams, and payment, tracked in a single dashboard.
              </p>
              <div className="hero-cta">
                <a href="/register" className="btn btn-primary">Start your application</a>
                <a href="#journey" className="btn btn-ghost">See the journey</a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="stepper-card">
                <h4>Application progress</h4>
                <div className="sub">Current status: Biometric pending</div>
                <div className="step-row">
                  <div className="step-dot done">1</div>
                  <div className="step-bar done" />
                  <div className="step-dot now">2</div>
                  <div className="step-bar" />
                  <div className="step-dot">3</div>
                  <div className="step-bar" />
                  <div className="step-dot">4</div>
                </div>
                <div className="step-labels">
                  <span>Docs</span><span>Applied</span><span>Bio</span><span>Exams</span>
                </div>
              </div>
              <div className="float-card card-2">
                <div className="float-dot amber" />
                <div><b>Biometric scheduled</b><span className="small">Wed, Aug 5 · 9:42 AM</span></div>
              </div>
              <div className="float-card card-3">
                <div className="float-dot green" />
                <div><b>Payment confirmed</b><span className="small">Rs. 500 via eSewa</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- PROBLEM ---------- */}
        <section className="dark">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Why we built this?</div>
              <h2>The old way runs on paper and waiting rooms.</h2>
              <p>
                Getting or renewing a driving licence in Nepal means repeat trips to the transport office,
                documents checked by hand at separate counters, and no way to know where things stand in between.
              </p>
            </div>
            <div className="pain-grid">
              <div className="pain-card">
                <h3>Manual verification</h3>
                <p>Citizenship, photos, and blood group reports are checked counter by counter, with no shared record of what&apos;s approved or missing.</p>
              </div>
              <div className="pain-card">
                <h3>Repeat visits</h3>
                <p>Applicants return to the office again just to check a status, rebook a missed exam slot, or find out a document was rejected.</p>
              </div>
              <div className="pain-card">
                <h3>No shared visibility</h3>
                <p>Neither citizens nor staff have one view of application status, exam schedules, or upcoming renewal deadlines.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- JOURNEY (signature scroll animation) ---------- */}
        <section id="journey">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">The SAVARI way</div>
              <h2>One road, six stops, zero counters.</h2>
              <p>Every stage of getting licensed, mapped to a single account, book what&apos;s next, check what&apos;s pending, and pick up where you left off.</p>
            </div>

            <div className="journey-body" ref={trackRef}>
              <div className="rail">
                <svg viewBox="0 0 90 948" preserveAspectRatio="none">
                  <defs>
                    <symbol id="veh-scooter" viewBox="0 0 60 34">
                      <circle className="wheel" cx="14" cy="27" r="6" />
                      <circle className="wheel" cx="46" cy="27" r="6" />
                      <path d="M14 27 L22 12 L34 12" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                      <path d="M34 12 L46 27" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                      <path d="M18 8 L28 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </symbol>
                    <symbol id="veh-car" viewBox="0 0 60 34">
                      <circle className="wheel" cx="16" cy="27" r="6" />
                      <circle className="wheel" cx="44" cy="27" r="6" />
                      <path d="M4 27 L4 18 Q4 13 10 13 L16 13 L22 4 L42 4 L48 13 L52 13 Q56 13 56 18 L56 27 Z" fill="currentColor" stroke="none" />
                      <path d="M20 13 L24 6 L38 6 L42 13" fill="#fff" stroke="none" opacity=".55" />
                    </symbol>
                    <symbol id="veh-bus" viewBox="0 0 60 34">
                      <circle className="wheel" cx="14" cy="28" r="6" />
                      <circle className="wheel" cx="46" cy="28" r="6" />
                      <rect x="4" y="4" width="52" height="22" rx="4" fill="currentColor" stroke="none" />
                      <rect x="9" y="9" width="10" height="8" rx="1.5" fill="#fff" opacity=".6" />
                      <rect x="22" y="9" width="10" height="8" rx="1.5" fill="#fff" opacity=".6" />
                      <rect x="35" y="9" width="10" height="8" rx="1.5" fill="#fff" opacity=".6" />
                    </symbol>
                  </defs>

                  <path id="road-path" d={ROAD_D} />
                  <path id="road-progress" ref={progressPathRef} d={ROAD_D} />
                  <path id="road-lane" d={ROAD_D} />

                  <g id="road-car" ref={carGroupRef}>
                    <circle className="pin" r="16" />
                    <use
                      ref={vehUseRef}
                      className="veh"
                      href="#veh-scooter"
                      x="0"
                      y="0"
                      width="22"
                      height="16"
                      color="#2F6FED"
                    />
                  </g>
                </svg>
              </div>

              <div className="stops">
                {STOPS.map((s, i) => (
                  <div className="stop" key={s.n} ref={(el) => (stopRefs.current[i] = el)}>
                    <div className="num">{s.n}</div>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                      {s.badge && <span className="badge">{s.badge}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- FEATURES ---------- */}
        <section id="features" style={{ background: 'var(--blue-100)' }}>
          <div className="wrap">
            <div className="section-head center" style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
              <h2>Everything an office visit used to require</h2>
              <p>Built around the four things that slow the process down most.</p>
            </div>
            <div className="feat-grid">
              <div className="feat-card">
                <div className="feat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F6FED" strokeWidth="1.8">
                    <path d="M6 3h9l5 5v13H6z" />
                    <path d="M15 3v5h5" />
                    <path d="M9 13h7M9 17h7" />
                  </svg>
                </div>
                <h3>Document verification</h3>
                <p>Upload once - admins approve, reject, or request a resubmission, with the status always visible to you.</p>
              </div>
              <div className="feat-card">
                <div className="feat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F6FED" strokeWidth="1.8">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                  </svg>
                </div>
                <h3>Exam scheduling</h3>
                <p>See open biometric, written, and practical slots by seat availability and book the one that fits.</p>
              </div>
              <div className="feat-card">
                <div className="feat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F6FED" strokeWidth="1.8">
                    <rect x="2" y="6" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </div>
                <h3>Secure payment</h3>
                <p>Pay licence and exam fees through eSewa and keep a full, timestamped payment history.</p>
              </div>
              <div className="feat-card">
                <div className="feat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F6FED" strokeWidth="1.8">
                    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.7 21a2 2 0 01-3.4 0" />
                  </svg>
                </div>
                <h3>Renewal reminders</h3>
                <p>Get notified before your licence expires so renewal never turns back into an office trip.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- ADMIN ---------- */}
        <section id="admin">
          <div className="wrap admin-grid">
            <div className="admin-copy">
              <video 
                src={VideoLogo} 
                autoPlay
                muted
                loop
                playsInline
                style={{
                  borderRadius: "20px"
                }}
              />
            </div>

            <div className="admin-mock">
              <div className="top">
                <div>
                  <h4>Review applications</h4>
                  <span>Pending work</span>
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-box"><div className="n">124</div><div className="l">New applications</div></div>
                <div className="stat-box"><div className="n">49</div><div className="l">Pending verification</div></div>
                <div className="stat-box"><div className="n">98</div><div className="l">Approved licences</div></div>
              </div>
              <div style={{ marginTop: '22px' }}>
                <div className="queue-row"><span>Aashish M. - New licence</span><span className="pill pending">Pending</span></div>
                <div className="queue-row"><span>Biraj R. - New licence</span><span className="pill approved">Approved</span></div>
                <div className="queue-row"><span>Prabesh S. - Renewal</span><span className="pill rejected">Rejected</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- CTA BAND ---------- */}
        <section>
          <div className="wrap">
            <div className="cta-band">
              <h2>Your licence, without the queue.</h2>
              <p>A working prototype of what Nepal&apos;s driving licence process could feel like, start to finish.</p>
              <div className="hero-cta">
                <a href="#" className="btn btn-primary">Explore the prototype</a>
                <a href="#journey" className="btn btn-ghost">Walk through the journey</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer id="footer">
        <div className="wrap">
          <div className="foot-top">
            <div className="logo">
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "contain"
                }}
              />
              <span>
                SAVARI
                <small>Less wait. More drive.</small>
              </span>
            </div>
            <div className="foot-cols">
              <div className="foot-col">
                <h5>Product</h5>
                <a href="#journey">Journey</a>
                <a href="#features">Features</a>
                <a href="#admin">For offices</a>
              </div>
              <div className="foot-col">
                <h5>The Cyberians</h5>
                <a href="#">Pratik Pujara</a>
                <a href="#">Aashish Mahato</a>
                <a href="#">Prabesh Shrestha</a>
                <a href="#">Biraj Sharma</a>
              </div>
            </div>
          </div>

          <div className="fleet-strip">
            <span className="fleet-label">One system, every category</span>
            <div className="fleet-row">
              <div className="fleet-chip" style={{ '--delay': '0s' }}>
                <svg viewBox="0 0 60 34"><use href="#veh-scooter" color="#2F6FED" /></svg>
                <b>A</b>
              </div>
              <div className="fleet-chip" style={{ '--delay': '.3s' }}>
                <svg viewBox="0 0 60 34"><use href="#veh-car" color="#2F6FED" /></svg>
                <b>B</b>
              </div>
              <div className="fleet-chip" style={{ '--delay': '.6s' }}>
                <svg viewBox="0 0 60 34"><use href="#veh-scooter" color="#2F6FED" /></svg>
                <b>K</b>
              </div>
              <div className="fleet-chip" style={{ '--delay': '.9s' }}>
                <svg viewBox="0 0 60 34"><use href="#veh-bus" color="#2F6FED" /></svg>
                <b>H</b>
              </div>
            </div>
          </div>

          <div className="foot-bottom">
            <span>© 2026 SAVARI. Student prototype - not an official government service.</span>
            <span className="credit">
              SAVARI · License Management System - Prototype for Herald College Kathmandu,
              Industry Preparation Course · The Cyberians, 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}