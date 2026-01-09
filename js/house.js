const PIECE_SIZE = 200;
const correctRelativePositions = {
    // Относительные позиции (от house1)
    1: { x: 0, y: 0, rotation: 0 },
    2: { x: 200, y: 0, rotation: 0 },
    3: { x: 400, y: 0, rotation: 0 },
    4: { x: 0, y: 200, rotation: 0 },
    5: { x: 200, y: 200, rotation: 0 },
    6: { x: 400, y: 200, rotation: 0 }
};

// Стартовые позиции
const startPositions = {
    1: { x: 20, y: 20, rotation: 90 },
    2: { x: 70, y: 100, rotation: 180 },
    3: { x: 120, y: 180, rotation: 270 },
    4: { x: 250, y: 50, rotation: 0 },
    5: { x: 300, y: 130, rotation: 45 },
    6: { x: 350, y: 210, rotation: 135 }
};

class HousePuzzle {
    constructor() {
        this.pieces = [];
        this.draggingPiece = null;
        this.dragOffset = { x: 0, y: 0 };
        this.isComplete = false;
        this.createPieces();
        this.setupEventListeners();
    }
    // Инициализация частей дома
    createPieces() {
    const puzzleArea = document.querySelector('.puzzle-area');
    puzzleArea.innerHTML = '';
    this.pieces = [];
    this.isComplete = false;
    puzzleArea.classList.remove('puzzle-complete');
            
    for (let i = 1; i <= 6; i++) {
        const piece = document.createElement('div');
        piece.className = 'house-piece';
        piece.dataset.index = i;
        piece.dataset.rotation = startPositions[i].rotation;
        
        const img = document.createElement('img');
        img.src = `img/house${i}.jpg`;
        img.alt = `Часть дома ${i}`;
        
        piece.appendChild(img);
        
        // Устанавливаем начальную позицию
        const startPos = startPositions[i];
        piece.style.left = `${startPos.x}px`;
        piece.style.top = `${startPos.y}px`;
        piece.style.transform = `rotate(${startPos.rotation}deg)`;
        piece.style.zIndex = '10';
        
        puzzleArea.appendChild(piece);
        this.pieces.push(piece);
    }
}
    // Назначение обработчиков
    setupEventListeners() {
        const puzzleArea = document.querySelector('.puzzle-area');
        
        // Кнопки управления
        document.getElementById('resetPuzzleBtn').addEventListener('click', () => {
            this.resetPuzzle();
        });
        
        document.getElementById('checkPuzzleBtn').addEventListener('click', () => {
            this.checkPuzzle();
        });
        
        // Обработчики для частей домика
        this.pieces.forEach(piece => {
            piece.addEventListener('mousedown', (e) => {
                if (e.button === 0 && !piece.classList.contains('correct')) {
                    // Не делать действия по умолчанию
                    e.preventDefault();
                    this.startDragging(piece, e);
                }
            });
            
            piece.addEventListener('contextmenu', (e) => {
                // Не делать действия по умолчанию
                e.preventDefault();
                // Проверка, что еще не стоит правильно
                if (!piece.classList.contains('correct')) {
                    this.rotatePiece(piece);
                }
            });
        });
        
        puzzleArea.addEventListener('mousemove', (e) => {
            this.drag(e);
        });
        
        puzzleArea.addEventListener('mouseup', () => {
            this.stopDragging();
        });
    }
    
    // Начало перетаскивания
    startDragging(piece, e) {
        if (this.isComplete) return;
        // Задаем перетаскиваемый объект
        this.draggingPiece = piece;
        piece.classList.add('dragging');      
        // Поднимаем элемент поверх других
        this.pieces.forEach(p => {
            if (p !== piece) p.style.zIndex = '10';
        });
        piece.style.zIndex = '1000';
        // Вычисляем смещение курсора внутри объекта 
        const rect = piece.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    // Перетаскивание
    drag(e) {
        if (!this.draggingPiece || this.isComplete) return;

        const area = document.querySelector('.puzzle-area');
        const areaRect = area.getBoundingClientRect();
        // Преобразуем оконные координаты для контейнера с учетом смещения 
        let newX = e.clientX - areaRect.left - this.dragOffset.x;
        let newY = e.clientY - areaRect.top - this.dragOffset.y;
        // Ограничиваем перемещение
        newX = Math.max(0, Math.min(newX, areaRect.width - 200));
        newY = Math.max(0, Math.min(newY, areaRect.height - 200));
        // Задаем новые координаты части дома
        this.draggingPiece.style.left = `${newX}px`;
        this.draggingPiece.style.top = `${newY}px`;
    }
    // Остановка перетаскивания
    stopDragging() {
        if (this.draggingPiece) {
            this.draggingPiece.classList.remove('dragging');
            this.draggingPiece = null;
        }
    }
    // Поворот части
    rotatePiece(piece) {
        if (this.isComplete) return;
        // Получаем текущий поворот и поворачиваем на 45 градусов
        let currentRotation = parseInt(piece.dataset.rotation) || 0;
        const newRotation = (currentRotation + 45) % 360;
        // Задаем новый поворот
        piece.style.transform = `rotate(${newRotation}deg)`;
        piece.dataset.rotation = newRotation;
    }
    // Сброс сборки
    resetPuzzle() {
        this.createPieces();
        this.setupEventListeners();
    }
    // Проверка сборки
    checkPuzzle() {
        if (this.isComplete) return;
        // Погрешность 50px
        const tolerance = 50;
        // Собираем данные о всех частях
        const piecesData = {};
        this.pieces.forEach(piece => {
            const index = parseInt(piece.dataset.index);
            const rect = piece.getBoundingClientRect();
            const areaRect = document.querySelector('.puzzle-area').getBoundingClientRect();
            // Вычисление координат относительно контейнера
            piecesData[index] = {
                x: rect.left - areaRect.left,
                y: rect.top - areaRect.top,
                rotation: parseInt(piece.dataset.rotation) || 0
            };
        });
        let allCorrect = true;
        // Точка отсчета
        const baseX = piecesData[1].x;
        const baseY = piecesData[1].y;
        // Проверяем каждую часть относительно house1
        for (let i = 1; i <= 6; i++) {
            // Ищем в массиве элемент с нужным индексом
            const piece = this.pieces.find(p => parseInt(p.dataset.index) === i);
            if (!piece) continue;
            // Получение данных для текущей части
            const data = piecesData[i];
            const correct = correctRelativePositions[i];
            const expectedRotation = correct.rotation;
            // Ожидаемые координаты относительно house1
            const expectedX = baseX + correct.x;
            const expectedY = baseY + correct.y;
            // Разница между фактической и ожидаемой позицией
            const xDiff = Math.abs(data.x - expectedX);
            const yDiff = Math.abs(data.y - expectedY);
            // Проверяем поворот (должен быть 0 градусов)
            const rotationCorrect = (data.rotation === expectedRotation);
            // Проверяем положение (погрешность до 50px)
            const positionCorrect = (xDiff <= tolerance && yDiff <= tolerance);
            // Обновление состояния части
            if (positionCorrect && rotationCorrect) {
                piece.classList.add('correct');
            } else {
                piece.classList.remove('correct');
                allCorrect = false;
            }
        }
        // Проверка общего результата
        if (allCorrect) {
            this.showSuccess();
        }
    }
    
    showSuccess() {
        this.isComplete = true;
        // Включаем анимацию
        document.querySelector('.puzzle-area').classList.add('puzzle-complete');
        // Сообщение об успехе
        alert("Успех!");
        // Делаем части некликабельными
        this.pieces.forEach(piece => {
            piece.style.cursor = 'default';
        });
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.puzzle = new HousePuzzle();
});