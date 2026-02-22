// Floating Leaves Animation for Hero Section
function createFloatingLeaves() {
    const leavesContainer = document.getElementById('leavesContainer');
    if (!leavesContainer) return;
    
    const leafCount = 15; // Number of leaves
    
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        
        // Random properties for each leaf
        const size = Math.floor(Math.random() * 30) + 20; // 20-50px
        const left = Math.random() * 100; // 0-100%
        const delay = Math.random() * 10; // 0-10s delay
        const duration = Math.random() * 15 + 15; // 15-30s duration
        const rotationSpeed = Math.random() * 20 + 10; // Rotation speed
        
        leaf.style.width = size + 'px';
        leaf.style.height = size + 'px';
        leaf.style.left = left + '%';
        leaf.style.animationDelay = delay + 's';
        leaf.style.animationDuration = duration + 's';
        leaf.style.opacity = (Math.random() * 0.3 + 0.2).toString(); // 0.2-0.5 opacity
        
        // Start position uniformly at the top
        leaf.style.top = -size - 10 + 'px';
        
        leavesContainer.appendChild(leaf);
    }
}

// Update animation triggers for fade-up elements
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Animation ---
    const heroTl = gsap.timeline();
    heroTl.to('.animate-hero', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Create floating leaves
    createFloatingLeaves();
    
    // Initialize scroll animations
    initScrollAnimations();

    // --- Scroll Animations ---
    const fadeUpElements = document.querySelectorAll('.fade-up');
    fadeUpElements.forEach(element => {
        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // --- Page Loader ---
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 1000);

    // --- Mobile Menu Logic ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    function openMenu() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMenu);
    }

});
