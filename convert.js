const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Strip out HTML skeleton
html = html.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>/i, '');
// Remove all script tags completely
html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
html = html.replace(/<\/body>[\s\S]*?<\/html>/i, '');

// Convert class= to className=
html = html.replace(/class=/g, 'className=');
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
// Handle onclick -> onClick
html = html.replace(/onclick=/g, 'onClick=');

// Fix the SVG inline or weird artifacts
html = html.replace(/<div className="preloader" id="preloader" onClick="this.classList.add\('done'\)">/, '<div className="preloader" id="preloader" onClick={(e) => e.currentTarget.classList.add(\\'done\\')}>');

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

    // Advanced GSAP
    gsap.registerPlugin(ScrollTrigger);
    const splitElements = document.querySelectorAll('h2, .lead, .connect-headline');
    splitElements.forEach(el => {
        if(!el.classList.contains('hero-clip-text')){
            const type = new SplitType(el as HTMLElement, { types: 'lines, words, chars' });
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
