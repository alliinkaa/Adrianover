document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем стандартное отправление формы

    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    fetch('http://localhost:8080/api/submit-order', { // Укажите URL вашего Java бэкенда
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Преобразуем объект в JSON
    })
    .then(response => response.json()) // Ожидаем JSON-ответ
    .then(data => {
        // Показываем сообщение об успешной отправке
        document.getElementById('responseMessage').textContent = data.message;
        document.getElementById('orderForm').reset(); // Очистить форму
    })
    .catch(error => {
        console.error('Ошибка:', error);
        document.getElementById('responseMessage').textContent = 'Произошла ошибка при отправке формы.';
    });
});
