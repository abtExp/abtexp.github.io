document.addEventListener("DOMContentLoaded", function () {
    // 1. Initialize Lenis (Premium Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP Animations (Discrete & Purposeful)
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entry Animation (Simple Fade Up)
    const heroTl = gsap.timeline();
    heroTl.from(".hero-title .line", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
    })
    .from(".hero-intro", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.5")
    .from(".hero-image-wrapper", {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8");

    // 3. Project Catalog Hover Reveal (Desktop Only)
    const projectRows = document.querySelectorAll(".project-row");
    const previewContainer = document.querySelector(".project-preview");
    const previewImg = document.getElementById("preview-img");

    if (window.matchMedia("(pointer: fine)").matches) {
        projectRows.forEach(row => {
            row.addEventListener("mouseenter", (e) => {
                const imgUrl = row.getAttribute("data-image");
                previewImg.src = imgUrl;

                // Show preview
                gsap.to(previewContainer, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            row.addEventListener("mousemove", (e) => {
                // Move preview with cursor
                gsap.to(previewContainer, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.2, // slight delay for smoothness
                    ease: "power1.out"
                });
            });

            row.addEventListener("mouseleave", () => {
                gsap.to(previewContainer, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    ease: "power2.in"
                });
            });
        });
    }

    // 4. Mobile Menu Logic
    const navToggle = document.querySelector(".nav-toggle");
    const closeMenu = document.querySelector(".close-menu");
    const mobileMenu = document.querySelector(".mobile-menu-overlay");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    function toggleMenu() {
        mobileMenu.classList.toggle("active");
    }

    navToggle.addEventListener("click", toggleMenu);
    closeMenu.addEventListener("click", toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            toggleMenu();
            // Smooth scroll handled by CSS scroll-behavior or Lenis
            const target = document.querySelector(link.getAttribute("href"));
            lenis.scrollTo(target);
        });
    });

    // Desktop Nav Links Smooth Scroll
    document.querySelectorAll(".nav-links a, .nav-logo a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");
            if (href && href !== "#") {
                const target = document.querySelector(href);
                if (target) lenis.scrollTo(target);
            }
        });
    });

    // 5. Sticker Effect (Parallax on Mouse Move for About Image)
    const aboutSection = document.getElementById("about");
    const sticker = document.querySelector(".sticker-img");

    if (aboutSection && sticker && window.matchMedia("(pointer: fine)").matches) {
        aboutSection.addEventListener("mousemove", (e) => {
            const rect = aboutSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(sticker, {
                x: x * 30,
                y: y * 30,
                rotate: 5 + (x * 10),
                duration: 0.5,
                ease: "power1.out"
            });
        });

        aboutSection.addEventListener("mouseleave", () => {
            gsap.to(sticker, {
                x: 0,
                y: 0,
                rotate: 5,
                duration: 0.5
            });
        });
    }
});
