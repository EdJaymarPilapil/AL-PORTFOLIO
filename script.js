// ============================================
// ANTHONY LEUTERIO — "THE STATEMENT" v3
// ============================================

// --- Supabase Setup ---
let supabase = null;
if (typeof window.supabase !== 'undefined') {
    const supaUrl = 'https://csteoeudjuzyhkhjaszo.supabase.co';
    const supaKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdGVvZXVkanV6eWhraGphc3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNDg2MDksImV4cCI6MjA4OTgyNDYwOX0.R2IsssIzOYjDMQiu_0Ona6zjI3COy2ui_swbFpFaroU';
    supabase = window.supabase.createClient(supaUrl, supaKey);
}

// --- Lenis Smooth Scrolling ---
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

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

// Optimized Smooth Anchor Scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const href = a.getAttribute('href');
        if (href === "#") return;
        
        menuBtn?.classList.remove('open');
        navLinks?.classList.remove('open');
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(href);
        } else {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// --- Nav scroll state & Parallax (Throttled) ---
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            document.getElementById('mainNav')?.classList.toggle('scrolled', window.scrollY > 80);
            document.body.style.setProperty('--scrollY', `${window.scrollY}px`);
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// --- Advanced GSAP Split-Text Reveals ---
if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Initial split applied to all h2 and lead text
    const splitElements = document.querySelectorAll('h2, .lead, .connect-headline');
    splitElements.forEach(el => {
        if(!el.classList.contains('hero-clip-text')){
            const type = new SplitType(el, { types: 'lines, words, chars' });
            
            gsap.from(type.chars, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 40,
                opacity: 0,
                rotationX: -40,
                stagger: 0.02,
                duration: 0.8,
                ease: 'back.out(1.2)'
            });
        }
    });
}

// --- Legacy CSS Reveal on scroll (for other elements) ---
const revealEls = document.querySelectorAll('.overline, .split-right p:not(.lead), .split-right blockquote, .award-tile, .cred-slide, .number-cell, .hscroll-panel, .coaching-card, .big-btn, .dev-card, .news-card');
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

// --- Award tile & Ecosystem panel hover effects ---
document.querySelectorAll('.award-tile, .hscroll-panel').forEach(tile => {
    tile.addEventListener('mousemove', e => {
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
    });
    tile.addEventListener('mouseleave', () => {
        if (tile.classList.contains('award-tile')) {
            tile.style.setProperty('--rotate-x', `0deg`);
            tile.style.setProperty('--rotate-y', `0deg`);
        }
    });
});


// --- Magnetic Buttons ---
document.querySelectorAll('.big-btn, .theme-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.setProperty('--mag-x', `${x * 0.3}px`);
        btn.style.setProperty('--mag-y', `${y * 0.3}px`);
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mag-x', `0px`);
        btn.style.setProperty('--mag-y', `0px`);
    });
});

// --- Vanilla Tilt initialization ---
if(typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".coaching-card, .dev-card, .news-card"), {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
        scale: 1.02
    });
}

// --- Contact Form ---
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        const status = document.getElementById('contactStatus');
        const submitBtn = document.getElementById('contactSubmit');
        
        if(!name || !email || !message) return;
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = '0.7';
        
        try {
            const { error } = await supabase.from('contacts').insert([{ name, email, message }]);
            if (error) throw error;
            
            status.textContent = "Message sent successfully!";
            status.style.color = "var(--gold)";
            contactForm.reset();
        } catch (err) {
            console.error(err);
            status.textContent = "Failed. Have you created the 'contacts' table in Supabase?";
            status.style.color = "red";
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.style.pointerEvents = 'auto';
            submitBtn.style.opacity = '1';
        }
    });
}
