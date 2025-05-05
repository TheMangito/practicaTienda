document.addEventListener('DOMContentLoaded', function() {
    // Hero Carousel
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopSlideshow();
            startSlideshow();
        });
    });

    // Start the slideshow
    if (slides.length > 0) {
        startSlideshow();
    }

    // Product Carousel
    const productSlider = document.querySelector('.product-slider');
    const productPrevBtn = document.querySelector('.carousel-btn.product-prev');
    const productNextBtn = document.querySelector('.carousel-btn.product-next');
    
    if (productSlider && productPrevBtn && productNextBtn) {
        const productCards = productSlider.querySelectorAll('.product-card');
        let productPosition = 0;
        const productCardWidth = productCards[0].offsetWidth + 30; // card width + margin
        const visibleCards = Math.floor(productSlider.offsetWidth / productCardWidth);
        const maxPosition = productCards.length - visibleCards;

        function moveProducts(direction) {
            if (direction === 'next' && productPosition < maxPosition) {
                productPosition++;
            } else if (direction === 'prev' && productPosition > 0) {
                productPosition--;
            }
            
            productSlider.style.transform = `translateX(-${productPosition * productCardWidth}px)`;
        }

        productPrevBtn.addEventListener('click', () => moveProducts('prev'));
        productNextBtn.addEventListener('click', () => moveProducts('next'));
    }

    // Price Range Slider
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    
    if (priceSlider && priceValue) {
        priceSlider.addEventListener('input', function() {
            priceValue.textContent = `$${this.value}`;
        });
    }

    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('show');
        });
    }

    // Quick View and Add to Cart buttons
    const quickViewBtns = document.querySelectorAll('.quick-view');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.product-card').querySelector('.product-name').textContent;
            alert(`Vista rápida de ${productName}`);
            // Aquí iría el código para mostrar un modal con la vista rápida del producto
        });
    });
});