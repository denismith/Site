// Логика страницы результатов
// Вспомогательные функции для работы с компаниями
function getCompanyName(companyId) {
    return COMPANIES[companyId]?.name || companyId;
}

function getCompanyColor(companyId) {
    return COMPANIES[companyId]?.colorPrimary || '#AF4C4C';
}

// Основная функция инициализации
function initResultsPage() {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const score = parseInt(urlParams.get('score')) || 0;
    const level = parseInt(urlParams.get('level')) || 1;
    const shift = parseInt(urlParams.get('shift')) || 1;
    const plan = parseInt(urlParams.get('plan')) || 30;
    const completed = urlParams.get('completed') === 'true';
    const nextLevel = parseInt(urlParams.get('nextLevel')) || 1;
    const nextShift = parseInt(urlParams.get('nextShift')) || 1;
    
    // Получаем сохранённое состояние
    const savedState = loadGameState();
    const playerName = savedState?.playerName || 'Игрок';
    const company = savedState?.company || 'company1';
    
    // Названия смен
    const shiftNames = {
        1: 'Ночь',
        2: 'Утро', 
        3: 'День'
    };
    
    // Названия уровней (берем из game-data.js или используем запасной вариант)
    const levelNames = {
        1: LEVEL_SETTINGS[1]?.name || 'Продуктовый склад',
        2: LEVEL_SETTINGS[2]?.name || 'Универсальный склад',
        3: LEVEL_SETTINGS[3]?.name || 'Логистический хаб'
    };
    
    const companyName = getCompanyName(company);
    const companyColor = getCompanyColor(company);
    
    // Применяем цвет компании
    document.documentElement.style.setProperty('--color-primary', companyColor);
    
    // Обновляем интерфейс
    document.getElementById('final-score').textContent = score;
    
    // Проверяем выполнение плана
    let resultIcon = '🎯';
    let resultTitle = 'Результаты смены';
    let resultMessage = '';
    
    if (completed) {
        if (score >= plan * 1.5) {
            resultIcon = '🏆';
            resultTitle = 'Отличная работа!';
            resultMessage = `Вы значительно перевыполнили план на ${levelNames[level]}!`;
        } else {
            resultIcon = '🎉';
            resultTitle = 'План выполнен!';
            resultMessage = `Вы успешно справились с заданием на ${levelNames[level]}!`;
        }
    } else {
        resultIcon = '😔';
        resultTitle = 'План не выполнен';
        resultMessage = `Не хватило ${plan - score} очков до плана на ${levelNames[level]}.`;
    }
    
    document.getElementById('result-icon').textContent = resultIcon;
    document.getElementById('result-title').textContent = resultTitle;
    document.getElementById('result-message').textContent = resultMessage;
    
    // Добавляем детали
    const details = document.getElementById('details');
    details.innerHTML = `
        <p><strong>👤 Игрок:</strong> ${playerName}</p>
        <p><strong>🏢 Компания:</strong> <span class="company-name">${companyName}</span></p>
        <p><strong>📊 Уровень:</strong> ${level} (${levelNames[level]})</p>
        <p><strong>⏰ Смена:</strong> ${shift} (${shiftNames[shift] || ''})</p>
        <p><strong>🎯 Набрано очков:</strong> ${score} из ${plan}</p>
        <p><strong>📈 Эффективность:</strong> ${Math.round((score / plan) * 100)}%</p>
    `;
    
    // Добавляем информацию о продолжении
    if (completed) {
        const continueInfo = document.createElement('div');
        continueInfo.className = 'continue-info';
        
        if (level === 3 && shift === 3) {
            continueInfo.innerHTML = `
                <strong>🎉 Поздравляем!</strong><br>
                Вы полностью прошли все уровни игры!<br>
                <small>Можете начать заново или попробовать побить рекорд</small>
            `;
            document.getElementById('continue-game').classList.add('hidden');
        } else if (shift < 3) {
            continueInfo.innerHTML = `
                <strong>➡️ Следующая смена:</strong><br>
                Уровень ${level}, Смена ${nextShift} (${shiftNames[nextShift] || ''})
            `;
            document.getElementById('continue-game').textContent = `Продолжить (Смена ${nextShift})`;
        } else {
            continueInfo.innerHTML = `
                <strong>⬆️ Следующий уровень:</strong><br>
                Уровень ${nextLevel} (${levelNames[nextLevel] || 'Новый уровень'})
            `;
            document.getElementById('continue-game').textContent = `Перейти на уровень ${nextLevel}`;
        }
        
        details.appendChild(continueInfo);
    } else {
        document.getElementById('continue-game').textContent = 'Повторить уровень';
    }
    
    // Вешаем обработчики кнопок
    setupEventListeners(playerName, company, score, level, shift, completed, nextLevel, nextShift, plan);
    
    // Сохраняем рекорд
    saveRecord(playerName, company, score);
    
    // Показываем сообщение о новом рекорде
    showNewRecordMessage(playerName, company, score);
}

// Настраивает обработчики событий для кнопок
function setupEventListeners(playerName, company, score, level, shift, completed, nextLevel, nextShift, plan) {
    // Кнопка "Сменить имя"
    document.getElementById('change-name').addEventListener('click', function() {
        localStorage.removeItem('conveyor_game_state');
        window.location.href = 'index.html';
    });

    // Кнопка "Продолжить"
    document.getElementById('continue-game').addEventListener('click', function() {
        if (completed && nextLevel <= 3) {
            // Продолжаем с сохранённого прогресса
            saveGameState({
                playerName: playerName,
                company: company,
                level: nextLevel,
                shift: nextShift,
                score: 0
            });
        } else {
            // Повторяем текущий уровень
            saveGameState({
                playerName: playerName,
                company: company,
                level: level,
                shift: 1,
                score: 0
            });
        }
        window.location.href = 'game.html';
    });
    
    // Кнопка "Новая игра"
    document.getElementById('new-game').addEventListener('click', function() {
        saveGameState({
            playerName: playerName,
            company: company,
            level: 1,
            shift: 1,
            score: 0
        });
        window.location.href = 'game.html';
    });
    
    // Кнопка "Таблица рекордов"
    document.getElementById('view-records').addEventListener('click', function() {
        toggleRecordsTable(playerName, company);
    });
}

// Показывает/скрывает таблицу рекордов
function toggleRecordsTable(playerName, company) {
    const table = document.getElementById('records-table');
    const body = document.getElementById('records-body');
    const btn = document.getElementById('view-records');
    
    if (table.classList.contains('hidden')) {
        // Показываем таблицу
        const records = loadRecords();
        body.innerHTML = '';
        
        // Преобразуем записи в массив
        const recordsArray = Object.entries(records)
            .map(([key, score]) => {
                const [name, comp] = key.split(':');
                return { 
                    name, 
                    company: comp,
                    companyName: getCompanyName(comp),
                    score 
                };
            })
            // Cортируем по убыванию очков
            .sort((a, b) => b.score - a.score)
            // Оставляем только 10 записей
            .slice(0, 10);
        
        if (recordsArray.length === 0) {
            body.innerHTML = '<tr><td colspan="3" style="text-align: center;">Рекордов пока нет</td></tr>';
        } else {
            recordsArray.forEach((record, index) => {
                const row = document.createElement('tr');
                
                // Подсвечиваем текущего игрока
                if (record.name === playerName && record.company === company) {
                    row.style.background = 'rgba(255, 215, 0, 0.1)';
                    row.style.borderLeft = '3px solid #FFD700';
                }
                
                row.innerHTML = `
                    <td>${index + 1}. ${record.name}</td>
                    <td><span style="color: ${getCompanyColor(record.company)}">${record.companyName}</span></td>
                    <td><strong>${record.score}</strong></td>
                `;
                body.appendChild(row);
            });
        }
        
        table.classList.remove('hidden');
        btn.textContent = 'Скрыть таблицу';
    } else {
        // Скрываем таблицу
        table.classList.add('hidden');
        btn.textContent = '🏆 Таблица рекордов';
    }
}

// Показывает сообщение о новом рекорде
function showNewRecordMessage(playerName, company, score) {
    const records = loadRecords();
    const currentKey = `${playerName}:${company}`;
    const currentRecord = records[currentKey];
    
    if (currentRecord === score) {
        setTimeout(() => {
            showMessage('🎉 Новый личный рекорд!', 'success');
        }, 500);
    }
}

// Запускаем инициализацию при загрузке страницы
window.addEventListener('DOMContentLoaded', initResultsPage);