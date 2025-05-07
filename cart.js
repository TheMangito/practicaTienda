// Funcionalidad del carrito de compras
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cartCount = document.getElementById('cart-count');
    const notification = document.getElementById('notification');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Carrito en localStorage
    let cart = JSON.parse(localStorage.getItem('luxeCart')) || [];
    
    // Actualizar contador del carrito
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }
    
    // Mostrar notificación
    function showNotification(message, isError = false) {
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');
            if (isError) {
                notification.classList.add('error');
            } else {
                notification.classList.remove('error');
            }
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
    
    // Agregar producto al carrito
    function addToCart(product) {
        const existingItemIndex = cart.findIndex(item => 
            item.id === product.id && 
            item.size === product.size && 
            item.color === product.color
        );
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += product.quantity;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('luxeCart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${product.name} añadido al carrito`);
    }
    
    // Eliminar producto del carrito
    function removeFromCart(index) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('luxeCart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        updateCartTotals();
        showNotification(`${removedItem.name} eliminado del carrito`);
    }
    
    // Actualizar cantidad de producto
    function updateQuantity(index, newQuantity) {
        if (newQuantity < 1) {
            removeFromCart(index);
            return;
        }
        
        cart[index].quantity = newQuantity;
        localStorage.setItem('luxeCart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        updateCartTotals();
    }
    
    // Calcular subtotal
    function calculateSubtotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Calcular impuestos (10%)
    function calculateTax(subtotal) {
        return subtotal * 0.10;
    }
    
    // Calcular envío (gratis si el subtotal > $200)
    function calculateShipping(subtotal) {
        return subtotal > 200 ? 0 : 15;
    }
    
    // Calcular total
    function calculateTotal(subtotal, tax, shipping) {
        return subtotal + tax + shipping;
    }
    
    // Actualizar totales en la página de carrito
    function updateCartTotals() {
        const subtotalElement = document.getElementById('cart-subtotal');
        const taxElement = document.getElementById('cart-tax');
        const shippingElement = document.getElementById('cart-shipping');
        const totalElement = document.getElementById('cart-total');
        
        if (subtotalElement && taxElement && shippingElement && totalElement) {
            const subtotal = calculateSubtotal();
            const tax = calculateTax(subtotal);
            const shipping = calculateShipping(subtotal);
            const total = calculateTotal(subtotal, tax, shipping);
            
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            taxElement.textContent = `$${tax.toFixed(2)}`;
            shippingElement.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`;
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    // Renderizar items del carrito en la página de carrito
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <p>Tu carrito está vacío</p>
                        <a href="products.html" class="btn btn-primary">Continuar Comprando</a>
                    </div>
                `;
                return;
            }
            
            cartItemsContainer.innerHTML = '';
            
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <div class="cart-item-meta">
                            ${item.color ? `<span class="cart-item-color">Color: ${item.color}</span>` : ''}
                            ${item.size ? `<span class="cart-item-size">Talla: ${item.size}</span>` : ''}
                        </div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                        <button class="quantity-btn increase">+</button>
                    </div>
                    <div class="cart-item-subtotal">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button class="cart-item-remove">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                `;
                
                cartItemsContainer.appendChild(cartItem);
                
                // Botones de cantidad
                const decreaseBtn = cartItem.querySelector('.decrease');
                const increaseBtn = cartItem.querySelector('.increase');
                const quantityInput = cartItem.querySelector('.quantity-input');
                const removeBtn = cartItem.querySelector('.cart-item-remove');
                
                decreaseBtn.addEventListener('click', () => {
                    updateQuantity(index, item.quantity - 1);
                });
                
                increaseBtn.addEventListener('click', () => {
                    updateQuantity(index, item.quantity + 1);
                });
                
                quantityInput.addEventListener('change', (e) => {
                    const newQuantity = parseInt(e.target.value);
                    if (!isNaN(newQuantity)) {
                        updateQuantity(index, newQuantity);
                    }
                });
                
                removeBtn.addEventListener('click', () => {
                    removeFromCart(index);
                });
            });
        }
    }
    
    // Evento para botones "Añadir al Carrito"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
            const productImage = productCard.querySelector('img').src;
            
            // Generar ID único para el producto
            const productId = productName.toLowerCase().replace(/\s+/g, '-');
            
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1,
                // Por defecto, sin color ni talla seleccionados
                color: null,
                size: null
            };
            
            addToCart(product);
        });
    });
    
    // Inicializar contador del carrito
    updateCartCount();
    
    // Si estamos en la página del carrito, renderizar los items
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
        updateCartTotals();
        
        // Botón para vaciar carrito
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
                    cart = [];
                    localStorage.setItem('luxeCart', JSON.stringify(cart));
                    updateCartCount();
                    renderCartItems();
                    updateCartTotals();
                    showNotification('Carrito vaciado');
                }
            });
        }
    }
    
    // Sincronizar carrito entre pestañas
    window.addEventListener('storage', (e) => {
        if (e.key === 'luxeCart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartCount();
            
            if (window.location.pathname.includes('cart.html')) {
                renderCartItems();
                updateCartTotals();
            }
        }
    });
});

// expón total leyendo el DOM
function getCartTotal() {
    const txt = document.getElementById('cart-total').textContent.replace(/[^0-9.]+/g, '');
    return parseFloat(txt);
 }

// Al final de cart.js, tras toda la lógica de carrito…
document.addEventListener('DOMContentLoaded', function() {
    // 1) Crea el botón de PayPal
    paypal.Buttons({
        createOrder: (data, actions) => {
            // usa tu función interna que devuelve el total del carrito
            const total2 = getCartTotal(); 
            return actions.order.create({
                purchase_units: [{ amount: { value: total2.toFixed(2) } }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
                showMessage('¡Gracias por su compra!', 'success');
            });
        },
        onCancel: () => {
            showMessage('Pago cancelado.', 'error');
        },
        onError: err => {
            console.error(err);
            showMessage('Hubo un error al procesar el pago.', 'error');
        }
    }).render('#paypal-button-container');
});

// Función auxiliar para mostrar mensajes en el div#message
function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.innerHTML = `<span class="${type}">${text}</span>`;
}
    