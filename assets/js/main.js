// Main JavaScript file for Volmerix Enterprise

// Global initialization function
function initializeVolmerix() {
    console.log('Initializing Volmerix Enterprise...');

    // Ensure all modules are loaded with proper error handling
    const checkModules = () => {
        const modules = {
            i18n: typeof i18n !== 'undefined',
            currencyManager: typeof currencyManager !== 'undefined',
            createNavbar: typeof createNavbar !== 'undefined',
            products: typeof products !== 'undefined'
        };

        const loadedModules = Object.keys(modules).filter(key => modules[key]);
        const missingModules = Object.keys(modules).filter(key => !modules[key]);

        console.log(`Modules loaded: ${loadedModules.join(', ')}`);
        if (missingModules.length > 0) {
            console.warn(`Missing modules: ${missingModules.join(', ')}`);
        }

        // Initialize components even if some modules are missing
        try {
            // Always try to initialize navbar
            if (typeof createNavbar === 'function') {
                createNavbar();
            }

            // Initialize page-specific components
            if (document.getElementById('featured-slider') && typeof initHomePage === 'function') {
                initHomePage();
            }

            if (document.getElementById('products-container') && typeof ShopManager === 'function') {
                new ShopManager();
            }

            if (document.getElementById('contact-form') && typeof ContactForm === 'function') {
                new ContactForm();
            }

            if (document.getElementById('messages-table') && typeof AdminPanel === 'function') {
                window.adminPanel = new AdminPanel();
            }

            if (document.getElementById('product-details') && typeof ProductPage === 'function') {
                window.productPage = new ProductPage();
            }

            // Update i18n content after all components are loaded
            if (typeof i18n !== 'undefined' && typeof i18n.updateContent === 'function') {
                setTimeout(() => {
                    i18n.updateContent();
                    console.log('i18n content updated after component initialization');
                }, 200);
            }

        } catch (error) {
            console.error('Error during initialization:', error);
        }
    };

    // Run initialization immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkModules);
    } else {
        checkModules();
    }
}



// Start initialization
initializeVolmerix();

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
