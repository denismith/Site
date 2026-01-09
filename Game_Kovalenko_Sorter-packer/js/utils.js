// Вспомогательные функции
// Возвращает случайный элемент массива
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Перемешивает массив
function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Создаёт DOM-элемент с указанными параметрами
 * @param {string} tag - тег элемента
 * @param {string|Array} className - класс или массив классов
 * @param {string} text - текстовое содержимое
 * @param {Object} attributes - объект с атрибутами
 * @returns {HTMLElement} созданный элемент
 */
function createElement(tag, className = '', text = '', attributes = {}) {
    const element = document.createElement(tag);
    
    if (className) {
        if (Array.isArray(className)) {
            element.classList.add(...className);
        } else {
            element.classList.add(className);
        }
    }
    
    if (text) {
        element.textContent = text;
    }
    
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    
    return element;
}

/**
 * Применяет тему компании к странице
 * @param {string} companyId - идентификатор компании
 */
function applyCompanyTheme(companyId) {
    const company = COMPANIES[companyId];
    if (!company) return;
    
    const root = document.documentElement;
    root.style.setProperty('--color-primary', company.colorPrimary);
    root.style.setProperty('--color-secondary', company.colorSecondary);
    root.style.setProperty('--color-conveyor', company.conveyorColor);
}

/**
 * Показывает временное сообщение на экране
 * @param {string} message - текст сообщения
 * @param {string} type - тип (success, error, info)
 * @param {number} duration - длительность в мс
 */
function showMessage(message, type = 'info', duration = 2000) {
    // Удаляем старое сообщение если есть
    const oldMsg = document.getElementById('temp-message');
    if (oldMsg) oldMsg.remove();
    
    // Создаём новое
    const msg = createElement('div', ['temp-message', `temp-message-${type}`], message, {
        id: 'temp-message'
    });
    
    // Добавляем на страницу
    document.body.appendChild(msg);
    
    // Удаляем через указанное время
    setTimeout(() => {
        if (msg.parentNode) {
            setTimeout(() => msg.remove(), 500);
        }
    }, duration);
}