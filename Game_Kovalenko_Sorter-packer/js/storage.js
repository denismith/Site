// Работа с localStorage
// Ключи для localStorage
const STORAGE_KEYS = {
    GAME_STATE: 'kovalenko_game_state',
    RECORDS: 'kovalenko_records'
};

/**
 * Сохраняет текущее состояние игры
 * @param {Object} state - объект состояния
 */
function saveGameState(state) {
    try {
        localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
        console.log('Сохранено:', state);
    } catch (e) {
        console.error('Ошибка сохранения:', e);
    }
}

/**
 * Загружает сохранённое состояние игры
 * @returns {Object|null} состояние или null
 */
function loadGameState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.error('Ошибка загрузки:', e);
        return null;
    }
}

/**
 * Сохраняет рекорд игрока
 * @param {string} playerName - имя игрока
 * @param {string} company - компания
 * @param {number} score - очки
 */
function saveRecord(playerName, company, score) {
    try {
        // Загружаем текущие рекорды
        const records = loadRecords();      
        // Ключ: имя + компания
        const key = `${playerName}:${company}`;
        // Сохраняем только если результат лучше предыдущего или он первый
        if (!records[key] || score > records[key]) {
            records[key] = score;
            localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
            console.log('Рекорд сохранён:', key, score);
        }
    } catch (e) {
        console.error('Ошибка сохранения рекорда:', e);
    }
}

/**
 * Загружает все рекорды
 * @returns {Object} объект с рекордами
 */
function loadRecords() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        console.error('Ошибка загрузки рекордов:', e);
        return {};
    }
}
