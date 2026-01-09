// Глобальное состояние игры
let gameState = {
    playerName: '',
    company: 'company1',
    level: 1,
    shift: 1,
    score: 0,
    timeLeft: 90,
    currentItem: null,
    boxes: [],
    boxConfigs: [], // Конфигурации ящиков (с ключами)
    intervalId: null,
    conveyorSpeed: 2
};

// DOM элементы
let scoreElement, timeElement, questionElement, boxesContainer, currentItemContainer;

// Инициализация игры при загрузке страницы
function initGame() {  
    // Загружаем сохранённое состояние
    const savedState = loadGameState();
    if (savedState) {
        Object.assign(gameState, savedState);
    } else {
        // Если нет сохранения, возвращаем на старт
        window.location.href = 'index.html';
        return;
    }
    // Находим DOM элементы
    scoreElement = document.getElementById('score');
    timeElement = document.getElementById('time-left');
    questionElement = document.getElementById('question-text');
    boxesContainer = document.getElementById('boxes-container');
    currentItemContainer = document.getElementById('current-item-container'); 
    // Обновляем информацию в шапке
    document.getElementById('company-name').textContent = COMPANIES[gameState.company]?.name || 'Склад';
    document.getElementById('player-name').textContent = gameState.playerName;
    document.getElementById('current-level').textContent = gameState.level;
    document.getElementById('current-shift').textContent = gameState.shift;
    document.getElementById('shift-name').textContent = SHIFT_SETTINGS[gameState.shift]?.name || '';
    document.getElementById('plan-score').textContent = LEVEL_SETTINGS[gameState.level]?.planScore || 30;
    // Настраиваем скорость конвейера в зависимости от смены
    gameState.conveyorSpeed = SHIFT_SETTINGS[gameState.shift]?.speed || 2;
    // Применяем тему компании
    applyCompanyTheme(gameState.company); 
    // Инициализируем ящики
    initBoxes();  
    // Запускаем игру
    startGame();
}

// Инициализация ящиков для текущего уровня
function initBoxes() {
    const levelSettings = LEVEL_SETTINGS[gameState.level];
    if (!levelSettings) return;
    
    // Очищаем контейнер
    boxesContainer.innerHTML = '';
    gameState.boxes = [];
    gameState.boxConfigs = [];
    
    // Перемешиваем ящики для случайного расположения
    const shuffledBoxes = shuffleArray(levelSettings.boxes);
    
    // Создаём каждый ящик
    shuffledBoxes.forEach((boxConfig, index) => {
        const boxElement = createBoxElement(boxConfig, index);
        boxesContainer.appendChild(boxElement);
        
        // Сохраняем конфигурацию ящика
        gameState.boxConfigs.push(boxConfig);
        
        // Добавляем пустой массив для предметов в этом ящике
        gameState.boxes.push([]);
    });
}

// Создаёт DOM-элемент ящика
function createBoxElement(boxConfig, index) {
    const box = createElement('div', 'box');
    box.dataset.boxIndex = index;
    
    // Заголовок ящика
    const header = createElement('div', 'box-header');
    const keyBadge = createElement('div', 'box-key', boxConfig.key); // Используем key из конфига
    const label = createElement('span', '', boxConfig.label);
    
    header.appendChild(keyBadge);
    header.appendChild(label);
    box.appendChild(header);
    
    // Контейнер для предметов
    const itemsContainer = createElement('div', 'box-items');
    box.appendChild(itemsContainer);
    
    // Полоска прогресса
    const progress = createElement('div', 'box-progress');
    const progressFill = createElement('div', 'box-progress-fill');
    progress.appendChild(progressFill);
    box.appendChild(progress);
    
    // Обработчики событий
    box.addEventListener('click', () => handleBoxClick(index));

    return box;
}

// Запускаем игровой цикл
function startGame() {
    // Обновляем UI
    updateUI();
    // Запускаем таймер
    startTimer();
    // Спавним первый предмет
    setTimeout(spawnNewItem, 1000);
    // Вешаем обработчики клавиатуры
    document.addEventListener('keydown', handleKeyPress);
    // Вешаем обработчик досрочного окончания смены
    document.getElementById('shift-end').addEventListener('click', endShiftEarly);
}

// Обновляет интерфейс (очки, время)
function updateUI() {
    if (scoreElement) scoreElement.textContent = gameState.score;
    if (timeElement) timeElement.textContent = gameState.timeLeft;
    
    // Меняем цвет таймера при малом времени
    if (gameState.timeLeft <= 30) {
        timeElement.style.color = '#FF5722';
        timeElement.style.animation = timeElement.style.animation ? '' : 'blink 1s infinite';
    } else {
        timeElement.style.color = '';
        timeElement.style.animation = '';
    }
}

// Запускает таймер
function startTimer() {
    if (gameState.intervalId) {
        clearInterval(gameState.intervalId);
    }
    // Уменьшение времени на 1 секунду
    gameState.intervalId = setInterval(() => {
        if (gameState.timeLeft > 0) {
            gameState.timeLeft--;
            updateUI();
        } else if (gameState.timeLeft <= 0) {
            endShift();
        }
    }, 1000);
}

// Создаёт новый предмет на конвейере
function spawnNewItem() {
    // Очищаем контейнер
    currentItemContainer.innerHTML = '';
    
    // Получаем предметы для текущего уровня
    const items = LEVEL_ITEMS[gameState.level];   
    // Для уровня 2: иногда спавним коробку (20% шанс)
    let item;
    if (gameState.level === 2 && Math.random() < 0.2) {
        item = items.find(it => it.isBox) || getRandomElement(items);
    } else {
        // Исключаем коробки на других уровнях
        const availableItems = items.filter(it => !it.isBox);
        item = getRandomElement(availableItems);
    }
    
    gameState.currentItem = item;
    
    // Создаём элемент предмета
    const itemElement = createElement('div', 'conveyor-item');

    // Для экспресс-товара добавляем подсветку только при наведении
    if (item.isExpress) {
        // Скрываем индикатор по умолчанию
        const expressIndicator = createElement('div', 'express-indicator', '🚀 Экспресс');
        expressIndicator.style.display = 'none'; // Скрываем по умолчанию
        itemElement.appendChild(expressIndicator);
        
        // Показываем только при наведении
        itemElement.addEventListener('mouseenter', function() {
            this.style.border = '3px solid #FF5722';
            this.style.boxShadow = '0 0 20px #FF5722';
            expressIndicator.style.display = 'block';
        });
        // Убираем при отведении
        itemElement.addEventListener('mouseleave', function() {
            this.style.border = '';
            this.style.boxShadow = '';
            expressIndicator.style.display = 'none';
        });
    }
    
    const emoji = createElement('div', 'item-emoji', item.emoji);
    const text = createElement('div', 'item-text', item.text);
    
    itemElement.appendChild(emoji);
    itemElement.appendChild(text);
    
    // Для коробки добавляем обработчик ПКМ
    if (item.isBox) {
        itemElement.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            if (!this.classList.contains('opened')) { // Проверяем, не открыта ли уже
                openBox(this, item);
            }
            return false;
        });   
        
        // Подсказка для коробки
        const hint = createElement('div', 'box-hint', 'Кликните ПКМ чтобы открыть');
        hint.style.fontSize = '0.8em';
        hint.style.color = '#666';
        hint.style.marginTop = '5px';
        itemElement.appendChild(hint);
        itemElement.dataset.isBox = 'true';
    }
    
    // Добавляем анимацию движения
    itemElement.style.top = '0px';
    itemElement.style.transition = `top ${gameState.conveyorSpeed}s linear`;
    
    currentItemContainer.appendChild(itemElement);
    
    // Обновляем вопрос
    if (questionElement) {
        let question = `Куда отправить ${item.text}?`;
        if (item.isBox) {
            question = 'Откройте коробку! Зажмите ПКМ';
        }
        questionElement.textContent = question;
    }
    
    // Запускаем движение
    setTimeout(() => {
        if (itemElement.parentNode) {
            itemElement.style.top = '550px';
        }
    }, 100);
    
    // Когда предмет доедет до конца
    setTimeout(() => {
        if (itemElement.parentNode && (gameState.currentItem === item || item.isBox)) {
            // Предмет не был обработан - он пропадает
            itemElement.remove();
            gameState.currentItem = null;
            
            // Штраф за пропуск
            gameState.score = Math.max(0, gameState.score - 1);
            showMessage('-1 очко за пропуск товара!', 'error');
            updateUI();
            
            // Ждём и создаём следующий
            setTimeout(spawnNewItem, SHIFT_SETTINGS[gameState.shift].waitTime);
        }
    }, (gameState.conveyorSpeed * 1000) + 100);
}

// Открывает коробку по клику ПКМ
function openBox(boxElement) {
    if (boxElement.classList.contains('opened')) return;
    boxElement.classList.add('opened');
    boxElement.oncontextmenu = null;
    
    const items = LEVEL_ITEMS[gameState.level].filter(it => !it.isBox);
    const realItem = getRandomElement(items);
    gameState.currentItem = realItem;
     
    setTimeout(() => {
        boxElement.querySelector('.item-emoji').textContent = realItem.emoji;
        boxElement.querySelector('.item-text').textContent = realItem.text;
        
        const hint = boxElement.querySelector('.box-hint');
        if (hint) hint.remove();
        
        delete boxElement.dataset.isBox;
        boxElement.style.transform = '';
        
        gameState.score += 2;
        showMessage('+2 очка за открытие коробки!', 'success');
        updateUI();
        
        if (questionElement) {
            questionElement.textContent = `Куда отправить ${realItem.text}?`;
        }
    }, 200);
}

// Обработчик клика по ящику
function handleBoxClick(boxIndex) {
    // Если новый предмет еще не появился
    if (!gameState.currentItem) {
        showMessage('Нет предмета для размещения!', 'error');
        return;
    }
    // Ящик полон (3 предмета)
    if (gameState.boxes[boxIndex].length >= 3) {
        const key = gameState.boxConfigs[boxIndex].key;
        showMessage(`Ящик полон! Сдайте его клавишей ${key}`, 'error');
        return;
    }
    const boxConfig = gameState.boxConfigs[boxIndex];
    const item = gameState.currentItem;
    // Особые случаи
    // Если закрытая коробка
    if (item.isBox) {
        showMessage('Откройте коробку, зажав ПКМ!', 'info');
        return;
    }
    // Если экспресс-товар
    if (item.isExpress) {
        if (boxConfig.category === 'express') {
            addItemToBox(boxIndex, item);
            gameState.score += 3;
            showMessage('+3 очка за экспресс-товар!', 'success');
        } else {
            handleWrongChoice();
        }
        updateUI();
        return;
    }
    // Общая проверка для всех уровней
    if (boxConfig.category === item.category) {
        addItemToBox(boxIndex, item);
        gameState.score += 1;
        showMessage('+1 очко!', 'success');
    } else {
        handleWrongChoice();
    }
    
    updateUI();
}

// Обработка неправильного выбора
function handleWrongChoice() {
    // Штраф -1 очко
    gameState.score = Math.max(0, gameState.score - 1);
    showMessage('-1 очко за ошибку!', 'error');  
    // Очищаем текущий предмет
    clearCurrentItem();
    updateUI();
}

// Очищает текущий предмет с конвейера
function clearCurrentItem() {
    if (currentItemContainer) {
        currentItemContainer.innerHTML = '';
    }
    gameState.currentItem = null;
    
    // Создаём новый предмет через некоторое время
    setTimeout(spawnNewItem, 500);
}

// Добавляет предмет в ящик
function addItemToBox(boxIndex, item) {
    // Добавляем в массив
    gameState.boxes[boxIndex].push(item);
    
    // Обновляем отображение ящика
    updateBoxDisplay(boxIndex);
    
    // Очищаем текущий предмет
    clearCurrentItem();
    
    // Увеличиваем счётчик обработанных предметов
    gameState.itemsProcessed++;
}

// Обновляет отображение ящика
function updateBoxDisplay(boxIndex) {
    const box = document.querySelector(`[data-box-index="${boxIndex}"]`);
    if (!box) return;
    
    const itemsContainer = box.querySelector('.box-items');
    const progressFill = box.querySelector('.box-progress-fill');
    
    // Очищаем и добавляем предметы
    itemsContainer.innerHTML = '';
    gameState.boxes[boxIndex].forEach(item => {
        const itemEl = createElement('div', 'box-item', item.emoji);
        itemsContainer.appendChild(itemEl);
    });
    
    // Обновляем прогресс
    const fillPercent = (gameState.boxes[boxIndex].length / 3) * 100;
    if (progressFill) {
        progressFill.style.width = `${fillPercent}%`;
    }
    
    // Если ящик полон - добавляем класс
    if (gameState.boxes[boxIndex].length >= 3) {
        box.classList.add('box-full');
    } else {
        box.classList.remove('box-full');
        box.style.animation = '';
    }
}

// Обработчик нажатия клавиш
function handleKeyPress(event) {
    // Цифры 1-5 для сдачи ящиков
    if (event.key >= '1' && event.key <= '5') {
        const key = event.key;
        
        // Находим индекс ящика с таким ключом
        const boxIndex = gameState.boxConfigs.findIndex(config => config.key === key);
        
        if (boxIndex !== -1) {
            submitFullBox(boxIndex);
        } else {
            showMessage(`Нет ящика с клавишей ${key}`, 'error');
        }
    }

    // Esc для возврата в меню
    if (event.key === 'Escape') {
        if (confirm('Вернуться в главное меню?\nТекущий прогресс будет сохранён.')) {
            saveGameState(gameState);
            window.location.href = 'index.html';
        }
    }
}

// Сдаём полный ящик
function submitFullBox(boxIndex) {
    if (gameState.boxes[boxIndex].length < 3) {
        showMessage('Ящик не полон!', 'error');
        return;
    }
    
    // Добавляем очки
    gameState.score += 2;
    updateUI();
    showMessage('+2 очка за полный ящик!', 'success');
    
    // Очищаем ящик
    gameState.boxes[boxIndex] = [];
    updateBoxDisplay(boxIndex);
}

// Досрочное завершение смены
function endShiftEarly() {
    if (confirm('Завершить смену досрочно?\nТекущие очки: ' + gameState.score + 
                '\nПлан: ' + LEVEL_SETTINGS[gameState.level].planScore)) {
        endShift();
    }
}

// Завершение смены (по времени или досрочно)
function endShift() {
    // Останавливаем таймер
    if (gameState.intervalId) {
        clearInterval(gameState.intervalId);
        gameState.intervalId = null;
    }
    
    // Снимаем обработчики
    document.removeEventListener('keydown', handleKeyPress);
    
    // Проверяем выполнение плана
    const planScore = LEVEL_SETTINGS[gameState.level].planScore;
    const isPlanCompleted = gameState.score >= planScore;
    
    // Сохраняем результат
    saveRecord(gameState.playerName, gameState.company, gameState.score);
    
    // Определяем следующий уровень/смену
    let nextState = null;
    
    if (isPlanCompleted) {
        // План выполнен
        if (gameState.shift < 3) {
            // Следующая смена
            nextState = {
                playerName: gameState.playerName,
                company: gameState.company,
                level: gameState.level,
                shift: gameState.shift + 1,
                score: 0
            };
        } else if (gameState.level < 3) {
            // Следующий уровень
            nextState = {
                playerName: gameState.playerName,
                company: gameState.company,
                level: gameState.level + 1,
                shift: 1,
                score: 0
            };
        } else {
            // Игра полностью пройдена
            nextState = {
                playerName: gameState.playerName,
                company: gameState.company,
                level: 1,
                shift: 1,
                score: 0
            };
        }
    } else {
        // План не выполнен - начинаем уровень заново
        nextState = {
            playerName: gameState.playerName,
            company: gameState.company,
            level: gameState.level,
            shift: 1,
            score: 0
        };
    }
    
    // Сохраняем прогресс
    saveGameState(nextState);
    
    // Переходим на страницу результатов
    setTimeout(() => {
        window.location.href = 'results.html?score=' + gameState.score + 
                               '&level=' + gameState.level + 
                               '&shift=' + gameState.shift +
                               '&plan=' + planScore +
                               '&completed=' + isPlanCompleted +
                               '&nextLevel=' + (nextState.level || 1) +
                               '&nextShift=' + (nextState.shift || 1);
    }, 1000);
}

// Запускаем игру когда страница загрузится
window.addEventListener('DOMContentLoaded', initGame);