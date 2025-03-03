// Add this function to your index.js file to fix viewport sizing issues
function adjustViewportHeight() {
    // Set the viewport height for mobile browsers
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Make sure footer doesn't cause overflow
    const footer = document.getElementById('footer');
    if (footer) {
        footer.style.maxWidth = `${document.body.clientWidth}px`;
    }
    
    // Check for any elements extending beyond viewport width
    const allElements = document.querySelectorAll('*');
    const bodyWidth = document.body.clientWidth;
    
    allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > bodyWidth) {
            // Apply fix to overly wide elements
            el.style.maxWidth = '100%';
            el.style.boxSizing = 'border-box';
        }
    });
}

// Run on page load and whenever the window is resized
window.addEventListener('load', adjustViewportHeight);
window.addEventListener('resize', adjustViewportHeight);

// Improved scroll behavior function
function smoothScrollToSection(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    
    // Prevent default anchor click behavior
    event.preventDefault();
    
    const headerOffset = 80; // Adjust based on your header height
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Better contact button functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactButton = document.getElementById('contact-click-button');
    if (contactButton) {
        contactButton.addEventListener('click', function() {
            smoothScrollToSection('contact');
        });
    }
});



// Add this code to your index.js file to improve navigation
document.addEventListener('DOMContentLoaded', function() {
    // Properly initialize all navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        if (!button.id.includes('theme-button')) { // Skip the theme toggle button
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all buttons
                navButtons.forEach(btn => {
                    if (!btn.id.includes('theme-button')) {
                        btn.classList.remove('active');
                    }
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Scroll to target section
                const targetId = this.getAttribute('data-target');
                document.getElementById(targetId).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    });
    
    // Improve contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
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
            
            if (!isValid) {
                return;
            }
            
            // Form is valid - handle submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            
            // Disable button during "submission"
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(to right, #00c853, #64dd17)';
                
                // Reset the form after success
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
                    submitBtn.style.background = 'linear-gradient(to right, #25aae1, #40e495, #30dd8a, #2bb673)';
                }, 2000);
            }, 1500);
        });
    }
    
    // Make contact button in home section work
    const contactClickButton = document.getElementById('contact-click-button');
    if (contactClickButton) {
        contactClickButton.addEventListener('click', function() {
            // Activate contact nav button
            const contactNavButton = document.querySelector('.nav-button[data-target="contact"]');
            if (contactNavButton) {
                contactNavButton.click();
            } else {
                // Fallback if button not found
                document.getElementById('contact').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// Add this to your index.js file to fix section positioning issues

document.addEventListener('DOMContentLoaded', function() {
    // Fix section heights and positioning
    function adjustSectionHeights() {
        const sections = document.querySelectorAll('.section');
        const windowHeight = window.innerHeight;
        
        // Adjust each section
        sections.forEach(section => {
            // Ensure minimum height but allow content to expand it
            section.style.minHeight = `${windowHeight}px`;
            
            // Special handling for specific sections
            if (section.id === 'experience' || section.id === 'portfolio') {
                // Add extra spacing between these problematic sections
                if (section.id === 'experience') {
                    section.style.marginBottom = '40px';
                } else {
                    section.style.marginTop = '40px';
                }
            }
            
            // Special handling for contact section
            if (section.id === 'contact') {
                // Calculate appropriate height for contact to avoid footer overlap
                const footer = document.getElementById('footer');
                const footerHeight = footer ? footer.offsetHeight : 0;
                section.style.marginBottom = `${footerHeight}px`;
                
                // Limit contact form height if needed
                const contactContainer = section.querySelector('.contact-container');
                if (contactContainer) {
                    const availableHeight = windowHeight - 200; // Account for padding and margins
                    contactContainer.style.maxHeight = `${availableHeight}px`;
                }
            }
        });
    }
    
    // Fix portfolio card hover behavior
    function fixPortfolioCardHover() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Increase z-index when hovering
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                // Reset z-index when not hovering
                this.style.zIndex = '1';
            });
        });
    }
    
    // Run fixes on load and resize
    adjustSectionHeights();
    fixPortfolioCardHover();
    window.addEventListener('resize', adjustSectionHeights);
    
    // Fix initial scroll position to avoid section overlap
    setTimeout(function() {
        // Slight scroll adjustment to force recalculation of positions
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
    }, 200);
});

// Add this to your index.js file or create a new experience-tilt.js file

document.addEventListener('DOMContentLoaded', function() {
    // Get all experience cards
    const experienceCards = document.querySelectorAll('.experience-card');
    
    // Add tilt effect to each card
    experienceCards.forEach(card => {
        card.addEventListener('mousemove', tiltCard);
        card.addEventListener('mouseleave', resetTilt);
        card.addEventListener('mouseenter', enterCard);
    });
    
    // Function to create the tilt effect
    function tiltCard(e) {
        const card = this;
        const cardInner = card.querySelector('.experience-card-inner');
        const cardRect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to card center
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        const centerX = cardRect.left + cardWidth / 2;
        const centerY = cardRect.top + cardHeight / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate rotation values (reduced intensity for smoother effect)
        const rotateY = (mouseX / (cardWidth / 2)) * 8; // Horizontal tilt
        const rotateX = -(mouseY / (cardHeight / 2)) * 8; // Vertical tilt
        
        // Apply transformation
        cardInner.style.transition = 'transform 0.1s ease-out';
        
        // Only apply tilt, not flip (the flip happens on hover via CSS)
        if (!card.classList.contains('hovered')) {
            cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    }
    
    // Function to reset tilt when mouse leaves
    function resetTilt() {
        const cardInner = this.querySelector('.experience-card-inner');
        cardInner.style.transition = 'transform 0.5s ease-out';
        
        // Reset to normal state
        if (!this.classList.contains('hovered')) {
            cardInner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        }
        
        // Remove hovered class
        this.classList.remove('hovered');
    }
    
    // Function for card flip on hover
    function enterCard() {
        // Add hovered class to manage state
        this.classList.add('hovered');
    }
    
    // Add highlight effect when scrolling
    window.addEventListener('scroll', () => {
        experienceCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const isInView = 
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth);
                
            if (isInView) {
                card.classList.add('in-view');
            } else {
                card.classList.remove('in-view');
            }
        });
    });
    
    // Trigger initial check for cards in view
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 300);
});

function redirectToSection(redirectLocation) {
    let currentLocation = window.location.href;
    let redirectTo = currentLocation.substring(0, currentLocation.indexOf('#'));
    window.location.href = redirectTo + '#' + redirectLocation;
}


function classActivate(element) {
    let allActives = document.getElementsByClassName('active');
    for (let i = 0; i < allActives.length; i++) {
        allActives[i].classList.remove('active');
    }
    let redirectLocation = element.getAttribute('id');
    if (redirectLocation.indexOf('-') !== -1) {
        redirectLocation = redirectLocation.substring(0, redirectLocation.lastIndexOf('-'));
    }
    redirectToSection(redirectLocation);
    element.classList.add('active');
}

function classActivateListener() {
    classActivate(this);
}

function attachClassActivateListener() {
    links = document.getElementsByClassName('nav-link');
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = classActivateListener;
    }
}

function changeTheme() {
    let sections = document.getElementsByClassName('section');

    let themeButtonIcon = document.getElementById('theme-icon');

    let activeTheme = themeButtonIcon.classList[1];

    let navbar = document.getElementById('navigation');

    for (var i = 0; i < sections.length; i++) {
        if (activeTheme === 'dark-theme') {
            sections[i].classList.remove('dark-theme');
            sections[i].classList.add('light-theme');
            themeButtonIcon.classList.remove('dark-theme');
            themeButtonIcon.classList.add('light-theme');
            navbar.classList.remove('dark-theme');
            navbar.classList.add('light-theme');
            themeButtonIcon.setAttribute('src', '../../resources/icons/moon.png');
        } else {
            sections[i].classList.remove('light-theme');
            sections[i].classList.add('dark-theme');
            themeButtonIcon.classList.remove('light-theme');
            themeButtonIcon.classList.add('dark-theme');
            navbar.classList.remove('light-theme');
            navbar.classList.add('dark-theme');
            themeButtonIcon.setAttribute('src', '../../resources/icons/sun.png');
        }
    }
}

function attachChangeThemeListener() {
    let themeButton = document.getElementById('theme-button');
    themeButton.onclick = changeTheme;
}

function scrollListener() {
    let currentLocation = window.location.href;
    let scrollIcon = document.getElementById('scroll-arrow');

    currentLocation = currentLocation.substring(currentLocation.lastIndexOf('#') + 1);

    let allSections = ['home', 'about', 'experience', 'portfolio', 'skills', 'contact'];

    let currentPageLocationIndex = allSections.indexOf(currentLocation);
    
    if (currentPageLocationIndex === allSections.length - 1) {
        scrollIcon.classList.remove('fa-arrow-up');
        scrollIcon.classList.add('fa-arrow-down');
    }
    
    let nextIndex = currentPageLocationIndex + 1;

    if (nextIndex >= allSections.length && nextIndex !== -1) {
        nextIndex = 0;
    }


    if (nextIndex == allSections.length - 1) {
        scrollIcon.classList.remove('fa-arrow-down');
        scrollIcon.classList.add('fa-arrow-up');
    }


    scrollToSectionElement = document.getElementById(allSections[nextIndex] + '-link');
    classActivate(scrollToSectionElement);
}

function attachScrollButtonListener() {
    let scrollButton = document.getElementById('scroll-button');
    scrollButton.onclick = scrollListener;
}

function getBoundingRectangle(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function checkFocus(element) {
    let allSections = document.getElementsByClassName('section');
    for (let i = 0; i < allSections.length; i++) {
        if (getBoundingRectangle(allSections[i])) {
            classActivate(allSections[i]);
        }
    }
}

function attachCheckFocusListener() {
    window.onscroll = checkFocus;
}

function toggleNeon() {
    let lightsourceElements = document.getElementsByClassName('lightsource');
    for (let i = 0; i < lightsourceElements.length; i++) {
        if (lightsourceElements[i].classList.contains('neon')) {
            lightsourceElements[i].classList.remove('neon');
        } else {
            lightsourceElements[i].classList.add('neon');
        }
    }
}

function attachToggleNeonListener() {
    let nameBanner = document.getElementById('banner');
    nameBanner.onmouseover = toggleNeon;
    nameBanner.onmouseout = toggleNeon;
}


window.onload = () => {
    if (window.location.href.indexOf('#') === -1) {
        window.location.href += '#home';
    } else {
        window.location.href = window.location.href.replace(window.location.href.substring(window.location.href.indexOf('#')), '#home');
    }
    attachClassActivateListener();
    attachChangeThemeListener();
    attachScrollButtonListener();
    attachCheckFocusListener();
    attachToggleNeonListener();
}

// Smooth scroll function
function smoothScroll(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const targetPosition = target.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing function for smooth animation
        const easeInOutQuad = progress => {
            return progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        };

        window.scrollTo(0, startPosition + (distance * easeInOutQuad(progress)));

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Update navigation active state based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navButtons = document.querySelectorAll('.nav-button');

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const isInView = (rect.top <= 150) && (rect.bottom >= 150);

        if (isInView) {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to corresponding button
            navButtons[index].classList.add('active');
        }
    });
}

// Initialize navigation
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('data-target');
            smoothScroll(targetId);
        });
    });

    // Update active state on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial update of active state
    updateActiveNavLink();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initNavigation);

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formDataObj = Object.fromEntries(formData.entries());
            
            // Here you would typically send the data to your backend
            // For now, we'll just log it and show a success message
            console.log('Form submitted:', formDataObj);
            
            // Add animation class to button
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
            submitBtn.style.background = 'linear-gradient(45deg, #00c853, #64dd17)';
            
            // Reset the form and button after 2 seconds
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
                submitBtn.style.background = 'linear-gradient(45deg, rgb(57, 252, 155), rgb(151, 227, 255))';
            }, 2000);
        });
    }
});