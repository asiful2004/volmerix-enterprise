// Main JavaScript file for Volmerix Enterprise

// Prevent multiple initializations
if (window.volmerixInitialized) {
    console.log('Volmerix already initialized, skipping...');
} else {
    window.volmerixInitialized = true;

    // Global initialization
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Volmerix Enterprise initialized');

        // Ensure all modules are loaded
        const checkModules = () => {
            if (typeof i18n !== 'undefined' &&
                typeof currencyManager !== 'undefined' &&
                typeof createNavbar !== 'undefined') {
                console.log('All modules loaded successfully');
            }
        };

        // Check after a short delay to ensure all scripts are loaded
        setTimeout(checkModules, 100);
    });
}

// Utility functions
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
    }
}

function showMessage(message, type = 'success') {
    // Simple alert for now, can be enhanced with toast notifications
    alert(message);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString();
}

// Form validation utility
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formData) {
    const errors = [];

    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }

    if (!formData.email || !validateEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }

    if (!formData.message || formData.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters');
    }

    return errors;
}

// Smooth scroll for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Removed popstate event listener that was causing unwanted page reloads
// For static sites, normal browser navigation works fine without this

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to monitoring service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send error reports to monitoring service
});

// Performance monitoring (basic)
window.addEventListener('load', function() {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
});
