// Products data and management for Volmerix Enterprise

const products = [
    {
        id: 1,
        name: 'YouTube Premium Individual – Yearly Plan',
        nameKr: 'YouTube 프리미엄 개인용 - 연간 플랜',
        slug: 'youtube-premium-individual-yearly',
        price: 32448.08, // KRW
        image: 'assets/images/product/youtube-in.png',
        description: 'YouTube Premium Individual Yearly Plan provides premium access to YouTube\'s ad-free experience, offline downloads, and background playback features. This comprehensive subscription includes all premium benefits for individual use with reliable account management and region-specific optimization.\n\nKey features include advanced geo-IP protection, continuous account monitoring, secure delivery methods, and ongoing technical support. Designed for long-term reliability and optimal user experience across all devices and platforms.',
        descriptionKr: '🎯 전문 리셀러 솔루션\n\n볼메릭스는 안정성, 통제 및 장기 신뢰성을 우선시하는 리셀러를 위해 특별히 설계된 전문적으로 관리되는 YouTube 프리미엄 개인용 연간 플랜을 제공합니다.\n\n✨ 주요 기능:\n• 통제된 설정으로 인도 지역 계정\n• 금지 방지를 위한 고급 Geo/IP 관리\n• 활성 기간 동안 풀타임 보증\n• 유연하고 안전한 배송 옵션\n• 갱신 및 지속적인 유지 관리 지원\n• 강력한 이익 마진을 위해 최적화된 도매 가격\n\n🎪 완벽함:\n안전하고 장기적인 구독 솔루션을 찾는 상점 소유자와 디지털 서비스 제공업체.\n\n🏆 안정적 • 관리됨 • 리셀러 준비됨',
        featured: true,
        hot: true,
        offer: true,
        new: false,
        bestseller: false,
        limited: false,
        rating: 4.9,
        reviews: 4,
        category: 'subscription',
        reviewsData: [
            {
                name: "John Smith",
                rating: 5,
                reviewText: "Excellent service! Fast delivery and premium quality account. Highly recommended for content creators.",
                date: "2024-01-15"
            },
            {
                name: "Sarah Johnson",
                rating: 5,
                reviewText: "Perfect YouTube Premium account. No issues with activation and great customer support. Will buy again!",
                date: "2024-01-18"
            },
            {
                name: "Mike Davis",
                rating: 5,
                reviewText: "Outstanding quality and reliability. The account works perfectly with all YouTube Premium features.",
                date: "2024-01-20"
            },
            {
                name: "Emma Wilson",
                rating: 4,
                reviewText: "Very good service overall. Quick delivery and responsive support team. Minor delay but still satisfied.",
                date: "2024-01-22"
            }
        ]
    },
    {
        id: 2,
        name: 'YouTube Premium Family Plan',
        nameKr: 'YouTube 프리미엄 패밀리 플랜',
        slug: 'youtube-premium-family-monthly',
        price: 10914.45, // KRW
        image: 'assets/images/product/youtube.png',
        description: 'YouTube Premium Family Plan offers premium YouTube access for up to 6 family members, including ad-free viewing, offline downloads, and background playback. This family subscription provides comprehensive account management with controlled member allocation and region-optimized access.\n\nKey features include geo-IP stability controls, continuous service monitoring, secure multi-user setup, and dedicated support services. Designed for families and small groups requiring reliable premium access across multiple devices.',
        descriptionKr: '👨‍👩‍👧‍👦 프리미엄 패밀리 경험\n\n볼메릭스는 장기 사용 및 최대 리셀러 신뢰성을 위해 신중하게 관리되는 YouTube 프리미엄 패밀리 플랜을 제공합니다.\n\n🔧 제공되는 것:\n• 안정성을 위한 전문적으로 관리되는 Geo/IP 처리\n• 활성 기간 동안 지속적인 서비스 보증\n• 플래그/금지를 방지하기 위한 통제된 멤버 할당\n• 지원 갱신 및 유지 관리 지원\n• 지속 가능한 재판매를 위한 공정한 도매 가격\n\n💼 설계 대상:\n일관성, 책임성 및 장기 신뢰를 중시하는 상점 소유자.\n\n🌟 신뢰할 수 있음 • 전문적 • 신뢰받음',
        featured: true,
        hot: false,
        offer: true,
        new: true,
        bestseller: true,
        limited: false,
        rating: 5,
        reviews: 3,
        category: 'subscription',
        reviewsData: [
            {
                name: "David Brown",
                rating: 5,
                reviewText: "Perfect family plan! Works great for all 6 family members. Excellent value for money.",
                date: "2024-01-10"
            },
            {
                name: "Lisa Anderson",
                rating: 5,
                reviewText: "Outstanding family subscription. Easy to manage multiple accounts and great support.",
                date: "2024-01-12"
            },
            {
                name: "Robert Taylor",
                rating: 5,
                reviewText: "Best family plan I've used. Reliable service and no issues with member management.",
                date: "2024-01-14"
            }
        ]
    }
];

const testimonials = [
    {
        image: 'assets/images/review-1.jpg',
        alt: '320px × 320px'
    },
    {
        image: 'assets/images/review-1.jpg',
        alt: '320px × 320px'
    },
    {
        image: 'assets/images/review-1.jpg',
        alt: '320px × 320px'
    },
    {
        image: 'assets/images/review-1.jpg',
        alt: '320px × 320px'
    },
    {
        image: 'assets/images/review-1.jpg',
        alt: '320px × 320px'
    },
    {
        image: 'assets/images/review-1.jpg',
        alt: '320px × 320px'
    },
    {
        image: 'assets/images/review-1.jpg',
        alt: '320px × 320px'
    },
    {
        image: 'assets/images/review-1.jpg',
        alt: '320px × 320px'
    },
    {
        image: 'assets/images/review-1.jpg',
        alt: '320px × 320px'
    },
    {
        image: 'assets/images/review-1.jpg',
        alt: '320px × 320px'
    },
    {
        image: 'assets/images/review-1.jpg',
        alt: '320px × 320px'
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

    // Generate single circular tag based on priority (only one tag per product)
    let tagHtml = '';

    // Tag priority order and styling (highest priority first)
    const tagConfig = [
        { key: 'hot', text: 'HOT', style: 'bg-red-500 text-white' },
        { key: 'offer', text: 'OFFER', style: 'bg-yellow-500 text-white' },
        { key: 'new', text: 'NEW', style: 'bg-green-500 text-white' },
        { key: 'featured', text: 'FEATURED', style: 'bg-purple-500 text-white' },
        { key: 'bestseller', text: 'BESTSELLER', style: 'bg-blue-500 text-white' },
        { key: 'limited', text: 'LIMITED', style: 'bg-orange-500 text-white' }
    ];

    // Find first active tag (highest priority)
    const activeTag = tagConfig.find(tag => product[tag.key]);

    // Generate circular tag HTML
    if (activeTag) {
        tagHtml = `<div class="absolute top-2 left-2 z-10 transition-none pointer-events-none">
            <span class="inline-flex items-center justify-center w-12 h-12 ${activeTag.style} text-xs font-bold rounded-full shadow-lg border-2 border-white transition-none">
                ${activeTag.text}
            </span>
        </div>`;
    }

    // All pages: Buy Now redirects to product page for better user flow
    let buttonsHtml = `<button onclick="viewProduct(${product.id})" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition duration-300" data-i18n="buy-now">Buy Now</button>`;

    return `
        <div class="product-card relative bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0 w-80">
            <div class="aspect-w-4 aspect-h-3">
                <img src="${product.image}" alt="${name}" class="w-full h-48 object-cover" onerror="this.src='assets/images/product/youtube.png'">
                ${tagHtml}
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
    return `
        <div class="bg-white shadow-md rounded-lg overflow-hidden min-w-80 border border-gray-100">
            <img src="${testimonial.image}" alt="${testimonial.alt}"
                 class="w-full h-80 object-cover testimonial-image"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="testimonial-text p-6 items-center justify-center hidden" style="display: none; height: 320px;">
                <p class="text-3xl font-bold text-gray-800 text-center leading-relaxed">
                    ${testimonial.alt}
                </p>
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



// Testimonials slider functionality
class TestimonialsSlider {
    constructor() {
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 seconds
        this.init();
    }

    init() {
        this.renderDots();
        this.setupAutoPlay();
        this.setupDotNavigation();
        this.updateActiveDot();
    }

    renderDots() {
        const dotsContainer = document.getElementById('testimonial-dots');
        if (!dotsContainer) return;

        const dots = testimonials.map((_, index) => `
            <button class="w-3 h-3 rounded-full transition-all duration-300 ${index === 0 ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'}" data-slide="${index}"></button>
        `).join('');

        dotsContainer.innerHTML = dots;
    }

    setupAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    setupDotNavigation() {
        const dotsContainer = document.getElementById('testimonial-dots');
        if (!dotsContainer) return;

        dotsContainer.addEventListener('click', (e) => {
            if (e.target.matches('[data-slide]')) {
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
                this.resetAutoPlay();
            }
        });
    }

    goToSlide(index) {
        const carousel = document.getElementById('testimonials-carousel');
        if (!carousel) return;

        this.currentIndex = index;
        const slideWidth = carousel.children[0]?.offsetWidth || 320;
        const scrollPosition = index * (slideWidth + 24); // 24px is the gap

        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        this.updateActiveDot();
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % testimonials.length;
        this.goToSlide(nextIndex);
    }

    updateActiveDot() {
        const dots = document.querySelectorAll('#testimonial-dots button');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.className = 'w-3 h-3 rounded-full bg-purple-600 transition-all duration-300';
            } else {
                dot.className = 'w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-all duration-300';
            }
        });
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.setupAutoPlay();
    }

    destroy() {
        clearInterval(this.autoPlayInterval);
    }
}

// Featured Plans slider functionality
class FeaturedSlider {
    constructor() {
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        this.init();
    }

    init() {
        this.renderDots();
        this.setupAutoPlay();
        this.setupDotNavigation();
        this.updateActiveDot();
    }

    renderDots() {
        const dotsContainer = document.getElementById('featured-dots');
        if (!dotsContainer) return;

        // Calculate number of dots based on featured products (assuming 2 products per slide on mobile, 3 on desktop)
        const featuredProducts = getFeaturedProducts();
        const dotsCount = Math.ceil(featuredProducts.length / 2); // Show 2 dots for 2 products

        const dots = Array.from({ length: dotsCount }, (_, index) => `
            <button class="w-3 h-3 rounded-full transition-all duration-300 ${index === 0 ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'}" data-slide="${index}"></button>
        `).join('');

        dotsContainer.innerHTML = dots;
    }

    setupAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    setupDotNavigation() {
        const dotsContainer = document.getElementById('featured-dots');
        if (!dotsContainer) return;

        dotsContainer.addEventListener('click', (e) => {
            if (e.target.matches('[data-slide]')) {
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
                this.resetAutoPlay();
            }
        });
    }

    goToSlide(index) {
        const slider = document.getElementById('featured-slider');
        if (!slider) return;

        this.currentIndex = index;
        const slideWidth = 320 + 24; // Product card width + gap
        const scrollPosition = index * slideWidth;

        slider.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        this.updateActiveDot();
    }

    nextSlide() {
        const dotsContainer = document.getElementById('featured-dots');
        if (!dotsContainer) return;

        const totalSlides = dotsContainer.children.length;
        const nextIndex = (this.currentIndex + 1) % totalSlides;
        this.goToSlide(nextIndex);
    }

    updateActiveDot() {
        const dots = document.querySelectorAll('#featured-dots button');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.className = 'w-3 h-3 rounded-full bg-purple-600 transition-all duration-300';
            } else {
                dot.className = 'w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-all duration-300';
            }
        });
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.setupAutoPlay();
    }

    destroy() {
        clearInterval(this.autoPlayInterval);
    }
}

// Global slider instances
let testimonialsSlider = null;
let featuredSlider = null;

// Initialize featured products and testimonials on home page
function initHomePage() {
    const featuredSliderElement = document.getElementById('featured-slider');
    const testimonialsCarousel = document.getElementById('testimonials-carousel');

    if (featuredSliderElement) {
        const featuredProducts = getFeaturedProducts();
        featuredSliderElement.innerHTML = featuredProducts.map(product => renderProductCard(product, true, 'home')).join('');

        // Initialize featured slider only on medium screens and up (where horizontal scrolling is used)
        if (window.innerWidth >= 768) {
            if (featuredSlider) {
                featuredSlider.destroy();
            }
            featuredSlider = new FeaturedSlider();
        }
    }

    if (testimonialsCarousel) {
        testimonialsCarousel.innerHTML = testimonials.map(testimonial => renderTestimonial(testimonial)).join('');

        // Initialize testimonials slider
        if (testimonialsSlider) {
            testimonialsSlider.destroy();
        }
        testimonialsSlider = new TestimonialsSlider();
    }

    // Update translations for dynamically added content
    setTimeout(() => {
        if (typeof i18n !== 'undefined' && typeof i18n.updateContent === 'function') {
            i18n.updateContent();
        }
    }, 50);
}

// Make initHomePage function globally available
window.initHomePage = initHomePage;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('featured-slider') || document.getElementById('testimonials-carousel')) {
        initHomePage();
    }
});
