const Telegram = window.Telegram.WebApp;
Telegram.ready();
Telegram.expand();

let balance = 100;
const betCost = 15;

// Твоя идеальная картинка, цифры по часовой стрелке от 12 часов
const sectors = [1, 5, 2, 10, 1, 50, 1, 0]; 

let isSpinning = false;

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
    
    balance -= betCost;
    updateUI();

    const randomIndex = Math.floor(Math.random() * sectors.length);
    const winAmount = sectors[randomIndex];
    
    // Сброс и плавное вращение
    wheel.style.transition = 'none'; 
    wheel.style.transform = 'rotate(0deg)';
    void wheel.offsetHeight; 
    wheel.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)'; 

    const baseAngle = 360 * 10; 
    const sectorAngle = 360 / sectors.length; 
    const targetAngle = baseAngle + (randomIndex * sectorAngle);

    wheel.style.transform = `rotate(${targetAngle}deg)`;
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(() => {
        isSpinning = false;
        
        if (winAmount > 0) {
            balance += winAmount;
            Telegram.showAlert(`✅ Выигрыш: +${winAmount} ⭐`);
        } else {
            Telegram.showAlert(`0 ⭐ Пустой сектор. Повезет в следующий раз!`);
        }
        
        updateUI();
        spinBtn.disabled = false;
    }, 5500);
}

spinBtn.addEventListener('click', spin);
updateUI();