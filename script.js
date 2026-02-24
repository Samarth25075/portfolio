// ============================================
// DARK MODE TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const bodyElement = document.body;

const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (currentTheme === 'dark') {
    bodyElement.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
} else {
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    bodyElement.classList.toggle('dark-mode');
    const isDark = bodyElement.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.style.animation = 'rotate360 0.6s ease-out';
    setTimeout(() => {
        themeToggle.style.animation = '';
    }, 600);
});


// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});


// ============================================
// INTERSECTION OBSERVER — SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .contact-item, .social-link, .skill').forEach(el => {
    observer.observe(el);
});


// ============================================
// SKILL BARS ANIMATION
// ============================================
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'progressBar 1.5s ease-out forwards';
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

skillBars.forEach(bar => skillObserver.observe(bar));


// ============================================
// ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
// ============================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150 && pageYOffset < sectionTop + sectionHeight - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        link.style.borderBottom = '';
        link.style.paddingBottom = '';
        
        if (link.getAttribute('href') === `#${current}`) {
            link.style.borderBottom = '2px solid var(--primary-color, #007bff)';
            link.style.paddingBottom = '5px';
        }
    });
});


// ============================================
// FORM SUBMISSION HANDLER (FOR FORMSUBMIT.CO)
// ============================================
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Don't prevent default - let FormSubmit do its job
        // Just show loading state on button
        
        // Validate fields before submission
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !subject || !message) {
            e.preventDefault();
            alert('⚠️ Please fill in all fields before submitting.');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            alert('⚠️ Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Sending...';
        
        // FormSubmit will handle the rest
        // The page will redirect to thank-you page on success
    });
}


// ============================================
// PARALLAX EFFECT ON HERO SECTION
// ============================================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});


// ============================================
// MOUSE PARALLAX ON PROJECT CARDS
// ============================================
document.addEventListener('mousemove', (e) => {
    const floatElements = document.querySelectorAll('.project-card');
    floatElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        if (index % 2 === 0 && !el.matches(':hover')) {
            el.style.transform = `perspective(1000px) rotateX(${y * 5}deg) rotateY(${x * 5}deg)`;
        }
    });
});

// Reset card on mouse leave
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseleave', function () {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});


// ============================================
// FLOATING ANIMATION ON SOCIAL LINKS
// ============================================
document.querySelectorAll('.social-link').forEach((link, index) => {
    link.style.animation = `floatLink${index} 3s ease-in-out infinite`;
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatLink${index} {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(${-5 - (index * 2)}px); }
        }
    `;
    document.head.appendChild(style);
});


// ============================================
// AUTO UPDATE COPYRIGHT YEAR
// ============================================
const footerYear = document.querySelector('footer p');
if (footerYear) {
    footerYear.innerHTML = `&copy; ${new Date().getFullYear()} Samarth Patel. All rights reserved. | Crafted with ❤️`;
}


// ============================================
// ADD ROTATION ANIMATION KEYFRAME
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes rotate360 {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes progressBar {
        from { width: 0; }
        to { width: var(--percentage); }
    }
`;
document.head.appendChild(style);