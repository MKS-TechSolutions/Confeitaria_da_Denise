const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const submenuItems = document.querySelectorAll('.has-submenu > a');
const productCards = document.querySelectorAll('.product-card');
const cartIconWrapper = document.querySelector('.cart-icon-wrapper');
const floatingCart = document.getElementById('floating-cart');
const floatingCartItemsList = document.getElementById('floating-cart-items');
const floatingCartTotalElement = document.getElementById('floating-cart-total');
const cartItemCountElement = document.getElementById('cart-item-count');
const addToCartMessageElement = document.querySelector('.add-to-cart-message');
const cart = [];

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    floatingCart.style.display = 'none';
});

cartIconWrapper.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.classList.remove('active');
    floatingCart.style.display = floatingCart.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (event) => {
    const isClickInsideCart = cartIconWrapper.contains(event.target) || floatingCart.contains(event.target);
    const isClickInsideHamburger = hamburger.contains(event.target);
    if (!isClickInsideCart && floatingCart.style.display === 'block' && !isClickInsideHamburger) {
        floatingCart.style.display = 'none';
    }
});

submenuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = item.nextElementSibling;
        if (submenu) {
            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
        }
    });
});

function updateCartDisplay() {
    floatingCartItemsList.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${item.name}</span>
            <div class="cart-item-quantity-controls">
                <button class="quantity-decrease" data-id="${item.id}">-</button>
                <input type="number" class="cart-item-quantity" value="${item.quantity}" min="1" data-id="${item.id}">
                <button class="quantity-increase" data-id="${item.id}">+</button>
            </div>
            <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-item-button" data-id="${item.id}">Remover</button>
        `;
        floatingCartItemsList.appendChild(listItem);
        total += item.price * item.quantity;
        itemCount += item.quantity;
    });

    floatingCartTotalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
    cartItemCountElement.textContent = itemCount;

    floatingCart.style.display = cart.length > 0 ? floatingCart.style.display : 'none';

    // Adiciona listeners para os botões de quantidade e remover no carrinho
    document.querySelectorAll('#floating-cart-items .quantity-decrease').forEach(button => {
        button.addEventListener('click', decreaseCartItemQuantity);
    });
    document.querySelectorAll('#floating-cart-items .quantity-increase').forEach(button => {
        button.addEventListener('click', increaseCartItemQuantity);
    });
    document.querySelectorAll('#floating-cart-items .cart-item-quantity').forEach(input => {
        input.addEventListener('change', updateCartItemQuantityInput);
    });
    document.querySelectorAll('#floating-cart-items .remove-item-button').forEach(button => {
        button.addEventListener('click', removeItemFromCart);
    });
}

function showAddToCartMessage(productName) {
    addToCartMessageElement.textContent = `${productName} adicionado ao carrinho!`;
    addToCartMessageElement.classList.add('show');
    setTimeout(() => {
        addToCartMessageElement.classList.remove('show');
    }, 3000); // Remove a mensagem após 3 segundos
}

productCards.forEach(card => {
    const addButton = card.querySelector('.add-to-cart');
    const quantityInput = card.querySelector('.quantity-input');

    addButton.addEventListener('click', function() {
        const productId = parseInt(card.dataset.id);
        const productName = card.dataset.name;
        const productPrice = parseFloat(card.dataset.price);
        const quantity = parseInt(quantityInput.value);

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: quantity
            });
        }

        updateCartDisplay();
        showAddToCartMessage(`${quantity} x ${productName}`);
        quantityInput.value = 1; // Reseta a quantidade no produto após adicionar
    });

    const decreaseButton = card.querySelector('.quantity-decrease');
    const increaseButton = card.querySelector('.quantity-increase');

    decreaseButton.addEventListener('click', () => {
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });

    increaseButton.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
});

function decreaseCartItemQuantity(event) {
    const itemId = parseInt(event.target.dataset.id);
    const item = cart.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateCartDisplay();
    }
}

function increaseCartItemQuantity(event) {
    const itemId = parseInt(event.target.dataset.id);
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity++;
        updateCartDisplay();
    }
}

function updateCartItemQuantityInput(event) {
    const itemId = parseInt(event.target.dataset.id);
    const newQuantity = parseInt(event.target.value);
    const item = cart.find(i => i.id === itemId);
    if (item && newQuantity >= 1) {
        item.quantity = newQuantity;
        updateCartDisplay();
    } else if (item && newQuantity < 1) {
        event.target.value = 1;
        item.quantity = 1;
        updateCartDisplay();
    }
}

function removeItemFromCart(event) {
    const itemId = parseInt(event.target.dataset.id);
    const index = cart.findIndex(item => item.id === itemId);
    if (index > -1) {
        cart.splice(index, 1);
        updateCartDisplay();
    }
}

updateCartDisplay();