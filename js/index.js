// === Obsługa przełączania zakładek ===
function switchTab(tabId) {
    // Ukryj wszystkie sekcje tabów
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));
  
    // Usuń aktywność z przycisków bocznych
    const allTabButtons = document.querySelectorAll('.tab');
    allTabButtons.forEach(btn => btn.classList.remove('active'));
  
    // Aktywuj właściwą sekcję i zakładkę
    const activeTab = document.getElementById(tabId);
    const activeBtn = document.querySelector(`.tab[data-tab="${tabId}"]`);
  
    if (activeTab && activeBtn) {
      activeTab.classList.add('active');
      activeBtn.classList.add('active');
    }
  }
  
  // === Obsługa formularza logowania ===
  function toggleLoginForm() {
    const form = document.getElementById("login-form");
    form.classList.toggle("hidden");
  }
  
  // === Nasłuchiwanie kliknięć zakładek bocznych ===
  document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        switchTab(tabId);
      });
    });
  
    // Nasłuchiwanie kliknięcia logowania
    const loginButton = document.getElementById('login-btn');
    if (loginButton) {
      loginButton.addEventListener('click', toggleLoginForm);
    }
  });
  