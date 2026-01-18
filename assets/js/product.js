// Product page functionality for Volmerix Enterprise

class ProductPage {
    constructor() {
        this.product = null;
        this.reviews = [];
        this.init();
    }

    init() {
        this.loadProductFromURL();
        this.setupOrderForm();
        this.setupReviewForm();
        this.loadReviews();
        this.setupContactMethodToggle();
    }

    loadProductFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        const id = urlParams.get('id');

        if (slug) {
            this.product = getProductBySlug(slug);
        } else if (id) {
            this.product = getProductById(parseInt(id));
        }

        if (this.product) {
            this.displayProduct();
        } else {
            this.showProductNotFound();
        }
    }

    displayProduct() {
        // Update page title
        document.title = `${this.product.name} - Volmerix Enterprise`;

        // Update breadcrumb
        document.getElementById('breadcrumb-product').textContent = this.product.name;

        // Update product title
        document.getElementById('product-title').textContent = this.product.name;

        // Update product image
        const imageElement = document.getElementById('product-image');
        imageElement.src = this.product.image;
        imageElement.alt = this.product.name;

        // Update product description
        const lang = typeof i18n !== 'undefined' ? i18n.currentLang : 'en';
        const description = lang === 'kr' ? this.product.descriptionKr : this.product.description;
        document.getElementById('product-description').textContent = description;

        // Update features
        this.displayFeatures();

        // Update price
        const priceElement = document.getElementById('product-price');
        if (currencyManager) {
            priceElement.textContent = currencyManager.formatPrice(this.product.price);
        } else {
            priceElement.textContent = `₩${this.product.price.toLocaleString()}`;
        }

        // Update rating
        this.displayRating();
    }

    displayFeatures() {
        const featuresList = document.getElementById('product-features');
        const features = [
            'Monthly subscription access',
            'Fast delivery within 24 hours',
            'Premium quality guaranteed',
            '24/7 customer support',
            'Secure payment processing',
            'Region-optimized accounts'
        ];

        featuresList.innerHTML = features.map(feature => `
            <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-3"></i>
                <span class="text-gray-700">${feature}</span>
            </li>
        `).join('');
    }

    displayRating() {
        const starsElement = document.getElementById('product-stars');
        const reviewsElement = document.getElementById('product-reviews');

        const fullStars = Math.floor(this.product.rating);
        const emptyStars = 5 - fullStars;

        starsElement.textContent = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
        reviewsElement.textContent = `(${this.product.reviews} reviews)`;
    }

    showProductNotFound() {
        document.getElementById('product-title').textContent = 'Product Not Found';
        document.getElementById('product-description').textContent = 'The product you are looking for does not exist.';
        document.getElementById('product-price').textContent = 'N/A';
        document.getElementById('product-features').innerHTML = '<li class="text-gray-500">No features available</li>';
    }

    setupOrderForm() {
        const form = document.getElementById('order-form');
        if (!form) return;

        form.addEventListener('submit', (e) => this.handleOrderSubmit(e));
    }

    async handleOrderSubmit(e) {
        e.preventDefault();

        if (!this.product) {
            this.showOrderError('Product not found');
            return;
        }

        const formData = new FormData(e.target);
        const orderData = {
            product_id: this.product.id,
            product_name: this.product.name,
            product_price: this.product.price,
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            contact_method: formData.get('contact_method'),
            whatsapp_id: formData.get('whatsapp_id'),
            company_name: formData.get('company_name') || '',
            currency: currencyManager ? currencyManager.getCurrentCurrency() : 'KRW',
            timestamp: new Date().toISOString()
        };

        // Validate required fields
        if (!orderData.full_name || !orderData.email || !orderData.whatsapp_id) {
            this.showOrderError('Please fill in all required fields');
            return;
        }

        if (!validateEmail(orderData.email)) {
            this.showOrderError('Please enter a valid email address');
            return;
        }

        // Show loading
        this.setOrderFormLoading(true);

        try {
            // Format price for display
            const displayPrice = currencyManager ?
                currencyManager.formatPrice(this.product.price) :
                `₩${this.product.price.toLocaleString()}`;

            // Prepare Discord webhook message
            const discordMessage = {
                content: `🛒 **New Detailed Order Received!**`,
                embeds: [
                    {
                        title: 'Order Details',
                        color: 15158332, // Red color
                        fields: [
                            {
                                name: 'Product',
                                value: `${this.product.name} (${displayPrice})`,
                                inline: true
                            },
                            {
                                name: 'Customer',
                                value: `${orderData.full_name}\n${orderData.email}`,
                                inline: true
                            },
                            {
                                name: 'Contact Method',
                                value: `${orderData.contact_method}: ${orderData.whatsapp_id}`,
                                inline: false
                            },
                            {
                                name: 'Company',
                                value: orderData.company_name || 'Not provided',
                                inline: true
                            },
                            {
                                name: 'Order Time',
                                value: new Date().toLocaleString(),
                                inline: true
                            }
                        ],
                        footer: {
                            text: 'Volmerix Enterprise Order System'
                        }
                    }
                ],
                username: 'Volmerix Order Bot',
                avatar_url: 'https://i.imgur.com/placeholder.png'
            };

            const response = await fetch('api/order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(discordMessage)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showOrderSuccess();
                e.target.reset();
            } else {
                this.showOrderError(result.error || 'Failed to submit order');
            }
        } catch (error) {
            console.error('Order submission error:', error);
            this.showOrderError('Network error. Please try again later.');
        } finally {
            this.setOrderFormLoading(false);
        }
    }

    setOrderFormLoading(loading) {
        const submitBtn = document.querySelector('#order-form button[type="submit"]');
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Place Order';
        }
    }

    showOrderSuccess() {
        const messagesDiv = document.getElementById('form-messages');
        const successDiv = document.getElementById('success-message');
        const errorDiv = document.getElementById('error-message');

        messagesDiv.classList.remove('hidden');
        successDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');

        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto-hide after 10 seconds
        setTimeout(() => {
            messagesDiv.classList.add('hidden');
        }, 10000);
    }

    showOrderError(message) {
        const messagesDiv = document.getElementById('form-messages');
        const successDiv = document.getElementById('success-message');
        const errorDiv = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');

        messagesDiv.classList.remove('hidden');
        successDiv.classList.add('hidden');
        errorDiv.classList.remove('hidden');
        errorText.textContent = message;
    }

    setupContactMethodToggle() {
        const contactMethodSelect = document.getElementById('contact-method');
        const whatsappLabel = document.querySelector('label[for="whatsapp-id"]');
        const whatsappInput = document.getElementById('whatsapp-id');

        if (contactMethodSelect) {
            contactMethodSelect.addEventListener('change', (e) => {
                const method = e.target.value;
                const labelText = method.charAt(0).toUpperCase() + method.slice(1) + ' ID *';
                if (whatsappLabel) whatsappLabel.textContent = labelText;

                // Update placeholder based on method
                const placeholders = {
                    whatsapp: '+1234567890 or username',
                    telegram: '@username or +1234567890',
                    discord: 'username#1234 or User ID',
                    email: 'Already provided above'
                };

                if (whatsappInput) {
                    whatsappInput.placeholder = placeholders[method] || 'Enter contact details';
                    whatsappInput.required = method !== 'email';
                }
            });
        }
    }

    setupReviewForm() {
        const form = document.getElementById('review-form');
        if (!form) return;

        // Setup star rating
        this.setupStarRating();

        form.addEventListener('submit', (e) => this.handleReviewSubmit(e));
    }

    setupStarRating() {
        const stars = document.querySelectorAll('#rating-stars .star');
        const ratingInput = document.getElementById('review-rating');
        let selectedRating = 0;

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                selectedRating = index + 1;
                ratingInput.value = selectedRating;

                // Update visual feedback
                stars.forEach((s, i) => {
                    if (i < selectedRating) {
                        s.className = 'star text-2xl text-yellow-400';
                    } else {
                        s.className = 'star text-2xl text-gray-300';
                    }
                });
            });

            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.className = 'star text-2xl text-yellow-400';
                    } else {
                        s.className = 'star text-2xl text-gray-300';
                    }
                });
            });
        });

        document.getElementById('rating-stars').addEventListener('mouseleave', () => {
            stars.forEach((s, i) => {
                if (i < selectedRating) {
                    s.className = 'star text-2xl text-yellow-400';
                } else {
                    s.className = 'star text-2xl text-gray-300';
                }
            });
        });
    }

    handleReviewSubmit(e) {
        e.preventDefault();

        if (!this.product) return;

        const formData = new FormData(e.target);
        const reviewData = {
            id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
            product_id: this.product.id,
            product_name: this.product.name,
            name: formData.get('review_name').trim(),
            email: formData.get('review_email').trim(),
            rating: parseInt(formData.get('rating')),
            review_text: formData.get('review_text').trim(),
            timestamp: new Date().toISOString(),
            browser_id: this.getBrowserId()
        };

        // Validate
        if (!reviewData.name || !reviewData.email || !reviewData.rating || !reviewData.review_text) {
            alert('Please fill in all required fields');
            return;
        }

        if (!validateEmail(reviewData.email)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            // Save to localStorage
            const reviewsKey = `reviews_${this.product.id}`;
            const existingReviews = JSON.parse(localStorage.getItem(reviewsKey) || '[]');

            // Check for duplicate reviews (same email on same product)
            const duplicate = existingReviews.find(review =>
                review.email === reviewData.email && review.product_id === reviewData.product_id
            );

            if (duplicate) {
                alert('You have already submitted a review for this product.');
                return;
            }

            existingReviews.push(reviewData);
            localStorage.setItem(reviewsKey, JSON.stringify(existingReviews));

            // Send Discord notification directly
            this.sendDiscordNotification(reviewData);

            // Success
            alert('Review submitted successfully!');
            e.target.reset();

            // Reset star rating
            document.querySelectorAll('#rating-stars .star').forEach(star => {
                star.className = 'star text-2xl text-gray-300';
            });
            document.getElementById('review-rating').value = '';

            // Reload reviews
            this.loadReviews();

        } catch (error) {
            console.error('Review submission error:', error);
            alert('Failed to save review. Please try again.');
        }
    }

    loadReviews() {
        if (!this.product) return;

        try {
            // Load reviews from localStorage
            const reviewsKey = `reviews_${this.product.id}`;
            const storedReviews = localStorage.getItem(reviewsKey);
            this.reviews = storedReviews ? JSON.parse(storedReviews) : [];

            // Sort by newest first
            this.reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            this.displayReviews();
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.reviews = [];
            this.displayReviews();
        }
    }

    sendDiscordNotification(reviewData) {
        // Send Discord notification for new review
        const discordWebhookUrl = 'https://discord.com/api/webhooks/1462099978171322522/d2eBv4ibb9OszUtSkCRZ4kCm4540f3knvG9yvdHjKeUc4OfzHItSflFHFDpn1lQQKI3d';

        const discordMessage = {
            content: '⭐ **New Product Review Submitted!**',
            embeds: [
                {
                    title: 'Review Details',
                    color: 16776960, // Yellow color
                    fields: [
                        {
                            name: 'Product',
                            value: reviewData.product_name,
                            inline: true
                        },
                        {
                            name: 'Rating',
                            value: '★'.repeat(reviewData.rating) + '☆'.repeat(5 - reviewData.rating),
                            inline: true
                        },
                        {
                            name: 'Customer',
                            value: `${reviewData.name} (${reviewData.email})`,
                            inline: false
                        },
                        {
                            name: 'Review',
                            value: reviewData.review_text.length > 500 ?
                                reviewData.review_text.substring(0, 500) + '...' :
                                reviewData.review_text,
                            inline: false
                        }
                    ],
                    footer: {
                        text: 'Volmerix Enterprise Review System'
                    },
                    timestamp: reviewData.timestamp
                }
            ],
            username: 'Volmerix Review Bot',
            avatar_url: 'https://i.imgur.com/placeholder.png'
        };

        // Send to Discord (don't wait for response)
        fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage)
        }).catch(error => {
            console.log('Discord notification failed:', error);
        });
    }

    getBrowserId() {
        // Generate a unique ID for this browser session
        let browserId = localStorage.getItem('browser_id');
        if (!browserId) {
            browserId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('browser_id', browserId);
        }
        return browserId;
    }

    displayReviews() {
        const reviewsList = document.getElementById('reviews-list');

        if (this.reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-comments text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-600 mb-2">No reviews yet</h3>
                    <p class="text-gray-500">Be the first to review this product!</p>
                </div>
            `;
            return;
        }

        reviewsList.innerHTML = this.reviews.map(review => this.renderReview(review)).join('');
    }

    renderReview(review) {
        const date = new Date(review.timestamp);
        const formattedDate = date.toLocaleDateString();

        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h4 class="font-semibold text-gray-900">${this.escapeHtml(review.name)}</h4>
                        <div class="flex items-center mt-1">
                            <div class="flex text-yellow-400 mr-2">
                                ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                            </div>
                            <span class="text-sm text-gray-500">${formattedDate}</span>
                        </div>
                    </div>
                </div>
                <p class="text-gray-700 leading-relaxed">${this.escapeHtml(review.review_text)}</p>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize product page when DOM is loaded
if (!window.productPageInitialized) {
    window.productPageInitialized = true;
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('product-details')) {
            window.productPage = new ProductPage();
        }
    });
}
