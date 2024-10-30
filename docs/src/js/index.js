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