"use client";
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function PortfolioClient({ 
  initialCoaching, 
  initialEcosystem, 
  initialDevelopers, 
  initialCredentials,
  initialAwards,
  initialNews
}: any) {
  
  const [theme, setTheme] = React.useState('dark');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const lenisRef = React.useRef<any>(null);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('al-theme', newTheme);
  };

  const toggleMenu = () => {
    const nextState = !isMenuOpen;
    setIsMenuOpen(nextState);
    document.body.style.overflow = nextState ? 'hidden' : '';
  };

  const scrollTo = (target: string | number) => {
    try {
        console.log(`[AL-PORTFOLIO] scrollTo called for target: ${target}`);
        
        // Use the ref instance if available
        const lenis = lenisRef.current;
        
        if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(target, {
                duration: 1.2,
                offset: typeof target === 'string' && target.startsWith('#') ? -80 : 0,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        } else {
            console.warn('[AL-PORTFOLIO] Lenis not ready, using native scroll');
            if (typeof target === 'number') {
                window.scrollTo({ top: target, behavior: 'smooth' });
            } else if (typeof target === 'string' && target.startsWith('#')) {
                const targetEl = document.querySelector(target);
                if (targetEl) {
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = targetEl.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    } catch (err) {
        console.error('[AL-PORTFOLIO] scrollTo error:', err);
    }
    
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('al-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          lerp: 0.1,
          smoothWheel: true
      });
      lenisRef.current = lenis;
      (window as any).lenis = lenis;
      
      // Synchronize GSAP with Lenis
      import('gsap').then(({ default: gsap }) => {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
            gsap.registerPlugin(ScrollTrigger);
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        });
      });

      // Optimized Scroll Listener for Nav
      lenis.on('scroll', (e: any) => {
          document.getElementById('mainNav')?.classList.toggle('scrolled', e.scroll > 80);
      });
    });

    setTimeout(() => {
        document.getElementById('preloader')?.classList.add('done');
    }, 800);

    // --- GSAP Reveals ---
    import('gsap').then(({ default: gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        import('split-type').then(({ default: SplitType }) => {
          gsap.registerPlugin(ScrollTrigger);

          // ScrollTrigger needs to be refreshed for Lenis
          ScrollTrigger.refresh();

          // Number Counter Animation
          const numberElements = document.querySelectorAll('.big-number[data-count]');
          numberElements.forEach((el: any) => {
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

          // Smooth Fade-In Reveals for Headings (Legacy observer handled now)
          
          // Refresh triggers once all DOM is settled
          setTimeout(() => ScrollTrigger.refresh(), 1000);
        });
      });
    });

    // --- Intersection Observer Reveals ---
    const revealEls = document.querySelectorAll('h2, .lead, .connect-headline, .overline, .split-right p:not(.lead), .split-right blockquote, .award-tile, .cred-slide, .number-cell, .hscroll-panel, .coaching-card, .big-btn, .dev-card, .news-card');
    revealEls.forEach(el => el.classList.add('reveal-up'));

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target as HTMLElement;
                const parent = target.parentElement;
                const delay = (parent?.classList.contains('awards-wall') || 
                               parent?.classList.contains('numbers-grid') || 
                               parent?.classList.contains('coaching-grid') || 
                               parent?.classList.contains('dev-grid') || 
                               parent?.classList.contains('news-grid'))
                    ? Array.from(parent.children).indexOf(target) * 80
                    : 0;
                setTimeout(() => target.classList.add('vis'), delay);
                revealObs.unobserve(target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObs.observe(el));

    // --- Hover Effects ---
    const handleHoverMove = (e: MouseEvent) => {
        const tile = e.currentTarget as HTMLElement;
        const r = tile.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        
        tile.style.setProperty('--mouse-x', `${px}px`);
        tile.style.setProperty('--mouse-y', `${py}px`);
        
        if (tile.classList.contains('award-tile')) {
            const x = px / r.width - 0.5;
            const y = py / r.height - 0.5;
            tile.style.setProperty('--rotate-x', `${-y * 8}deg`);
            tile.style.setProperty('--rotate-y', `${x * 8}deg`);
        }
    };

    const handleHoverLeave = (e: MouseEvent) => {
        const tile = e.currentTarget as HTMLElement;
        if (tile.classList.contains('award-tile')) {
            tile.style.setProperty('--rotate-x', `0deg`);
            tile.style.setProperty('--rotate-y', `0deg`);
        }
    };

    const handleMagneticMove = (e: MouseEvent) => {
        const btn = e.currentTarget as HTMLElement;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.setProperty('--mag-x', `${x * 0.3}px`);
        btn.style.setProperty('--mag-y', `${y * 0.3}px`);
    };

    const handleMagneticLeave = (e: MouseEvent) => {
        const btn = e.currentTarget as HTMLElement;
        btn.style.setProperty('--mag-x', `0px`);
        btn.style.setProperty('--mag-y', `0px`);
    };

    document.querySelectorAll('.award-tile, .hscroll-panel').forEach(tile => {
        tile.addEventListener('mousemove', handleHoverMove as any);
        tile.addEventListener('mouseleave', handleHoverLeave as any);
    });

    document.querySelectorAll('.big-btn, .theme-btn').forEach(btn => {
        btn.addEventListener('mousemove', handleMagneticMove as any);
        btn.addEventListener('mouseleave', handleMagneticLeave as any);
    });

    // --- Vanilla Tilt ---
    // Tilt effect disabled

    return () => {
        if (lenisRef.current) {
            lenisRef.current.destroy();
            lenisRef.current = null;
        }
    };
  }, []);

  return (
    <>
    <div className="preloader" id="preloader" onClick={(e) => { e.currentTarget.classList.add('done') }}>
        <div className="preloader-inner">
            <div className="preloader-logo">
                <span className="preloader-text">AL</span>
            </div>
        </div>
    </div>
    
    <div className="nav-outer" id="mainNav">
        <nav>
            <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo(0); }}><img src="components/logo.png" alt="AL" /></a>
            <div className={`nav-center ${isMenuOpen ? 'open' : ''}`} id="navLinks">
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('#about'); }}>About</a>
                <a href="#pillars" onClick={(e) => { e.preventDefault(); scrollTo('#pillars'); }}>Coaching</a>
                <a href="#ecosystem" onClick={(e) => { e.preventDefault(); scrollTo('#ecosystem'); }}>Companies</a>
                <a href="#developers" onClick={(e) => { e.preventDefault(); scrollTo('#developers'); }}>Developers</a>
                <a href="#credentials" onClick={(e) => { e.preventDefault(); scrollTo('#credentials'); }}>Education</a>
                <a href="#news" onClick={(e) => { e.preventDefault(); scrollTo('#news'); }}>News</a>
                <a href="#recognition" onClick={(e) => { e.preventDefault(); scrollTo('#recognition'); }}>Awards</a>
                <a href="#connect" onClick={(e) => { e.preventDefault(); scrollTo('#connect'); }}>Contact</a>
            </div>
            <div className="nav-right">
                <button className="theme-btn" onClick={toggleTheme} id="themeBtn">
                    <span className="t-dark">☀️</span><span className="t-light">🌙</span>
                </button>
                <button className={`menu-btn ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} id="menuBtn">
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

            <div className="hero-logo-wrapper">
                <div className="hero-logo-strip">
                    {initialDevelopers?.map((dev: any) => (
                        <img key={`strip1-${dev.id}`} src={dev.logo_url} alt={dev.name} className="trust-logo" />
                    ))}
                </div>
                <div className="hero-logo-strip">
                    {initialDevelopers?.map((dev: any) => (
                        <img key={`strip2-${dev.id}`} src={dev.logo_url} alt={dev.name} className="trust-logo" />
                    ))}
                </div>
            </div>

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
            <a href="#connect" className="text-link" onClick={(e) => { e.preventDefault(); scrollTo('#connect'); }}>Get in Touch →</a>
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
                    <div className="coaching-card-corner top-left"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                    <div className="coaching-card-corner top-right"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                    <div className="coaching-card-corner bottom-left"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                    <div className="coaching-card-corner bottom-right"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                    <div className="coaching-shine"></div>
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
                            <div className="harvard-logo"></div>
                            <div className="cred-card-corner top-left"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                            <div className="cred-card-corner top-right"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                            <div className="cred-card-corner bottom-left"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                            <div className="cred-card-corner bottom-right"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                            <div className="cred-shine"></div>
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
                            <div className="cred-card-corner top-left"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                            <div className="cred-card-corner top-right"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                            <div className="cred-card-corner bottom-left"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                            <div className="cred-card-corner bottom-right"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                            <div className="cred-shine"></div>
                            <div className="cred-badge">{cred.institution}</div>
                            <h4>{cred.title}</h4>
                            <p>{cred.organization}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>

    <section className="news-section" id="news">
        <div className="section-container">
            <span className="overline">Media & Insights</span>
            <h2>Latest <em>Updates</em></h2>
            <div className="news-grid">
                {initialNews?.map((news: any) => (
                    <div key={news.id} className="news-card">
                        <div className="news-card-corner top-left"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                        <div className="news-card-corner top-right"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                        <div className="news-card-corner bottom-left"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                        <div className="news-card-corner bottom-right"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                        <div className="news-shine"></div>
                        <div className="news-img">
                            <img src={news.image_url} alt={news.title} loading="lazy" />
                            <span className="news-tag">{news.tag}</span>
                        </div>
                        <div className="news-body">
                            <span className="news-date">{news.published_date}</span>
                            <h4>{news.title}</h4>
                            <p>{news.description}</p>
                        </div>
                    </div>
                ))}
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
                        <div className="award-card-corner top-left"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                        <div className="award-card-corner top-right"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                        <div className="award-card-corner bottom-left"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                        <div className="award-card-corner bottom-right"><svg viewBox="0 0 60 60"><path d="M0 20 L0 5 Q0 0 5 0 L20 0"/></svg></div>
                        <div className="award-shine"></div>
                        <div className="award-tile-inner">
                            <div className="award-top">
                                <span className="award-icon">{award.icon}</span>
                                <span className="award-year">{award.year}</span>
                            </div>
                            <h4>{award.title}</h4>
                            <p>{award.organization}</p>
                        </div>
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
            <span>© 2026 Anthony Leuterio</span>
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
