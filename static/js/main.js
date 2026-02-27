document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Vanilla Tilt Setup --- //
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
    });

    // --- 2. GSAP Animations --- //
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Animation
    gsap.to(".hero-photo-container", {
        opacity: 1,
        duration: 1.5,
        delay: 0.2,
        y: -10,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut" // Floating effect
    });
    gsap.from(".hero .subtitle", { opacity: 0, y: 50, duration: 1, delay: 0.5 });
    gsap.from(".hero .title", { opacity: 0, y: 50, duration: 1, delay: 0.8 });
    gsap.from(".hero .description", { opacity: 0, scale: 0.9, duration: 1, delay: 1.1 });
    gsap.from(".hero-actions", { opacity: 0, y: 20, duration: 1, delay: 1.4 });

    // Scroll Animations for sections
    const sections = document.querySelectorAll(".section-title");
    sections.forEach((sec) => {
        gsap.from(sec, {
            scrollTrigger: {
                trigger: sec,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
    });

    // Cards staggered animation
    const cards = [".about-grid > div", ".project-card", ".fun-card"];
    cards.forEach(cardSelector => {
        gsap.from(cardSelector, {
            scrollTrigger: {
                trigger: cardSelector,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 1
        });
    });

    // --- 3. Mobile Navigation --- //
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
            if (navLinks.style.display === "flex") {
                navLinks.style.flexDirection = "column";
                navLinks.style.position = "absolute";
                navLinks.style.top = "100%";
                navLinks.style.left = "0";
                navLinks.style.width = "100%";
                navLinks.style.background = "rgba(5, 5, 8, 0.9)";
                navLinks.style.padding = "20px";
                navLinks.style.gap = "20px";
            }
        });
    }

    // --- Navbar Background Change on Scroll --- //
    const nav = document.querySelector(".glass-nav");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            nav.style.boxShadow = "0 5px 20px rgba(0,0,0,0.2)";
        } else {
            nav.style.boxShadow = "none";
        }
    });

    // --- Theme Toggle Logic --- //
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        const icon = themeBtn.querySelector("i");
        const currentTheme = localStorage.getItem("theme") || "light";

        // Initial setup
        document.documentElement.setAttribute("data-theme", currentTheme);
        if (currentTheme === "dark") {
            icon.classList.replace("fa-moon", "fa-sun");
        }

        themeBtn.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");
            if (theme === "light") {
                theme = "dark";
                icon.classList.replace("fa-moon", "fa-sun");
            } else {
                theme = "light";
                icon.classList.replace("fa-sun", "fa-moon");
            }
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);

            // Dispatch event for Three.js to pick up
            window.dispatchEvent(new Event('themeChanged'));
        });
    }

});

// --- Modal Logic ---
const openProjectModal = (title, description) => {
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");

    if (modal && modalTitle && modalDesc) {
        modalTitle.innerText = title;
        modalDesc.innerText = description;
        modal.classList.remove("d-none");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const minModal = document.querySelector('.close-modal');
    if (minModal) {
        minModal.addEventListener('click', () => {
            const modal = document.getElementById("project-modal");
            modal.classList.add("d-none");
        });
    }

    window.addEventListener('click', (e) => {
        const modal = document.getElementById("project-modal");
        if (e.target === modal) {
            modal.classList.add("d-none");
        }
    });
});
