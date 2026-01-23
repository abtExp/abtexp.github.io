/**
 * Unified Application Script
 * Consolidates navigation, animations, and interaction logic.
 */

(function() {
    'use strict';

    // ==========================================
    // State & Constants
    // ==========================================
    let isMobileMenuOpen = false;
    const SECTIONS = ['home', 'about', 'experience', 'portfolio', 'skills', 'contact'];

    // ==========================================
    // Initialization
    // ==========================================
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Initializing Application...');

        // Core functionality
        initNavigation();
        initThemeToggle();
        initScrollButton();

        // Layout & Responsiveness
        initSectionAdjustments();

        // Section-specific logic
        initBannerEffects();      // Home
        initAboutSection();       // About
        initExperienceSection();  // Experience
        initPortfolioSection();   // Portfolio
        initSkillsSection();      // Skills
        initContactSection();     // Contact

        // Scroll monitoring for active link highlighting
        window.addEventListener('scroll', throttle(() => {
            updateActiveNavLink();
            updateScrollArrow();
            checkTimelineVisibility();
            checkAboutCardsVisibility();
        }, 100));

        // Initial checks
        setTimeout(() => {
            adjustViewportSizes();
            updateActiveNavLink();
            updateScrollArrow();
            checkTimelineVisibility();
            checkAboutCardsVisibility();
        }, 500);
    });

    // ==========================================
    // Utilities
    // ==========================================
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            background: ${type === 'error' ? '#ff4757' : '#2ed573'};
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // ==========================================
    // Navigation & Scrolling
    // ==========================================
    function initNavigation() {
        // Desktop Navigation
        const navButtons = document.querySelectorAll('#navigation .nav-button[data-target]');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = btn.getAttribute('data-target');
                scrollToSection(target);
            });
        });

        // Mobile Hamburger Menu
        const hamburgerBtn = document.getElementById('hamburger-menu');
        const overlay = document.getElementById('mobile-menu-overlay');

        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleMobileMenu();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', closeMobileMenu);
        }

        // Mobile Nav Items
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-target]');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('data-target');
                scrollToSection(target);
                closeMobileMenu();
            });
        });

        // Contact Button in Home Section
        const contactBtn = document.getElementById('contact-click-button');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => scrollToSection('contact'));
        }
    }

    function toggleMobileMenu() {
        if (isMobileMenuOpen) closeMobileMenu();
        else openMobileMenu();
    }

    function openMobileMenu() {
        const hamburger = document.getElementById('hamburger-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        const menu = document.getElementById('mobile-menu');

        if (hamburger) hamburger.classList.add('active');
        if (overlay) overlay.classList.add('active');
        if (menu) menu.classList.add('active');

        document.body.classList.add('mobile-menu-open');
        isMobileMenuOpen = true;
        updateActiveNavLink(); // Update active state in menu
    }

    function closeMobileMenu() {
        const hamburger = document.getElementById('hamburger-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        const menu = document.getElementById('mobile-menu');

        if (hamburger) hamburger.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (menu) menu.classList.remove('active');

        document.body.classList.remove('mobile-menu-open');
        isMobileMenuOpen = false;
    }

    function scrollToSection(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
        });

        history.replaceState(null, null, `#${targetId}`);
        updateActiveStates(targetId);
    }

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + (window.innerHeight * 0.3);
        let currentSection = 'home';

        for (const sectionId of SECTIONS) {
            const element = document.getElementById(sectionId);
            if (element) {
                const top = element.offsetTop;
                const height = element.offsetHeight;
                if (scrollPosition >= top && scrollPosition < top + height) {
                    currentSection = sectionId;
                    break;
                }
            }
        }
        updateActiveStates(currentSection);
        return currentSection;
    }

    function updateActiveStates(activeId) {
        // Desktop
        document.querySelectorAll('#navigation .nav-button').forEach(btn => {
            if (btn.getAttribute('data-target') === activeId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Mobile
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            if (item.getAttribute('data-target') === activeId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function initThemeToggle() {
        const toggleBtn = document.getElementById('theme-button');
        const mobileToggleBtn = document.getElementById('mobile-theme-button');

        const performToggle = () => {
            const container = document.getElementById('container');
            const nav = document.getElementById('navigation');
            const icon = document.getElementById('theme-icon');
            const mobileIcon = document.getElementById('mobile-theme-icon');
            const sections = document.querySelectorAll('.section');

            const isDark = container.classList.contains('dark-theme');

            if (isDark) {
                // Switch to Light
                container.classList.replace('dark-theme', 'light-theme');
                if (nav) nav.classList.replace('dark-theme', 'light-theme');
                sections.forEach(s => s.classList.replace('dark-theme', 'light-theme'));
                if (icon) icon.src = './resources/icons/moon.png';
                if (mobileIcon) mobileIcon.src = './resources/icons/moon.png';
            } else {
                // Switch to Dark
                container.classList.replace('light-theme', 'dark-theme');
                if (nav) nav.classList.replace('light-theme', 'dark-theme');
                sections.forEach(s => s.classList.replace('light-theme', 'dark-theme'));
                if (icon) icon.src = './resources/icons/sun.png';
                if (mobileIcon) mobileIcon.src = './resources/icons/sun.png';
            }
        };

        if (toggleBtn) toggleBtn.addEventListener('click', performToggle);
        if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', performToggle);
    }

    function initScrollButton() {
        const btn = document.getElementById('scroll-button');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const current = updateActiveNavLink(); // Get current based on scroll
            const idx = SECTIONS.indexOf(current);
            const nextIdx = (idx + 1) % SECTIONS.length;
            scrollToSection(SECTIONS[nextIdx]);
        });
    }

    function updateScrollArrow() {
        const arrow = document.getElementById('scroll-arrow');
        if (!arrow) return;

        // Simple logic: if near bottom or contact section, point up
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= documentHeight - 100) {
            arrow.className = 'fa-solid fa-arrow-up';
        } else {
            arrow.className = 'fa-solid fa-arrow-down';
        }
    }

    // ==========================================
    // Layout Fixes
    // ==========================================
    function initSectionAdjustments() {
        adjustViewportSizes();
        window.addEventListener('resize', debounce(adjustViewportSizes, 200));
    }

    function adjustViewportSizes() {
        // Fix for mobile 100vh issue
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // Ensure section spacing
        const experience = document.getElementById('experience');
        const portfolio = document.getElementById('portfolio');

        if (experience && portfolio) {
            const expRect = experience.getBoundingClientRect();
            // Dynamic adjustment if needed
        }
    }

    // ==========================================
    // Section Specific Logic
    // ==========================================

    // --- HOME ---
    function initBannerEffects() {
        const banner = document.getElementById('banner');
        if (!banner) return;

        banner.addEventListener('mouseenter', () => {
            document.querySelectorAll('.lightsource').forEach(el => el.classList.add('neon'));
        });
        banner.addEventListener('mouseleave', () => {
            document.querySelectorAll('.lightsource').forEach(el => el.classList.remove('neon'));
        });
    }

    // --- ABOUT (Merged from about.js) ---
    function initAboutSection() {
        initAboutCardEffects();
        initAboutAvatarEffect();
        initAboutParallax();
    }

    function initAboutCardEffects() {
        const cards = document.querySelectorAll('.about-card');
        cards.forEach(card => {
            // Tilt Effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });
    }

    function checkAboutCardsVisibility() {
        const cards = document.querySelectorAll('.about-card');
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.85 && rect.bottom >= 0) {
                setTimeout(() => card.classList.add('in-view'), index * 100);
            }
        });
    }

    function initAboutAvatarEffect() {
        const avatar = document.querySelector('.about-avatar');
        if (avatar) {
            avatar.addEventListener('mouseenter', () => {
                avatar.style.transform = 'scale(1.1) rotate(5deg)';
            });
            avatar.addEventListener('mouseleave', () => {
                avatar.style.transform = 'scale(1) rotate(0deg)';
            });
        }
    }

    function initAboutParallax() {
        const section = document.getElementById('about');
        const avatar = document.querySelector('.about-avatar');
        if (!section || !avatar) return;

        window.addEventListener('scroll', () => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scroll = window.pageYOffset;
                const speed = (scroll - section.offsetTop) * 0.1;
                avatar.style.transform = `translateY(${speed}px)`;
            }
        });
    }

    // --- EXPERIENCE ---
    function initExperienceSection() {
        const cards = document.querySelectorAll('.experience-card');
        cards.forEach(card => {
            // Flip on click
            card.addEventListener('click', function() {
                const inner = this.querySelector('.experience-card-inner');
                if (inner) {
                    const currentTransform = inner.style.transform;
                    if (currentTransform.includes('rotateY(180deg)')) {
                        inner.style.transform = 'perspective(1000px) rotateY(0deg)';
                    } else {
                        inner.style.transform = 'perspective(1000px) rotateY(180deg)';
                    }
                }
            });
        });
    }

    function checkTimelineVisibility() {
        const nodes = document.querySelectorAll('.timeline-node');
        nodes.forEach(node => {
            const rect = node.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0) {
                const content = node.querySelector('.timeline-content');
                if (content) content.classList.add('in-view');

                // Animate left/right containers
                const left = node.querySelector('.timeline-left');
                const right = node.querySelector('.timeline-right');
                if (left) left.classList.add('in-view');
                if (right) right.classList.add('in-view');
            }
        });
    }

    // --- PORTFOLIO ---
    function initPortfolioSection() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => card.style.zIndex = '10');
            card.addEventListener('mouseleave', () => card.style.zIndex = '1');
        });
    }

    // --- SKILLS (Merged from tilt.js) ---
    function initSkillsSection() {
        const cards = document.querySelectorAll('.skill-container');
        cards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const rotateX = (y / (rect.height / 2)) * -10; // Inverted for natural feel
                const rotateY = (x / (rect.width / 2)) * 10;

                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

                const list = this.querySelector('.skill-middle-container');
                if (list) {
                    list.style.transform = `translateZ(20px) scale(1.02)`;
                }
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                const list = this.querySelector('.skill-middle-container');
                if (list) {
                    list.style.transform = 'translateZ(0) scale(1)';
                }
            });
        });
    }

    // --- CONTACT ---
    function initContactSection() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmission);
        }
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        const btn = e.target.querySelector('.submit-btn');
        const originalText = btn.innerHTML;

        // Basic validation check
        const inputs = e.target.querySelectorAll('input[required], textarea[required]');
        let valid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) valid = false;
        });

        if (!valid) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        // Simulate API call
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
            showNotification('Message sent successfully!', 'success');
            e.target.reset();

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }, 2000);
        }, 1500);
    }

})();
