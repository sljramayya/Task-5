// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Shopping Cart Functionality
    const cartCount = document.querySelector('.cart-count');
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const continueShopping = document.querySelector('.continue-shopping');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    let cartItemsCount = 3; // Initial cart items
    
    // Sample products data
    const products = [
        {
            id: 1,
            name: 'Premium Winter Jacket',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            quantity: 1
        },
        {
            id: 2,
            name: 'Designer Evening Dress',
            price: 69.99,
            image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            quantity: 1
        },
        {
            id: 3,
            name: 'Casual Linen Shirt',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            quantity: 1
        },
        {
            id: 4,
            name: 'Running Sport Shoes',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            quantity: 1
        }
    ];
    
    // Initialize cart with sample items
    let cart = [products[0], products[1], products[3]];
    
    // Add to cart functionality
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === products[index].id);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({...products[index]});
            }
            
            cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = cartItemsCount;
            
            // Animation effect
            button.innerHTML = '<i class="fas fa-check"></i> Added';
            button.style.backgroundColor = '#4CAF50';
            
            // Reset button after animation
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                button.style.backgroundColor = '';
            }, 1500);
        });
    });
    
    // Toggle cart modal
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        renderCart();
        cartModal.style.display = 'flex';
    });
    
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    continueShopping.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    // Close cart when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Render cart items
    function renderCart() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = '$0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                updateQuantity(id, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                updateQuantity(id, 1);
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const id = parseInt(this.dataset.id);
                const newQuantity = parseInt(this.value) || 1;
                updateQuantity(id, newQuantity, true);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                removeFromCart(id);
            });
        });
    }
    
    // Update item quantity in cart
    function updateQuantity(id, change, setValue = false) {
        const item = cart.find(item => item.id === id);
        
        if (item) {
            if (setValue) {
                item.quantity = change;
            } else {
                item.quantity += change;
            }
            
            if (item.quantity < 1) {
                item.quantity = 1;
            }
            
            cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = cartItemsCount;
            renderCart();
        }
    }
    
    // Remove item from cart
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = cartItemsCount;
        renderCart();
    }
    
    // Newsletter form submission
    const subscribeForm = document.querySelector('.subscribe-form');
    subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        
        if (emailInput.value && validateEmail(emailInput.value)) {
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    });
    
    // Email validation function
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Responsive menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('a.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                navMenu.classList.remove('show');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Quick view functionality
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, this would show product details
            alert('Quick view feature would show product details here!');
        });
    });
    
    // Highlight active section in navigation
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('a.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 100)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
});