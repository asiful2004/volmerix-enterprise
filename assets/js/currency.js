// Currency management module for Volmerix Enterprise

class CurrencyManager {
    constructor() {
        this.currentCurrency = localStorage.getItem('currency') || this.detectCurrency();
        this.rates = {
            KRW: 1,
            USD: 0.00075  // Approximate rate, should be updated with real API
        };
        this.init();
    }

    detectCurrency() {
        // Detect Korean users and default to KRW
        const userLang = navigator.language || navigator.userLanguage;
        return userLang.startsWith('ko') ? 'KRW' : 'USD';
    }

    init() {
        this.updatePrices();
        this.setupCurrencySwitch();
    }

    setCurrency(currency) {
        this.currentCurrency = currency;
        localStorage.setItem('currency', currency);
        this.updatePrices();
    }

    formatPrice(priceKRW) {
        const price = priceKRW * this.rates[this.currentCurrency];
        const symbol = this.currentCurrency === 'KRW' ? '₩' : '$';

        if (this.currentCurrency === 'KRW') {
            return `${symbol}${Math.round(price).toLocaleString()}`;
        } else {
            return `${symbol}${price.toFixed(2)}`;
        }
    }

    updatePrices() {
        const priceElements = document.querySelectorAll('[data-price]');
        priceElements.forEach(element => {
            const priceKRW = parseInt(element.getAttribute('data-price'));
            element.textContent = this.formatPrice(priceKRW);
        });
    }

    setupCurrencySwitch() {
        // This will be called when navbar is loaded
        const currencySwitch = document.getElementById('currency-switch');
        if (currencySwitch) {
            currencySwitch.value = this.currentCurrency;
            currencySwitch.addEventListener('change', (e) => {
                this.setCurrency(e.target.value);
            });
        }
    }

    getCurrentCurrency() {
        return this.currentCurrency;
    }

    getSymbol() {
        return this.currentCurrency === 'KRW' ? '₩' : '$';
    }
}

// Initialize currency manager
const currencyManager = new CurrencyManager();
