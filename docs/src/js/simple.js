/**
 * FINAL NAVIGATION FIX
 * Using working scroll methods and fixed direction logic
 */

(function() {
    'use strict';
    
    console.log('🎯 FINAL NAVIGATION FIX LOADING...');
    
    // Remove existing listeners
    function clearExistingListeners() {
        const navButtons = document.querySelectorAll('.nav-button');
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
    
    // Apply necessary CSS fixes
    function applyCSSFixes() {
        const css = `
            html { scroll-behavior: smooth !important; }
            #navigation { pointer-events: auto !important; z-index: 999999 !important; }
            .nav-button { pointer-events: auto !important; cursor: pointer !important; }
            #scroll-button { pointer-events: auto !important; cursor: pointer !important; z-index: 999999 !important; }
            #contact-click-button { pointer-events: auto !important; cursor: pointer !important; }
            .section { scroll-margin-top: 100px !important; }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    // Reliable scroll function - using method 2 for nav, method 1 for scroll button
    function scrollToSection(sectionId, useScrollIntoView = false) {
        console.log(`🎯 Scrolling to: ${sectionId} (method: ${useScrollIntoView ? 'scrollIntoView' : 'window.scrollTo'})`);
        
        const element = document.getElementById(sectionId);
        if (!element) {
            console.error(`❌ Section "${sectionId}" not found!`);
            return false;
        }
        
        if (useScrollIntoView) {
            // Method 2 - works for nav buttons
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        } else {
            // Method 1 - works for scroll button
            const offset = 100;
            const targetTop = element.offsetTop - offset;
            window.scrollTo({
                top: Math.max(0, targetTop),
                behavior: 'smooth'
            });
        }
        
        // Update URL
        history.replaceState(null, null, '#' + sectionId);
        
        console.log(`✅ Scroll initiated to ${sectionId}`);
        return true;
    }
    
    // Fixed current section detection
    function getCurrentSection() {
        const sections = ['home', 'about', 'experience', 'portfolio', 'skills', 'contact'];
        const scrollPosition = window.scrollY + (window.innerHeight * 0.3); // Use top 30% of viewport
        
        let currentSection = 'home';
        
        // Check each section from top to bottom
        for (let i = 0; i < sections.length; i++) {
            const element = document.getElementById(sections[i]);
            if (element) {
                const sectionTop = element.offsetTop;
                const sectionBottom = sectionTop + element.offsetHeight;
                
                // If scroll position is within this section
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = sections[i];
                    break;
                }
                
                // If scroll position is past this section, it might be the current one
                if (scrollPosition >= sectionTop) {
                    currentSection = sections[i];
                }
            }
        }
        
        console.log(`📍 Current section: ${currentSection} (scroll: ${Math.round(scrollPosition)})`);
        return currentSection;
    }
    
    // Setup navigation buttons
    function setupNavButtons() {
        const navButtons = document.querySelectorAll('.nav-button[data-target]');
        console.log(`🔘 Setting up ${navButtons.length} nav buttons...`);
        
        navButtons.forEach((button, index) => {
            const target = button.getAttribute('data-target');
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                console.log(`🖱️ Nav button clicked: ${target}`);
                
                // Update active states
                navButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll using method 2 (works for nav buttons)
                scrollToSection(target, true);
                
                // Update scroll arrow after navigation
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
                
                navButtons.forEach(btn => btn.classList.remove('active'));
                const contactNav = document.querySelector('.nav-button[data-target="contact"]');
                if (contactNav) contactNav.classList.add('active');
                
                scrollToSection('contact', true);
                setTimeout(updateScrollArrow, 1000);
            });
        }
    }
    
    // Setup scroll button with FIXED logic
    function setupScrollButton() {
        const scrollButton = document.getElementById('scroll-button');
        if (!scrollButton) return;
        
        console.log('🔄 Setting up scroll button...');
        
        scrollButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            console.log('🔄 Scroll button clicked');
            
            const sections = ['home', 'about', 'experience', 'portfolio', 'skills', 'contact'];
            const currentSection = getCurrentSection();
            const currentIndex = sections.indexOf(currentSection);
            
            console.log(`  📍 Current: ${currentSection} (index: ${currentIndex})`);
            
            // SIMPLE FORWARD PROGRESSION LOGIC
            let nextSection;
            
            if (currentIndex === -1) {
                // If somehow not detected, go to about
                nextSection = 'about';
            } else if (currentIndex === sections.length - 1) {
                // If at last section (contact), go to home
                nextSection = 'home';
            } else {
                // Otherwise, go to next section
                nextSection = sections[currentIndex + 1];
            }
            
            console.log(`  ➡️ Next: ${nextSection}`);
            
            // Update nav active state
            const navButtons = document.querySelectorAll('.nav-button[data-target]');
            navButtons.forEach(btn => btn.classList.remove('active'));
            const nextNav = document.querySelector(`.nav-button[data-target="${nextSection}"]`);
            if (nextNav) nextNav.classList.add('active');
            
            // Scroll using method 1 (works for scroll button)
            scrollToSection(nextSection, false);
            
            // Update arrow after scroll
            setTimeout(updateScrollArrow, 1000);
        });
    }
    
    // Update scroll arrow direction
    function updateScrollArrow() {
        const arrow = document.getElementById('scroll-arrow');
        if (!arrow) return;
        
        const currentSection = getCurrentSection();
        console.log(`🔄 Updating arrow for section: ${currentSection}`);
        
        // Simple logic: show up arrow ONLY when at contact section
        if (currentSection === 'contact') {
            arrow.classList.remove('fa-arrow-down');
            arrow.classList.add('fa-arrow-up');
            console.log('⬆️ Arrow set to UP (at contact section)');
        } else {
            arrow.classList.remove('fa-arrow-up');
            arrow.classList.add('fa-arrow-down');
            console.log('⬇️ Arrow set to DOWN');
        }
    }
    
    // Update active nav on scroll
    function updateActiveNav() {
        const currentSection = getCurrentSection();
        const navButtons = document.querySelectorAll('.nav-button[data-target]');
        
        navButtons.forEach(btn => {
            const target = btn.getAttribute('data-target');
            if (target === currentSection) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Setup scroll monitoring
    function setupScrollMonitoring() {
        let scrollTimeout;
        
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateActiveNav();
                updateScrollArrow();
            }, 150); // Slightly delayed to avoid rapid updates
        });
    }
    
    // Initialize everything
    function initializeNavigation() {
        console.log('🚀 Initializing final navigation...');
        
        try {
            clearExistingListeners();
            applyCSSFixes();
            setupNavButtons();
            setupScrollButton();
            setupScrollMonitoring();
            
            // Set initial states
            setTimeout(() => {
                updateActiveNav();
                updateScrollArrow();
            }, 500);
            
            console.log('✅ Final navigation initialized successfully!');
            
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
    
    // Test functions
    window.testNavButton = function(section) {
        console.log(`🧪 Testing nav button to: ${section}`);
        scrollToSection(section, true);
    };
    
    window.testScrollButton = function() {
        console.log('🧪 Testing scroll button');
        const currentSection = getCurrentSection();
        const sections = ['home', 'about', 'experience', 'portfolio', 'skills', 'contact'];
        const currentIndex = sections.indexOf(currentSection);
        const nextSection = currentIndex === sections.length - 1 ? 'home' : sections[currentIndex + 1];
        
        console.log(`Will scroll from ${currentSection} to ${nextSection}`);
        scrollToSection(nextSection, false);
        setTimeout(updateScrollArrow, 1000);
    };
    
    window.checkCurrentSection = function() {
        const current = getCurrentSection();
        console.log(`Current section: ${current}`);
        updateScrollArrow();
        return current;
    };
    
})();

console.log('🎯 Final Navigation Fix Loaded!');