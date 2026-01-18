// Admin panel functionality for viewing contact messages

class AdminPanel {
    constructor() {
        this.messages = [];
        this.init();
    }

    init() {
        this.loadMessages();
        this.loadReviews();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadMessages();
                this.loadReviews();
            });
        }

        // Export reviews functionality
        const exportBtn = document.getElementById('export-reviews-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportReviews());
        }

        // Import reviews functionality
        const importBtn = document.getElementById('import-reviews-btn');
        const importFile = document.getElementById('import-file');

        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', (e) => this.importReviews(e));
        }
    }

    async loadMessages() {
        try {
            showLoading(document.getElementById('messages-table'));

            // Fetch messages from data/contacts.json
            const response = await fetch('data/contacts.json');
            if (response.ok) {
                this.messages = await response.json();
                this.messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first
            } else {
                this.messages = [];
            }

            this.renderMessages();
            this.updateStats();
        } catch (error) {
            console.error('Error loading messages:', error);
            this.messages = [];
            this.renderMessages();
        } finally {
            hideLoading(document.getElementById('messages-table'));
        }
    }

    loadReviews() {
        try {
            // Load all reviews from localStorage for all products
            this.reviews = [];
            const products = [1, 2, 3, 4, 5, 6]; // Product IDs

            products.forEach(productId => {
                const reviewsKey = `reviews_${productId}`;
                const storedReviews = localStorage.getItem(reviewsKey);
                if (storedReviews) {
                    const productReviews = JSON.parse(storedReviews);
                    this.reviews = this.reviews.concat(productReviews);
                }
            });

            // Sort by newest first
            this.reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            this.renderReviews();
            this.updateReviewStats();
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.reviews = [];
            this.renderReviews();
        }
    }

    renderMessages() {
        const tableBody = document.getElementById('messages-table');
        const emptyState = document.getElementById('empty-state');

        if (!tableBody) return;

        if (this.messages.length === 0) {
            tableBody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        tableBody.innerHTML = this.messages.map(message => this.renderMessageRow(message)).join('');
    }

    renderMessageRow(message) {
        const date = new Date(message.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Truncate message for display
        const shortMessage = message.message.length > 100 ?
            message.message.substring(0, 100) + '...' :
            message.message;

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${this.escapeHtml(message.name)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${this.escapeHtml(message.email)}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-xs truncate" title="${this.escapeHtml(message.message)}">
                        ${this.escapeHtml(shortMessage)}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${formattedDate}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="viewFullMessage('${message.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                        View
                    </button>
                    <button onclick="deleteMessage('${message.id}')" class="text-purple-600 hover:text-purple-900">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }

    updateStats() {
        const totalElement = document.getElementById('total-messages');
        const todayElement = document.getElementById('today-messages');
        const weekElement = document.getElementById('week-messages');

        if (totalElement) totalElement.textContent = this.messages.length;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        let todayCount = 0;
        let weekCount = 0;

        this.messages.forEach(message => {
            const messageDate = new Date(message.timestamp);
            if (messageDate >= today) {
                todayCount++;
            }
            if (messageDate >= weekAgo) {
                weekCount++;
            }
        });

        if (todayElement) todayElement.textContent = todayCount;
        if (weekElement) weekElement.textContent = weekCount;
    }

    renderReviews() {
        const tableBody = document.getElementById('reviews-table');
        const emptyState = document.getElementById('reviews-empty-state');

        if (!tableBody) return;

        if (this.reviews.length === 0) {
            tableBody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        tableBody.innerHTML = this.reviews.slice(0, 10).map(review => this.renderReviewRow(review)).join(''); // Show latest 10 reviews
    }

    renderReviewRow(review) {
        const date = new Date(review.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Truncate review text for display
        const shortReview = review.review_text.length > 100 ?
            review.review_text.substring(0, 100) + '...' :
            review.review_text;

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${this.escapeHtml(review.product_name)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${this.escapeHtml(review.name)}</div>
                    <div class="text-xs text-gray-500">${this.escapeHtml(review.email)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex text-yellow-400">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                    <div class="text-xs text-gray-500">${review.rating}/5</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-xs truncate" title="${this.escapeHtml(review.review_text)}">
                        ${this.escapeHtml(shortReview)}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${formattedDate}</div>
                </td>
            </tr>
        `;
    }

    updateReviewStats() {
        // Could add review stats here if needed
        // For now, just ensure the reviews are loaded
    }

    exportReviews() {
        try {
            // Collect all reviews from localStorage
            const allReviews = {};
            const products = [1, 2, 3, 4, 5, 6];

            products.forEach(productId => {
                const reviewsKey = `reviews_${productId}`;
                const storedReviews = localStorage.getItem(reviewsKey);
                if (storedReviews) {
                    allReviews[reviewsKey] = JSON.parse(storedReviews);
                }
            });

            // Create export data
            const exportData = {
                exportDate: new Date().toISOString(),
                reviews: allReviews,
                totalReviews: Object.values(allReviews).reduce((total, reviews) => total + reviews.length, 0)
            };

            // Create and download JSON file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `volmerix_reviews_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert('Reviews exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export reviews.');
        }
    }

    importReviews(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);

                if (!importData.reviews) {
                    alert('Invalid import file format.');
                    return;
                }

                // Import reviews to localStorage
                let importedCount = 0;
                Object.entries(importData.reviews).forEach(([key, reviews]) => {
                    if (Array.isArray(reviews)) {
                        // Merge with existing reviews
                        const existingReviews = JSON.parse(localStorage.getItem(key) || '[]');
                        const mergedReviews = [...existingReviews];

                        reviews.forEach(review => {
                            // Check if review already exists (by ID)
                            const exists = mergedReviews.find(r => r.id === review.id);
                            if (!exists) {
                                mergedReviews.push(review);
                                importedCount++;
                            }
                        });

                        localStorage.setItem(key, JSON.stringify(mergedReviews));
                    }
                });

                // Reload reviews
                this.loadReviews();

                alert(`Successfully imported ${importedCount} reviews!`);
            } catch (error) {
                console.error('Import error:', error);
                alert('Failed to import reviews. Please check the file format.');
            }
        };

        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global functions for button actions
function viewFullMessage(messageId) {
    const message = adminPanel.messages.find(m => m.id === messageId);
    if (message) {
        alert(`From: ${message.name} <${message.email}>\n\nTime: ${new Date(message.timestamp).toLocaleString()}\n\nMessage:\n${message.message}`);
    }
}

function deleteMessage(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
        // In a real application, you'd send a delete request to the server
        // For now, we'll just show a message
        alert('Delete functionality would be implemented with server-side code.\n\nMessage ID: ' + messageId);
    }
}

// Make AdminPanel class globally available
window.AdminPanel = AdminPanel;

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('messages-table')) {
        window.adminPanel = new AdminPanel();
    }
});
