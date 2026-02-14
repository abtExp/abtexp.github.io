/**
 * COMPLETE NAVIGATION WITH HAMBURGER MENU
 * Integrates hamburger menu with existing navigation system
 */

(function() {
    'use strict';

    console.log('🍔 HAMBURGER NAVIGATION LOADING...');

    let isMobileMenuOpen = false;

    // Remove existing listeners
    function clearExistingListeners() {
        const navButtons = document.querySelectorAll('.nav-button, .mobile-nav-item');
        navButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        });

        const scrollButton = document.getElementById('scroll-button');
        if (scrollButton) {
            const newScrollButton = scrollButton.cloneNode(true);
            scrollButton.parentNode.replaceChild(newScrollButton, scrollButton);
        }

        const contactButton = document.getElementById('contact-click-button');
        if (contactButton) {
            const newContactButton = contactButton.cloneNode(true);
            contactButton.parentNode.replaceChild(newContactButton, contactButton);
        }
    }

    // Apply CSS fixes
    function applyCSSFixes() {
        const css = `
            html { scroll-behavior: smooth !important; }
            #navigation { pointer-events: auto !important; z-index: 100000 !important; }
            .nav-button { pointer-events: auto !important; cursor: pointer !important; }
            .mobile-nav-item { pointer-events: auto !important; cursor: pointer !important; }
            .hamburger-menu { pointer-events: auto !important; cursor: pointer !important; }
            #scroll-button { pointer-events: auto !important; cursor: pointer !important; z-index: 99998 !important; }
            #contact-click-button { pointer-events: auto !important; cursor: pointer !important; }
            .section { scroll-margin-top: 100px !important; }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Scroll function (same as before)
    function scrollToSection(sectionId, useScrollIntoView = false) {
        console.log(`🎯 Scrolling to: ${sectionId}`);

        const element = document.getElementById(sectionId);
        if (!element) {
            console.error(`❌ Section "${sectionId}" not found!`);
            return false;
        }

        if (useScrollIntoView) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        } else {
            const offset = 100;
            const targetTop = element.offsetTop - offset;
            window.scrollTo({
                top: Math.max(0, targetTop),
                behavior: 'smooth'
            });
        }

        history.replaceState(null, null, '#' + sectionId);

        // Close mobile menu if open
        if (isMobileMenuOpen) {
            closeMobileMenu();
        }

        console.log(`✅ Scroll initiated to ${sectionId}`);
        return true;
    }

    // Current section detection (same as before)
    function getCurrentSection() {
        const sections = ['home', 'about', 'experience', 'portfolio', 'skills', 'contact'];
        const scrollPosition = window.scrollY + (window.innerHeight * 0.3);

        let currentSection = 'home';

        for (let i = 0; i < sections.length; i++) {
            const element = document.getElementById(sections[i]);
            if (element) {
                const sectionTop = element.offsetTop;
                const sectionBottom = sectionTop + element.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = sections[i];
                    break;
                }

                if (scrollPosition >= sectionTop) {
                    currentSection = sections[i];
                }
            }
        }

        return currentSection;
    }

    // Open mobile menu
    function openMobileMenu() {
        console.log('📱 Opening mobile menu');

        const hamburger = document.getElementById('hamburger-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        const menu = document.getElementById('mobile-menu');

        if (hamburger) hamburger.classList.add('active');
        if (overlay) overlay.classList.add('active');
        if (menu) menu.classList.add('active');

        document.body.classList.add('mobile-menu-open');
        isMobileMenuOpen = true;

        // Update active state in mobile menu
        updateMobileMenuActiveState();
    }

    // Close mobile menu
    function closeMobileMenu() {
        console.log('📱 Closing mobile menu');

        const hamburger = document.getElementById('hamburger-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        const menu = document.getElementById('mobile-menu');

        if (hamburger) hamburger.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (menu) menu.classList.remove('active');

        document.body.classList.remove('mobile-menu-open');
        isMobileMenuOpen = false;
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        if (isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Update mobile menu active state
    function updateMobileMenuActiveState() {
        const currentSection = getCurrentSection();
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

        mobileNavItems.forEach(item => {
            const target = item.getAttribute('data-target');
            if (target === currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Setup hamburger menu
    function setupHamburgerMenu() {
        const hamburgerButton = document.getElementById('hamburger-menu');
        const overlay = document.getElementById('mobile-menu-overlay');

        if (hamburgerButton) {
            hamburgerButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                toggleMobileMenu();
            });
        }

        // Close menu when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeMobileMenu();
            });
        }

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });

        console.log('🍔 Hamburger menu setup complete');
    }

    // Setup mobile navigation items
    function setupMobileNavigation() {
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-target]');
        console.log(`📱 Setting up ${mobileNavItems.length} mobile nav items...`);

        mobileNavItems.forEach((item, index) => {
            const target = item.getAttribute('data-target');

            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                console.log(`📱 Mobile nav clicked: ${target}`);

                // Update active states for both desktop and mobile
                updateAllActiveStates(target);

                // Scroll to section
                scrollToSection(target, true);

                // Update scroll arrow
                setTimeout(updateScrollArrow, 1000);
            });
        });
    }

    // Setup desktop navigation
    function setupDesktopNavigation() {
        const navButtons = document.querySelectorAll('#navigation .nav-button[data-target]');
        console.log(`🖥️ Setting up ${navButtons.length} desktop nav buttons...`);

        navButtons.forEach((button, index) => {
            const target = button.getAttribute('data-target');

            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                console.log(`🖥️ Desktop nav clicked: ${target}`);

                // Update active states for both desktop and mobile
                updateAllActiveStates(target);

                // Scroll to section
                scrollToSection(target, true);

                // Update scroll arrow
                setTimeout(updateScrollArrow, 1000);
            });
        });

        // Contact button in home section
        const contactButton = document.getElementById('contact-click-button');
        if (contactButton) {
            contactButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                console.log('📞 Contact button clicked');

                updateAllActiveStates('contact');
                scrollToSection('contact', true);
                setTimeout(updateScrollArrow, 1000);
            });
        }
    }

    // Update active states for both desktop and mobile
    function updateAllActiveStates(targetSection) {
        // Desktop nav buttons
        const navButtons = document.querySelectorAll('#navigation .nav-button[data-target]');
        navButtons.forEach(btn => {
            const target = btn.getAttribute('data-target');
            if (target === targetSection) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Mobile nav items
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-target]');
        mobileNavItems.forEach(item => {
            const target = item.getAttribute('data-target');
            if (target === targetSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Setup theme toggle
    function setupThemeToggle() {
        const desktopThemeBtn = document.getElementById('theme-button');
        const mobileThemeBtn = document.getElementById('mobile-theme-button');

        function toggleTheme() {
            const container = document.getElementById('container');
            const sections = document.getElementsByClassName('section');
            const navbar = document.getElementById('navigation');
            const desktopIcon = document.getElementById('theme-icon');
            const mobileIcon = document.getElementById('mobile-theme-icon');

            const isDark = container.classList.contains('dark-theme');

            if (isDark) {
                // Switch to light theme
                container.className = 'light-theme';
                navbar.className = 'horizontal-list light-theme';

                if (desktopIcon) desktopIcon.src = './resources/icons/moon.png';
                if (mobileIcon) mobileIcon.src = './resources/icons/moon.png';

                for (let i = 0; i < sections.length; i++) {
                    sections[i].className = 'section light-theme';
                }
            } else {
                // Switch to dark theme
                container.className = 'dark-theme';
                navbar.className = 'horizontal-list dark-theme';

                if (desktopIcon) desktopIcon.src = './resources/icons/sun.png';
                if (mobileIcon) mobileIcon.src = './resources/icons/sun.png';

                for (let i = 0; i < sections.length; i++) {
                    sections[i].className = 'section dark-theme';
                }
            }
        }

        if (desktopThemeBtn) {
            desktopThemeBtn.addEventListener('click', toggleTheme);
        }

        if (mobileThemeBtn) {
            mobileThemeBtn.addEventListener('click', function() {
                toggleTheme();
                // Close mobile menu after theme change
                setTimeout(closeMobileMenu, 300);
            });
        }
    }

    // Setup scroll button (same as before)
    function setupScrollButton() {
        const scrollButton = document.getElementById('scroll-button');
        if (!scrollButton) return;

        scrollButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            const sections = ['home', 'about', 'experience', 'portfolio', 'skills', 'contact'];
            const currentSection = getCurrentSection();
            const currentIndex = sections.indexOf(currentSection);

            let nextSection;
            if (currentIndex === -1) {
                nextSection = 'about';
            } else if (currentIndex === sections.length - 1) {
                nextSection = 'home';
            } else {
                nextSection = sections[currentIndex + 1];
            }

            updateAllActiveStates(nextSection);
            scrollToSection(nextSection, false);
            setTimeout(updateScrollArrow, 1000);
        });
    }

    // Update scroll arrow
    function updateScrollArrow() {
        const arrow = document.getElementById('scroll-arrow');
        if (!arrow) return;

        const currentSection = getCurrentSection();

        if (currentSection === 'contact') {
            arrow.classList.remove('fa-arrow-down');
            arrow.classList.add('fa-arrow-up');
        } else {
            arrow.classList.remove('fa-arrow-up');
            arrow.classList.add('fa-arrow-down');
        }
    }

    // Setup scroll monitoring
    function setupScrollMonitoring() {
        let scrollTimeout;

        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const currentSection = getCurrentSection();
                updateAllActiveStates(currentSection);
                updateScrollArrow();
            }, 150);
        });
    }

    // Initialize everything
    function initializeNavigation() {
        console.log('🚀 Initializing hamburger navigation...');

        try {
            clearExistingListeners();
            applyCSSFixes();
            setupHamburgerMenu();
            setupMobileNavigation();
            setupDesktopNavigation();
            setupThemeToggle();
            setupScrollButton();
            setupScrollMonitoring();

            // Set initial states
            setTimeout(() => {
                const currentSection = getCurrentSection();
                updateAllActiveStates(currentSection);
                updateScrollArrow();
            }, 500);

            console.log('✅ Hamburger navigation initialized successfully!');

        } catch (error) {
            console.error('❌ Navigation initialization failed:', error);
        }
    }

    // Wait for DOM and execute
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNavigation);
    } else {
        initializeNavigation();
    }

    // Global functions for testing
    window.testMobileMenu = function() {
        toggleMobileMenu();
    };

    window.closeMobileMenuTest = function() {
        closeMobileMenu();
    };

})();

console.log('🍔 Hamburger Navigation Loaded!');