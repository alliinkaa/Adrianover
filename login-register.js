const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const iconClose = document.querySelector('.icon-close');


registerLink.addEventListener('click',()=>{
    wrapper.classList.add('active');
});

loginLink.addEventListener('click',()=>{
    wrapper.classList.remove('active');
});

iconClose.addEventListener('click',()=>{
    wrapper.classList.remove('active');
});/*toje ne nujen v principe*/

// Получаем элементы форм
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const responseMessage = document.getElementById('responseMessage'); // Добавьте этот элемент в HTML для отображения сообщений

// Обработка формы входа
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/api/v2/auth/authentication', { // Замените на URL вашего бэкенда
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Сохранение токена (JWT) в localStorage
            localStorage.setItem('authToken', data.token);
            
            // Проверка роли пользователя
            if (data.role === 'admin') {
                // Перенаправление на админ-дэшборд
                window.location.href = 'admin-dashboard.html'; // Убедитесь, что такая страница существует
            } else {
                // Перенаправление на обычный дэшборд
                window.location.href = 'dashboard.html'; // Создайте эту страницу
            }
        } else {
            // Отображение сообщения об ошибке
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке формы.');
    });
});

// Обработка формы регистрации
registerForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

   
    const firstName = document.getElementById('registerFirstName').value;
    const secondName = document.getElementById('registerSecondName').value;
    const phone = document.getElementById('registerPhone').value;
    
     // Получаем дату рождения из Flatpickr
     const birthdateInput = document.getElementById('registerBirthdate').value;

     // Преобразуем дату в формате ГГГГ-ММ-ДД
     const [day, month, year] = birthdateInput.split('.'); // Разделяем по точке
     const formattedBirthdate = `${year}-${month}-${day}`; // Форматируем в ГГГГ-ММ-ДД

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    fetch('http://localhost:3000/api/v2/auth/register', { // Замените на URL вашего бэкенда
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            firstName: firstName,
            secondName: secondName,
            dateOfBirth: formattedBirthdate, // Изменено
            email: email,
            mobNum: phone, // Изменено
            password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Перенаправление на страницу входа после успешной регистрации
            window.location.href = 'login-register.html';
            alert('Регистрация успешна. Теперь вы можете войти.');
        } else {
            // Отображение сообщения об ошибке
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке формы.');
    });
});

document.addEventListener("DOMContentLoaded", function() {
    flatpickr("#registerBirthdate", {
        dateFormat: "d.m.Y",
        locale: {
            firstDayOfWeek: 1 // Пн как первый день недели
        }
    });
});

