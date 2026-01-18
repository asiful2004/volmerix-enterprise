// Navbar component for Volmerix Enterprise

function createNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    navbar.innerHTML = `
        <div class="container mx-auto px-4 py-3 md:py-4">
            <div class="flex items-center justify-between">
                <!-- Logo -->
                <div class="flex items-center">
                    <a href="index.html" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <img src="assets/images/Volmerix-Enterprise.png" alt="Volmerix Logo" class="h-10 md:h-12 lg:h-14 xl:h-16 w-auto object-contain">
                        <span class="hidden lg:inline text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-purple-600">Volmerix</span>
                    </a>
                </div>

                <!-- Navigation Menu -->
                <div class="hidden lg:flex items-center space-x-2 xl:space-x-4">
                    <a href="index.html" class="relative text-gray-700 hover:text-blue-600 transition-all duration-300 text-sm xl:text-base font-semibold tracking-wide px-4 py-2 rounded-lg hover:bg-blue-50 hover:shadow-sm" data-i18n="home">Home</a>
                    <a href="shop.html" class="relative text-gray-700 hover:text-blue-600 transition-all duration-300 text-sm xl:text-base font-semibold tracking-wide px-4 py-2 rounded-lg hover:bg-blue-50 hover:shadow-sm" data-i18n="shop">Shop</a>
                    <a href="about.html" class="relative text-gray-700 hover:text-purple-600 transition-all duration-300 text-sm xl:text-base font-semibold tracking-wide px-4 py-2 rounded-lg hover:bg-purple-50 hover:shadow-sm" data-i18n="about">About Us</a>
                    <a href="contact.html" class="relative text-gray-700 hover:text-blue-600 transition-all duration-300 text-sm xl:text-base font-semibold tracking-wide px-4 py-2 rounded-lg hover:bg-blue-50 hover:shadow-sm" data-i18n="contact">Contact Us</a>
                </div>

                <!-- Right Side Controls -->
                <div class="flex items-center space-x-2 md:space-x-4">
                    <!-- Currency Switch - Hidden on mobile -->
                    <select id="currency-switch" class="hidden lg:inline bg-gray-100 border border-gray-300 rounded px-2 md:px-3 py-1 text-xs md:text-sm">
                        <option value="KRW">₩ KRW</option>
                        <option value="USD">$ USD</option>
                    </select>

                    <!-- Language Switch - Hidden on mobile -->
                    <select id="lang-switch" class="hidden lg:inline bg-gray-100 border border-gray-300 rounded px-2 md:px-3 py-1 text-xs md:text-sm">
                        <option value="en">EN</option>
                        <option value="kr">KR</option>
                    </select>

                    <!-- Social Icons - Smaller on mobile -->
                    <div class="hidden sm:flex space-x-1 md:space-x-2">
                        <a href="#" class="text-gray-600 hover:text-blue-600 transition duration-300 p-1">
                            <i class="fab fa-discord text-sm md:text-lg"></i>
                        </a>
                        <a href="#" class="text-gray-600 hover:text-purple-600 transition duration-300 p-1">
                            <i class="fab fa-facebook text-sm md:text-lg"></i>
                        </a>
                        <a href="#" class="text-gray-600 hover:text-blue-600 transition duration-300 p-1">
                            <i class="fab fa-telegram text-sm md:text-lg"></i>
                        </a>
                    </div>

                    <!-- Mobile Menu Button -->
                    <button id="mobile-menu-btn" class="lg:hidden text-gray-700 hover:text-blue-600 p-2 -mr-2">
                        <i class="fas fa-bars text-lg"></i>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div id="mobile-menu" class="lg:hidden hidden mt-4 pb-4 border-t border-gray-200 bg-white">
                <!-- Navigation Links -->
                <div class="flex flex-col space-y-1 pt-4 px-2">
                    <a href="index.html" class="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition duration-300 py-3 px-4 rounded-lg" data-i18n="home">Home</a>
                    <a href="shop.html" class="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition duration-300 py-3 px-4 rounded-lg" data-i18n="shop">Shop</a>
                    <a href="about.html" class="text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition duration-300 py-3 px-4 rounded-lg" data-i18n="about">About Us</a>
                    <a href="contact.html" class="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition duration-300 py-3 px-4 rounded-lg" data-i18n="contact">Contact Us</a>
                </div>

                <!-- Mobile Controls Separator -->
                <div class="border-t border-gray-100 my-4"></div>

                <!-- Mobile Controls -->
                <div class="px-2 space-y-4">
                    <!-- Currency and Language Switches -->
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Currency</label>
                            <select id="mobile-currency-switch" class="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-sm">
                                <option value="KRW">₩ KRW</option>
                                <option value="USD">$ USD</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Language</label>
                            <select id="mobile-lang-switch" class="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-sm">
                                <option value="en">EN</option>
                                <option value="kr">KR</option>
                            </select>
                        </div>
                    </div>

                    <!-- Social Icons -->
                    <div class="flex justify-center space-x-4 pt-2">
                        <a href="#" class="text-gray-600 hover:text-blue-600 transition duration-300 p-2 bg-gray-50 rounded-full">
                            <i class="fab fa-discord text-lg"></i>
                        </a>
                        <a href="#" class="text-gray-600 hover:text-purple-600 transition duration-300 p-2 bg-gray-50 rounded-full">
                            <i class="fab fa-facebook text-lg"></i>
                        </a>
                        <a href="#" class="text-gray-600 hover:text-blue-600 transition duration-300 p-2 bg-gray-50 rounded-full">
                            <i class="fab fa-telegram text-lg"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Setup switches after navbar is loaded
    if (typeof i18n !== 'undefined') {
        i18n.setupLanguageSwitch();
        // Sync mobile language switch
        setupMobileLanguageSwitch();
    }
    if (typeof currencyManager !== 'undefined') {
        currencyManager.setupCurrencySwitch();
        // Sync mobile currency switch
        setupMobileCurrencySwitch();
    }

    // Setup mobile menu close on outside click
    setupMobileMenuClose();
}

function setupMobileLanguageSwitch() {
    const desktopLangSwitch = document.getElementById('lang-switch');
    const mobileLangSwitch = document.getElementById('mobile-lang-switch');

    if (desktopLangSwitch && mobileLangSwitch) {
        // Sync initial values
        mobileLangSwitch.value = desktopLangSwitch.value;

        // Handle mobile switch changes
        mobileLangSwitch.addEventListener('change', (e) => {
            desktopLangSwitch.value = e.target.value;
            desktopLangSwitch.dispatchEvent(new Event('change'));
        });
    }
}

function setupMobileCurrencySwitch() {
    const desktopCurrencySwitch = document.getElementById('currency-switch');
    const mobileCurrencySwitch = document.getElementById('mobile-currency-switch');

    if (desktopCurrencySwitch && mobileCurrencySwitch) {
        // Sync initial values
        mobileCurrencySwitch.value = desktopCurrencySwitch.value;

        // Handle mobile switch changes
        mobileCurrencySwitch.addEventListener('change', (e) => {
            desktopCurrencySwitch.value = e.target.value;
            desktopCurrencySwitch.dispatchEvent(new Event('change'));
        });
    }
}

function setupMobileMenuClose() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');

        if (mobileMenu && mobileMenuBtn && !mobileMenu.classList.contains('hidden')) {
            // Check if click is outside mobile menu and button
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        }
    });

    // Close mobile menu when clicking on navigation links
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', createNavbar);
