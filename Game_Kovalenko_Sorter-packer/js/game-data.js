// Константы, предметы, настройки уровней
// Настройки компаний (темы)
const COMPANIES = {
    company1: {
        name: "🍓 Strawberries",
        colorPrimary: "#AF4C4C",
        colorSecondary: "#c34a4a",
        conveyorColor: "#8e3838"
    },
    company2: {
        name: "⚡️ Flash Warehouse",
        colorPrimary: "#E47900",
        colorSecondary: "#FF9800",
        conveyorColor: "#E6AF19"
    },
    company3: {
        name: "🚙 Express Logistics",
        colorPrimary: "#2196F3",
        colorSecondary: "#03A9F4",
        conveyorColor: "#1976D2"
        
    }
};

// Предметы для каждого уровня
const LEVEL_ITEMS = {
    1: [ // Уровень 1:
        // Съедобное x4
        { emoji: "🍎", text: "яблоко", category: "food" },
        { emoji: "🍌", text: "банан", category: "food" },
        { emoji: "🥖", text: "хлеб", category: "food" },
        { emoji: "🥛", text: "молоко", category: "food" },
        { emoji: "🧀", text: "сыр", category: "food" },
        // Несъедобное x4
        { emoji: "🧼", text: "мыло", category: "nonfood" },
        { emoji: "📘", text: "книга", category: "nonfood" },
        { emoji: "🧦", text: "носки", category: "nonfood" },
        { emoji: "⌚", text: "часы", category: "nonfood" },
        { emoji: "🔋", text: "батарейка", category: "nonfood" }
    ],
    2: [ // Уровень 2:
        // Еда x5
        { emoji: "🍕", text: "пицца", category: "food" },
        { emoji: "🥦", text: "брокколи", category: "food" },
        { emoji: "🍣", text: "суши", category: "food" },
        { emoji: "🥪", text: "сэндвич", category: "food" },
        { emoji: "🥩", text: "мясо", category: "food" },
        // Одежда x5
        { emoji: "👕", text: "футболка", category: "clothes" },
        { emoji: "👖", text: "джинсы", category: "clothes" },
        { emoji: "👠", text: "туфли", category: "clothes" },
        { emoji: "🩴", text: "шлепанцы", category: "clothes" },
        { emoji: "🎽", text: "майка", category: "clothes" },
        // Электроника x5
        { emoji: "📱", text: "телефон", category: "electronics" },
        { emoji: "💻", text: "ноутбук", category: "electronics" },
        { emoji: "🎧", text: "наушники", category: "electronics" },
        { emoji: "🖨️", text: "принтер", category: "electronics" },
        { emoji: "📷", text: "фотоаппарат", category: "electronics" },
        // Коробки
        { emoji: "📦", text: "коробка", category: "box", isBox: true }
    ],
    3: [ // Уровень 3: 4 категории + экспресс
        // Еда
        { emoji: "🍔", text: "бургер", category: "food" },
        { emoji: "🥓", text: "бекон", category: "food" },
        { emoji: "🍟", text: "картофель фри", category: "food" },
        { emoji: "🍪", text: "печенье", category: "food" },
        // Одежда x4
        { emoji: "👟", text: "кроссовки", category: "clothes" },
        { emoji: "🧤", text: "перчатки", category: "clothes" },
        { emoji: "🧣", text: "шарф", category: "clothes" },
        { emoji: "🩱", text: "купальник", category: "clothes" },
        // Электроника
        { emoji: "📺", text: "телевизор", category: "electronics" },
        { emoji: "📱", text: "телефон", category: "electronics" },
        { emoji: "📹", text: "видеокамера", category: "electronics" },
        { emoji: "🎙️", text: "микрофон", category: "electronics" },
        // Инструменты
        { emoji: "🔨", text: "молоток", category: "tools" },
        { emoji: "🔧", text: "ключ", category: "tools" },
        { emoji: "🪚", text: "ножовка", category: "tools" },
        { emoji: "🪓", text: "топор", category: "tools" },
        
        // Экспресс-версии обычных предметов
        { emoji: "🥓", text: "бекон", category: "food", isExpress: true },
        { emoji: "👟", text: "кроссовки", category: "clothes", isExpress: true },
        { emoji: "📱", text: "телефон", category: "electronics", isExpress: true },
        { emoji: "🔨", text: "молоток", category: "tools", isExpress: true }
    ]
};

// Настройки для каждого уровня
const LEVEL_SETTINGS = {
    1: {
        name: "Продуктовый склад",
        boxes: [
            { id: "food", label: "🍎 Съедобное", emoji: "🍎", key: "1", category: "food" },
            { id: "nonfood", label: "🧼 Несъедобное", emoji: "🧼", key: "2", category: "nonfood" }
        ],
        planScore: 50,
        timePerShift: 90,
        speedMultiplier: 1.0
    },
    2: {
        name: "Универсальный склад",
        boxes: [
            { id: "food", label: "🍕 Еда", emoji: "🍕", key: "1", category: "food" },
            { id: "clothes", label: "👕 Одежда", emoji: "👕", key: "2", category: "clothes" },
            { id: "electronics", label: "📱 Электроника", emoji: "📱", key: "3", category: "electronics" }
        ],
        planScore: 70,
        timePerShift: 90,
        speedMultiplier: 1.2
    },
    3: {
        name: "Логистический хаб",
        boxes: [
            { id: "food", label: "🍔 Еда", emoji: "🍔", key: "1", category: "food" },
            { id: "clothes", label: "👟 Одежда", emoji: "👟", key: "2", category: "clothes" },
            { id: "electronics", label: "⌚ Электроника", emoji: "⌚", key: "3", category: "electronics" },
            { id: "tools", label: "🔨 Инструменты", emoji: "🔨", key: "4", category: "tools" },
            { id: "express", label: "🚀 Экспресс", emoji: "🚀", key: "5", category: "express" }
        ],
        planScore: 90,
        timePerShift: 90,
        speedMultiplier: 1.5
    }
};

// Настройки смен (скорость конвейера)
const SHIFT_SETTINGS = {
    1: { name: "Ночь", speed: 4, waitTime: 2000 },    // Медленно
    2: { name: "Утро", speed: 3, waitTime: 1000 },    // Средне
    3: { name: "День", speed: 2, waitTime: 500 }     // Быстро
};