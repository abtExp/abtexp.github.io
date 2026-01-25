document.addEventListener("DOMContentLoaded", () => {

    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    const tl = gsap.timeline();

    tl.from(".hero-title .word", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
    })
    .from(".hero-subtitle", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.5")
    .from(".hero-buttons a", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    }, "-=0.6")
    .from(".glass-circle", {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)"
    }, "-=1")
    .from(".floating-badge", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=0.5");

    // Marquee Animation
    gsap.to(".marquee-content", {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1
    });

    // About Section Reveal
    gsap.from(".about-panel", {
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // Stats Counter Animation
    const stats = document.querySelectorAll(".stat-num");
    stats.forEach(stat => {
        let target = +stat.getAttribute("data-count");

        ScrollTrigger.create({
            trigger: stat,
            start: "top 85%",
            once: true,
            onEnter: () => {
                gsap.to(stat, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: "power1.out",
                    onUpdate: function() {
                        stat.innerText = Math.ceil(this.targets()[0].innerText) + (stat.innerHTML.includes("%") ? "%" : "+");
                    }
                });
            }
        });
    });

    // Work Cards Stagger
    gsap.from(".project-card", {
        scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 75%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
    });

    // Timeline Items
    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
            },
            x: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // Contact Panel Reveal
    gsap.from(".contact-panel", {
        scrollTrigger: {
            trigger: ".contact-section",
            start: "top 80%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // 3. Mobile Menu Toggle
    const navToggle = document.querySelector(".nav-toggle");
    const menuOverlay = document.querySelector(".menu-overlay");
    const menuClose = document.querySelector(".menu-close");
    const menuLinks = document.querySelectorAll(".menu-items a");

    function toggleMenu() {
        menuOverlay.classList.toggle("active");
        if (menuOverlay.classList.contains("active")) {
            gsap.fromTo(".menu-items a",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2 }
            );
        }
    }

    navToggle.addEventListener("click", toggleMenu);
    menuClose.addEventListener("click", toggleMenu);

    menuLinks.forEach(link => {
        link.addEventListener("click", toggleMenu);
    });

    // 4. 3D Tilt Effect for Glass Panels
    const panels = document.querySelectorAll(".glass-panel, .project-card, .glass-circle");

    // Only on desktop
    if (window.matchMedia("(min-width: 992px)").matches) {
        panels.forEach(panel => {
            panel.addEventListener("mousemove", (e) => {
                const rect = panel.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const xPct = x / rect.width;
                const yPct = y / rect.height;

                const rotateX = (yPct - 0.5) * -10; // Max 5 deg tilt
                const rotateY = (xPct - 0.5) * 10;

                gsap.to(panel, {
                    transformPerspective: 1000,
                    rotationX: rotateX,
                    rotationY: rotateY,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });

            panel.addEventListener("mouseleave", () => {
                gsap.to(panel, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });
    }

});
