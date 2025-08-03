// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Initialize EmailJS with proper error handling
let emailjsInitialized = false;

function initializeEmailJS() {
    return new Promise((resolve, reject) => {
        // Wait for EmailJS to be available
        let attempts = 0;
        const maxAttempts = 10;
        
        const checkEmailJS = () => {
            attempts++;
            
            if (typeof emailjs !== 'undefined') {
                try {
                    emailjs.init('CH7Idv-T3WhDQYjtb');
                    emailjsInitialized = true;
                    console.log('EmailJS initialized successfully');
                    resolve();
                } catch (error) {
                    console.error('EmailJS initialization failed:', error);
                    reject(error);
                }
            } else if (attempts < maxAttempts) {
                console.log(`EmailJS not ready, attempt ${attempts}/${maxAttempts}`);
                setTimeout(checkEmailJS, 500);
            } else {
                reject(new Error('EmailJS library not loaded after multiple attempts'));
            }
        };
        
        checkEmailJS();
    });
}

// Form handling for both forms
document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('applicationForm');
    const quickRegistrationForm = document.getElementById('quickRegistrationForm');
    
    // Initialize EmailJS when page loads
    initializeEmailJS().catch(error => {
        console.warn('EmailJS initialization failed, will use fallback method:', error);
    });
    
    // Handle application form (about.html)
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'application');
        });
    }
    
    // Handle quick registration form (index.html)
    if (quickRegistrationForm) {
        quickRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'quick');
        });
    }
});

// Unified form submission handler
function handleFormSubmission(form, formType) {
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Try EmailJS first, then fallback to alternative method
    sendFormEmail(data, formType)
        .then(() => {
            showSuccessPopup();
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        })
        .catch((error) => {
            console.error('Form submission error:', error);
            // Try fallback method
            return sendFormEmailFallback(data, formType);
        })
        .then(() => {
            showSuccessPopup();
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        })
        .catch((error) => {
            console.error('All form submission methods failed:', error);
            showErrorPopup('Something went wrong. Please try again or contact us directly at momentvmclub@gmail.com');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// Form validation
function validateForm(data) {
    const requiredFields = ['from_name', 'from_email', 'role', 'expertise', 'motivation'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    // Email validation
    const email = document.getElementById('from_email');
    if (data.from_email if (data.email && !isValidEmail(data.email))if (data.email && !isValidEmail(data.email)) !isValidEmail(data.from_email)) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(input, message) {
    input.classList.add('form-error');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(input) {
    input.classList.remove('form-error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Send form data via EmailJS with improved error handling
// Send form data via EmailJS with working method
function sendFormEmail(data, formType = 'application') {
    return new Promise((resolve, reject) => {
        if (!emailjsInitialized) {
            reject(new Error('EmailJS not initialized'));
            return;
        }

        // Get the form element
        const form = document.getElementById('applicationForm') || document.getElementById('quickRegistrationForm');
        if (!form) {
            reject(new Error('Form not found'));
            return;
        }

        console.log('Attempting to send email with form data...');
        
        const serviceID = 'default_service';
        const templateID = 'template_1bsatl6';
        
        emailjs.sendForm(serviceID, templateID, form)
            .then((response) => {
                console.log('EmailJS success:', response);
                resolve(response);
            })
            .catch((error) => {
                console.error('EmailJS error details:', {
                    error: error,
                    message: error.message,
                    status: error.status,
                    text: error.text
                });
                reject(error);
            });
    });
}
// Fallback method using multiple options
// Send form data via EmailJS with working method
function sendFormEmail(data, formType = 'application') {
    return new Promise((resolve, reject) => {
        if (!emailjsInitialized) {
            reject(new Error('EmailJS not initialized'));
            return;
        }

        // Get the form element
        const form = document.getElementById('applicationForm') || document.getElementById('quickRegistrationForm');
        if (!form) {
            reject(new Error('Form not found'));
            return;
        }

        console.log('Attempting to send email with form data...');
        
        const serviceID = 'default_service';
        const templateID = 'template_1bsatl6';
        
        emailjs.sendForm(serviceID, templateID, form)
            .then((response) => {
                console.log('EmailJS success:', response);
                resolve(response);
            })
            .catch((error) => {
                console.error('EmailJS error details:', {
                    error: error,
                    message: error.message,
                    status: error.status,
                    text: error.text
                });
                reject(error);
            });
    });
}
// Show info popup
function showInfoPopup(message) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const popup = document.createElement('div');
    popup.className = 'info-popup';
    popup.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        animation: slideIn 0.3s ease;
    `;
    
    popup.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <i class="fas fa-info-circle" style="font-size: 3rem; color: #3b82f6;"></i>
        </div>
        <h3 style="margin-bottom: 1rem; color: #1f2937;">Manual Email Required</h3>
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem;">
            ${message}
        </p>
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem;">
            Or contact us directly at: <strong>momentvmclub@gmail.com</strong>
        </p>
        <button onclick="closePopup()" style="
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
            Got it!
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Add CSS animations if not already added
    if (!document.querySelector('style[data-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-animations', 'true');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Show success popup
function showSuccessPopup() {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create popup content
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        animation: slideIn 0.3s ease;
    `;
    
    popup.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: #10b981;"></i>
        </div>
        <h3 style="margin-bottom: 1rem; color: #1f2937;">Application Submitted!</h3>
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem;">
            Thank you for your application to Momentvm.club! We've received your submission and will review it carefully.
        </p>
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem;">
            You can expect to hear back from us within 48 hours.
        </p>
        <button onclick="closePopup()" style="
            background: #1e40af;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        " onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#1e40af'">
            Got it!
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Show error popup
function showErrorPopup(message) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create popup content
    const popup = document.createElement('div');
    popup.className = 'error-popup';
    popup.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        animation: slideIn 0.3s ease;
    `;
    
    popup.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444;"></i>
        </div>
        <h3 style="margin-bottom: 1rem; color: #1f2937;">Oops! Something went wrong</h3>
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem;">
            ${message}
        </p>
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem;">
            Please try again or contact us directly at momentvmclub@gmail.com
        </p>
        <button onclick="closePopup()" style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        " onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
            Try Again
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Add CSS animations if not already added
    if (!document.querySelector('style[data-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-animations', 'true');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Close popup function
function closePopup() {
    const overlay = document.querySelector('.popup-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.about-card, .benefit-item, .member-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes("+") ? "+" : "");
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes("+") ? "+" : "");
        }
    }, 16);
}
function animateCountdown(element, target, duration = 2000) {
    let start = target;
    const decrement = target / (duration / 16);
    
    const timer = setInterval(() => {
        start -= decrement;
        if (start <= 0) {
            element.textContent = "0" + (element.textContent.includes("+") ? "+" : "");
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes("+") ? "+" : "");
        }
    }, 16);
}    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector(".stat-number");
            const statLabels = entry.target.querySelectorAll(".stat-label");
            const text = statNumber.textContent;
            const number = parseInt(text.replace(/\D/g, ""));
            
            if (number > 0) {
                const isBSStat = Array.from(statLabels).some(label => label.textContent.includes("BS"));
                if (isBSStat) {
                    statNumber.textContent = "100" + (text.includes("+") ? "+" : "");
                    animateCountdown(statNumber, number);
                } else {
                    statNumber.textContent = "0" + (text.includes("+") ? "+" : "");
                    animateCounter(statNumber, number);
                }
            }
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });document.addEventListener('DOMContentLoaded', function() {
    const statElements = document.querySelectorAll('.stat');
    statElements.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Parallax effect for floating cards
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        card.style.transform = `translateY(${yPos}px)`;
    });
});

// Add CSS for mobile menu
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.1);
            padding: 2rem 0;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu .nav-link {
            margin: 1rem 0;
            font-size: 1.1rem;
        }
        
        .nav-toggle.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .nav-toggle.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
`;
document.head.appendChild(style);

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effect to cards
    const cards = document.querySelectorAll('.about-card, .member-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(135deg, #1e40af 0%, #ea580c 100%);
    z-index: 1001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', function() {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
}); 