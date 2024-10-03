document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken'); // Получаем токен из localStorage

    // Если токена нет, перенаправляем на страницу входа
    if (!token) {
        window.location.href = 'login-register.html';
        return;
    }

    // Получаем элементы формы и сообщение
    const userForm = document.getElementById('userForm');
    const responseMessage = document.getElementById('responseMessage');

    // Получаем иконку корзины и обновляем ее видимость и счетчик
    const cartIcon = document.getElementById('cart-button');

    // Функция для отображения корзины, если авторизован
    function setupCart() {
        if (token) {
            cartIcon.style.display = 'block';
            fetchCartData(token);
        } else {
            cartIcon.style.display = 'none';
        }
    }

    // Функция для получения данных пользователя
    function fetchUserData() {
        fetch('http://localhost:8080/api/user', { // Замените на URL вашего бэкенда
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось получить данные пользователя');
            }
            return response.json();
        })
        .then(data => {
            // Заполняем форму данными пользователя
            document.getElementById('fullName').value = data.fullName;
            document.getElementById('phone').value = data.phone;
            document.getElementById('birthday').value = data.birthday;
            document.getElementById('email').value = data.email;
            document.getElementById('password').value = ''; // Пароль не заполняем для безопасности
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка при загрузке данных пользователя. Пожалуйста, войдите снова.');
            // Если ошибка, возможно, токен недействителен, удаляем его и перенаправляем на вход
            localStorage.removeItem('authToken');
            window.location.href = 'login-register.html';
        });
    }

    // Обработчик отправки формы
    userForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        // Собираем данные из формы
        const updatedData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            birthday: document.getElementById('birthday').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        // Отправляем данные на сервер для обновления
        fetch('http://localhost:8080/api/user', { // Замените на URL вашего бэкенда
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось обновить данные пользователя');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                responseMessage.textContent = 'Данные успешно обновлены!';
                responseMessage.style.color = 'green';
                userForm.reset(); // Очистить форму, если нужно
            } else {
                responseMessage.textContent = `Ошибка: ${data.message}`;
                responseMessage.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            responseMessage.textContent = 'Произошла ошибка при обновлении данных.';
            responseMessage.style.color = 'red';
        });
    });

    // Функция для получения данных корзины
    function fetchCartData(token) {
        fetch('http://localhost:8080/api/cart', { // Замените на URL вашего бэкенда
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось получить данные корзины');
            }
            return response.json();
        })
        .then(data => {
            // Обновляем счетчик корзины
            const cartCount = data.count || 0;
            document.getElementById('cart-count').textContent = cartCount;
            cartIcon.setAttribute('data-count', cartCount);

            // Заполняем содержимое корзины
            const cartItemsContainer = document.querySelector('.cart-items');
            cartItemsContainer.innerHTML = ''; // Очистить текущие элементы

            data.items.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p class="description">${item.weight}</p>
                        <div class="cart-item-actions">
                            <button class="change-button">Изменить</button>
                            <button class="remove-button">Удалить</button>
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="decrease-button">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-button">+</button>
                    </div>
                    <div class="cart-item-price">
                        <p>${item.price} сом</p>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            // Обновить общую сумму
            document.getElementById('total-price').textContent = data.totalPrice;
        })
        .catch(error => {
            console.error('Ошибка при получении данных корзины:', error);
            cartIcon.style.display = 'none';
            localStorage.removeItem('authToken');
            window.location.href = 'login-register.html';
        });
    }

    // Настраиваем отображение корзины
    setupCart();

    // Получаем данные пользователя
    fetchUserData();

    // Обработчики модального окна корзины
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close');

    cartIcon.addEventListener('click', function(event) {
        event.preventDefault();
        cartModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });

    // Скрытие корзины при клике вне её содержимого
    window.addEventListener('click', function(event) {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Обработка формы оформления заказа
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        const orderData = { name, phone, address };

        fetch('http://localhost:8080/api/orders', { // Замените на URL вашего бэкенда
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Заказ оформлен успешно!');
                // Очистить корзину на фронтенде и обновить счетчик
                document.querySelector('.cart-items').innerHTML = '';
                document.getElementById('total-price').textContent = '0';
                cartIcon.setAttribute('data-count', '0');
                document.getElementById('cart-count').textContent = '0';
                cartModal.style.display = 'none';
            } else {
                alert('Ошибка при оформлении заказа: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при оформлении заказа:', error);
            alert('Произошла ошибка при оформлении заказа.');
        });
    });

    // Обработчик выхода из системы (добавьте кнопку выхода на странице)
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('authToken');
            window.location.href = 'page.html'; // Перенаправление на гостевую страницу
        });
    }
});
