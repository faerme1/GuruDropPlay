const Telegram = window.Telegram.WebApp;
Telegram.ready();
Telegram.expand();

function goHome() {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
}

function openRoulette() {
    document.getElementById('rouletteScreen').classList.add('active');
}

function openSlots() {
    document.getElementById('slotsScreen').classList.add('active');
}

function openInventory() {
    document.getElementById('inventoryScreen').classList.add('active');
}
