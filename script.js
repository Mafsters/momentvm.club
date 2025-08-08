// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// Quiz Modal Functionality
let currentQuestion = 1;
const totalQuestions = 4;
let quizAnswers = {};

// Show quiz modal on page load (with a small delay)
document.addEventListener('DOMContentLoaded', function() {
    // Show quiz modal after 2 seconds
    setTimeout(() => {
        showQuizModal();
    }, 2000);
});

function showQuizModal() {
    const modal = document.getElementById('quiz-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeQuizModal() {
    const modal = document.getElementById('quiz-modal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Reset quiz when closing
    restartQuiz();
}

function nextQuestion() {
    const currentQuestionElement = document.querySelector(`[data-question="${currentQuestion}"]`);
    const selectedOption = currentQuestionElement.querySelector('input[type="radio"]:checked');
    
    if (!selectedOption) {
        alert('Please select an answer before continuing.');
        return;
    }
    
    // Store the answer
    quizAnswers[`q${currentQuestion}`] = selectedOption.value;
    
    if (currentQuestion < totalQuestions) {
        // Move to next question
        currentQuestionElement.classList.remove('active');
        currentQuestion++;
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.add('active');
        
        // Update navigation buttons
        document.getElementById('prev-btn').style.display = 'block';
        if (currentQuestion === totalQuestions) {
            document.getElementById('next-btn').textContent = 'See Results';
        }
    } else {
        // Show results
        showQuizResults();
    }
}

function prevQuestion() {
    if (currentQuestion > 1) {
        const currentQuestionElement = document.querySelector(`[data-question="${currentQuestion}"]`);
        currentQuestionElement.classList.remove('active');
        currentQuestion--;
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.add('active');
        
        // Update navigation buttons
        if (currentQuestion === 1) {
            document.getElementById('prev-btn').style.display = 'none';
        }
        document.getElementById('next-btn').textContent = 'Next';
    }
}

function showQuizResults() {
    // Hide current question and navigation
    document.querySelector(`[data-question="${currentQuestion}"]`).classList.remove('active');
    document.querySelector('.quiz-navigation').style.display = 'none';
    
    // Calculate results
    const yesAnswers = Object.values(quizAnswers).filter(answer => answer === 'yes').length;
    const resultElement = document.getElementById('quiz-result');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    
    if (yesAnswers >= 3) {
        resultTitle.textContent = "You're a great fit! 🎉";
        resultMessage.textContent = "Based on your answers, you'd be a valuable addition to our community. You have the right mindset and experience to contribute meaningfully while learning from others. We'd love to have you join us!";
    } else if (yesAnswers >= 2) {
        resultTitle.textContent = "You might be a good fit! 🤔";
        resultMessage.textContent = "You have some of the qualities we're looking for, but there might be areas where you could grow. Consider applying anyway - we value potential and willingness to contribute over perfect qualifications.";
    } else {
        resultTitle.textContent = "Maybe not the right time 😊";
        resultMessage.textContent = "Based on your answers, this community might not be the best fit for you right now. That's totally okay! Focus on building your experience and skills, and feel free to apply again in the future.";
    }
    
    resultElement.classList.add('active');
}

function scrollToForm() {
    closeQuizModal(); // Close the modal first
    setTimeout(() => {
        document.getElementById('quickRegistrationForm').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 300); // Small delay to allow modal to close
}

function restartQuiz() {
    // Reset quiz state
    currentQuestion = 1;
    quizAnswers = {};
    
    // Reset all questions
    document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
    document.querySelector(`[data-question="1"]`).classList.add('active');
    
    // Reset navigation
    document.getElementById('prev-btn').style.display = 'none';
    document.getElementById('next-btn').textContent = 'Next';
    document.querySelector('.quiz-navigation').style.display = 'flex';
    
    // Hide results
    document.getElementById('quiz-result').classList.remove('active');
    
    // Clear all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
}

// Initialize EmailJS
let emailjsInitialized = false;

function initializeEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('CH7Idv-T3WhDQYjtb');
        emailjsInitialized = true;
        console.log('EmailJS initialized successfully');
    } else {
        setTimeout(initializeEmailJS, 100);
    }
}

// Initialize when EmailJS loads
if (typeof emailjs !== 'undefined') {
    initializeEmailJS();
} else {
    const checkEmailJS = () => {
        if (typeof emailjs !== 'undefined') {
            initializeEmailJS();
        } else {
            setTimeout(checkEmailJS, 100);
        }
    };
    checkEmailJS();
}

// Handle form submissions
function handleFormSubmission(form, formType) {
    console.log('Form submission started:', formType);
    
    // Prevent default form submission
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        from_name: formData.get('from_name'),
        from_email: formData.get('from_email'),
        linkedin_url: formData.get('linkedin_url'),
        role: formData.get('role'),
        company: formData.get('company'),
        expertise: formData.get('expertise'),
        motivation: formData.get('motivation')
    };
    
    console.log('Form data:', data);
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Send email
    sendFormEmail(form, formType)
        .then((response) => {
            console.log('Email sent successfully:', response);
            showSuccessPopup();
            form.reset();
        })
        .catch((error) => {
            console.error('Email failed:', error);
            showErrorPopup('Failed to send email. Please try again or contact us directly.');
        })
        .finally(() => {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
}

// Validate form data
function validateForm(data) {
    const requiredFields = ['from_name', 'from_email', 'role', 'expertise', 'motivation'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            alert(`Please fill in the ${field.replace('_', ' ')} field.`);
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.from_email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    return true;
}

// Send email using EmailJS
function sendFormEmail(form, formType) {
    return new Promise((resolve, reject) => {
        if (!emailjsInitialized) {
            reject(new Error('EmailJS not initialized'));
            return;
        }
        
        console.log('Sending email with form data...');
        
        const serviceID = 'service_lb1tvqc';
        const templateID = 'template_1bsatl6';
        
        emailjs.sendForm(serviceID, templateID, form)
            .then((response) => {
                console.log('EmailJS success:', response);
                resolve(response);
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                reject(error);
            });
    });
}

// Show success popup
function showSuccessPopup() {
    const overlay = document.createElement('div');
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
    `;
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    `;
    
    popup.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <span style="font-size: 3rem; color: #10b981;">✓</span>
        </div>
        <h3 style="margin-bottom: 1rem; color: #1f2937;">Success!</h3>
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem;">
            Your application has been sent successfully. We'll get back to you soon!
        </p>
        <button onclick="closePopup()" style="
            background: #10b981;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
        ">
            Got it!
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// Show error popup
function showErrorPopup(message) {
    const overlay = document.createElement('div');
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
    `;
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    `;
    
    popup.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <span style="font-size: 3rem; color: #ef4444;">✗</span>
        </div>
        <h3 style="margin-bottom: 1rem; color: #1f2937;">Error</h3>
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem;">
            ${message}
        </p>
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem;">
            Or contact us directly at: <strong>momentvmclub@gmail.com</strong>
        </p>
        <button onclick="closePopup()" style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
        ">
            Got it!
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// Close popup
function closePopup() {
    const overlay = document.querySelector('div[style*="position: fixed"]');
    if (overlay) {
        overlay.remove();
    }
}

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing forms...');
    
    // Application form
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        console.log('Found application form');
        applicationForm.addEventListener('submit', function(event) {
            handleFormSubmission(this, 'application');
        });
    }
    
    // Quick registration form
    const quickRegistrationForm = document.getElementById('quickRegistrationForm');
    if (quickRegistrationForm) {
        console.log('Found quick registration form');
        quickRegistrationForm.addEventListener('submit', function(event) {
            handleFormSubmission(this, 'quick');
        });
    }
    
    // Initialize stats animation
    const statElements = document.querySelectorAll('.stat');
    statElements.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    console.log('Forms and stats initialized');
}); 
// Stats animation functions
function animateCounter(element, target, duration = 2000) {
    let start = 0;
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
}, { threshold: 0.5 });
