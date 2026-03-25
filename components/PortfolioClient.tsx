"use client";
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function PortfolioClient({ 
  initialCoaching, 
  initialEcosystem, 
  initialDevelopers, 
  initialCredentials,
  initialAwards
}: any) {
  
  useEffect(() => {
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });

    setTimeout(() => {
        document.getElementById('preloader')?.classList.add('done');
    }, 1000);

    const htmlEl = document.documentElement;
    htmlEl.setAttribute('data-theme', localStorage.getItem('al-theme') || 'dark');
    document.getElementById('themeBtn')?.addEventListener('click', () => {
        const t = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', t);
        localStorage.setItem('al-theme', t);
    });

    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    menuBtn?.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        navLinks?.classList.toggle('open');
        document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
    });

    setTimeout(() => {
        import('vanilla-tilt').then((VanillaTilt: any) => {
            VanillaTilt.default.init(document.querySelectorAll(".coaching-card, .dev-card, .news-card") as any, {
                max: 8,
                speed: 400,
                glare: true,
                "max-glare": 0.15,
                scale: 1.02
            });
        });
    }, 500);

    const numberElements = document.querySelectorAll('.big-number[data-count]');
    numberElements.forEach((el) => {
        const target = parseInt(el.getAttribute('data-count') || '0', 10);
        gsap.fromTo(el, 
            { innerText: 0 },
            {
                innerText: target,
                duration: 2,
                ease: 'power2.out',
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

  }, []);

  return (
    <>
    <div className="preloader" id="preloader" onClick={(e) => { e.currentTarget.classList.add('done') }}>
        <div className="preloader-inner">
            <span className="preloader-text">ANTHONY LEUTERIO</span>
        </div>
    </div>
    
    <div className="nav-outer" id="mainNav">
        <nav>
            <a href="#" className="nav-logo"><img src="components/logo.png" alt="AL" /></a>
            <div className="nav-center" id="navLinks">
                <a href="#about">About</a>
                <a href="#pillars">Coaching</a>
                <a href="#ecosystem">Companies</a>
                <a href="#developers">Developers</a>
                <a href="#credentials">Education</a>
                <a href="#news">News</a>
                <a href="#recognition">Awards</a>
                <a href="#connect">Contact</a>
            </div>
            <div className="nav-right">
                <button className="theme-btn" id="themeBtn">
                    <span className="t-dark">☀️</span><span className="t-light">🌙</span>
                </button>
                <button className="menu-btn" id="menuBtn">
                    <span></span><span></span>
                </button>
            </div>
        </nav>
    </div>

    <section className="hero-section" id="hero">
        <div className="hero-bg-img" style={{backgroundImage: `url('components/bossing-cropped.jpg')`}}></div>
        <div className="hero-overlay"></div>
        <h1 className="hero-clip-text" aria-label="Anthony Leuterio">
            <span className="clip-line">ANTHONY</span>
            <span className="clip-line">LEUTERIO</span>
        </h1>
        <div className="hero-bottom-bar">
            <div className="hero-tagline">Philippines' Premier Real Estate Visionary</div>

            <div className="hero-scroll-cue">
                <div className="scroll-dot"></div>
            </div>
            <div className="hero-role">Founder · Speaker · PropTech Pioneer</div>
        </div>
    </section>

    <section className="numbers-section" id="numbers">
        <div className="numbers-inner">
            <div className="numbers-grid">
                <div className="number-cell">
                    <div className="big-number" data-count="133">0</div>
                    <div className="number-caption">Offices <span>Nationwide</span></div>
                </div>
                <div className="number-cell">
                    <div className="big-number" data-count="50">0</div>
                    <div className="number-caption">Industry <span>Awards</span></div>
                </div>
                <div className="number-cell">
                    <div className="big-number" data-count="15">0</div>
                    <div className="number-caption">Years of <span>Excellence</span></div>
                </div>
                <div className="number-cell">
                    <div className="big-number-text">Top 1</div>
                    <div className="number-caption"><span>PropTech</span> Leader</div>
                </div>
            </div>
        </div>
    </section>

    <section className="split-section" id="about">
        <div className="split-left">
            <div className="split-img-wrapper">
                <img src="components/bossing-blended.jpg" alt="Anthony Leuterio" loading="lazy" />
            </div>
        </div>
        <div className="split-right">
            <span className="overline">Legacy & Vision</span>
            <h2>Redefining <em>Real Estate</em> Through Innovation</h2>
            <p className="lead">Anthony Leuterio is more than just a real estate mogul — he is a visionary leader who has transformed the industry in the Philippines and beyond.</p>
            <p>As the founder of Filipino Homes and Leuterio Realty, he has established an unparalleled ecosystem of over 133 franchise offices, empowering thousands of agents and property owners.</p>
            <blockquote>
                "Innovation is not just about technology; it's about creating a future where everyone has a place to call home."
            </blockquote>
            <a href="#connect" className="text-link">Get in Touch →</a>
        </div>
    </section>

    <section className="coaching-section" id="pillars">
        <div className="coaching-header">
            <span className="overline">Mentorship System</span>
            <h2>Coaching for <em>Success</em></h2>
        </div>
        <div className="coaching-grid">
            {initialCoaching?.map((card: any, index: number) => (
                <div key={card.id || index} className="coaching-card">
                    <div className="coaching-img"><img src={card.image_url} alt={card.title} loading="lazy" /></div>
                    <div className="coaching-body">
                        <span className="pillar-badge">{card.badge_text}</span>
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>

    <section className="ecosystem-section" id="ecosystem">
        <div className="ecosystem-header">
            <span className="overline">Companies & Ventures</span>
            <h2>The<br /><em>Ecosystem</em></h2>
        </div>
        <div className="hscroll-track" id="hscrollTrack">
            {initialEcosystem?.map((company: any) => (
                <div key={company.id} className="hscroll-panel">
                    <div className="panel-visual"><img src={company.logo_url} alt={company.name} loading="lazy" /></div>
                    <div className="panel-info">
                        <h3>{company.name}</h3>
                        <p>{company.description}</p>
                        <a href={company.website_url} target="_blank" rel="noopener" className="text-link">Visit Website →</a>
                    </div>
                </div>
            ))}
        </div>
    </section>

    <section className="developers-section" id="developers">
        <div className="section-container">
            <span className="overline">Featured Partners</span>
            <h2>Trusted <em>Developers</em></h2>
            <div className="dev-grid">
                {initialDevelopers?.map((dev: any) => (
                    <div key={dev.id} className="dev-card">
                        <div className="dev-logo"><img src={dev.logo_url} alt={dev.name} loading="lazy" /></div>
                        <h4>{dev.name}</h4>
                        <a href={dev.website_url} target="_blank" rel="noopener" className="text-link">Explore →</a>
                    </div>
                ))}
            </div>
        </div>
    </section>

    <section className="credentials-section" id="credentials">
        <div className="credentials-inner">
            <div className="creds-header">
                <span className="overline">Education</span>
                <h2>Executive<br /><em>Credentials</em></h2>
            </div>

            <div className="creds-group creds-group-harvard">
                <div className="creds-group-label">
                    <span className="creds-institution-badge harvard-badge">Harvard Business School Online</span>
                </div>
                <div className="creds-grid">
                    {initialCredentials?.filter((c: any) => c.category === 'harvard').map((cred: any) => (
                        <div key={cred.id} className="cred-slide cred-harvard">
                            <div className="cred-badge">Harvard</div>
                            <h4>{cred.title}</h4>
                            <p>{cred.organization}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="creds-group creds-group-other">
                <div className="creds-group-label">
                    <span className="creds-institution-badge">Other Institutions & Licenses</span>
                </div>
                <div className="creds-grid">
                    {initialCredentials?.filter((c: any) => c.category === 'other').map((cred: any) => (
                        <div key={cred.id} className="cred-slide">
                            <div className="cred-badge">{cred.institution}</div>
                            <h4>{cred.title}</h4>
                            <p>{cred.organization}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>

    <section className="recognition-section" id="recognition">
        <div className="recognition-inner">
            <div className="recognition-header">
                <span className="overline">A Legacy of Excellence</span>
                <h2>Awards &<br /><em>Recognition</em></h2>
            </div>
            <div className="awards-wall">
                {initialAwards?.map((award: any, index: number) => (
                    <div key={award.id || index} className={`award-tile ${index === 1 || index === 4 ? 'featured' : ''}`}>
                        <div className="award-icon">{award.icon}</div>
                        <span className="award-year">{award.year}</span>
                        <h4>{award.title}</h4>
                        <p>{award.organization}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>

    <section className="connect-section" id="connect">
        <div className="connect-blob"></div>
        <div className="connect-inner">
            <h2 className="connect-headline">Let's Build<br /><em>Something</em><br />Extraordinary</h2>
            <p className="connect-sub">Ready to revolutionize your real estate journey?</p>
            <form className="connect-form" id="contactForm">
                <div className="form-row">
                    <input type="text" id="contactName" placeholder="Your Name" required />
                    <input type="email" id="contactEmail" placeholder="Your Email" required />
                </div>
                <textarea id="contactMessage" placeholder="How can we build together?" required></textarea>
                <div className="form-footer">
                    <div className="connect-meta">
                        <span>📍 Cebu City, Philippines</span>
                        <span>🌐 filipinohomes.com</span>
                    </div>
                    <button type="submit" className="big-btn" id="contactSubmit" style={{marginBottom: 0, cursor: 'pointer', background: 'transparent'}}>Send Message</button>
                </div>
                <div id="contactStatus" className="form-status"></div>
            </form>
        </div>
    </section>

    <footer>
        <div className="footer-inner">
            <span>© 2024 Anthony Leuterio</span>
            <div className="footer-links">
                <a href="https://www.facebook.com/TonLeuterioOfficial" target="_blank" rel="noopener">Facebook</a>
                <a href="https://www.instagram.com/tonleuterio/" target="_blank" rel="noopener">Instagram</a>
                <a href="https://www.linkedin.com/in/tonleuterio/" target="_blank" rel="noopener">LinkedIn</a>
                <a href="/admin">Admin</a>
            </div>
        </div>
    </footer>
    </>
  );
}
