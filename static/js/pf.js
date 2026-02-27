/* Unified JS: nav toggle, smooth scroll, section highlighting, animations */
document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = mainNav ? Array.from(mainNav.querySelectorAll('a[href^="#"]') ) : [];
    const sections = Array.from(document.querySelectorAll('section[id]'));

    // --- Theme toggle ---
    const themeToggle = document.getElementById('themeToggle');
    const avatarImage = document.getElementById('avatarImage');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    // apply stored theme
    document.documentElement.setAttribute('data-theme', currentTheme === 'light' ? 'light' : '');
    
    // Function to update avatar based on theme
    function updateAvatar(theme) {
        if (avatarImage) {
            const darkImage = avatarImage.getAttribute('data-dark-image');
            const lightImage = avatarImage.getAttribute('data-light-image');
            if (theme === 'light') {
                avatarImage.src = lightImage;
            } else {
                avatarImage.src = darkImage;
            }
        }
    }
    
    // Set initial avatar image
    updateAvatar(currentTheme);
    
    if (themeToggle) {
        // set initial icon
        themeToggle.innerHTML = currentTheme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.addEventListener('click', () => {
            const active = document.documentElement.getAttribute('data-theme') === 'light';
            if (active) {
                document.documentElement.removeAttribute('data-theme');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme','dark');
                // Trigger flip animation and update avatar
                if (avatarImage) {
                    avatarImage.classList.add('flip');
                    setTimeout(() => {
                        updateAvatar('dark');
                        setTimeout(() => {
                            avatarImage.classList.remove('flip');
                        }, 300);
                    }, 300);
                }
            } else {
                document.documentElement.setAttribute('data-theme','light');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme','light');
                // Trigger flip animation and update avatar
                if (avatarImage) {
                    avatarImage.classList.add('flip');
                    setTimeout(() => {
                        updateAvatar('light');
                        setTimeout(() => {
                            avatarImage.classList.remove('flip');
                        }, 300);
                    }, 300);
                }
            }
        });
    }

    // --- Nav toggle for small screens ---
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('show');
        });
    }

    // --- Smooth scroll for anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80; // header height offset
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
                // close mobile nav
                if (mainNav && mainNav.classList.contains('show')) mainNav.classList.remove('show');
            }
        });
    });

    // --- Active section highlighting using IntersectionObserver ---
    if ('IntersectionObserver' in window && navLinks.length && sections.length) {
        const map = new Map();
        navLinks.forEach(link => map.set(link.getAttribute('href'), link));

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = `#${entry.target.id}`;
                const link = map.get(id);
                if (!link) return;
                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

        sections.forEach(s => io.observe(s));
    }

    // --- Set current year in footer ---
    const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Skill bars animation ---
    const skillBars = document.querySelectorAll('.skill-level[data-level]');
    if (skillBars.length && 'IntersectionObserver' in window) {
        const sbObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    document.querySelectorAll('.skill-level').forEach(b => {
                        const lvl = b.getAttribute('data-level') || '0';
                        b.style.width = lvl + '%';
                    });
                    obs.disconnect();
                }
            });
        }, { threshold: 0.25 });
        sbObs.observe(document.querySelector('section.skills') || document.body);
    }

    // --- Intersection-based reveal (adds .fade-in) ---
    const revealTargets = document.querySelectorAll('section');
    if ('IntersectionObserver' in window) {
        const rev = new IntersectionObserver((entries, ob) => {
            entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('fade-in'); ob.unobserve(en.target); } });
        }, { threshold: 0.12 });
        revealTargets.forEach(t => rev.observe(t));
    } else {
        revealTargets.forEach(t => t.classList.add('fade-in'));
    }

    // --- Contact form handler with EmailJS ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm ? contactForm.querySelector('.submit-btn') : null;
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const status = document.getElementById('formStatus');
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Get form values
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };
            
            // Validate
            if (!formData.name || !formData.email || !formData.message) {
                showStatus(status, 'Please fill in all fields.', 'error');
                return;
            }
            
            // Show loading state
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
            
            try {
                // Option 1: Using EmailJS (Recommended - No backend needed)
                // First, add this script tag to your HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
                // Then initialize: emailjs.init("YOUR_PUBLIC_KEY");
                
                if (typeof emailjs !== 'undefined') {
                    // EmailJS Configuration
                    // Replace with your EmailJS service ID, template ID, and public key
                    const serviceID = 'YOUR_SERVICE_ID';      // Get from EmailJS dashboard
                    const templateID = 'YOUR_TEMPLATE_ID';    // Get from EmailJS dashboard
                    const publicKey = 'YOUR_PUBLIC_KEY';      // Get from EmailJS dashboard
                    
                    // Check if EmailJS is configured
                    if (serviceID === 'YOUR_SERVICE_ID' || templateID === 'YOUR_TEMPLATE_ID' || publicKey === 'YOUR_PUBLIC_KEY') {
                        throw new Error('EmailJS not configured. Please set up your Service ID, Template ID, and Public Key in pf.js');
                    }
                    
                    // Initialize EmailJS (only needed once, but safe to call multiple times)
                    emailjs.init(publicKey);
                    
                    // Send email
                    await emailjs.send(serviceID, templateID, {
                        from_name: formData.name,
                        from_email: formData.email,
                        message: formData.message,
                        to_email: 'ansen.vinoj@example.com' // Replace with your actual email
                    });
                    
                    showStatus(status, '✓ Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } 
                // Option 2: Using Formspree (Alternative - No backend needed)
                else if (window.Formspree) {
                    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        showStatus(status, '✓ Message sent successfully! I\'ll get back to you soon.', 'success');
                        contactForm.reset();
                    } else {
                        throw new Error('Failed to send message');
                    }
                }
                // Option 3: Using your own backend API
                else {
                    try {
                        const response = await fetch('/api/contact', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        });
                        
                        if (response.ok) {
                            showStatus(status, '✓ Message sent successfully! I\'ll get back to you soon.', 'success');
                            contactForm.reset();
                        } else {
                            throw new Error('Failed to send message');
                        }
                    } catch (fetchError) {
                        // Fallback: Demo mode (for testing before setup)
                        console.log('Form data (demo mode):', formData);
                        showStatus(status, '⚠️ Form submitted (demo mode). Please configure EmailJS to send real emails. Check CONTACT_FORM_SETUP.md for instructions.', 'error');
                        contactForm.reset();
                    }
                }
            } catch (error) {
                console.error('Error sending message:', error);
                showStatus(status, '✗ Failed to send message. Please try again or contact me directly via email.', 'error');
            } finally {
                // Remove loading state
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }
        });
    }
    
    // Helper function to show status messages
    function showStatus(statusEl, message, type = 'success') {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.className = `form-status ${type}`;
        
        // Auto-clear after 5 seconds
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'form-status';
        }, 5000);
    }

    // --- Modal live-demo preview ---
    const modal = document.getElementById('modal');
    const modalFrame = document.getElementById('modalFrame');
    const modalClose = document.querySelector('.modal-close');
    document.querySelectorAll('.project-links a').forEach(a => {
        // Live Demo buttons will use data-demo or href
        if (a.textContent.trim().toLowerCase().includes('live')) {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const demo = a.getAttribute('data-demo') || a.getAttribute('href') || '';
                if (!demo) return;
                if (modal && modalFrame) {
                    modalFrame.src = demo;
                    modal.classList.add('active');
                }
            });
        }
    });

    function closeModal() {
        if (modal && modalFrame) {
            modal.classList.remove('active');
            modalFrame.src = '';
        }
    }
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // --- Certificate download demo (if any) ---
    document.querySelectorAll('.download-cert').forEach(btn => {
        btn.addEventListener('click', () => {
            const filename = btn.getAttribute('data-cert') || 'cert.pdf';
            const blob = new Blob([`Sample certificate ${filename}`], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        });
    });
});