// Product page functionality for Volmerix Enterprise

class ProductPage {
    constructor() {
        // Prevent multiple instantiations
        if (window.productPageInstance) {
            console.warn('ProductPage already instantiated, skipping duplicate initialization');
            return window.productPageInstance;
        }

        this.product = null;
        this.reviews = [];
        this.filteredReviews = [];
        this.currentRatingFilter = 'all'; // 'all', '5', '4', '3', '2', '1'
        this.currentSort = 'newest'; // 'newest', 'oldest', 'highest', 'lowest'
        this.isSubmittingOrder = false;
        this.isSubmittingReview = false;
        this.init();
        window.productPageInstance = this;
    }

    init() {
        this.loadProductFromURL();
        this.setupOrderForm();
        this.setupReviewForm();
        this.setupReviewFilters();
        this.loadReviews();
        this.setupContactMethodToggle();
        this.setupLanguageChangeListener();
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

        // Update translations for dynamically added content
        setTimeout(() => {
            if (typeof i18n !== 'undefined' && typeof i18n.updateContent === 'function') {
                i18n.updateContent();
            }
        }, 50);
    }

    displayProduct() {
        // Get translated product name
        const lang = typeof i18n !== 'undefined' ? i18n.currentLang : 'en';
        const productName = lang === 'kr' ? this.product.nameKr : this.product.name;

        // Update page title
        document.title = `${productName} - Volmerix Enterprise`;

        // Update breadcrumb
        document.getElementById('breadcrumb-product').textContent = productName;

        // Update product title
        document.getElementById('product-title').textContent = productName;

        // Update product image
        const imageElement = document.getElementById('product-image');
        imageElement.src = this.product.image;
        imageElement.alt = this.product.name;

        // Update product description
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
            'monthly-subscription',
            'fast-delivery',
            'premium-quality',
            'support-24-7',
            'secure-payments',
            'optimized-accounts'
        ];

        featuresList.innerHTML = features.map(featureKey => {
            const featureText = typeof i18n !== 'undefined' ? i18n.t(featureKey) : featureKey;
            return `
                <li class="flex items-center">
                    <i class="fas fa-check text-green-500 mr-3"></i>
                    <span class="text-gray-700">${featureText}</span>
                </li>
            `;
        }).join('');
    }

    displayRating() {
        const starsElement = document.getElementById('product-stars');
        const reviewsElement = document.getElementById('product-reviews');

        const fullStars = Math.floor(this.product.rating);
        const emptyStars = 5 - fullStars;

        starsElement.textContent = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);

        const reviewsText = typeof i18n !== 'undefined' ? i18n.t('reviews') : 'reviews';
        reviewsElement.textContent = `(${this.product.reviews} ${reviewsText})`;
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

        // Prevent double submission
        if (this.isSubmittingOrder) {
            console.warn('Order form: Double submission prevented');
            return;
        }

        console.log('Order form: Starting submission');

        if (!this.product) {
            console.error('Order form: Product not found');
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

        console.log('Order form: Collected data', orderData);

        // Validate required fields
        if (!orderData.full_name || !orderData.email || !orderData.whatsapp_id) {
            console.log('Order form: Validation failed - missing required fields');
            this.showOrderError('Please fill in all required fields');
            return;
        }

        if (!validateEmail(orderData.email)) {
            console.log('Order form: Validation failed - invalid email');
            this.showOrderError('Please enter a valid email address');
            return;
        }

        // Set submission flag
        this.isSubmittingOrder = true;
        console.log('Order form: Submission flag set to true');

        // Show loading
        this.setOrderFormLoading(true);

        try {
            console.log('Order form: Sending to api/order.php', orderData);
            // Send order data to PHP backend (PHP will handle Discord webhook)
            const response = await fetch('api/order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            console.log('Order form: Response received', response.status);
            const result = await response.json();
            console.log('Order form: Result', result);

            if (response.ok && result.success) {
                console.log('Order form: Success - resetting form');
                e.target.reset();

                // Show beautiful notification
                if (window.notifications) {
                    window.notifications.success(
                        'We will contact you soon.',
                        'Order placed successfully!'
                    );
                } else {
                    this.showOrderSuccess(); // Fallback
                }
            } else {
                console.error('Order form: Error response', result);

                // Show beautiful error notification
                if (window.notifications) {
                    window.notifications.error(
                        result.error || 'Failed to submit order',
                        'Order submission failed'
                    );
                } else {
                    this.showOrderError(result.error || 'Failed to submit order'); // Fallback
                }
            }
        } catch (error) {
            console.error('Order form: Network error:', error);
            this.showOrderError('Network error. Please try again later.');
        } finally {
            this.setOrderFormLoading(false);
            this.isSubmittingOrder = false;
            console.log('Order form: Submission flag reset to false');
        }
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

    setOrderFormLoading(loading) {
        const submitBtn = document.querySelector('#order-form button[type="submit"]');
        if (!submitBtn) return;

        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Placing Order...';
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Place Order';
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
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
                    kakaotalk: 'KakaoTalk ID or phone number'
                };

                if (whatsappInput) {
                    whatsappInput.placeholder = placeholders[method] || 'Enter contact details';
                    whatsappInput.required = method !== 'kakaotalk';
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

    async handleReviewSubmit(e) {
        e.preventDefault();

        // Prevent double submission
        if (this.isSubmittingReview) {
            console.warn('Review form: Double submission prevented');
            if (window.notifications) {
                window.notifications.warning('Please wait, review is being submitted...', 'Processing');
            } else {
                alert('Please wait, review is being submitted...');
            }
            return;
        }

        console.log('Review form: Starting submission');

        if (!this.product) {
            console.error('Review form: Product not found');
            return;
        }

        const formData = new FormData(e.target);
        const reviewData = {
            product_id: this.product.id,
            product_name: this.product.name,
            name: formData.get('review_name').trim(),
            email: formData.get('review_email').trim(),
            rating: parseInt(formData.get('rating')),
            review_text: formData.get('review_text').trim(),
            timestamp: new Date().toISOString(),
            browser_id: this.getBrowserId()
        };

        console.log('Review form: Collected data', reviewData);

        // Validate
        if (!reviewData.name || !reviewData.email || !reviewData.rating || !reviewData.review_text) {
            console.log('Review form: Validation failed - missing fields');
            if (window.notifications) {
                window.notifications.warning('Please fill in all required fields', 'Validation Error');
            } else {
                alert('Please fill in all required fields');
            }
            return;
        }

        if (!validateEmail(reviewData.email)) {
            console.log('Review form: Validation failed - invalid email');
            if (window.notifications) {
                window.notifications.warning('Please enter a valid email address', 'Validation Error');
            } else {
                alert('Please enter a valid email address');
            }
            return;
        }

        // Set submission flag
        this.isSubmittingReview = true;
        console.log('Review form: Submission flag set to true');

        try {
            // First save to localStorage for immediate display
            const reviewsKey = `reviews_${this.product.id}`;
            const existingReviews = JSON.parse(localStorage.getItem(reviewsKey) || '[]');

            // Check for duplicate reviews (same email on same product)
            const duplicate = existingReviews.find(review =>
                review.email === reviewData.email && review.product_id === reviewData.product_id
            );

            if (duplicate) {
                console.log('Review form: Duplicate review found');
                if (window.notifications) {
                    window.notifications.warning(
                        'You have already submitted a review for this product.',
                        'Duplicate Review'
                    );
                } else {
                    alert('You have already submitted a review for this product.');
                }
                this.isSubmittingReview = false;
                return;
            }

            existingReviews.push(reviewData);
            localStorage.setItem(reviewsKey, JSON.stringify(existingReviews));

            console.log('Review form: Saved to localStorage, now sending to server');

            // Send to PHP backend for Discord webhook
            const response = await fetch('api/reviews.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData)
            });

            console.log('Review form: Server response', response.status);
            const result = await response.json();
            console.log('Review form: Server result', result);

            if (response.ok && result.success) {
                console.log('Review form: Success - webhook sent');

                // Show beautiful notification
                if (window.notifications) {
                    window.notifications.success(
                        'Thank you for your feedback!',
                        'Review submitted successfully!'
                    );
                } else {
                    alert('Review submitted successfully!'); // Fallback
                }
                e.target.reset();

                // Reset star rating
                document.querySelectorAll('#rating-stars .star').forEach(star => {
                    star.className = 'star text-2xl text-gray-300';
                });
                document.getElementById('review-rating').value = '';

                // Reload reviews
                this.loadReviews();
            } else {
                console.error('Review form: Server error', result);
                // Still show success since localStorage worked
                alert('Review submitted successfully!');
                e.target.reset();

                // Reset star rating
                document.querySelectorAll('#rating-stars .star').forEach(star => {
                    star.className = 'star text-2xl text-gray-300';
                });
                document.getElementById('review-rating').value = '';

                // Reload reviews
                this.loadReviews();
            }

        } catch (error) {
            console.error('Review form: Network error:', error);
            // Still show success since localStorage worked
            alert('Review submitted successfully! (Offline mode)');
            e.target.reset();

            // Reset star rating
            document.querySelectorAll('#rating-stars .star').forEach(star => {
                star.className = 'star text-2xl text-gray-300';
            });
            document.getElementById('review-rating').value = '';

            // Reload reviews
            this.loadReviews();
        } finally {
            this.isSubmittingReview = false;
            console.log('Review form: Submission flag reset to false');
        }
    }

    loadReviews() {
        if (!this.product) return;

        try {
            // Load reviews from localStorage (user-submitted reviews)
            const reviewsKey = `reviews_${this.product.id}`;
            const storedReviews = localStorage.getItem(reviewsKey);
            const localStorageReviews = storedReviews ? JSON.parse(storedReviews) : [];

            // Load reviews from products data (pre-added reviews)
            const productDataReviews = this.product.reviewsData || [];

            // Merge both sources and remove duplicates (by email if they exist)
            const allReviews = [...productDataReviews];

            // Add localStorage reviews, but avoid duplicates
            localStorageReviews.forEach(localReview => {
                const exists = allReviews.find(review =>
                    review.email === localReview.email &&
                    review.timestamp === localReview.timestamp
                );
                if (!exists) {
                    allReviews.push(localReview);
                }
            });

            this.reviews = allReviews;

            // Sort by newest first initially
            this.reviews.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));

            // Initialize filtered reviews
            this.filteredReviews = [...this.reviews];
            this.displayReviews();
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.reviews = [];
            this.displayReviews();
        }
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
            const noReviewsTitle = typeof i18n !== 'undefined' ? i18n.t('no-reviews-yet') : 'No reviews yet';
            const noReviewsText = typeof i18n !== 'undefined' ? i18n.t('first-review') : 'Be the first to review this product!';
            reviewsList.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-comments text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-600 mb-2">${noReviewsTitle}</h3>
                    <p class="text-gray-500">${noReviewsText}</p>
                </div>
            `;
            return;
        }

        reviewsList.innerHTML = this.reviews.map(review => this.renderReview(review)).join('');
    }

    renderReview(review) {
        // Handle both timestamp and date fields
        const dateValue = review.timestamp || review.date;
        const date = new Date(dateValue);
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
                <p class="text-gray-700 leading-relaxed">${this.escapeHtml(review.reviewText || review.review_text)}</p>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupReviewFilters() {
        // Setup rating filter buttons
        const filterButtons = document.querySelectorAll('.review-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const rating = e.target.getAttribute('data-rating');
                this.setRatingFilter(rating);

                // Update button styles
                filterButtons.forEach(btn => {
                    if (btn.getAttribute('data-rating') === rating) {
                        btn.classList.remove('border-gray-300', 'text-gray-700', 'hover:bg-gray-50');
                        btn.classList.add('bg-purple-500', 'text-white', 'border-purple-500');
                    } else {
                        btn.classList.remove('bg-purple-500', 'text-white', 'border-purple-500');
                        btn.classList.add('border-gray-300', 'text-gray-700', 'hover:bg-gray-50');
                    }
                });
            });
        });

        // Setup sort dropdown
        const sortSelect = document.getElementById('review-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.setSortOption(e.target.value);
            });
        }
    }

    setRatingFilter(rating) {
        this.currentRatingFilter = rating;
        this.applyFiltersAndSort();
        this.updateFilterInfo();
    }

    setSortOption(sort) {
        this.currentSort = sort;
        this.applyFiltersAndSort();
        this.updateFilterInfo();
    }

    applyFiltersAndSort() {
        let filtered = [...this.reviews];

        // Apply rating filter
        if (this.currentRatingFilter !== 'all') {
            filtered = filtered.filter(review => review.rating === parseInt(this.currentRatingFilter));
        }

        // Apply sorting
        switch (this.currentSort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.timestamp || a.date) - new Date(b.timestamp || b.date));
                break;
            case 'highest':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                filtered.sort((a, b) => a.rating - b.rating);
                break;
        }

        this.filteredReviews = filtered;
        this.displayFilteredReviews();
    }

    updateFilterInfo() {
        const filterInfo = document.getElementById('filter-info');
        if (!filterInfo) return;

        const totalFiltered = this.filteredReviews.length;
        const ratingText = this.currentRatingFilter === 'all' ? 'all' : `${this.currentRatingFilter}-star`;
        const sortText = this.currentSort.replace('newest', 'newest first').replace('oldest', 'oldest first')
            .replace('highest', 'highest rated').replace('lowest', 'lowest rated');

        filterInfo.textContent = `Showing ${totalFiltered} ${ratingText} reviews (sorted by ${sortText})`;
    }

    displayFilteredReviews() {
        const reviewsList = document.getElementById('reviews-list');

        if (this.filteredReviews.length === 0) {
            const noReviewsTitle = typeof i18n !== 'undefined' ? i18n.t('no-reviews-yet') : 'No reviews yet';
            const noReviewsText = typeof i18n !== 'undefined' ? i18n.t('first-review') : 'Be the first to review this product!';
            reviewsList.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-comments text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-600 mb-2">${noReviewsTitle}</h3>
                    <p class="text-gray-500">No reviews match your current filters.</p>
                </div>
            `;
            return;
        }

        reviewsList.innerHTML = this.filteredReviews.map(review => this.renderReview(review)).join('');
    }

    setupLanguageChangeListener() {
        // Listen for language changes and update dynamic content
        if (typeof i18n !== 'undefined') {
            // Override the i18n updateContent method to also update product-specific content
            const originalUpdateContent = i18n.updateContent.bind(i18n);
            i18n.updateContent = () => {
                originalUpdateContent();
                this.updateDynamicContent();
            };
        }
    }

    updateDynamicContent() {
        if (this.product) {
            // Update features list
            this.displayFeatures();

            // Update description
            const lang = typeof i18n !== 'undefined' ? i18n.currentLang : 'en';
            const description = lang === 'kr' ? this.product.descriptionKr : this.product.description;
            document.getElementById('product-description').textContent = description;

            // Update button text
            const orderBtn = document.querySelector('#order-form button[type="submit"]');
            if (orderBtn && typeof i18n !== 'undefined') {
                orderBtn.textContent = i18n.t('place-order');
            }

            const reviewBtn = document.querySelector('#review-form button[type="submit"]');
            if (reviewBtn && typeof i18n !== 'undefined') {
                reviewBtn.textContent = i18n.t('submit-review');
            }
        }

        // Update review display
        this.displayReviews();
    }
}

// Make ProductPage class globally available
window.ProductPage = ProductPage;

// Initialize product page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-details') && !window.productPageInstance) {
        window.productPage = new ProductPage();
    }
});
