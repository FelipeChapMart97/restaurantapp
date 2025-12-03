// Datos del menú de RestaurantApp
const menuItems = [
    {
        id: 1,
        name: "Ceviche Mixto",
        category: "entradas",
        price: 18.90,
        description: "Pescado y mariscos frescos marinados en limón con cebolla y ají limo.",
        image: "https://www.elespectador.com/resizer/v2/2AVD5Z6Y2ZFWHETPQGCPLMNK4A.jpg?auth=82394bc07906097860918c7a77b6320dbba80a4b67cc293a909e810ae6941229&width=920&height=613&smart=true&quality=60"
    },
    {
        id: 2,
        name: "Lomo Saltado",
        category: "principales",
        price: 24.50,
        description: "Trozos de lomo de res salteados con cebolla, tomate y papas fritas.",
        image: "https://imag.bonviveur.com/lomo-saltado.webp"
    },
    {
        id: 3,
        name: "Aji de Gallina",
        category: "principales",
        price: 21.90,
        description: "Pollo desmenuzado en crema de ají amarillo con nueces y queso.",
        image: "https://easyways.cl/storage/20180531102415aji-gallina-peruano.jpg"
    },
    {
        id: 4,
        name: "Suspiro a la Limeña",
        category: "postres",
        price: 12.50,
        description: "Dulce de manjar blanco con merengue de vino oporto.",
        image: "https://cdn0.recetasgratis.net/es/posts/2/6/2/suspiro_limeno_78262_600.webp"
    },
    {
        id: 5,
        name: "Pisco Sour",
        category: "bebidas",
        price: 15.00,
        description: "Nuestro cóctel bandera preparado con pisco, limón y clara de huevo.",
        image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/pisco-sour-44f6c3b.jpg?quality=90&webp=true&resize=700,636"
    },
    {
        id: 6,
        name: "Chicha Morada",
        category: "bebidas",
        price: 8.00,
        description: "Refrescante bebida de maíz morado con canela y clavo de olor.",
        image: "https://tofuu.getjusto.com/orioneat-local/resized2/xkq9Bh55a8u2yvAMR-300-x.webp"
    }
];

// Variables globales
let cart = [];
let currentCategory = 'all';

// Elementos DOM
const menuGrid = document.querySelector('.menu-grid');
const categoryBtns = document.querySelectorAll('.category-btn');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const checkoutBtn = document.querySelector('.checkout-btn');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const contactForm = document.getElementById('contactForm');

// Inicializar aplicación
function init() {
    renderMenu();
    setupEventListeners();
    updateCartCount();
}

// Renderizar menú
function renderMenu() {
    menuGrid.innerHTML = '';
    
    const filteredItems = currentCategory === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === currentCategory);
    
    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <div class="menu-item-title">${item.name}</div>
                    <div class="menu-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="menu-item-description">${item.description}</div>
                <div class="menu-item-footer">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="decreaseQuantity(${item.id})">-</button>
                        <span class="quantity" id="quantity-${item.id}">0</span>
                        <button class="quantity-btn plus" onclick="increaseQuantity(${item.id})">+</button>
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${item.id})">Agregar</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Categorías
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderMenu();
        });
    });

    // Carrito
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        renderCart();
    });

    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    checkoutBtn.addEventListener('click', checkout);

    // Formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
            this.reset();
        });
    }

    // Cerrar modal al hacer click fuera
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

// Funciones del carrito
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartCount();
    updateQuantityDisplay(itemId);
}

function increaseQuantity(itemId) {
    addToCart(itemId);
}

function decreaseQuantity(itemId) {
    const itemIndex = cart.findIndex(i => i.id === itemId);
    
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        
        updateCartCount();
        updateQuantityDisplay(itemId);
    }
}

function updateQuantityDisplay(itemId) {
    const quantityElement = document.getElementById(`quantity-${itemId}`);
    const cartItem = cart.find(i => i.id === itemId);
    if (quantityElement) {
        quantityElement.textContent = cartItem ? cartItem.quantity : '0';
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        totalAmount.textContent = '$0.00';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)} c/u</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn minus" onclick="decreaseQuantity(${item.id})">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" onclick="increaseQuantity(${item.id})">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = cart.map(item => 
        `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    alert(`¡Pedido confirmado!\n\n${orderDetails}\n\nTotal: $${total.toFixed(2)}\n\nGracias por tu compra. Tu pedido será preparado pronto.`);
    
    cart = [];
    updateCartCount();
    renderCart();
    cartModal.style.display = 'none';
    
    // Resetear cantidades en el menú
    menuItems.forEach(item => {
        updateQuantityDisplay(item.id);
    });
}

// Smooth scrolling para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', init);