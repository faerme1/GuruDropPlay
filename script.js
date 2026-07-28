const Telegram = window.Telegram.WebApp;
Telegram.ready();
Telegram.expand();

let balance = 100;
const betCost = 15;
// Порядок цифр на твоей картинке (по часовой стрелке от верхнего левого края)
// Если по факту выпадает 5 вместо 1 - поменяй первую цифру в массиве на 5
const sectors = [1, 5, 2, 10, 1, 50, 1, 0]; 

let isSpinning = false;
let currentRotation = 0; // Запоминаем, сколько уже накручено

const balanceDisplay = document.getElementById('balance');
const spinBtn = document.getElementById('spinBtn');
const wheel = document.getElementById('rouletteWheel');

function updateUI() {
    balanceDisplay.innerText = balance;
    spinBtn.innerText = balance >= betCost ? `Крутить за ${betCost} ⭐` : 'Не хватает ⭐';
    spinBtn.disabled = balance < betCost;
}

function spin() {
    if (isSpinning || balance < betCost) return;

    isSpinning = true;
    spinBtn.disabled = true;

    // 1. Списываем деньги
    balance -= betCost;
    updateUI();

    // 2. Выбираем ВЫИГРЫШ (а не просто индекс)
    const randomIndex = Math.floor(Math.random() * sectors.length);
    const winAmount = sectors[randomIndex];

    // 3. Вычисляем угол, чтобы попасть ровно в центр этого сектора
    const sectorAngle = 360 / sectors.length; // 45°
    
    // Вычисляем центр сектора, начиная от 12 часов (верха) по часовой стрелке
    const targetSectorAngle = randomIndex * sectorAngle + (sectorAngle / 2);
    
    // Чтобы стрелка указала на этот центр, колесо должно повернуться на 360 - targetSectorAngle
    const stopAngle = 360 - targetSectorAngle;

    // 4. Добавляем 8 красивых оборотов к текущему положению
    currentRotation += 360 * 8 + stopAngle;

    // 5. Запускаем вращение
    wheel.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    if (navigator.vibrate) navigator.vibrate(50);

    // 6. Ожидаем окончания вращения и выдаём результат
    setTimeout(() => {
        if (winAmount > 0) {
            balance += winAmount;
            Telegram.showAlert(`✅ Выигрыш: +${winAmount} ⭐`);
        } else {
            Telegram.showAlert('0 ⭐ Пустой сектор. Повезет в следующий раз!');
        }

        updateUI();
        spinBtn.disabled = false;
        isSpinning = false;
    }, 5000);
}

spinBtn.addEventListener('click', spin);
updateUI();
