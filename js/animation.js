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
                // Optional: Stop observing once visible if you don't want them to animate again
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -15% 0px' // Slightly higher margin so it triggers earlier on mobile
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Animation ---
    const heroTl = gsap.timeline();
    heroTl.to('.animate-hero', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
    });

    // Create floating leaves
    createFloatingLeaves();

    // --- Hero Mouse Parallax ---
    const heroSection = document.getElementById('hero');
    const leavesLayer = document.getElementById('leavesContainer');
    const heroBgLayer = document.querySelector('.hero-bg-overlay');

    if (heroSection && leavesLayer && heroBgLayer) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15; // Slightly toned down for softness
            const y = (e.clientY / window.innerHeight - 0.5) * 15;

            gsap.to(leavesLayer, {
                x: x,
                y: y,
                duration: 1.2,
                ease: "power2.out"
            });

            gsap.to(heroBgLayer, {
                x: -x * 0.5,
                y: -y * 0.5,
                duration: 2,
                ease: "power2.out"
            });
        });

        // Reset on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            gsap.to([leavesLayer, heroBgLayer], {
                x: 0,
                y: 0,
                duration: 2,
                ease: "power3.out"
            });
        });
    }

    // Initialize CSS-based scroll animations
    initScrollAnimations();

    // --- Page Loader ---
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 1000);

    // --- Number Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const targetText = stat.innerText;
        // Check if it's a simple number or a range like "10-15"
        const isRange = targetText.includes('-');
        const targetValue = parseInt(targetText.replace(/[^0-9]/g, ''));

        if (!isNaN(targetValue) && !isRange) {
            stat.innerText = '0';

            gsap.to(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: "top 90%",
                    once: true
                },
                innerText: targetValue,
                duration: 2.5,
                snap: { innerText: 1 },
                ease: "power2.out"
            });
        }
    });

    // --- Staggered Grid Animations ---
    if (document.querySelector('.features-grid')) {
        gsap.from('.feature-image-card', {
            scrollTrigger: {
                trigger: '.features-grid',
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.2)"
        });
    }

    if (document.querySelector('.methodology-grid')) {
        gsap.from('.method-item', {
            scrollTrigger: {
                trigger: '.methodology-grid',
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        });
    }

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
