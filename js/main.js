document.addEventListener('DOMContentLoaded', () => {

    // --- Page Loader ---
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                pageLoader.classList.add('hidden');
            }, 800); // Slight delay for smoothness
        });
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check saved theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        html.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark-mode');

        let theme = 'light';
        if (html.classList.contains('dark-mode')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });

    // --- Language Toggle ---
    const langToggle = document.getElementById('langToggle');
    const langText = langToggle.querySelector('.lang-text');
    let currentLang = localStorage.getItem('lang') || 'en';

    // Initial content update
    updateContent(currentLang);
    updateLangBtn(currentLang);

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'jp' : 'en';
        localStorage.setItem('lang', currentLang);
        updateContent(currentLang);
        updateLangBtn(currentLang);
    });

    function updateLangBtn(lang) {
        langText.textContent = lang === 'en' ? 'JP' : 'EN';
        document.documentElement.lang = lang === 'en' ? 'en' : 'ja';
    }

    function updateContent(lang) {
        const elements = document.querySelectorAll('[data-en], [data-ja]');
        elements.forEach(el => {
            if (lang === 'en' && el.dataset.en) {
                el.innerHTML = el.dataset.en;
            } else if (lang === 'jp' && el.dataset.ja) {
                el.innerHTML = el.dataset.ja;
            }
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileMenuOverlay');
    const closeMenuBtn = document.querySelector('.close-menu-btn');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking on a link
    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Mobile Theme Toggle
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', () => {
            html.classList.toggle('dark-mode');
            let theme = 'light';
            if (html.classList.contains('dark-mode')) {
                theme = 'dark';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // Mobile Lang Toggle
    const mobileLangToggle = document.getElementById('mobileLangToggle');
    if (mobileLangToggle) {
        mobileLangToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'jp' : 'en';
            localStorage.setItem('lang', currentLang);
            updateContent(currentLang);
            updateLangBtn(currentLang);

            // Update mobile button text
            const mobileLangText = mobileLangToggle.querySelector('.lang-text');
            if (mobileLangText) {
                mobileLangText.textContent = currentLang === 'en' ? 'JP' : 'EN';
            }
        });
    }
});
