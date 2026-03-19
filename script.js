// ============================================
// ANTHONY LEUTERIO — "THE STATEMENT" v3
// ============================================

// --- Preloader ---
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader')?.classList.add('done');
    }, 1400);
});

// --- Theme ---
const html = document.documentElement;
html.setAttribute('data-theme', localStorage.getItem('al-theme') || 'dark');
document.getElementById('themeBtn')?.addEventListener('click', () => {
    const t = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', t);
    localStorage.setItem('al-theme', t);
});

// --- Mobile Nav ---
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn?.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.nav-center a').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        menuBtn?.classList.remove('open');
        navLinks?.classList.remove('open');
        document.body.style.overflow = '';
        document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Nav scroll state ---
let lastY = 0;
window.addEventListener('scroll', () => {
    document.getElementById('mainNav')?.classList.toggle('scrolled', window.scrollY > 80);
    lastY = window.scrollY;
}, { passive: true });

// --- Reveal on scroll ---
const revealEls = document.querySelectorAll('.overline, h2, .lead, .split-right p, .split-right blockquote, .split-right .text-link, .award-tile, .cred-slide, .number-cell, .hscroll-panel, .coaching-card, .connect-headline, .connect-sub, .big-btn, .connect-meta, .dev-card, .news-card');
revealEls.forEach(el => el.classList.add('reveal-up'));

const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const delay = entry.target.closest('.awards-wall, .creds-carousel, .numbers-grid, .coaching-grid, .dev-grid, .news-grid')
                ? [...entry.target.parentElement.children].indexOf(entry.target) * 80
                : 0;
            setTimeout(() => entry.target.classList.add('vis'), delay);
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// --- Number cells counter ---
const numObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.big-number').forEach(el => {
                if (el && !el.dataset.done) {
                    el.dataset.done = '1';
                    animateCount(el, parseInt(el.dataset.count));
                }
            });
            numObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
const numGrid = document.querySelector('.numbers-grid');
if (numGrid) numObs.observe(numGrid);

function animateCount(el, target) {
    const dur = 2000;
    const start = performance.now();
    function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(ease * target);
        if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// --- Horizontal Scroll Carousel ---
const track = document.getElementById('hscrollTrack');
const panels = track ? track.querySelectorAll('.hscroll-panel') : [];
const dotsContainer = document.getElementById('hscrollDots');
const prevBtn = document.getElementById('hscrollPrev');
const nextBtn = document.getElementById('hscrollNext');

if (track && panels.length > 0) {
    // Create dots
    panels.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'hscroll-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => scrollToPanel(i));
        dotsContainer.appendChild(dot);
    });

    function scrollToPanel(idx) {
        panels[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }

    prevBtn?.addEventListener('click', () => {
        const currentIdx = getCurrentPanel();
        if (currentIdx > 0) scrollToPanel(currentIdx - 1);
    });
    nextBtn?.addEventListener('click', () => {
        const currentIdx = getCurrentPanel();
        if (currentIdx < panels.length - 1) scrollToPanel(currentIdx + 1);
    });

    function getCurrentPanel() {
        const trackRect = track.getBoundingClientRect();
        let closest = 0, minDist = Infinity;
        panels.forEach((p, i) => {
            const dist = Math.abs(p.getBoundingClientRect().left - trackRect.left);
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        return closest;
    }

    track.addEventListener('scroll', () => {
        const idx = getCurrentPanel();
        dotsContainer.querySelectorAll('.hscroll-dot').forEach((d, i) => {
            d.classList.toggle('active', i === idx);
        });
    }, { passive: true });
}

// --- Award tile hover effects ---
document.querySelectorAll('.award-tile').forEach(tile => {
    tile.addEventListener('mousemove', e => {
        const r = tile.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        const x = px / r.width - 0.5;
        const y = py / r.height - 0.5;
        
        tile.style.setProperty('--mouse-x', `${px}px`);
        tile.style.setProperty('--mouse-y', `${py}px`);
        tile.style.setProperty('--rotate-x', `${-y * 8}deg`);
        tile.style.setProperty('--rotate-y', `${x * 8}deg`);
    });
    tile.addEventListener('mouseleave', () => {
        tile.style.setProperty('--rotate-x', `0deg`);
        tile.style.setProperty('--rotate-y', `0deg`);
    });
});

// --- Smooth anchor scroll ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});