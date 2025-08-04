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
    
    console.log('Forms initialized');
}); 