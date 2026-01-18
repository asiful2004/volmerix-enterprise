// Products data and management for Volmerix Enterprise

const products = [
    {
        id: 1,
        name: 'YouTube Premium Account',
        nameKr: 'YouTube 프리미엄 계정',
        slug: 'youtube-premium',
        price: 15000, // KRW
        image: 'assets/images/placeholder.php?w=400&h=300&text=YouTube+Premium',
        description: 'Full access to YouTube Premium with ad-free viewing and background play',
        descriptionKr: '광고 없는 시청과 백그라운드 재생이 가능한 YouTube 프리미엄 전체 액세스',
        featured: true,
        rating: 4.8,
        reviews: 127,
        category: 'subscription'
    },
    {
        id: 2,
        name: 'Google One 100GB',
        nameKr: 'Google One 100GB',
        slug: 'google-one-100gb',
        price: 25000,
        image: 'assets/images/placeholder.php?w=400&h=300&text=Google+One+100GB',
        description: '100GB cloud storage with Google One benefits',
        descriptionKr: 'Google One 혜택과 함께 100GB 클라우드 저장소',
        featured: true,
        rating: 4.9,
        reviews: 89,
        category: 'storage'
    },
    {
        id: 3,
        name: 'Netflix Premium Account',
        nameKr: 'Netflix 프리미엄 계정',
        slug: 'netflix-premium',
        price: 20000,
        image: 'assets/images/placeholder.php?w=400&h=300&text=Netflix+Premium',
        description: 'Ultra HD streaming with premium Netflix account',
        descriptionKr: '프리미엄 Netflix 계정으로 울트라 HD 스트리밍',
        featured: false,
        rating: 4.7,
        reviews: 203,
        category: 'entertainment'
    },
    {
        id: 4,
        name: 'Spotify Premium',
        nameKr: 'Spotify 프리미엄',
        slug: 'spotify-premium',
        price: 12000,
        image: 'assets/images/placeholder.php?w=400&h=300&text=Spotify+Premium',
        description: 'Ad-free music streaming with offline downloads',
        descriptionKr: '오프라인 다운로드와 함께 광고 없는 음악 스트리밍',
        featured: false,
        rating: 4.6,
        reviews: 156,
        category: 'music'
    },
    {
        id: 5,
        name: 'Adobe Creative Cloud',
        nameKr: 'Adobe Creative Cloud',
        slug: 'adobe-creative-cloud',
        price: 35000,
        image: 'assets/images/placeholder.php?w=400&h=300&text=Adobe+CC',
        description: 'Full Adobe Creative Cloud suite access',
        descriptionKr: '전체 Adobe Creative Cloud 제품군 액세스',
        featured: true,
        rating: 4.8,
        reviews: 67,
        category: 'software'
    },
    {
        id: 6,
        name: 'Microsoft 365 Personal',
        nameKr: 'Microsoft 365 개인용',
        slug: 'microsoft-365-personal',
        price: 18000,
        image: 'assets/images/placeholder.php?w=400&h=300&text=Microsoft+365',
        description: 'One year access to Microsoft 365 Personal',
        descriptionKr: 'Microsoft 365 개인용 1년 액세스',
        featured: false,
        rating: 4.5,
        reviews: 94,
        category: 'office'
    }
];

const testimonials = [
    {
        id: 1,
        text: 'Amazing service! Got my account within hours.',
        textKr: '놀라운 서비스! 몇 시간 만에 계정을 받았습니다.',
        author: 'Kim J.',
        platform: 'Discord'
    },
    {
        id: 2,
        text: 'Very reliable and fast delivery. Highly recommend!',
        textKr: '매우 신뢰할 수 있고 빠른 배송. 강력 추천!',
        author: 'Park S.',
        platform: 'Telegram'
    },
    {
        id: 3,
        text: 'Premium quality accounts. No issues so far.',
        textKr: '프리미엄 품질 계정. 지금까지 문제 없음.',
        author: 'Lee M.',
        platform: 'Facebook'
    }
];

// Product management functions
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

function getProductBySlug(slug) {
    return products.find(product => product.slug === slug);
}

function getFeaturedProducts() {
    return products.filter(product => product.featured);
}

function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.nameKr.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.descriptionKr.toLowerCase().includes(lowerQuery)
    );
}

function sortProducts(products, sortBy) {
    const sorted = [...products];
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'featured':
            return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        default:
            return sorted;
    }
}

// Render functions
function renderProductCard(product, featured = false, context = 'shop') {
    const lang = typeof i18n !== 'undefined' ? i18n.currentLang : 'en';
    const name = lang === 'kr' ? product.nameKr : product.name;
    const description = lang === 'kr' ? product.descriptionKr : product.description;

    // All pages: Buy Now redirects to product page for better user flow
    let buttonsHtml = `<button onclick="viewProduct(${product.id})" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition duration-300" data-i18n="buy-now">Buy Now</button>`;

    return `
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0 w-80">
            ${featured ? '<div class="bg-purple-600 text-white text-xs px-2 py-1 text-center font-medium">FEATURED</div>' : ''}
            <div class="aspect-w-4 aspect-h-3">
                <img src="${product.image}" alt="${name}" class="w-full h-48 object-cover" onerror="this.src='assets/images/placeholder.php?w=400&h=300&text=Product'">
            </div>
            <div class="p-6 flex flex-col flex-1">
                <h3 class="text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem] leading-tight">${name}</h3>
                <p class="text-gray-600 mb-4 line-clamp-3 min-h-[3.75rem] leading-relaxed flex-1">${description}</p>
                <div class="flex items-center mb-4">
                    <div class="flex text-yellow-400 mr-2">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span class="text-sm text-gray-600">(${product.reviews} reviews)</span>
                </div>
                <div class="flex items-center justify-between mt-auto">
                    <span class="text-2xl font-bold text-purple-600" data-price="${product.price}">${currencyManager ? currencyManager.formatPrice(product.price) : `₩${product.price.toLocaleString()}`}</span>
                    ${buttonsHtml}
                </div>
            </div>
        </div>
    `;
}

function renderTestimonial(testimonial) {
    const lang = typeof i18n !== 'undefined' ? i18n.currentLang : 'en';
    const text = lang === 'kr' ? testimonial.textKr : testimonial.text;

    return `
        <div class="bg-white shadow-md rounded-lg p-6 min-w-80 border border-gray-100">
            <p class="text-gray-700 mb-4">"${text}"</p>
            <div class="flex items-center justify-between">
                <span class="font-bold text-gray-900">${testimonial.author}</span>
                <span class="text-sm text-gray-500">${testimonial.platform}</span>
            </div>
        </div>
    `;
}

function viewProduct(productId) {
    console.log('viewProduct called with productId:', productId);
    const product = getProductById(productId);
    console.log('Product found:', product);
    if (product) {
        console.log('Redirecting to:', `product.html?slug=${product.slug}`);
        window.location.href = `product.html?slug=${product.slug}`;
    } else {
        console.error('Product not found for ID:', productId);
    }
}

function buyNow(productId) {
    console.log('buyNow called with productId:', productId, '- THIS SHOULD NOT HAPPEN ON SHOP PAGE');
    const product = getProductById(productId);
    if (!product) return;

    const lang = typeof i18n !== 'undefined' ? i18n.currentLang : 'en';
    const name = lang === 'kr' ? product.nameKr : product.name;
    const currentCurrency = currencyManager ? currencyManager.getCurrentCurrency() : 'KRW';
    const price = currencyManager ? currencyManager.formatPrice(product.price) : `₩${product.price.toLocaleString()}`;

    // Send Discord webhook
    const webhookData = {
        content: `🛒 **New Order Received!**\n\n**Product:** ${name}\n**Price:** ${price}\n**Currency:** ${currentCurrency}\n**Customer:** Anonymous\n**Time:** ${new Date().toLocaleString()}`,
        username: 'Volmerix Order Bot',
        avatar_url: 'https://i.imgur.com/placeholder.png'
    };

    fetch('api/order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Order submitted! Check Discord for confirmation.');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Order submitted! We will contact you soon.');
    });
}

// Initialize featured products and testimonials on home page
function initHomePage() {
    const featuredSlider = document.getElementById('featured-slider');
    const testimonialsCarousel = document.getElementById('testimonials-carousel');

    if (featuredSlider) {
        const featuredProducts = getFeaturedProducts();
        featuredSlider.innerHTML = featuredProducts.map(product => renderProductCard(product, true, 'home')).join('');
    }

    if (testimonialsCarousel) {
        testimonialsCarousel.innerHTML = testimonials.map(testimonial => renderTestimonial(testimonial)).join('');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('featured-slider') || document.getElementById('testimonials-carousel')) {
        initHomePage();
    }
});
