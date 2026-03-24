"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import VanillaTilt from 'vanilla-tilt';

export default function PortfolioClient({ initialCoaching = [], initialEcosystem = [], initialDevelopers = [], initialNews = [] }: {
  initialCoaching?: any[], initialEcosystem?: any[], initialDevelopers?: any[], initialNews?: any[]
}) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Dynamic Lenis import for SSR safety
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
      });

      const mainNav = document.getElementById('mainNav');

      lenis.on('scroll', ({ scroll }: { scroll: number }) => {
          if (mainNav) mainNav.classList.toggle('scrolled', scroll > 80);
      });

      // Integrate with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    });

    // Theme logic
    const htmlEl = document.documentElement;
    htmlEl.setAttribute('data-theme', localStorage.getItem('al-theme') || 'dark');
    document.getElementById('themeBtn')?.addEventListener('click', () => {
        const t = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', t);
        localStorage.setItem('al-theme', t);
    });

    // GSAP Text Reveal
    const splitElements = document.querySelectorAll('h2, .lead, .connect-headline');
    splitElements.forEach(el => {
        if(!el.classList.contains('hero-clip-text')){
            const type = new SplitType(el as HTMLElement, { types: 'lines,words' });
            
            // Wrap words in a wrapper for better masking if needed, 
            // but for now, we'll do a smooth fade + blur + slide
            gsap.from(type.words, {
                scrollTrigger: { 
                    trigger: el, 
                    start: 'top 90%', 
                    toggleActions: 'play none none reverse' 
                },
                y: 20,
                opacity: 0,
                filter: 'blur(10px)',
                stagger: 0.03,
                duration: 1,
                ease: 'power3.out'
            });
        }
    });

    // Num counter
    const numObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.big-number').forEach(el => {
                    const t = parseInt(el.getAttribute('data-count') || '0');
                    if(t > 0 && !el.classList.contains('counted')) {
                        el.classList.add('counted');
                        let start = 0;
                        const duration = 2000;
                        const startTime = performance.now();
                        const update = (currentTime: number) => {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const easeOut = 1 - Math.pow(1 - progress, 3);
                            el.innerHTML = Math.floor(easeOut * t).toString();
                            if (progress < 1) requestAnimationFrame(update);
                            else el.innerHTML = t.toString() + (t > 100 ? '+' : '');
                        };
                        requestAnimationFrame(update);
                    }
                });
                numObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const numGrid = document.querySelector('.numbers-grid');
    if (numGrid) numObs.observe(numGrid);

    // Reveal
    const revealEls = document.querySelectorAll('.overline, .split-right p:not(.lead), .split-right blockquote, .award-tile, .cred-slide, .number-cell, .hscroll-panel, .coaching-card, .big-btn, .dev-card, .news-card');
    revealEls.forEach(el => el.classList.add('reveal-up'));
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.closest('.awards-wall, .creds-carousel, .numbers-grid, .coaching-grid, .dev-grid, .news-grid')
                    ? Array.from(entry.target.parentElement!.children).indexOf(entry.target) * 80
                    : 0;
                setTimeout(() => entry.target.classList.add('vis'), delay);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));

    // VanillaTilt
    VanillaTilt.init(document.querySelectorAll(".coaching-card, .dev-card, .news-card") as any, {
        max: 8, speed: 400, glare: true, "max-glare": 0.15, scale: 1.02
    });
  }, []);

  const hidePreloader = () => {
    if(preloaderRef.current) preloaderRef.current.classList.add('done');
  };

  useEffect(() => {
    hidePreloader();
    setTimeout(hidePreloader, 500);
  }, []);

  return (
    <>
      <div className="preloader" id="preloader" ref={preloaderRef} onClick={hidePreloader}>
          <div className="preloader-inner">
              <span className="preloader-text">ANTHONY LEUTERIO</span>
          </div>
      </div>

      <div className="nav-outer" id="mainNav">
          <nav>
              <a href="#" className="nav-logo"><img src="/components/logo.png" alt="AL" /></a>
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
          <div className="hero-bg-img" style={{backgroundImage: "url('/components/bossing-cropped.jpg')"}}></div>
          <div className="hero-overlay"></div>
          <h1 className="hero-clip-text" aria-label="Anthony Leuterio">
              <span className="clip-line">ANTHONY</span>
              <span className="clip-line">LEUTERIO</span>
          </h1>
          <div className="hero-bottom-bar">
              <div className="hero-tagline">Philippines' Premier Real Estate Visionary</div>
              <div className="hero-logo-wrapper">
                  <div className="hero-logo-strip">
                      <img src="/components/Cebu Landmaster Inc..webp" alt="CLI" className="trust-logo" />
                      <img src="/components/Grand Land Incorporated.webp" alt="Grand Land" className="trust-logo" />
                      <img src="/components/Primeworld Land Holdings Inc..webp" alt="Primeworld" className="trust-logo" />
                      <img src="/components/Priland Development Corporation.webp" alt="Priland" className="trust-logo" />
                      <img src="/components/Be Residences.webp" alt="Be" className="trust-logo" />
                      <img src="/components/Wee Comm Developers Inc..webp" alt="Wee" className="trust-logo" />
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
                  <img src="/components/bossing-blended.jpg" alt="Anthony Leuterio" loading="lazy" />
              </div>
          </div>
          <div className="split-right">
              <span className="overline">Legacy & Vision</span>
              <h2>Redefining <em>Real Estate</em> Through Innovation</h2>
              <p className="lead">Anthony Leuterio is more than just a real estate mogul — he is a visionary leader...</p>
              <blockquote>
                  "Innovation is not just about technology; it's about creating a future where everyone has a place to call home."
              </blockquote>
          </div>
      </section>

      {initialCoaching?.length > 0 && (
      <section className="coaching-section" id="pillars">
          <div className="coaching-header">
              <span className="overline">Mentorship System</span>
              <h2>Coaching for <em>Success</em></h2>
          </div>
          <div className="coaching-grid">
              {initialCoaching.map((card) => (
                  <div key={card.id || Math.random()} className="coaching-card">
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
      )}

      {initialEcosystem?.length > 0 && (
      <section className="ecosystem-section" id="ecosystem">
          <div className="ecosystem-header">
              <span className="overline">Companies & Ventures</span>
              <h2>The<br/><em>Ecosystem</em></h2>
          </div>
          <div className="hscroll-track" id="hscrollTrack">
              {initialEcosystem.map((eco) => (
                  <div key={eco.id || Math.random()} className="hscroll-panel">
                      <div className="panel-visual"><img src={eco.logo_url} alt={eco.name} loading="lazy" /></div>
                      <div className="panel-info">
                          <h3>{eco.name}</h3>
                          <p>{eco.description}</p>
                          <a href={eco.website_url} target="_blank" rel="noopener" className="text-link">Visit Website →</a>
                      </div>
                  </div>
              ))}
          </div>
      </section>
      )}

      {initialDevelopers?.length > 0 && (
      <section className="developers-section" id="developers">
          <div className="section-container">
              <span className="overline">Featured Partners</span>
              <h2>Trusted <em>Developers</em></h2>
              <div className="dev-grid">
                  {initialDevelopers.map((dev) => (
                      <div key={dev.id || Math.random()} className="dev-card">
                          <div className="dev-logo"><img src={dev.logo_url} alt={dev.name} loading="lazy" /></div>
                          <h4>{dev.name}</h4>
                          <a href={dev.website_url} target="_blank" rel="noopener" className="text-link">Explore →</a>
                      </div>
                  ))}
              </div>
          </div>
      </section>
      )}

      {initialNews?.length > 0 && (
      <section className="news-section" id="news">
          <div className="section-container">
              <span className="overline">Media & Insights</span>
              <h2>Latest <em>Updates</em></h2>
              <div className="news-grid">
                  {initialNews.map((news) => (
                      <div key={news.id || Math.random()} className="news-card">
                          <div className="news-img"><img src={news.image_url} alt={news.title} loading="lazy" /><span className="news-tag">{news.tag}</span></div>
                          <div className="news-body"><span className="news-date">{news.published_date}</span><h4>{news.title}</h4><p>{news.description}</p></div>
                      </div>
                  ))}
              </div>
          </div>
      </section>
      )}

      <section className="credentials-section" id="credentials">
          <div className="credentials-inner">
              <div className="creds-header">
                  <span className="overline">Education</span>
                  <h2>Executive<br/><em>Credentials</em></h2>
              </div>

              <div className="creds-group creds-group-harvard">
                  <div className="creds-group-label">
                      <span className="creds-institution-badge harvard-badge">Harvard Business School Online</span>
                  </div>
                  <div className="creds-grid">
                      <div className="cred-slide cred-harvard">
                          <div className="cred-badge">Harvard</div>
                          <h4>Creating Brand Value</h4>
                          <p>Harvard Business School Online — 2025</p>
                      </div>
                      <div className="cred-slide cred-harvard">
                          <div className="cred-badge">Harvard</div>
                          <h4>AI Essentials for Business</h4>
                          <p>Harvard Business School Online — 2025</p>
                      </div>
                      <div className="cred-slide cred-harvard">
                          <div className="cred-badge">Harvard</div>
                          <h4>Digital Marketing Strategy</h4>
                          <p>Harvard Business School Online — 2024</p>
                      </div>
                      <div className="cred-slide cred-harvard">
                          <div className="cred-badge">Harvard</div>
                          <h4>Sustainable Business Strategy</h4>
                          <p>Harvard Business School Online — 2022</p>
                      </div>
                      <div className="cred-slide cred-harvard">
                          <div className="cred-badge">Harvard</div>
                          <h4>Disruptive Strategy</h4>
                          <p>Harvard Business School Online — 2021</p>
                      </div>
                      <div className="cred-slide cred-harvard">
                          <div className="cred-badge">Harvard</div>
                          <h4>Strategy Execution</h4>
                          <p>Harvard Business School Online — 2021</p>
                      </div>
                  </div>
              </div>

              <div className="creds-group creds-group-other">
                  <div className="creds-group-label">
                      <span className="creds-institution-badge">Other Institutions & Licenses</span>
                  </div>
                  <div className="creds-grid">
                      <div className="cred-slide">
                          <div className="cred-badge">MIT</div>
                          <h4>Digital Business Strategy</h4>
                          <p>MIT Sloan School of Management — 2019</p>
                      </div>
                      <div className="cred-slide">
                          <div className="cred-badge">Oxford</div>
                          <h4>Digital Marketing</h4>
                          <p>University of Oxford — 2019</p>
                      </div>
                      <div className="cred-slide">
                          <div className="cred-badge">PRC</div>
                          <h4>Licensed Real Estate Broker</h4>
                          <p>Professional Regulation Commission</p>
                      </div>
                      <div className="cred-slide">
                          <div className="cred-badge">USJ-R</div>
                          <h4>Bachelor's Degree</h4>
                          <p>University of San Jose-Recoletos — 1992</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section className="recognition-section" id="recognition">
          <div className="recognition-inner">
              <div className="recognition-header">
                  <span className="overline">A Legacy of Excellence</span>
                  <h2>Awards &<br/><em>Recognition</em></h2>
              </div>
              <div className="awards-wall">
                  <div className="award-tile">
                      <div className="award-icon">🏆</div>
                      <span className="award-year">2024</span>
                      <h4>International REALTOR® of the Year</h4>
                      <p>Global Real Estate Excellence Board</p>
                  </div>
                  <div className="award-tile featured">
                      <div className="award-icon">✨</div>
                      <span className="award-year">2023</span>
                      <h4>Most Outstanding Real Estate Broker</h4>
                      <p>National Property Awards PH</p>
                  </div>
                  <div className="award-tile">
                      <div className="award-icon">💎</div>
                      <span className="award-year">2021</span>
                      <h4>Best Real Estate Brand</h4>
                      <p>Property Excellence Awards</p>
                  </div>
                  <div className="award-tile">
                      <div className="award-icon">🎖️</div>
                      <span className="award-year">2020</span>
                      <h4>Entrepreneur of the Year</h4>
                      <p>Asia CEO Awards</p>
                  </div>
                  <div className="award-tile featured">
                      <div className="award-icon">🎤</div>
                      <span className="award-year">2019</span>
                      <h4>Top Motivational Speaker</h4>
                      <p>Real Estate Motivators PH</p>
                  </div>
                  <div className="award-tile">
                      <div className="award-icon">🌟</div>
                      <span className="award-year">2018</span>
                      <h4>Most Influential Personality</h4>
                      <p>Property Report PH</p>
                  </div>
                  <div className="award-tile">
                      <div className="award-icon">📈</div>
                      <span className="award-year">2014</span>
                      <h4>Most Promising Company</h4>
                      <p>APEA — Asia Pacific Entrepreneurship Awards</p>
                  </div>
              </div>
          </div>
      </section>

      <section className="connect-section" id="connect">
          <div className="connect-blob"></div>
          <div className="connect-inner">
              <h2 className="connect-headline">Let's Build<br/><em>Something</em><br/>Extraordinary</h2>
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
              </form>
          </div>
      </section>

      <footer>
          <div className="footer-inner">
              <span>© 2026 Anthony Leuterio</span>
              <div className="footer-links">
                  <a href="/login">Admin Login</a>
              </div>
          </div>
      </footer>
    </>
  );
}
