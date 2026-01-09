// Логика стартовой страницы
// Инициализация страницы
function initIndexPage() {
    // Загружаем список компаний
    loadCompanies(); 
    // Настраиваем обработчики событий
    setupEventListeners();
}

// Загружаем компании в выпадающий список
function loadCompanies() {
    const companyList = document.getElementById('company');
    // Очищаем существующие опции
    companyList.innerHTML = '';
    // Добавляем опции из COMPANIES
    for (const [id, company] of Object.entries(COMPANIES)) {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = company.name;
        companyList.appendChild(option);
    }
}

// Настраиваем обработчики событий
function setupEventListeners() {
    // Кнопка Начать работу
    document.getElementById('start').addEventListener('click', () => {
            StartGame();
    });
    // Кнопки для быстрого тестирования
    const testButtons = document.getElementById('test-buttons');
    if (testButtons) {
        document.getElementById('test-level-1').addEventListener('click', () => {
            startTestGame(1);
        });
        document.getElementById('test-level-2').addEventListener('click', () => {
            startTestGame(2);
        });
        document.getElementById('test-level-3').addEventListener('click', () => {
            startTestGame(3);
        });
    }
}

// Обработчик начала игры
function StartGame() {    
    const playerName = document.getElementById('player-name').value.trim();
    const companyId = document.getElementById('company').value;
    // Проверка заполненности формы
    if (!playerName) {
        alert('Введите имя!');
        return;
    }
    // Сохраняем данные для игры
    saveGameState({
        playerName: playerName,
        company: companyId,
        level: 1,
        shift: 1,
        score: 0
    });   
    // Переходим на страницу игры
    window.location.href = 'game.html';
}

// Запуск тестового режима
function startTestGame(level) {
    // Для тестирования берем выбранную компанию, но имя всегда одно
    const companyId = document.getElementById('company').value;
    saveGameState({
        playerName: 'Тестировщик',
        company: companyId,
        level: level,
        shift: 1,
        score: 0
    });
    // Переходим на страницу игры
    window.location.href = 'game.html';
}
// Запускаем инициализацию при загрузке страницы
window.addEventListener('DOMContentLoaded', initIndexPage);