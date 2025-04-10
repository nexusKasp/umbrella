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

// Cart functionality
class Cart {
    constructor() {
        this.items = this.loadCart();
    }

    loadCart() {
        const cart = localStorage.getItem('umbrellaCoffeeCart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        localStorage.setItem('umbrellaCoffeeCart', JSON.stringify(this.items));
    }

    addItem(productId, weight = '250гр') {
        const product = productsDB[productId];
        if (!product) return;

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

// Initialize cart
const cart = new Cart();

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add cart counter to the header
    const navList = document.querySelector('.nav__list');
    if (navList) {
        const cartLink = document.createElement('li');
        cartLink.innerHTML = `
            <a href="#" class="nav__link cart-link">
                Корзина
                <span class="cart-counter" style="display: ${cart.getTotalItems() > 0 ? 'block' : 'none'}">
                    ${cart.getTotalItems()}
                </span>
            </a>
        `;
        navList.insertBefore(cartLink, navList.lastElementChild);
    }

    // Handle add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') && e.target.textContent === 'В корзину') {
            const productCard = e.target.closest('.product-card, .product-cart');
            if (productCard) {
                // For catalog page product cards
                const productId = Array.from(productCard.parentNode.children).indexOf(productCard) + 1;
                const weightOption = productCard.querySelector('.weight-option.active, .gr-option.active');
                const weight = weightOption ? weightOption.textContent : '250гр';
                
                cart.addItem(productId.toString(), weight);
                
                // Visual feedback
                e.target.textContent = 'Добавлено!';
                e.target.style.backgroundColor = '#4CAF50';
                setTimeout(() => {
                    e.target.textContent = 'В корзину';
                    e.target.style.backgroundColor = '';
                }, 2000);
            }
        }

        // Handle weight selection
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
    });

    // Update cart counter on page load
    cart.updateCartCounter();
});
const burger = document.querySelector('[data-burger]');
const nav = document.querySelector('[data-nav]');

if (burger && nav) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
    });
}

// Modal Windows
const loginBtn = document.querySelector('.login-btn');
const registerBtn = document.querySelector('.register-btn');
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.modal__close');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');

if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('active');
    });
}

if (registerBtn && registerModal) {
    registerBtn.addEventListener('click', () => {
        loginModal.classList.remove('active');
        registerModal.classList.add('active');
    });
}

if (closeBtns.length > 0 && modals.length > 0) {
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(modal => modal.classList.remove('active'));
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Auth Tabs
const authTabs = document.querySelectorAll('.auth-tab');

if (authTabs.length > 0) {
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

// Forms submission (prevent default for demo)
const forms = document.querySelectorAll('form');
if (forms.length > 0) {
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form handling logic here
        });
    });
}
// Cart preview functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartLink = document.querySelector('.cart-link');
    const cartPreview = document.getElementById('cartPreview');
    
    if (cartLink && cartPreview) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            cartPreview.style.display = cartPreview.style.display === 'block' ? 'none' : 'block';
            updateCartPreview();
        });
        
        // Close cart when clicking outside
        document.addEventListener('click', function(e) {
            if (!cartPreview.contains(e.target) && e.target !== cartLink && !cartLink.contains(e.target)) {
                cartPreview.style.display = 'none';
            }
        });
    }
    
    function updateCartPreview() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const totalPriceElement = document.querySelector('.total-price');
        
        if (cartItemsContainer && totalPriceElement) {
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
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.cart-item-remove').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    const weight = this.getAttribute('data-weight');
                    cart.removeItem(productId, weight);
                    updateCartPreview();
                });
            });
        }
    }
});
