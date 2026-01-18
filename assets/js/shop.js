// Shop page functionality for Volmerix Enterprise

class ShopManager {
    constructor() {
        this.allProducts = [...products];
        this.filteredProducts = [...this.allProducts];
        this.currentView = 'grid'; // 'grid' or 'list'
        this.itemsPerPage = 12;
        this.currentPage = 1;
        this.searchQuery = '';
        this.sortBy = 'featured';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProducts();
        this.updateResultsCount();
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.filterAndSort();
                this.renderProducts();
            });
        }

        // Filter select
        const filterSelect = document.getElementById('filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.filterAndSort();
                this.renderProducts();
            });
        }

        // View toggle
        const gridView = document.getElementById('grid-view');
        const listView = document.getElementById('list-view');

        if (gridView) {
            gridView.addEventListener('click', () => {
                this.setView('grid');
            });
        }

        if (listView) {
            listView.addEventListener('click', () => {
                this.setView('list');
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }
    }

    filterAndSort() {
        let filtered = [...this.allProducts];

        // Apply search filter
        if (this.searchQuery) {
            filtered = searchProducts(this.searchQuery);
        }

        // Apply sorting
        filtered = sortProducts(filtered, this.sortBy);

        this.filteredProducts = filtered;
        this.currentPage = 1; // Reset to first page when filtering
    }

    setView(view) {
        this.currentView = view;
        const gridView = document.getElementById('grid-view');
        const listView = document.getElementById('list-view');
        const container = document.getElementById('products-container');

        if (view === 'grid') {
            gridView.className = 'px-4 py-2 bg-purple-600 text-white rounded-l-lg hover:bg-purple-700';
            listView.className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300';
            container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
        } else {
            gridView.className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded-l-lg hover:bg-gray-300';
            listView.className = 'px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700';
            container.className = 'space-y-4';
        }

        this.renderProducts();
    }

    renderProducts() {
        const container = document.getElementById('products-container');
        const noProducts = document.getElementById('no-products');
        const loadMoreBtn = document.getElementById('load-more');

        if (!container) return;

        const productsToShow = this.getProductsToShow();

        if (productsToShow.length === 0) {
            container.innerHTML = '';
            noProducts.classList.remove('hidden');
            loadMoreBtn.classList.add('hidden');
            return;
        }

        noProducts.classList.add('hidden');

        if (this.currentView === 'grid') {
            container.innerHTML = productsToShow.map(product => this.renderProductGrid(product)).join('');
        } else {
            container.innerHTML = productsToShow.map(product => this.renderProductList(product)).join('');
        }

        // Show/hide load more button
        if (this.filteredProducts.length > productsToShow.length) {
            loadMoreBtn.classList.remove('hidden');
        } else {
            loadMoreBtn.classList.add('hidden');
        }

        this.updateResultsCount();

        // Update translations for dynamically added content
        setTimeout(() => {
            if (typeof i18n !== 'undefined' && typeof i18n.updateContent === 'function') {
                i18n.updateContent();
            }
        }, 50);
    }

    renderProductGrid(product) {
        const lang = typeof i18n !== 'undefined' ? i18n.currentLang : 'en';
        const name = lang === 'kr' ? product.nameKr : product.name;
        const description = lang === 'kr' ? product.descriptionKr : product.description;

        return `
            <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
                ${product.featured ? '<div class="bg-purple-600 text-white text-xs px-2 py-1 text-center">FEATURED</div>' : ''}
                <img src="${product.image}" alt="${name}" class="w-full h-48 object-cover" onerror="this.src='assets/images/product/youtube.png'">
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">${name}</h3>
                    <p class="text-gray-600 mb-4 line-clamp-2">${description}</p>
                    <div class="flex items-center mb-4">
                        <div class="flex text-yellow-400 mr-2">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        </div>
                        <span class="text-sm text-gray-600">(${product.reviews})</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-purple-600" data-price="${product.price}">${currencyManager ? currencyManager.formatPrice(product.price) : `₩${product.price.toLocaleString()}`}</span>
                        <button onclick="viewProduct(${product.id})" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-300" data-i18n="buy-now">Buy Now</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductList(product) {
        const lang = typeof i18n !== 'undefined' ? i18n.currentLang : 'en';
        const name = lang === 'kr' ? product.nameKr : product.name;
        const description = lang === 'kr' ? product.descriptionKr : product.description;

        return `
            <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
                <div class="flex">
                    <img src="${product.image}" alt="${name}" class="w-48 h-48 object-cover" onerror="this.src='assets/images/product/youtube.png'">
                    <div class="flex-1 p-6">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h3 class="text-xl font-bold mb-2">${name}</h3>
                                <p class="text-gray-600 mb-4">${description}</p>
                                <div class="flex items-center">
                                    <div class="flex text-yellow-400 mr-2">
                                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                                    </div>
                                    <span class="text-sm text-gray-600">(${product.reviews} reviews)</span>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="text-3xl font-bold text-purple-600 mb-4 block" data-price="${product.price}">${currencyManager ? currencyManager.formatPrice(product.price) : `₩${product.price.toLocaleString()}`}</span>
                                <button onclick="viewProduct(${product.id})" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition duration-300" data-i18n="buy-now">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getProductsToShow() {
        const startIndex = 0;
        const endIndex = this.currentPage * this.itemsPerPage;
        return this.filteredProducts.slice(startIndex, endIndex);
    }

    loadMoreProducts() {
        this.currentPage++;
        this.renderProducts();
    }

    updateResultsCount() {
        const countElement = document.getElementById('product-count');
        const resultsElement = document.getElementById('results-count');

        if (countElement && resultsElement) {
            const showing = Math.min(this.filteredProducts.length, this.currentPage * this.itemsPerPage);
            countElement.textContent = showing;

            const totalText = resultsElement.textContent.replace(/\d+/, showing);
            resultsElement.innerHTML = totalText.replace('0', showing);
        }
    }
}

// Make ShopManager class globally available
window.ShopManager = ShopManager;

// Initialize shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-container')) {
        new ShopManager();
    }
});
