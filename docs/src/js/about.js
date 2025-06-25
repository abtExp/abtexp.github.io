// About Section Tilt Animations JavaScript
// Add this to your existing index.js file

// Initialize about section with tilt effects
function initAboutSection() {
    // Check for about cards visibility on scroll
    window.addEventListener('scroll', throttle(checkAboutCardsVisibility, 50));
    
    // Initialize tilt effects
    initAboutCardTiltEffects();
    
    // Initial visibility check
    setTimeout(checkAboutCardsVisibility, 100);
}

// Advanced tilt effect for about cards
function initAboutCardTiltEffects() {
    const aboutCards = document.querySelectorAll('.about-card');
    
    aboutCards.forEach(card => {
        // Mouse move tilt effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation values (more pronounced than before)
            const rotateX = (y - centerY) / centerY * -15;
            const rotateY = (x - centerX) / centerX * 15;
            
            // Apply 3D transform with perspective
            this.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-15px) 
                scale(1.05)
            `;
            
            // Add subtle shadow movement
            const shadowX = (x - centerX) / centerX * 25;
            const shadowY = (y - centerY) / centerY * 25;
            this.style.boxShadow = `
                ${shadowX}px ${shadowY + 25}px 50px rgba(0, 0, 0, 0.2),
                0 15px 30px rgba(0, 0, 0, 0.1)
            `;
            
            // Icon rotation effect
            const icon = this.querySelector('.about-card-icon');
            if (icon) {
                icon.style.transform = `
                    scale(1.1) 
                    rotate(${rotateY * 0.5}deg)
                    translateZ(20px)
                `;
            }
        });
        
        // Mouse enter - prepare for tilt
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'none';
            
            const icon = this.querySelector('.about-card-icon');
            if (icon) {
                icon.style.transition = 'none';
            }
        });
        
        // Mouse leave - return to normal with bounce
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            
            const icon = this.querySelector('.about-card-icon');
            if (icon) {
                icon.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                icon.style.transform = 'scale(1) rotate(0deg) translateZ(0px)';
            }
        });
        
        // Click effect - bounce animation
        card.addEventListener('click', function() {
            this.style.transform = 'perspective(1000px) scale(0.95) translateY(-5px)';
            
            setTimeout(() => {
                this.style.transform = 'perspective(1000px) scale(1.1) translateY(-20px)';
                
                setTimeout(() => {
                    this.style.transform = 'perspective(1000px) scale(1) translateY(0)';
                }, 150);
            }, 100);
        });
    });
}

// Check which about cards are in view for scroll animations
function checkAboutCardsVisibility() {
    const aboutCards = document.querySelectorAll('.about-card');
    
    aboutCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.85 && rect.bottom >= 0;
        
        if (isInView && !card.classList.contains('in-view')) {
            // Staggered animation with bounce effect
            setTimeout(() => {
                card.classList.add('in-view');
                
                // Add a subtle bounce when card appears
                setTimeout(() => {
                    if (card.classList.contains('in-view')) {
                        card.style.transform = 'translateY(-10px) scale(1.03)';
                        setTimeout(() => {
                            card.style.transform = 'translateY(0) scale(1)';
                        }, 200);
                    }
                }, 300);
            }, index * 150); // Faster stagger timing
        }
    });
}

// Avatar hover effect
function initAboutAvatarEffect() {
    const aboutAvatar = document.querySelector('.about-avatar');
    if (!aboutAvatar) return;
    
    aboutAvatar.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15) rotate(10deg)';
        this.style.boxShadow = '0 20px 60px rgba(57, 252, 155, 0.5)';
    });
    
    aboutAvatar.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
        this.style.boxShadow = '0 8px 32px rgba(57, 252, 155, 0.2)';
    });
    
    // Click effect for avatar
    aboutAvatar.addEventListener('click', function() {
        this.style.transform = 'scale(0.9) rotate(-5deg)';
        
        setTimeout(() => {
            this.style.transform = 'scale(1.2) rotate(15deg)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }, 100);
    });
}

// Parallax effect for about section
function initAboutParallax() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const aboutTop = aboutSection.offsetTop;
        const aboutHeight = aboutSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Check if about section is in view
        if (scrolled + windowHeight > aboutTop && scrolled < aboutTop + aboutHeight) {
            const aboutCards = document.querySelectorAll('.about-card');
            
            aboutCards.forEach((card, index) => {
                const speed = 0.5 + (index * 0.1); // Different speeds for each card
                const yPos = (scrolled - aboutTop) * speed * 0.1;
                
                if (!card.matches(':hover')) {
                    card.style.transform = `translateY(${yPos}px)`;
                }
            });
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAboutSection();
    initAboutAvatarEffect();
    initAboutParallax();
});

// Add intersection observer for better performance
function initAboutIntersectionObserver() {
    const aboutCards = document.querySelectorAll('.about-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.classList.contains('in-view')) {
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    aboutCards.forEach(card => {
        observer.observe(card);
    });
}

// Call intersection observer if supported
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', initAboutIntersectionObserver);
}