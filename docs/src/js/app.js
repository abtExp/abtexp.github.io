// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initial Animation Timeline
const tl = gsap.timeline();

// Hero Animations
tl.from('.bg-text', { y: 150, opacity: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 })
  .from('.hero-image', { scale: 1.15, opacity: 0, y: 50, duration: 1.5, ease: 'power2.out', transformOrigin: 'bottom center' }, '-=1.3')
  .from('.navbar', { opacity: 0, duration: 1, ease: 'power2.out' }, '-=1.0')
  .from('.hero-overlay > *', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: 'power2.out' }, '-=0.8');

// Parallax Effect on Mouse Move
const bgText = document.querySelector('.bg-text');
const heroImage = document.querySelector('.hero-image');

if (window.matchMedia("(min-width: 992px)").matches) {
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        gsap.to(bgText, { x: x * -50, y: y * -20, duration: 1, ease: 'power2.out' });
        gsap.to(heroImage, { x: x * 20, y: y * 10, duration: 1, ease: 'power2.out' });
    });
}

// Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
let isMenuOpen = false;

menuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        mobileMenu.classList.add('active');
        menuBtn.classList.add('active');
        // Animate links in
        gsap.fromTo(mobileLinks,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.3 }
        );
        // Turn hamburger to X (simple CSS transition handled in style or here if needed)
        gsap.to(menuBtn.children[0], { rotation: 45, y: 8, duration: 0.3 });
        gsap.to(menuBtn.children[1], { rotation: -45, y: -5, duration: 0.3 });
    } else {
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
        gsap.to(menuBtn.children[0], { rotation: 0, y: 0, duration: 0.3 });
        gsap.to(menuBtn.children[1], { rotation: 0, y: 0, duration: 0.3 });
    }
});

// Close menu on link click
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
        gsap.to(menuBtn.children[0], { rotation: 0, y: 0, duration: 0.3 });
        gsap.to(menuBtn.children[1], { rotation: 0, y: 0, duration: 0.3 });
    });
});

// Scroll Animations for Sections

// Titles
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// About Cards
gsap.from('.about-card', {
    scrollTrigger: {
        trigger: '.about-grid',
        start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power2.out'
});

// Timeline Items
gsap.utils.toArray('.timeline-item').forEach(item => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 85%'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });
});

// Portfolio Cards
gsap.from('.portfolio-card', {
    scrollTrigger: {
        trigger: '.portfolio-grid',
        start: 'top 80%'
    },
    y: 100,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'power3.out'
});

// Skills
gsap.from('.skill-category', {
    scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 85%'
    },
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power2.out'
});

// Contact
gsap.from('.contact-wrapper', {
    scrollTrigger: {
        trigger: '.contact-wrapper',
        start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});
