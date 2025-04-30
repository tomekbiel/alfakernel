// === Tab Switching ===
function switchTab(tabId) {
    // Hide all sections
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active state from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected section and tab
    const activeTab = document.getElementById(tabId);
    const activeBtn = document.querySelector(`.tab[data-tab="${tabId}"]`);
    
    if (activeTab && activeBtn) {
        activeTab.classList.add('active');
        activeBtn.classList.add('active');
        
        // Change background
        document.body.className = tabId === 'home' ? 'home-bg' : tabId + '-bg';
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