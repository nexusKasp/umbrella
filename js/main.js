// Database of products
const productsDB = {
    "1": {
        id: "1",
        name: "Кофе в зернах Gemma Колумбия",
        price: 750,
        image: "./img/Products/Rectangle 6.png"
    },
    "2": {
        id: "2",
        name: "Кофе в дрипп-пакетах Lezgin Бразилия",
        price: 847,
        image: "./img/Products/Rectangle 7.png"
    },
    "3": {
        id: "3",
        name: "Кофе в зернах Antony Колумбия",
        price: 847,
        image: "./img/Products/Rectangle 8.png"
    },
    "4": {
        id: "4",
        name: "Кофе в зернах Fine Cup Мадагаскар",
        price: 1024,
        image: "./img/Products/Rectangle 19.png"
    },
    "5": {
        id: "5",
        name: "Кофе в капсулах молотый Boobs",
        price: 352,
        image: "./img/Products/Rectangle 20.png"
    },
    "6": {
        id: "6",
        name: "Кофе Gemma Arabika Premium Avar",
        price: 450,
        image: "./img/Products/Rectangle 21.png"
    },
    "7": {
        id: "7",
        name: "Сидамо",
        price: 687,
        image: "./img/Products/image 4.png"
    },
    "8": {
        id: "8",
        name: "Кофе в зернах Antony Колумбия (Брауд)",
        price: 687,
        image: "./img/Products/image 1.png"
    }
};

// Auth Service
class AuthService {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('umbrellaCoffeeUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('umbrellaCoffeeCurrentUser')) || null;
    }

    register(email, password) {
        if (this.users.some(user => user.email === email)) {
            return { success: false, message: 'Пользователь с таким email уже существует' };
        }

        const newUser = {
            id: Date.now().toString(),
            email,
            password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('umbrellaCoffeeUsers', JSON.stringify(this.users));

        return { success: true, user: newUser };
    }

    login(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        
        if (!user) {
            return { success: false, message: 'Неверный email или пароль' };
        }

        this.currentUser = user;
        localStorage.setItem('umbrellaCoffeeCurrentUser', JSON.stringify(user));
        
        return { success: true, user };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('umbrellaCoffeeCurrentUser');
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }
}

const authService = new AuthService();

// Cart functionality
class Cart {
    constructor() {
        this.items = this.loadCart();
    }

    loadCart() {
        if (!authService.isAuthenticated()) return [];
        
        const cart = localStorage.getItem(`umbrellaCoffeeCart_${authService.currentUser.id}`);
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        if (authService.isAuthenticated()) {
            localStorage.setItem(
                `umbrellaCoffeeCart_${authService.currentUser.id}`, 
                JSON.stringify(this.items)
            );
        }
    }

    addItem(productId, weight = '250гр') {
        if (!authService.isAuthenticated()) {
            showToast('Для добавления товаров необходимо войти в систему', 'error');
            openLoginModal();
            return false;
        }

        const product = productsDB[productId];
        if (!product) return false;

        const existingItem = this.items.find(item => item.id === productId && item.weight === weight);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                weight: weight,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCounter();
        return true;
    }

    removeItem(productId, weight) {
        this.items = this.items.filter(item => !(item.id === productId && item.weight === weight));
        this.saveCart();
        this.updateCartCounter();
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartCounter() {
        const counter = document.querySelector('.cart-counter');
        if (counter) {
            const totalItems = this.getTotalItems();
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }
}

const cart = new Cart();

// Helper functions
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function openLoginModal() {
    closeAllModals();
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('active');
    }
}

function updateAuthUI() {
    const loginBtn = document.querySelector('.login-btn');
    const navList = document.querySelector('.nav__list');
    const cartLink = document.querySelector('.cart-link');
    
    if (authService.isAuthenticated()) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (cartLink) cartLink.style.display = 'block';
        
        const userLi = document.querySelector('.nav-user') || document.createElement('li');
        userLi.className = 'nav-user';
        userLi.innerHTML = `
            <div class="user-dropdown">
                <a href="#" class="nav__link user-link">${authService.currentUser.email}</a>
                <div class="dropdown-content">
                    <a href="#" class="logout-btn">Выйти</a>
                </div>
            </div>
        `;
        
        if (!document.querySelector('.nav-user')) {
            navList.insertBefore(userLi, navList.lastElementChild);
        }
        
        cart.items = cart.loadCart();
        cart.updateCartCounter();
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (cartLink) cartLink.style.display = 'none';
        
        const userLi = document.querySelector('.nav-user');
        if (userLi) userLi.remove();
        
        cart.items = [];
        cart.updateCartCounter();
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    const burger = document.querySelector('[data-burger]');
    const nav = document.querySelector('[data-nav]');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Add cart link
    const navList = document.querySelector('.nav__list');
    if (navList) {
        const cartLink = document.createElement('li');
        cartLink.innerHTML = `
            <a href="#" class="nav__link cart-link" style="display: none">
                Корзина
                <span class="cart-counter" style="display: none">0</span>
            </a>
        `;
        navList.insertBefore(cartLink, navList.lastElementChild);
    }

    // Product interactions
    document.addEventListener('click', function(e) {
        // Add to cart
        if (e.target.classList.contains('btn') && e.target.textContent === 'В корзину') {
            e.preventDefault();
            const productCard = e.target.closest('.product-card, .product-cart');
            if (productCard) {
                const productId = Array.from(productCard.parentNode.children).indexOf(productCard) + 1;
                const weightOption = productCard.querySelector('.weight-option.active, .gr-option.active');
                const weight = weightOption ? weightOption.textContent : '250гр';
                
                const added = cart.addItem(productId.toString(), weight);
                if (added) {
                    e.target.textContent = 'Добавлено!';
                    e.target.style.backgroundColor = '#4CAF50';
                    setTimeout(() => {
                        e.target.textContent = 'В корзину';
                        e.target.style.backgroundColor = '';
                    }, 2000);
                }
            }
        }

        // Weight selection
        if (e.target.classList.contains('weight-option') || e.target.classList.contains('gr-option')) {
            e.preventDefault();
            const container = e.target.closest('.product-card__weight, .product-cart__weight');
            if (container) {
                container.querySelectorAll('.weight-option, .gr-option').forEach(option => {
                    option.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        }

        // Logout
        if (e.target.classList.contains('logout-btn')) {
            e.preventDefault();
            authService.logout();
            updateAuthUI();
            showToast('Вы вышли из системы');
        }
    });

    // Auth forms
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            const result = authService.login(email, password);
            if (result.success) {
                closeAllModals();
                updateAuthUI();
                showToast('Вы успешно вошли в систему');
            } else {
                showToast(result.message, 'error');
            }
        });
    }

    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            const result = authService.register(email, password);
            if (result.success) {
                authService.login(email, password);
                closeAllModals();
                updateAuthUI();
                showToast('Регистрация прошла успешно!');
            } else {
                showToast(result.message, 'error');
            }
        });
    }

    // Modal windows
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.modal__close');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginModal').classList.add('active');
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginModal').classList.remove('active');
            document.getElementById('registerModal').classList.add('active');
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(modal => modal.classList.remove('active'));
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Auth tabs
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Cart preview
    const cartLink = document.querySelector('.cart-link');
    const cartPreview = document.createElement('div');
    cartPreview.id = 'cartPreview';
    cartPreview.style.display = 'none';
    cartPreview.innerHTML = `
        <div class="cart-preview__content">
            <h3>Ваша корзина</h3>
            <div class="cart-items"></div>
            <div class="cart-total">
                <span>Итого:</span>
                <span class="total-price">0 ₽</span>
            </div>
            <button class="btn btn--checkout">Оформить заказ</button>
        </div>
    `;
    document.body.appendChild(cartPreview);

    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            cartPreview.style.display = cartPreview.style.display === 'block' ? 'none' : 'block';
            updateCartPreview();
        });
    }

    function updateCartPreview() {
        const cartItemsContainer = cartPreview.querySelector('.cart-items');
        const totalPriceElement = cartPreview.querySelector('.total-price');
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
            totalPriceElement.textContent = '0 ₽';
            return;
        }
        
        cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name} (${item.weight})</div>
                    <div class="cart-item-price">${item.price} ₽ × ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" data-weight="${item.weight}">×</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        totalPriceElement.textContent = `${cart.getTotalPrice()} ₽`;
        
        cartPreview.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const weight = this.getAttribute('data-weight');
                cart.removeItem(productId, weight);
                updateCartPreview();
            });
        });
    }

    // Initialize UI
    updateAuthUI();
});
