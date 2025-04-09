// Mobile Menu
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