// Initialize Lenis for Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Three.js Scene Setup
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Colorful Star Particles
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 6000;
const posArray = new Float32Array(starsCount * 3);
const colorArray = new Float32Array(starsCount * 3);

const colorPalette = [
    new THREE.Color('#00f260'), // Green
    new THREE.Color('#0575E6'), // Blue
    new THREE.Color('#e84393'), // Pink
    new THREE.Color('#ffffff')  // White
];

// Fill with random positions and colors
for(let i = 0; i < starsCount; i++) {
    // Positions
    posArray[i*3] = (Math.random() - 0.5) * 15;
    posArray[i*3+1] = (Math.random() - 0.5) * 15;
    posArray[i*3+2] = (Math.random() - 0.5) * 15;

    // Colors
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colorArray[i*3] = color.r;
    colorArray[i*3+1] = color.g;
    colorArray[i*3+2] = color.b;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
starsGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

// Material
const starsMaterial = new THREE.PointsMaterial({
    size: 0.008,
    vertexColors: true, // Enable per-vertex colors
    transparent: true,
    opacity: 0.8,
});

// Mesh
const starMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starMesh);

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Scroll Velocity Integration
let scrollSpeed = 0;

lenis.on('scroll', (e) => {
    scrollSpeed = e.velocity;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Smooth rotation based on mouse
    starMesh.rotation.y += 0.5 * (targetX - starMesh.rotation.y);
    starMesh.rotation.x += 0.05 * (targetY - starMesh.rotation.x);

    // Warp speed effect based on scroll
    starMesh.rotation.z += 0.001 + (Math.abs(scrollSpeed) * 0.0005);

    const time = clock.getElapsedTime();
    // Gentle pulse
    starMesh.scale.x = 1 + Math.sin(time * 0.5) * 0.05;
    starMesh.scale.y = 1 + Math.sin(time * 0.5) * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Reveal
const heroTl = gsap.timeline();

heroTl.from('.logo', {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
})
.from('.hero-title', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out',
    skewY: 7
}, "-=0.5")
.from('.hero-subtitle', {
    y: 20,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
}, "-=1")
.from('.scroll-indicator', {
    opacity: 0,
    duration: 1
}, "-=0.5");

// Editorial Text Reveal
const editorialText = document.querySelectorAll('.editorial-text p');
editorialText.forEach(text => {
    gsap.from(text, {
        scrollTrigger: {
            trigger: text,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
    });
});

// Project Items Stagger
const projects = document.querySelectorAll('.project-item');
projects.forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// Menu Interaction
const menuBtn = document.querySelector('.menu-btn');
const closeBtn = document.querySelector('.close-btn');
const menuLinks = document.querySelectorAll('.menu-link');

const menuTl = gsap.timeline({ paused: true });

menuTl.to('.menu-overlay', {
    autoAlpha: 1, // Visiblity + Opacity
    duration: 0.5,
    ease: 'power2.inOut'
})
.from('.menu-link', {
    y: 50,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out'
}, "-=0.2");

menuBtn.addEventListener('click', () => {
    menuTl.play();
});

closeBtn.addEventListener('click', () => {
    menuTl.reverse();
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuTl.reverse();
    });
});

// Contact Email Hover Effect (simple scale)
const contactEmail = document.querySelector('.contact-email');
if(contactEmail) {
    contactEmail.addEventListener('mouseenter', () => {
        gsap.to(contactEmail, { scale: 1.05, duration: 0.3 });
    });
    contactEmail.addEventListener('mouseleave', () => {
        gsap.to(contactEmail, { scale: 1, duration: 0.3 });
    });
}
