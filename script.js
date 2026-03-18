// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.classList.add('preloader-hidden');
        }, 1800);
    }
});

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const currentTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', currentTheme);

function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
}

// Mobile Menu Toggle
const navToggle = document.getElementById('nav-toggle');
const navContainer = document.getElementById('nav-container');
const navLinksItems = document.querySelectorAll('.nav-links li a');

if (navToggle && navContainer) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navContainer.classList.toggle('active');
        document.body.style.overflow = navContainer.classList.contains('active') ? 'hidden' : '';
    });
}

// Close mobile menu when a link is clicked
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        if (navToggle && navContainer) {
            navToggle.classList.remove('active');
            navContainer.classList.remove('active');
        }
        document.body.style.overflow = '';
    });
});

// Simple and fast loading
window.addEventListener('DOMContentLoaded', () => {
    // Hide scroll indicator after delay
    setTimeout(() => {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transition = 'opacity 1s ease';
        }
    }, 4000);
});

// Scroll progress
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }
    
    // Nav scroll effect
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
function checkReveal() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 120) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', checkReveal);
checkReveal();

// Stat counters animation with IntersectionObserver
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (isNaN(target)) return;
                
                let count = 0;
                const duration = 2000; // 2 seconds
                const frameDuration = 1000 / 60; // 60fps
                const totalFrames = Math.round(duration / frameDuration);
                const increment = target / totalFrames;
                
                let frame = 0;
                const counter = setInterval(() => {
                    frame++;
                    count += increment;
                    
                    if (frame === totalFrames) {
                        stat.textContent = target;
                        clearInterval(counter);
                    } else {
                        stat.textContent = Math.floor(count);
                    }
                }, frameDuration);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
    statsObserver.observe(statsGrid);
}

// Form submit
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        if (btn) {
            btn.textContent = 'Sent! ✓';
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.textContent = 'Send Message';
                btn.style.background = '';
                form.reset();
            }, 3000);
        }
    });
}

// Smooth scroll for nav links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});