document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM para filtros
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    const colorFilters = document.querySelectorAll('.color-filter input');
    const sizeFilters = document.querySelectorAll('.size-filter input');
    const sortSelect = document.getElementById('sort-by');
    const productsGrid = document.querySelector('.products-grid');
    const productsCount = document.querySelector('.products-count span');
    
    // Productos originales (para restaurar después de filtrar)
    let originalProducts = [];
    
    // Obtener todos los productos iniciales
    if (productsGrid) {
        originalProducts = Array.from(productsGrid.querySelectorAll('.product-card'));
    }
    
    // Función para actualizar el contador de productos
    function updateProductCount() {
        if (productsCount) {
            const visibleProducts = productsGrid.querySelectorAll('.product-card:not(.hidden)').length;
            productsCount.textContent = `${visibleProducts} productos`;
        }
    }
    
    // Función para aplicar filtros
    function applyFilters() {
        if (!productsGrid) return;
        
        // Obtener valores de filtros
        const maxPrice = priceSlider ? parseInt(priceSlider.value) : 1000;
        const selectedColors = Array.from(colorFilters)
            .filter(input => input.checked)
            .map(input => input.value);
        const selectedSizes = Array.from(sizeFilters)
            .filter(input => input.checked)
            .map(input => input.value);
        
        // Restaurar productos originales
        while (productsGrid.firstChild) {
            productsGrid.removeChild(productsGrid.firstChild);
        }
        
        let filteredProducts = [...originalProducts];
        
        // Filtrar por precio
        filteredProducts = filteredProducts.filter(product => {
            const price = parseFloat(product.querySelector('.product-price').textContent.replace('$', ''));
            return price <= maxPrice;
        });
        
        // Filtrar por color (si hay colores seleccionados)
        if (selectedColors.length > 0) {
            // Simulamos que cada producto tiene un color basado en su índice
            // En una aplicación real, esto vendría de los datos del producto
            filteredProducts = filteredProducts.filter((product, index) => {
                const productColors = [
                    'black', 'white', 'beige', 'navy', 'burgundy'
                ];
                const productColor = productColors[index % productColors.length];
                return selectedColors.includes(productColor);
            });
        }
        
        // Filtrar por talla (si hay tallas seleccionadas)
        if (selectedSizes.length > 0) {
            // Simulamos que cada producto tiene tallas basadas en su índice
            // En una aplicación real, esto vendría de los datos del producto
            filteredProducts = filteredProducts.filter((product, index) => {
                const productSizes = [
                    'xs', 's', 'm', 'l', 'xl'
                ];
                const productSize = productSizes[index % productSizes.length];
                return selectedSizes.includes(productSize);
            });
        }
        
        // Ordenar productos
        if (sortSelect) {
            const sortValue = sortSelect.value;
            
            filteredProducts.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
                
                if (sortValue === 'price-low') {
                    return priceA - priceB;
                } else if (sortValue === 'price-high') {
                    return priceB - priceA;
                } else if (sortValue === 'newest') {
                    // Simulamos que los productos más nuevos están al final del array original
                    return originalProducts.indexOf(b) - originalProducts.indexOf(a);
                }
                
                // Por defecto, mantener el orden original (featured)
                return originalProducts.indexOf(a) - originalProducts.indexOf(b);
            });
        }
        
        // Mostrar productos filtrados
        filteredProducts.forEach(product => {
            productsGrid.appendChild(product.cloneNode(true));
        });
        
        // Actualizar contador de productos
        updateProductCount();
        
        // Volver a añadir event listeners a los botones de añadir al carrito
        const addToCartButtons = productsGrid.querySelectorAll('.add-to-cart');
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
                    color: null,
                    size: null
                };
                
                // Usar la función addToCart del archivo cart.js
                let addToCart; // Declare addToCart
                if (typeof window.addToCart === 'function') {
                    addToCart = window.addToCart;
                    addToCart(product);
                } else {
                    // Fallback si la función no está disponible
                    let cart = JSON.parse(localStorage.getItem('luxeCart')) || [];
                    cart.push(product);
                    localStorage.setItem('luxeCart', JSON.stringify(cart));
                    
                    // Mostrar notificación
                    const notification = document.getElementById('notification');
                    if (notification) {
                        notification.textContent = `${product.name} añadido al carrito`;
                        notification.classList.add('show');
                        
                        setTimeout(() => {
                            notification.classList.remove('show');
                        }, 3000);
                    }
                }
            });
        });
    }
    
    // Event listeners para filtros
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            if (priceValue) {
                priceValue.textContent = `$${this.value}`;
            }
            applyFilters();
        });
    }
    
    colorFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    sizeFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    // Inicializar filtros
    applyFilters();
});