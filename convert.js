const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Strip out HTML skeleton
html = html.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>/i, '');
// Remove all script tags completely
html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
// Remove HTML comments
html = html.replace(/<!--[\s\S]*?-->/g, '');
html = html.replace(/<\/body>[\s\S]*?<\/html>/i, '');

// Convert class= to className= (avoid double replacement)
html = html.replace(/\bclass=/g, 'className=');
html = html.replace(/classNameName=/g, 'className=');
// Convert for= to htmlFor=
html = html.replace(/for=/g, 'htmlFor=');
// Convert style="background-image:url('...')"
html = html.replace(/style="background-image:url\('([^']+)'\)"/g, "style={{backgroundImage: `url('$1')`}}");
// Some raw style attributes
html = html.replace(/style="[^"]*"/g, (match) => {
    if(match.includes("display:none")) return "style={{display: 'none'}}";
    if(match.includes("margin-bottom:0; cursor:pointer; background:transparent;")) return "style={{marginBottom: 0, cursor: 'pointer', background: 'transparent'}}";
    return match; // fallback
});
// Self close elements
html = html.replace(/<(img|input|br|hr)([^>]*?)(?<!\/)>/g, "<$1$2 />");
// Handle onclick -> onClick with arrow function conversion
html = html.replace(/onclick="([^"]*)"/g, (match, code) => {
    // Convert this. to e.currentTarget. and wrap in arrow function
    const convertedCode = code.replace(/this\./g, 'e.currentTarget.');
    return `onClick={(e) => { ${convertedCode} }}`;
});

// Fix the SVG inline or weird artifacts
html = html.replace(/<div className="preloader" id="preloader" onClick="this\.classList\.add\('done'\)">/, '<div className="preloader" id="preloader" onClick={(e) => e.currentTarget.classList.add(\'done\')}>');

// Add admin login link to footer
html = html.replace(/<footer>[\s\S]*?<\/footer>/, `<footer>
        <div className="footer-inner">
            <span>© 2024 Anthony Leuterio</span>
            <div className="footer-links">
                <a href="https://www.facebook.com/TonLeuterioOfficial" target="_blank" rel="noopener">Facebook</a>
                <a href="https://www.instagram.com/tonleuterio/" target="_blank" rel="noopener">Instagram</a>
                <a href="https://www.linkedin.com/in/tonleuterio/" target="_blank" rel="noopener">LinkedIn</a>
                <a href="/admin">Admin</a>
            </div>
        </div>
    </footer>`);

const component = `"use client";
import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import VanillaTilt from 'vanilla-tilt';

export default function PortfolioClient({ initialCoaching, initialEcosystem, initialDevelopers, initialNews }: any) {
  
  useEffect(() => {
    // Dynamically import Lenis to prevent SSR issues
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
        VanillaTilt.init(document.querySelectorAll(".coaching-card, .dev-card, .news-card") as any, {
            max: 8,
            speed: 400,
            glare: true,
            "max-glare": 0.15,
            scale: 1.02
        });
    }, 500);

    // Number counting animation
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
      ${html}
    </>
  );
}
`;

if (!fs.existsSync('components')) fs.mkdirSync('components');
fs.writeFileSync('components/PortfolioClient.tsx', component);
console.log('Successfully generated PortfolioClient.tsx');
