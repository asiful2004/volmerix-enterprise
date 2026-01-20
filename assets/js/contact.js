// Contact form functionality for Volmerix Enterprise

class ContactForm {
    constructor() {
        // Prevent multiple instantiations
        if (window.contactFormInstance) {
            console.warn('ContactForm already instantiated, skipping duplicate initialization');
            return window.contactFormInstance;
        }

        this.form = document.getElementById('contact-form');
        this.messageDiv = document.getElementById('form-message');
        this.successMessage = document.getElementById('success-message');
        this.errorMessage = document.getElementById('error-message');

        this.init();
        window.contactFormInstance = this;
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Prevent double submission
        if (this.isSubmitting) {
            console.warn('Contact form: Double submission prevented');
            return;
        }

        console.log('Contact form: Starting submission');

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
            console.log('Contact form: Validation failed', errors);
            this.showError(errors.join('<br>'));
            return;
        }

        // Set submission flag
        this.isSubmitting = true;
        console.log('Contact form: Submission flag set to true');

        // Show loading state
        this.setLoading(true);

        try {
            console.log('Contact form: Sending to api/contact.php', data);
            // Send to PHP backend
            const response = await fetch('api/contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            console.log('Contact form: Response received', response.status);
            const result = await response.json();
            console.log('Contact form: Result', result);

            if (response.ok && result.success) {
                console.log('Contact form: Success - resetting form');
                this.form.reset();

                // Show beautiful notification
                if (window.notifications) {
                    window.notifications.success(
                        'Thank you for your message.',
                        'Form submitted successfully!'
                    );
                } else {
                    this.showSuccess(); // Fallback
                }
            } else {
                console.error('Contact form: Error response', result);

                // Show beautiful error notification
                if (window.notifications) {
                    window.notifications.error(
                        result.error || 'Failed to send message',
                        'Form submission failed'
                    );
                } else {
                    this.showError(result.error || 'Failed to send message'); // Fallback
                }
            }
        } catch (error) {
            console.error('Contact form: Network error:', error);
            this.showError('Network error. Please try again later.');
        } finally {
            this.setLoading(false);
            this.isSubmitting = false;
            console.log('Contact form: Submission flag reset to false');
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

// Make ContactForm class globally available
window.ContactForm = ContactForm;

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contact-form') && !window.contactFormInstance) {
        new ContactForm();
    }
});
