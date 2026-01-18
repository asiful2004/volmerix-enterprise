// Internationalization module for Volmerix Enterprise

const translations = {
    en: {
        'hero-title': 'Volmerix Enterprise',
        'hero-subtitle': 'Your Trusted Subscription Supplier',
        'get-started': 'Get Started Now',
        'featured-plans': 'Featured Plans',
        'why-choose': 'Why Choose Volmerix Enterprise',
        'fast-fulfillment': 'Fast Order Fulfillment',
        'fast-fulfillment-desc': '24h delivery',
        'premium-accounts': 'Premium Accounts Only',
        'premium-accounts-desc': 'High quality guaranteed',
        'safe-setup': 'Safe Korean Setup',
        'safe-setup-desc': 'Region optimized',
        'support': '24/7 Support',
        'support-desc': 'Always here to help',
        'satisfied-customers': 'Satisfied Customers',
        'trusted-by': 'Trusted by 100+ customers',
        'trusted-by-title': 'Trusted By',
        'cta-title': 'Bring Your YouTube to the Next Level Today',
        'cta-button': 'Get Started Now',
        'home': 'Home',
        'shop': 'Shop',
        'about': 'About Us',
        'contact': 'Contact Us',
        'buy-now': 'Buy Now',
        'view-details': 'View Details',
        'search-products': 'Search products...',
        'filter-featured': 'Featured',
        'filter-price-low': 'Price: Low to High',
        'filter-price-high': 'Price: High to Low',
        'no-products': 'No products found',
        'product-details': 'Product Details',
        'rating': 'Rating',
        'reviews': 'reviews',
        'faq': 'Frequently Asked Questions',
        'activation-time': 'Activation Time',
        'activation-time-desc': 'Accounts are activated within 24 hours after purchase.',
        'requirements': 'Requirements',
        'requirements-desc': 'Valid email address and stable internet connection.',
        'korean-safety': 'Korean Region Safety',
        'korean-safety-desc': 'All accounts are optimized for Korean region usage.',
        'refund-policy': 'Refund Policy',
        'refund-policy-desc': 'Refunds available within 24 hours if account is not activated.',
        'welcome-about': 'Welcome to Volmerix Enterprise',
        'about-content': 'We are your trusted partner for premium subscription services, specializing in high-quality accounts with fast delivery and excellent customer support.',
        'premium-google': 'Premium Google Accounts',
        'fast-activation': 'Fast Activation',
        'trusted-korean': 'Trusted by Korean Customers',
        'get-in-touch': 'Get in Touch',
        'contact-form-title': 'Send us a message',
        'name': 'Name',
        'email': 'Email',
        'message': 'Message',
        'send-message': 'Send Message',
        'message-sent': 'Message sent successfully!',
        'error-sending': 'Error sending message. Please try again.',
        'admin-title': 'Admin - Contact Messages',
        'no-messages': 'No messages yet',
        'date': 'Date',
        'actions': 'Actions'
    },
    kr: {
        'hero-title': '볼메릭스 엔터프라이즈',
        'hero-subtitle': '신뢰할 수 있는 구독 공급업체',
        'get-started': '지금 시작하세요',
        'featured-plans': '추천 플랜',
        'why-choose': '볼메릭스 엔터프라이즈를 선택하는 이유',
        'fast-fulfillment': '빠른 주문 처리',
        'fast-fulfillment-desc': '24시간 배송',
        'premium-accounts': '프리미엄 계정만',
        'premium-accounts-desc': '고품질 보장',
        'safe-setup': '안전한 한국 설정',
        'safe-setup-desc': '지역 최적화',
        'support': '24/7 지원',
        'support-desc': '항상 도움을 드립니다',
        'satisfied-customers': '만족한 고객들',
        'trusted-by': '100명 이상의 고객이 신뢰',
        'trusted-by-title': '신뢰받는',
        'cta-title': '오늘 YouTube를 다음 단계로 끌어올리세요',
        'cta-button': '지금 시작하세요',
        'home': '홈',
        'shop': '상점',
        'about': '회사 소개',
        'contact': '연락처',
        'buy-now': '지금 구매',
        'view-details': '자세히 보기',
        'search-products': '제품 검색...',
        'filter-featured': '추천',
        'filter-price-low': '가격: 낮음에서 높음',
        'filter-price-high': '가격: 높음에서 낮음',
        'no-products': '제품을 찾을 수 없습니다',
        'product-details': '제품 상세',
        'rating': '평점',
        'reviews': '리뷰',
        'faq': '자주 묻는 질문',
        'activation-time': '활성화 시간',
        'activation-time-desc': '구매 후 24시간 이내에 계정이 활성화됩니다.',
        'requirements': '요구사항',
        'requirements-desc': '유효한 이메일 주소와 안정적인 인터넷 연결.',
        'korean-safety': '한국 지역 안전',
        'korean-safety-desc': '모든 계정은 한국 지역 사용에 최적화되어 있습니다.',
        'refund-policy': '환불 정책',
        'refund-policy-desc': '계정이 활성화되지 않은 경우 24시간 이내 환불 가능.',
        'welcome-about': '볼메릭스 엔터프라이즈에 오신 것을 환영합니다',
        'about-content': '저희는 고품질 계정, 빠른 배송, 우수한 고객 지원을 전문으로 하는 프리미엄 구독 서비스의 신뢰할 수 있는 파트너입니다.',
        'premium-google': '프리미엄 Google 계정',
        'fast-activation': '빠른 활성화',
        'trusted-korean': '한국 고객이 신뢰',
        'get-in-touch': '연락하기',
        'contact-form-title': '메시지를 보내주세요',
        'name': '이름',
        'email': '이메일',
        'message': '메시지',
        'send-message': '메시지 보내기',
        'message-sent': '메시지가 성공적으로 전송되었습니다!',
        'error-sending': '메시지 전송 오류. 다시 시도해주세요.',
        'admin-title': '관리자 - 연락 메시지',
        'no-messages': '아직 메시지가 없습니다',
        'date': '날짜',
        'actions': '작업'
    }
};

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        // Detect Korean users
        const userLang = navigator.language || navigator.userLanguage;
        return userLang.startsWith('ko') ? 'kr' : 'en';
    }

    init() {
        // Update content immediately on page load
        this.updateContent();

        // Setup language switch after a short delay to ensure navbar is loaded
        setTimeout(() => {
            this.setupLanguageSwitch();
        }, 100);
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        this.updateContent();
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[this.currentLang][key]) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translations[this.currentLang][key];
                } else {
                    element.textContent = translations[this.currentLang][key];
                }
            }
        });
    }

    setupLanguageSwitch() {
        // This will be called when navbar is loaded
        const langSwitch = document.getElementById('lang-switch');
        if (langSwitch) {
            langSwitch.value = this.currentLang;
            langSwitch.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    t(key) {
        return translations[this.currentLang][key] || key;
    }
}

// Initialize i18n
const i18n = new I18n();
