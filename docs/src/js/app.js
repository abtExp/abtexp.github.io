document.addEventListener("DOMContentLoaded", function () {
    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 2. Custom Cursor
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    // Only show custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3
            });
        });

        const links = document.querySelectorAll('a, button, .glass-card, .nav-toggle');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 0.5 });
                gsap.to(follower, { scale: 1.5, borderColor: 'var(--accent-color)' });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1 });
                gsap.to(follower, { scale: 1, borderColor: 'var(--primary-color)' });
            });
        });
    } else {
        // Hide on touch devices
        cursor.style.display = 'none';
        follower.style.display = 'none';
    }


    // 3. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Reveal
    const tl = gsap.timeline();

    // Prepare initial state for reveal
    gsap.set('.reveal-text', { y: 100, opacity: 0 });
    gsap.set('.reveal-text-delay', { y: 50, opacity: 0 });

    tl.to('.reveal-text', {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power4.out"
    })
    .to('.reveal-text-delay', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.5")
    .from('.floating-nav', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");

    // Scroll Indicator Hide on Scroll
    gsap.to('.scroll-indicator', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: "top top",
            end: "20% top",
            scrub: true
        },
        opacity: 0
    });

    // Horizontal Scroll for Portfolio
    // Only on desktop
    if (window.innerWidth > 768) {
        const portfolioSection = document.querySelector(".horizontal-scroll-section");
        const portfolioWrapper = document.querySelector(".portfolio-wrapper");

        gsap.to(portfolioWrapper, {
            x: () => -(portfolioWrapper.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: portfolioSection,
                start: "top top",
                end: () => `+=${portfolioWrapper.scrollWidth - window.innerWidth}`,
                scrub: 1,
                pin: true,
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });
    }

    // General Fade In Up
    const sections = document.querySelectorAll('.section-header, .about-card, .timeline-item, .contact-wrapper, .skills-grid');

    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // 4. Navigation Logic
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const navToggle = document.querySelector('.nav-toggle');
    const closeMenuBtn = document.querySelector('.mobile-menu-close');

    // Smooth Scroll for Anchors
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            // Close mobile menu if open
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }

            lenis.scrollTo(targetSection);
        });
    });

    // Mobile Menu Toggle
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
    }

    if (navToggle) navToggle.addEventListener('click', toggleMobileMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu);

    // Active Link Highlight
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section, header');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    });

    // 5. Contact Form Logic
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            // Simulate sending
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
                btn.style.background = 'var(--secondary-color)';

                setTimeout(() => {
                    contactForm.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = 'var(--primary-color)';
                }, 3000);
            }, 1500);
        });
    }
});
