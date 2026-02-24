// DARK MODE TOGGLE
const themeToggle = document.getElementById('themeToggle');
const bodyElement = document.body;

// Check for saved theme preference or system preference
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

// Smooth scroll for navigation links
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

// Intersection Observer for scroll animations
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

// Skill bars animation on scroll
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

// Active nav link highlighting
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
        link.style.color = '#fff';
        link.style.borderBottom = 'none';
        link.style.paddingBottom = '0';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.borderBottom = '2px solid var(--primary)';
            link.style.paddingBottom = '5px';
        }
    });
});

// ============ CONTACT FORM SUBMISSION FOR VERCEL ============
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Get submit button and form status div
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.className = 'form-status loading';
    formStatus.textContent = 'Sending your message...';
    
    try {
        // Send to Vercel serverless function
        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Success
            document.getElementById('contactForm').reset();
            formStatus.className = 'form-status success';
            formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        } else {
            // Error
            throw new Error(result.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Failed to send message. Please try again later.';
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});

// Parallax effect on hero
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Mouse position parallax effect on project cards
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

// Reset card transforms on mouse leave
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Add floating animation to social links
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

// Update copyright year
document.querySelector('footer p').innerHTML = `&copy; ${new Date().getFullYear()} Samarth Patel. All rights reserved. | Crafted with ❤️`;