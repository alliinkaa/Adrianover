// Инициализация корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Обработчик событий для кнопок "Добавить в корзину"
const addToCartButtons = document.querySelectorAll('.dish-item button');
addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

// Функция добавления товара в корзину
// Функция добавления товара в корзину
function addToCart(event) {
    const dishItem = event.target.closest('.dish-item'); // Получаем родительский элемент для кнопки
    const dishName = dishItem.querySelector('h3').innerText; // Получаем название блюда
    const dishPrice = parseFloat(dishItem.querySelector('.price').innerText.replace('сом', '').trim()); // Получаем цену, заменяя 'сом' на пустую строку
    const dishImage = dishItem.querySelector('img').src; // Получаем путь к изображению
    const dishDescription = dishItem.querySelector('.description').innerText; // Получаем описание блюда

    const existingDish = cart.find(item => item.name === dishName);
    if (existingDish) {
        existingDish.quantity += 1; // Увеличиваем количество, если блюдо уже в корзине
    } else {
        cart.push({ name: dishName, price: dishPrice, quantity: 1, image: dishImage, description: dishDescription }); // Добавляем новое блюдо в корзину с описанием
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Сохраняем корзину в localStorage
    updateCartCount(); // Обновляем количество товаров в корзине
}



// Обновление количества товаров в корзине
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
}

// Открытие модального окна корзины
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeModal = cartModal.querySelector('.close');

cartButton.addEventListener('click', () => {
    updateCartModal();
    cartModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Обновление содержимого модального окна корзины
function updateCartModal() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-content">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="description">${item.description}</p> <!-- Теперь описание меняется в зависимости от блюда -->
                    <div class="cart-item-quantity">
                        <button class="decrease-button" data-name="${item.name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-button" data-name="${item.name}">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <p class="price">${(item.price * item.quantity).toFixed(2)} сом</p>
                    <button class="remove-button" data-name="${item.name}">Удалить</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
        totalPrice += item.price * item.quantity;
    });

    document.getElementById('total-price').innerText = totalPrice.toFixed(2);
    attachButtonEvents(); // Привязываем события к кнопкам
}


// Удаление товара из корзины
function attachButtonEvents() {
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeFromCart);
    });

    const increaseButtons = document.querySelectorAll('.increase-button');
    increaseButtons.forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });

    const decreaseButtons = document.querySelectorAll('.decrease-button');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
}

function increaseQuantity(event) {
    const dishName = event.target.dataset.name;
    const existingDish = cart.find(item => item.name === dishName);
    if (existingDish) {
        existingDish.quantity += 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartModal();
    updateCartCount();
}

function decreaseQuantity(event) {
    const dishName = event.target.dataset.name;
    const existingDish = cart.find(item => item.name === dishName);
    if (existingDish) {
        if (existingDish.quantity > 1) {
            existingDish.quantity -= 1;
        } else {
            removeFromCart(event);
            return;
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartModal();
    updateCartCount();
}

function removeFromCart(event) {
    const dishName = event.target.dataset.name;
    cart = cart.filter(item => item.name !== dishName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartModal();
    updateCartCount();
}

// Отправка формы
const orderForm = document.getElementById('order-form');
orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // Здесь можно добавить логику отправки формы
    alert('Заказ оформлен!');
    cart = []; // Очистить корзину после оформления заказа
    localStorage.removeItem('cart');
    updateCartCount();
    cartModal.style.display = 'none';
});
