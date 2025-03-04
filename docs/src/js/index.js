/**
 * Portfolio Website JavaScript
 * Consolidated and optimized version
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
    
    // Check initial hash and set default if none
    if (window.location.href.indexOf('#') === -1) {
        window.location.href += '#home';
    } else {
        // Make sure home is active if refreshed on another section
        updateActiveNavLink();
    }
    
    // Force layout recalculation to prevent section overlap
    setTimeout(function() {
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
    }, 300);
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
                this.classList.add('active');
                
                // Scroll to target
                const targetId = this.getAttribute('data-target');
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
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
}

// Update active nav button based on visible section
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navButtons = document.querySelectorAll('.nav-button');
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        // Consider a section in view if its top is near the top of viewport
        const isInView = (rect.top <= 150) && (rect.bottom >= 150);
        
        if (isInView && index < navButtons.length && !navButtons[index].id.includes('theme-button')) {
            navButtons.forEach(btn => {
                if (!btn.id.includes('theme-button')) {
                    btn.classList.remove('active');
                }
            });
            navButtons[index].classList.add('active');
        }
    });
}

// Smooth scroll to section
function smoothScrollToSection(targetId, event) {
    // Prevent default if an event was passed
    if (event) {
        event.preventDefault();
    }
    
    // Get the target element
    const target = document.getElementById(targetId);
    if (!target) {
        console.warn(`Target element with ID "${targetId}" not found`);
        return;
    }
    
    // Calculate position
    const headerOffset = 80; // Adjust based on your fixed header height
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = window.pageYOffset + elementPosition - headerOffset;
    
    // Perform the smooth scroll
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
    
    // Update URL hash without scrolling (optional)
    setTimeout(() => {
        history.pushState(null, null, `#${targetId}`);
    }, 10);
    
    // Update the active navigation button
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-target') === targetId) {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
    });
}

// ===== Theme Toggle =====

function initThemeToggle() {
    const themeButton = document.getElementById('theme-button');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const sections = document.getElementsByClassName('section');
    const themeButtonIcon = document.getElementById('theme-icon');
    const activeTheme = themeButtonIcon.classList[1];
    const navbar = document.getElementById('navigation');
    
    for (let i = 0; i < sections.length; i++) {
        if (activeTheme === 'dark-theme') {
            sections[i].classList.remove('dark-theme');
            sections[i].classList.add('light-theme');
            themeButtonIcon.classList.remove('dark-theme');
            themeButtonIcon.classList.add('light-theme');
            navbar.classList.remove('dark-theme');
            navbar.classList.add('light-theme');
            themeButtonIcon.setAttribute('src', './resources/icons/moon.png');
        } else {
            sections[i].classList.remove('light-theme');
            sections[i].classList.add('dark-theme');
            themeButtonIcon.classList.remove('light-theme');
            themeButtonIcon.classList.add('dark-theme');
            navbar.classList.remove('light-theme');
            navbar.classList.add('dark-theme');
            themeButtonIcon.setAttribute('src', './resources/icons/sun.png');
        }
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
    if (nextIndex === allSections.length - 1) {
        scrollIcon.classList.remove('fa-arrow-down');
        scrollIcon.classList.add('fa-arrow-up');
    } else {
        scrollIcon.classList.remove('fa-arrow-up');
        scrollIcon.classList.add('fa-arrow-down');
    }
    
    // Scroll to next section
    smoothScrollToSection(allSections[nextIndex]);
    
    // Update active nav button
    const navButton = document.querySelector(`.nav-button[data-target="${allSections[nextIndex]}"]`);
    if (navButton) {
        const buttons = document.querySelectorAll('.nav-button');
        buttons.forEach(btn => btn.classList.remove('active'));
        navButton.classList.add('active');
    }
}

// ===== Section Size Adjustments =====

function initSectionAdjustments() {
    adjustViewportSizes();
    window.addEventListener('resize', adjustViewportSizes);
}

// Fix viewport sizing issues
function adjustViewportSizes() {
    // Set the viewport height variable for mobile browsers
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Adjust section heights
    const sections = document.querySelectorAll('.section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        // Ensure minimum height
        section.style.minHeight = `${windowHeight}px`;
        
        // Special handling for specific sections
        if (section.id === 'experience') {
            section.style.marginBottom = '40px';
            adjustExperienceSection(section);
        } else if (section.id === 'portfolio') {
            section.style.marginTop = '40px';
        } else if (section.id === 'contact') {
            // Adjust contact section height to avoid footer overlap
            const footer = document.getElementById('footer');
            const footerHeight = footer ? footer.offsetHeight : 0;
            section.style.marginBottom = `${footerHeight}px`;
            
            // Limit contact form height
            const contactContainer = section.querySelector('.contact-container');
            if (contactContainer) {
                const availableHeight = windowHeight - 200;
                contactContainer.style.maxHeight = `${availableHeight}px`;
            }
        }
    });
    
    // Fix footer width
    const footer = document.getElementById('footer');
    if (footer) {
        footer.style.maxWidth = `${document.body.clientWidth}px`;
    }
    
    // Check for elements wider than viewport
    const bodyWidth = document.body.clientWidth;
    document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > bodyWidth) {
            el.style.maxWidth = '100%';
            el.style.boxSizing = 'border-box';
        }
    });
}

// Special adjustments for experience section
// Add this function to your index.js file or replace the existing adjustExperienceSection function

// Fix experience section spacing and layout
function adjustExperienceSection(section) {
    // Ensure we have a section to work with
    if (!section) {
        section = document.getElementById('experience');
        if (!section) return;
    }
    
    // Set minimum height for the timeline container
    const timelineContainer = section.querySelector('.timeline-container');
    if (timelineContainer) {
        // Make sure the timeline container has enough height
        const lastNode = timelineContainer.querySelector('.timeline-node:last-of-type');
        if (lastNode) {
            const lastNodePosition = lastNode.offsetTop + lastNode.offsetHeight;
            // Add some buffer space
            timelineContainer.style.minHeight = `${lastNodePosition + 100}px`;
        }
    }
    
    // Fix spacing between sections
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        // Calculate distance between sections
        const experienceRect = section.getBoundingClientRect();
        const portfolioRect = portfolioSection.getBoundingClientRect();
        
        // If sections are overlapping or too close
        if (portfolioRect.top < experienceRect.bottom + 50) {
            // Add spacer if it doesn't exist
            if (!document.getElementById('experience-portfolio-spacer')) {
                const spacer = document.createElement('div');
                spacer.id = 'experience-portfolio-spacer';
                spacer.style.height = '150px';  // Taller spacer
                spacer.style.width = '100%';
                spacer.style.clear = 'both';
                spacer.style.display = 'block';
                spacer.style.position = 'relative';
                section.appendChild(spacer);
            }
            
            // Set explicit margin on portfolio section
            portfolioSection.style.marginTop = '60px';
        }
    }
    
    // Fix mobile timeline point positioning
    const timelinePoints = section.querySelectorAll('.timeline-point');
    if (window.innerWidth <= 768) {
        timelinePoints.forEach(point => {
            point.style.transform = 'translateX(0)';
        });
    } else {
        timelinePoints.forEach(point => {
            point.style.transform = 'translateX(-50%)';
        });
    }
    
    // Force opacity to 1 on all timeline content
    const timelineContents = section.querySelectorAll('.timeline-content');
    timelineContents.forEach(content => {
        content.style.opacity = '1';
    });
}

// Run this function immediately
document.addEventListener('DOMContentLoaded', function() {
    adjustExperienceSection();
    
    // Also run on window resize
    window.addEventListener('resize', adjustExperienceSection);
    
    // And run again after a delay to handle dynamic content
    setTimeout(adjustExperienceSection, 500);
    setTimeout(adjustExperienceSection, 2000);
});

// ===== Contact Form =====

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const formElements = contactForm.elements;
            let isValid = true;
            
            for (let i = 0; i < formElements.length; i++) {
                if (formElements[i].hasAttribute('required') && !formElements[i].value.trim()) {
                    formElements[i].style.borderColor = 'red';
                    isValid = false;
                } else if (formElements[i].type !== 'submit') {
                    formElements[i].style.borderColor = '';
                }
            }
            
            if (!isValid) return;
            
            // Handle submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            
            // Simulate submission (replace with actual form handling)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(to right, #00c853, #64dd17)';
                
                // Reset form after success
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
                    submitBtn.style.background = 'linear-gradient(to right, #25aae1, #40e495, #30dd8a, #2bb673)';
                }, 2000);
            }, 1500);
        });
    }
}

// ===== Experience Cards =====

function initExperienceCards() {
    // Get all experience cards and timeline elements
    const experienceCards = document.querySelectorAll('.experience-card');
    const timelineContents = document.querySelectorAll('.timeline-content');
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    // Set initial visible state for cards
    timelineContents.forEach(content => {
        content.style.opacity = '1'; // Make cards visible by default
    });
    
    // Add event listeners for card interactions
    experienceCards.forEach(card => {
        card.addEventListener('mousemove', tiltExperienceCard);
        card.addEventListener('mouseleave', resetExperienceCard);
        card.addEventListener('click', toggleCardFlip);
    });
    
    // Add timeline point animations
    animateTimelinePoints();
    
    // Check for visible cards on scroll
    window.addEventListener('scroll', checkTimelineVisibility);
    
    // Initial check for visible cards
    setTimeout(checkTimelineVisibility, 300);
    
    // Trigger initial timeline point animation when section is visible
    window.addEventListener('scroll', function scrollTrigger() {
        const experienceSection = document.getElementById('experience');
        if (!experienceSection) return;
        
        const rect = experienceSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            animateTimelinePoints();
            window.removeEventListener('scroll', scrollTrigger);
        }
    });
}

// Tilt effect for experience cards
function tiltExperienceCard(e) {
    const card = this;
    const cardInner = card.querySelector('.experience-card-inner');
    if (!cardInner) return;
    
    // Skip tilt if card is flipped
    if (cardInner.style.transform && cardInner.style.transform.includes('rotateY(180deg)')) {
        return;
    }
    
    const cardRect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    const centerX = cardRect.left + cardWidth / 2;
    const centerY = cardRect.top + cardHeight / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation values
    const rotateY = (mouseX / (cardWidth / 2)) * 5;
    const rotateX = -(mouseY / (cardHeight / 2)) * 5;
    
    // Apply transformation
    cardInner.style.transition = 'transform 0.1s ease-out';
    cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

// Reset tilt on mouse leave
function resetExperienceCard() {
    const cardInner = this.querySelector('.experience-card-inner');
    if (!cardInner) return;
    
    cardInner.style.transition = 'transform 0.5s ease-out';
    cardInner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
}

// Toggle card flip on click
function toggleCardFlip() {
    const cardInner = this.querySelector('.experience-card-inner');
    if (!cardInner) return;
    
    if (cardInner.style.transform && cardInner.style.transform.includes('rotateY(180deg)')) {
        cardInner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    } else {
        cardInner.style.transform = 'perspective(1000px) rotateX(0) rotateY(180deg)';
    }
}

// Animate timeline points
function animateTimelinePoints() {
    const timelinePoints = document.querySelectorAll('.timeline-point');
    
    timelinePoints.forEach((point, index) => {
        setTimeout(() => {
            point.style.transform = 'translateX(-50%) scale(1.2)';
            point.style.boxShadow = '0 0 15px rgb(57, 252, 155)';
            
            setTimeout(() => {
                point.style.transform = 'translateX(-50%) scale(1)';
                point.style.boxShadow = '0 0 0 4px rgba(57, 252, 155, 0.2)';
            }, 500);
        }, index * 300);
    });
}

// Check which timeline nodes are in view
function checkTimelineVisibility() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    timelineNodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const contentEl = node.querySelector('.timeline-content');
        
        // Consider a node in view if its top is in the bottom 80% of viewport
        const isInView = rect.top <= (window.innerHeight * 0.8) && rect.bottom >= 0;
        
        if (isInView && contentEl) {
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