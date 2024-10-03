document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken'); // Предполагается, что токен сохранен в localStorage

    if (!token) {
        // Если нет токена, перенаправляем на страницу входа
        window.location.href = 'login-register.html';
    }

    // Проверка роли пользователя
    fetch('http://localhost:8080/api/user-role', { // Замените на ваш API для получения роли пользователя
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.role !== 'admin') {
            alert('У вас нет доступа к этой странице.');
            window.location.href = 'page.html'; // Перенаправление на главную или другую страницу
        } else {
            // Если пользователь админ, загружаем данные
            loadUsers();
        }
    })
    .catch(error => {
        console.error('Ошибка при проверке роли пользователя:', error);
        window.location.href = 'login-register.html';
    });

    // Функция для добавления нового блюда
    const addDishForm = document.getElementById('addDishForm');
    addDishForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addDishForm);
        const dishData = {
            name: formData.get('dishName'),
            category: formData.get('dishCategory'),
            description: formData.get('dishDescription'),
            price: formData.get('dishPrice'),
            // Изображение нужно отправлять отдельно или как base64, в зависимости от вашей реализации
        };

        // Преобразование FormData в JSON, если изображение не требуется
        fetch('http://localhost:8080/api/dishes', { // Замените на ваш API для добавления блюда
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dishData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('addDishMessage').textContent = 'Блюдо успешно добавлено!';
                addDishForm.reset();
            } else {
                document.getElementById('addDishMessage').textContent = `Ошибка: ${data.message}`;
            }
        })
        .catch(error => {
            console.error('Ошибка при добавлении блюда:', error);
            document.getElementById('addDishMessage').textContent = 'Произошла ошибка при добавлении блюда.';
        });
    });

    // Функция для загрузки данных пользователей
    function loadUsers() {
        fetch('http://localhost:8080/api/users', { // Замените на ваш API для получения списка пользователей
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const usersTableBody = document.querySelector('#usersTable tbody');
            usersTableBody.innerHTML = ''; // Очистка таблицы

            data.users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.birthday}</td>
                `;
                usersTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке пользователей:', error);
        });
    }

    // Обработчик выхода из системы
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('authToken');
        window.location.href = 'login-register.html';
    });
});
