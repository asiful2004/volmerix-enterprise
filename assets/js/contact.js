// Contact form functionality for Volmerix Enterprise

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.messageDiv = document.getElementById('form-message');
        this.successMessage = document.getElementById('success-message');
        this.errorMessage = document.getElementById('error-message');

        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            message: formData.get('message').trim()
        };

        // Validate form
        const errors = validateForm(data);
        if (errors.length > 0) {
            this.showError(errors.join('<br>'));
            return;
        }

        // Show loading state
        this.setLoading(true);

        try {
            // Send to PHP backend
            const response = await fetch('api/contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showSuccess();
                this.form.reset();
            } else {
                this.showError(result.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            this.showError('Network error. Please try again later.');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = i18n ? i18n.t('send-message') : 'Send Message';
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }

    showSuccess() {
        this.messageDiv.classList.remove('hidden');
        this.successMessage.classList.remove('hidden');
        this.errorMessage.classList.add('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideMessages();
        }, 5000);
    }

    showError(message) {
        this.messageDiv.classList.remove('hidden');
        this.errorMessage.classList.remove('hidden');
        this.successMessage.classList.add('hidden');
        this.errorMessage.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
    }

    hideMessages() {
        this.messageDiv.classList.add('hidden');
        this.successMessage.classList.add('hidden');
        this.errorMessage.classList.add('hidden');
    }
}

// Initialize contact form when DOM is loaded
if (!window.contactFormInitialized) {
    window.contactFormInitialized = true;
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('contact-form')) {
            new ContactForm();
        }
    });
}
