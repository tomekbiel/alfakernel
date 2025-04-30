// === Obsługa przełączania zakładek ===
function switchTab(tabId) {
    // Ukryj wszystkie sekcje
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Usuń aktywność z przycisków bocznych
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Aktywuj właściwą sekcję i zakładkę
    const activeTab = document.getElementById(tabId);
    const activeBtn = document.querySelector(`.tab[data-tab="${tabId}"]`);
    
    if (activeTab && activeBtn) {
        activeTab.classList.add('active');
        activeBtn.classList.add('active');
        
        // Zmiana tła strony
        document.body.className = tabId + '-bg';
    }
}

// === Obsługa przycisku powrotu ===
function handleBackClick() {
    switchTab('home');
}

// === Inicjalizacja ===
document.addEventListener('DOMContentLoaded', () => {
    // Domyślnie ustaw stronę główną
    switchTab('home');
    
    // Nasłuchiwanie kliknięć zakładek bocznych
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Nasłuchiwanie przycisków powrotu
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', handleBackClick);
    });
    
    // Nasłuchiwanie kliknięcia w header/footer
    document.querySelector('.header').addEventListener('click', handleBackClick);
    document.querySelector('.footer').addEventListener('click', handleBackClick);
});
// 🔐 Login toggle
document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const loginForm = document.getElementById("login-form");

    loginBtn.addEventListener("click", () => {
        loginForm.classList.toggle("hidden");
    });
});
