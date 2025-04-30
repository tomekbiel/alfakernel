// === Tab Switching ===
function switchTab(tabId) {
    // Ukryj wszystkie sekcje
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Pokaż wybraną sekcję
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
        document.body.className = tabId + '-bg';
    }
    
    // Dla home ustaw czarne tło
    if (tabId === 'home') {
        document.body.className = 'home-bg';
    }
}

// === Back Button ===
function handleBackClick() {
    switchTab('home');
    document.body.className = 'home-bg';
}

// === Initialization ===
document.addEventListener('DOMContentLoaded', () => {
    // Set home as default
    switchTab('home');
    
    // Tab click listeners
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Back button listeners
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', handleBackClick);
    });
    
    // Header click to return home
    document.querySelector('.header').addEventListener('click', handleBackClick);
});