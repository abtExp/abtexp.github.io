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
    console.log(currentLocation);
    console.log(currentPageLocationIndex);
    console.log(allSections[currentPageLocationIndex]);
    
    if (currentPageLocationIndex === allSections.length - 1) {
        scrollIcon.classList.remove('fa-arrow-up');
        scrollIcon.classList.add('fa-arrow-down');
    }
    
    let nextIndex = currentPageLocationIndex + 1;
    console.log(allSections[nextIndex]);

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
    console.log(`${element.getAttribute("id")} : `, rect);
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
            console.log('Focused On : ', allSections[i].getAttribute('id'));
        }
    }
}

function attachCheckFocusListener() {
    window.onscroll = checkFocus;
}

function toggleNeon() {
    let lightsourceElements = document.getElementsByClassName('lightsource');
    console.log(lightsourceElements);
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