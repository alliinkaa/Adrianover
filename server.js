const express = require('express');
const cors = require('cors');
const app = express();

// Используйте CORS
app.use(cors({
    origin: 'http://127.0.0.1:5501' // Замените на нужный вам адрес
}));

// Включите парсинг JSON
app.use(express.json());

// Ваши маршруты
app.post('/api/v2/auth/register', (req, res) => {
    // Логика для обработки регистрации
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
