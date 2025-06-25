/**
 * Portfolio Website JavaScript
 * Fixed version with proper layout management
 */

// Main initialization when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything
    initNavigation();
    initThemeToggle();
    initScrollButton();
    initSectionAdjustments();
    initContactForm();
    initExperienceCards();
    initPortfolioCards();
    initBannerEffects();
    initAboutSection();
    initAboutCardEffects();
    initAboutParallax();
    
    // Check initial hash and set default if none
    if (window.location.href.indexOf('#') === -1) {
        window.location.href += '#home';
    } else {
        updateActiveNavLink();
    }
    
    // Force layout recalculation after everything loads
    setTimeout(function() {
        adjustViewportSizes();
        adjustExperienceSection();
    }, 100);
});

// ===== Navigation Functions =====

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    // Set up navigation button clicks
    navButtons.forEach(button => {
        if (!button.id.includes('theme-button')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active button
                navButtons.forEach(btn => {
                    if (!btn.id.includes('theme-button')) {
                        btn.classList.remove('active');
                    }
                });

                button.classList.add('active');
                
                // Scroll to target
                const targetId = button.getAttribute('data-target');
                smoothScrollToSection(targetId);
            });
        }
    });
    
    // Make the contact button work
    const contactButton = document.getElementById('contact-click-button');
    if (contactButton) {
        contactButton.addEventListener('click', function() {
            const contactNavButton = document.querySelector('.nav-button[data-target="contact"]');
            if (contactNavButton) {
                contactNavButton.click();
            } else {
                smoothScrollToSection('contact');
            }
        });
    }
    
    // Update active link on scroll
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    updateActiveNavLink(); // Initial call
}

// Throttle function for better performance
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

// Update active nav button based on visible section
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navButtons = document.querySelectorAll('.nav-button');
    const scrollPosition = window.scrollY + 200; // Offset for better detection
    
    let currentSection = '';
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    // Update active button
    navButtons.forEach((btn, index) => {
        if (!btn.id.includes('theme-button')) {
            const targetId = btn.getAttribute('data-target');
            if (targetId === currentSection) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });
}

// Smooth scroll to section with proper offset
function smoothScrollToSection(targetId, event) {
    if (event) {
        event.preventDefault();
    }

    const target = document.getElementById(targetId);
    if (!target) {
        console.warn(`Target element with ID "${targetId}" not found`);
        return;
    }

    const headerOffset = 100; // Increased offset for better positioning
    const offsetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
        top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative position
        behavior: 'smooth'
    });

    // Update URL without causing scroll
    history.replaceState(null, null, `#${targetId}`);
}

// ===== Theme Toggle =====

function initThemeToggle() {
    const themeButton = document.getElementById('theme-button');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const container = document.getElementById('container');
    const sections = document.getElementsByClassName('section');
    const themeButtonIcon = document.getElementById('theme-icon');
    const navbar = document.getElementById('navigation');
    
    const isDark = container.classList.contains('dark-theme');
    
    // Toggle container theme
    if (isDark) {
        container.classList.remove('dark-theme');
        container.classList.add('light-theme');
        themeButtonIcon.setAttribute('src', './resources/icons/moon.png');
    } else {
        container.classList.remove('light-theme');
        container.classList.add('dark-theme');
        themeButtonIcon.setAttribute('src', './resources/icons/sun.png');
    }
    
    // Toggle all sections
    for (let i = 0; i < sections.length; i++) {
        if (isDark) {
            sections[i].classList.remove('dark-theme');
            sections[i].classList.add('light-theme');
        } else {
            sections[i].classList.remove('light-theme');
            sections[i].classList.add('dark-theme');
        }
    }
    
    // Toggle navbar
    if (isDark) {
        navbar.classList.remove('dark-theme');
        navbar.classList.add('light-theme');
        themeButtonIcon.classList.remove('dark-theme');
        themeButtonIcon.classList.add('light-theme');
    } else {
        navbar.classList.remove('light-theme');
        navbar.classList.add('dark-theme');
        themeButtonIcon.classList.remove('light-theme');
        themeButtonIcon.classList.add('dark-theme');
    }
}

// ===== Scroll Button =====

function initScrollButton() {
    const scrollButton = document.getElementById('scroll-button');
    if (scrollButton) {
        scrollButton.addEventListener('click', scrollToNextSection);
    }
}

function scrollToNextSection() {
    const currentLocation = window.location.href;
    const scrollIcon = document.getElementById('scroll-arrow');
    const currentSection = currentLocation.substring(currentLocation.lastIndexOf('#') + 1);
    const allSections = ['home', 'about', 'experience', 'portfolio', 'skills', 'contact'];
    
    const currentIndex = allSections.indexOf(currentSection);
    let nextIndex = currentIndex + 1;
    
    if (nextIndex >= allSections.length) {
        nextIndex = 0;
    }
    
    // Update icon direction
    if (nextIndex === 0) {
        scrollIcon.classList.remove('fa-arrow-down');
        scrollIcon.classList.add('fa-arrow-up');
    } else {
        scrollIcon.classList.remove('fa-arrow-up');
        scrollIcon.classList.add('fa-arrow-down');
    }
    
    // Scroll to next section
    smoothScrollToSection(allSections[nextIndex]);
}

// ===== Section Size Adjustments =====

function initSectionAdjustments() {
    adjustViewportSizes();
    window.addEventListener('resize', debounce(adjustViewportSizes, 250));
    window.addEventListener('orientationchange', function() {
        setTimeout(adjustViewportSizes, 500);
    });
}

// Debounce function for resize events
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

// Fix viewport sizing issues
function adjustViewportSizes() {
    // Set CSS custom property for viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Ensure sections don't overlap
    ensureSectionSeparation();
    
    // Fix any layout issues
    fixLayoutIssues();
}

// Ensure proper section separation
function ensureSectionSeparation() {
    const sections = ['experience', 'portfolio', 'skills', 'contact'];
    
    sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Clear any transforms that might affect positioning
        section.style.transform = '';
        
        // Ensure section is properly positioned
        section.style.position = 'relative';
        section.style.zIndex = index + 1;
        
        // Add proper margins based on section
        switch(sectionId) {
            case 'experience':
                section.style.marginBottom = '0';
                section.style.paddingBottom = '60px';
                break;
            case 'portfolio':
                section.style.marginTop = '80px';
                section.style.paddingTop = '60px';
                break;
            case 'skills':
                section.style.marginTop = '60px';
                section.style.paddingTop = '60px';
                break;
            case 'contact':
                section.style.marginTop = '60px';
                section.style.marginBottom = '150px';
                break;
        }
    });
    
    // Force clear any floated elements
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        timelineContainer.style.overflow = 'visible';
        // Add clearfix
        if (!timelineContainer.querySelector('.clearfix-after')) {
            const clearDiv = document.createElement('div');
            clearDiv.className = 'clearfix-after';
            clearDiv.style.clear = 'both';
            clearDiv.style.height = '1px';
            clearDiv.style.width = '100%';
            timelineContainer.appendChild(clearDiv);
        }
    }
}

// Fix general layout issues
function fixLayoutIssues() {
    // Fix footer positioning
    const footer = document.getElementById('footer');
    if (footer) {
        footer.style.maxWidth = '100%';
        footer.style.width = '100%';
        footer.style.position = 'relative';
        footer.style.clear = 'both';
    }
    
    // Fix navigation background on scroll
    const navigation = document.getElementById('navigation');
    if (navigation && window.scrollY > 50) {
        navigation.style.background = 'rgba(238, 238, 238, 0.95)';
        navigation.style.backdropFilter = 'blur(10px)';
    }
    
    // Ensure images don't overflow
    document.querySelectorAll('img').forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });
}

// Special adjustments for experience section
function adjustExperienceSection() {
    const section = document.getElementById('experience');
    if (!section) return;
    
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;
    
    // Get all timeline nodes
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    // Calculate required height
    let maxHeight = 0;
    timelineNodes.forEach(node => {
        const nodeBottom = node.offsetTop + node.offsetHeight;
        maxHeight = Math.max(maxHeight, nodeBottom);
    });
    
    // Set minimum height with buffer
    timelineContainer.style.minHeight = `${maxHeight + 100}px`;
    
    // Ensure timeline content is visible
    const timelineContents = document.querySelectorAll('.timeline-content');
    timelineContents.forEach(content => {
        content.style.opacity = '1';
        content.style.position = 'relative';
    });
    
    // Fix mobile timeline positioning
    if (window.innerWidth <= 768) {
        const timelinePoints = document.querySelectorAll('.timeline-point');
        timelinePoints.forEach(point => {
            point.style.transform = 'translateX(0)';
        });
    }
    
    // Add spacer between experience and portfolio if needed
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        const experienceRect = section.getBoundingClientRect();
        const portfolioRect = portfolioSection.getBoundingClientRect();
        
        // If sections are too close, adjust spacing
        if (Math.abs(portfolioRect.top - experienceRect.bottom) < 100) {
            portfolioSection.style.marginTop = '120px';
        }
    }
}

// ===== Contact Form =====

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formElements = form.elements;
    let isValid = true;
    
    // Validate form
    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        if (element.hasAttribute('required') && !element.value.trim()) {
            element.style.borderColor = '#ff4757';
            element.style.boxShadow = '0 0 5px rgba(255, 71, 87, 0.5)';
            isValid = false;
        } else if (element.type !== 'submit') {
            element.style.borderColor = '';
            element.style.boxShadow = '';
        }
    }
    
    if (!isValid) {
        // Show error message
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Handle submission
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    
    // Simulate submission
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #00c853, #64dd17)';
        
        showNotification('Message sent successfully!', 'success');
        
        // Reset form
        setTimeout(() => {
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 2000);
    }, 1500);
}

// Show notification
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
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// ===== Experience Cards =====

function initExperienceCards() {
    const experienceCards = document.querySelectorAll('.experience-card');
    const timelineContents = document.querySelectorAll('.timeline-content');
    
    // Ensure cards are visible
    timelineContents.forEach(content => {
        content.style.opacity = '1';
    });
    
    // Add interaction handlers
    experienceCards.forEach(card => {
        card.addEventListener('mousemove', tiltExperienceCard);
        card.addEventListener('mouseleave', resetExperienceCard);
        card.addEventListener('click', toggleCardFlip);
    });
    
    // Initialize timeline animations
    setTimeout(() => {
        checkTimelineVisibility();
        animateTimelinePoints();
    }, 500);
    
    window.addEventListener('scroll', throttle(checkTimelineVisibility, 100));
}

function tiltExperienceCard(e) {
    const card = this;
    const cardInner = card.querySelector('.experience-card-inner');
    if (!cardInner || cardInner.style.transform.includes('rotateY(180deg)')) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -10;
    const rotateY = (x - centerX) / centerX * 10;
    
    cardInner.style.transition = 'transform 0.1s ease-out';
    cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetExperienceCard() {
    const cardInner = this.querySelector('.experience-card-inner');
    if (!cardInner) return;
    
    cardInner.style.transition = 'transform 0.5s ease-out';
    cardInner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
}

function toggleCardFlip() {
    const cardInner = this.querySelector('.experience-card-inner');
    if (!cardInner) return;
    
    const isFlipped = cardInner.style.transform.includes('rotateY(180deg)');
    cardInner.style.transition = 'transform 0.6s ease';
    cardInner.style.transform = isFlipped 
        ? 'perspective(1000px) rotateX(0) rotateY(0)' 
        : 'perspective(1000px) rotateX(0) rotateY(180deg)';
}

function animateTimelinePoints() {
    const timelinePoints = document.querySelectorAll('.timeline-point');
    
    timelinePoints.forEach((point, index) => {
        setTimeout(() => {
            point.style.transition = 'all 0.5s ease';
            point.style.transform = 'translateX(-50%) scale(1.3)';
            point.style.boxShadow = '0 0 20px rgb(57, 252, 155)';
            
            setTimeout(() => {
                point.style.transform = 'translateX(-50%) scale(1)';
                point.style.boxShadow = '0 0 0 4px rgba(57, 252, 155, 0.2)';
            }, 300);
        }, index * 200);
    });
}

function checkTimelineVisibility() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    timelineNodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0;
        
        const contentEl = node.querySelector('.timeline-content');
        if (isInView && contentEl && !contentEl.classList.contains('in-view')) {
            contentEl.classList.add('in-view');
        }
    });
}

// ===== Portfolio Cards =====

function initPortfolioCards() {
    const portfolioCards = document.querySelectorAll('.project-card');
    
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// ===== Banner Effects =====

function initBannerEffects() {
    const banner = document.getElementById('banner');
    if (banner) {
        banner.addEventListener('mouseover', toggleNeonEffect);
        banner.addEventListener('mouseout', toggleNeonEffect);
    }
}

function toggleNeonEffect() {
    const lightsources = document.getElementsByClassName('lightsource');
    for (let i = 0; i < lightsources.length; i++) {
        lightsources[i].classList.toggle('neon');
    }
}

// Run adjustments periodically to ensure layout stability
setInterval(() => {
    if (document.visibilityState === 'visible') {
        adjustExperienceSection();
    }
}, 5000);


// About Section Animation JavaScript
// Add this to your existing index.js file

// Initialize about section animations
function initAboutSection() {
    // Check for about cards visibility on scroll
    window.addEventListener('scroll', throttle(checkAboutCardsVisibility, 100));
    
    // Initial check when page loads
    setTimeout(checkAboutCardsVisibility, 500);
}

// Check which about cards are in view
function checkAboutCardsVisibility() {
    const aboutCards = document.querySelectorAll('.about-card');
    
    aboutCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
        
        if (isInView && !card.classList.contains('in-view')) {
            // Add a small delay for staggered animation
            setTimeout(() => {
                card.classList.add('in-view');
            }, index * 100);
        }
    });
}

// Add hover effects for about cards
function initAboutCardEffects() {
    const aboutCards = document.querySelectorAll('.about-card');
    
    aboutCards.forEach(card => {
        // Add tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;
            
            this.style.transform = `translateY(-10px) scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Add click effect
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Parallax effect for about avatar
function initAboutParallax() {
    const aboutAvatar = document.querySelector('.about-avatar');
    if (!aboutAvatar) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const aboutSection = document.getElementById('about');
        
        if (aboutSection) {
            const aboutTop = aboutSection.offsetTop;
            const aboutHeight = aboutSection.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Check if about section is in view
            if (scrolled + windowHeight > aboutTop && scrolled < aboutTop + aboutHeight) {
                const parallaxSpeed = (scrolled - aboutTop) * 0.1;
                aboutAvatar.style.transform = `translateY(${parallaxSpeed}px)`;
            }
        }
    });
}
// Add this to your existing main initialization function
// Add these lines to your existing initNavigation() or main init function:
/*
// Add this inside your main DOMContentLoaded event listener:
initAboutSection();
initAboutCardEffects();
initAboutParallax();
*/
