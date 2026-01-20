// Beautiful Notification System for Volmerix Enterprise
// Supports multiple languages and beautiful animations

class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.init();
    }

    init() {
        // Create notification container
        this.createContainer();

        // Add CSS styles
        this.addStyles();

        console.log('Notification system initialized');
    }

    createContainer() {
        // Remove existing container if any
        const existing = document.getElementById('notification-container');
        if (existing) {
            existing.remove();
        }

        // Create new container
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'notification-container';
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-atomic', 'false');

        // Position: top-right corner
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            pointer-events: none;
        `;

        document.body.appendChild(this.container);
    }

    addStyles() {
        if (document.getElementById('notification-styles')) {
            return; // Already added
        }

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-container {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .notification-toast {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
                margin-bottom: 12px;
                padding: 16px 20px;
                border-left: 4px solid;
                pointer-events: auto;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .notification-toast.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification-toast.hide {
                transform: translateX(100%);
                opacity: 0;
            }

            .notification-toast.success {
                border-left-color: #10b981;
                background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
            }

            .notification-toast.error {
                border-left-color: #ef4444;
                background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
            }

            .notification-toast.warning {
                border-left-color: #f59e0b;
                background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
            }

            .notification-toast.info {
                border-left-color: #3b82f6;
                background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
            }

            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }

            .notification-icon {
                flex-shrink: 0;
                width: 20px;
                height: 20px;
                margin-top: 2px;
            }

            .notification-text {
                flex: 1;
                font-size: 14px;
                line-height: 1.4;
                color: #374151;
            }

            .notification-title {
                font-weight: 600;
                color: #111827;
                margin-bottom: 2px;
                font-size: 15px;
            }

            .notification-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s;
                margin-left: 8px;
                flex-shrink: 0;
            }

            .notification-close:hover {
                color: #6b7280;
                background: rgba(0, 0, 0, 0.05);
            }

            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: currentColor;
                border-radius: 0 0 12px 12px;
                opacity: 0.7;
            }

            @media (max-width: 640px) {
                .notification-container {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Show notification
    show(options = {}) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 5000,
            persistent = false
        } = options;

        // Get translated messages
        const translatedTitle = this.getTranslatedText(title);
        const translatedMessage = this.getTranslatedText(message);

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;

        // Icon mapping
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <div class="notification-text">
                    ${translatedTitle ? `<div class="notification-title">${translatedTitle}</div>` : ''}
                    ${translatedMessage}
                </div>
                <button class="notification-close" aria-label="Close notification">
                    ✕
                </button>
            </div>
            ${!persistent ? '<div class="notification-progress"></div>' : ''}
        `;

        // Add to container
        this.container.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Progress bar animation
        let progressBar = null;
        let progressInterval = null;

        if (!persistent && duration > 0) {
            progressBar = notification.querySelector('.notification-progress');
            if (progressBar) {
                let width = 100;
                progressInterval = setInterval(() => {
                    width -= 100 / (duration / 100); // Update every 100ms
                    if (width <= 0) {
                        width = 0;
                        clearInterval(progressInterval);
                        this.hide(notification);
                    }
                    progressBar.style.width = width + '%';
                }, 100);
            }
        }

        // Auto-hide after duration (if not persistent)
        let autoHideTimeout = null;
        if (!persistent && duration > 0) {
            autoHideTimeout = setTimeout(() => {
                this.hide(notification);
            }, duration);
        }

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            if (autoHideTimeout) clearTimeout(autoHideTimeout);
            if (progressInterval) clearInterval(progressInterval);
            this.hide(notification);
        });

        // Store notification info
        notification._notificationData = {
            autoHideTimeout,
            progressInterval
        };

        return notification;
    }

    // Hide notification
    hide(notification) {
        if (!notification) return;

        // Clear timers
        if (notification._notificationData) {
            const { autoHideTimeout, progressInterval } = notification._notificationData;
            if (autoHideTimeout) clearTimeout(autoHideTimeout);
            if (progressInterval) clearInterval(progressInterval);
        }

        // Animate out
        notification.classList.remove('show');
        notification.classList.add('hide');

        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Get translated text
    getTranslatedText(key) {
        // Try to get from i18n system first
        if (typeof i18n !== 'undefined' && i18n.t) {
            const translated = i18n.t(key);
            if (translated && translated !== key) {
                return translated;
            }
        }

        // Fallback to built-in translations
        const translations = {
            en: {
                'Form submitted successfully!': 'Form submitted successfully!',
                'Thank you for your message.': 'Thank you for your message.',
                'Order placed successfully!': 'Order placed successfully!',
                'We will contact you soon.': 'We will contact you soon.',
                'Review submitted successfully!': 'Review submitted successfully!',
                'Network error. Please try again.': 'Network error. Please try again.',
                'Please fill in all required fields': 'Please fill in all required fields',
                'Please enter a valid email address': 'Please enter a valid email address',
                'Form submission failed': 'Form submission failed',
                'Success': 'Success',
                'Error': 'Error',
                'Warning': 'Warning',
                'Information': 'Information'
            },
            kr: {
                'Form submitted successfully!': '양식이 성공적으로 제출되었습니다!',
                'Thank you for your message.': '메시지를 보내주셔서 감사합니다.',
                'Order placed successfully!': '주문이 성공적으로 접수되었습니다!',
                'We will contact you soon.': '곧 연락드리겠습니다.',
                'Review submitted successfully!': '리뷰가 성공적으로 제출되었습니다!',
                'Network error. Please try again.': '네트워크 오류입니다. 다시 시도해 주세요.',
                'Please fill in all required fields': '모든 필수 필드를 입력해 주세요',
                'Please enter a valid email address': '유효한 이메일 주소를 입력해 주세요',
                'Form submission failed': '양식 제출 실패',
                'Success': '성공',
                'Error': '오류',
                'Warning': '경고',
                'Information': '정보'
            }
        };

        // Get current language
        const currentLang = (typeof i18n !== 'undefined' && i18n.currentLang) ? i18n.currentLang : 'en';
        const langTranslations = translations[currentLang] || translations.en;

        return langTranslations[key] || key;
    }

    // Convenience methods
    success(message, title = 'Success') {
        return this.show({ type: 'success', title, message });
    }

    error(message, title = 'Error') {
        return this.show({ type: 'error', title, message });
    }

    warning(message, title = 'Warning') {
        return this.show({ type: 'warning', title, message });
    }

    info(message, title = 'Information') {
        return this.show({ type: 'info', title, message });
    }
}

// Global notification system
const notifications = new NotificationSystem();

// Make it globally available
window.notifications = notifications;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Notification system ready');
});

// Export for ES modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}
