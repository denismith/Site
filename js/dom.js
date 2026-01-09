const latin = [
    "Consuetudo est altera natura",
    "Nota bene", 
    "Nulla calamitas sola",
    "Per aspera ad astra",
    "Memento mori",
    "Invictus maneo",
    "Fortes fortuna adiuvat",
    "Si vis pacem, para bellum",
    "Non progredi est regredi",
    "Etiam post malam segetem serendum est"
];

const russian = [
    "Привычка - вторая натура",
    "Заметьте хорошо!",
    "Беда не приходит одна", 
    "Через тернии к звёздам",
    "Помни о смерти",
    "Остаюсь непобежденным",
    "Храбрым судьба помогает",
    "Хочешь мира — готовься к войне",
    "Не продвигаться вперед – значит идти назад",
    "И после плохого урожая надо сеять"
];

let clicks = 0;

// Добавить фразу
document.getElementById('addPhraseBtn').addEventListener('click', function() {
    // Если массив пуст - фразы закончились
    if (latin.length === 0) {
        alert("Фразы закончились");
        return;
    }
    
    // Выбираем случайный индекс из ОСТАВШИХСЯ фраз
    const randomIndex = Math.floor(Math.random() * latin.length);
    
    // Берем фразу
    const latinPhrase = latin[randomIndex];
    const russianPhrase = russian[randomIndex];
    
    // Удаляем использованную фразу
    latin.splice(randomIndex, 1);
    russian.splice(randomIndex, 1);
    
    // Создаем строку таблицы
    const row = document.createElement('tr');
    row.className = ++clicks % 2 == 0 ? 'class2' : 'class1';
    
    const cell1 = document.createElement('td');
    cell1.textContent = latinPhrase;
    
    const cell2 = document.createElement('td');
    cell2.textContent = russianPhrase;
    
    row.appendChild(cell1);
    row.appendChild(cell2);
    document.getElementById('tableBody').appendChild(row);
});

// Перекрасить четные строки
document.getElementById('recolorBtn').addEventListener('click', function() {
    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach((row, index) => {
        // Четные строки для пользователя (реальные индексы нечетные)
        if (index % 2 == 1) {
            row.style.fontWeight = 'bold';
        }
    });
});