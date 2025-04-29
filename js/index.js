document.addEventListener('DOMContentLoaded', function() {
    // Elementy DOM
    const signInBtn = document.getElementById('signInBtn');
    const signInPopup = document.getElementById('signInPopup');
    const tabItems = document.querySelectorAll('.sidebar li');
    const tabContents = document.querySelectorAll('.tab-content');
    const homeSection = document.getElementById('home');
    const header = document.querySelector('.header');
    const backToHomeButtons = document.querySelectorAll('.back-to-home');
  
    // Pokaz/ukryj popup logowania
    signInBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      signInPopup.classList.toggle('hidden');
    });
  
    // Zamknij popup przy kliknięciu gdzie indziej
    document.addEventListener('click', function() {
      signInPopup.classList.add('hidden');
    });
  
    // Zapobiegaj zamykaniu popupa przy kliknięciu w nim
    signInPopup.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  
    // Obsługa zakładek
    tabItems.forEach(item => {
      item.addEventListener('click', function() {
        // Usuń aktywną klasę ze wszystkich zakładek
        tabItems.forEach(tab => tab.classList.remove('active'));
        
        // Dodaj aktywną klasę do klikniętej zakładki
        this.classList.add('active');
        
        // Ukryj wszystkie sekcje zawartości
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Ukryj sekcję home
        homeSection.style.display = 'none';
        
        // Pokaż odpowiednią sekcję zawartości
        const tabId = this.getAttribute('data-tab');
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
          activeContent.classList.add('active');
        }
      });
    });
  
    // Powrót do strony głównej przy kliknięciu w nagłówek
    header.addEventListener('click', function() {
      resetToHome();
    });
  
    // Powrót do strony głównej przy kliknięciu przycisku "Back to Home"
    backToHomeButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        resetToHome();
      });
    });
  
    // Funkcja resetująca do strony głównej
    function resetToHome() {
      tabItems.forEach(tab => tab.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      homeSection.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    // Inicjalizacja - pokaż stronę główną na starcie
    resetToHome();
  
    // Obsługa formularza logowania
    const loginForm = signInPopup.querySelector('form');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Tutaj możesz dodać logikę logowania
        alert('Login functionality will be implemented here');
        signInPopup.classList.add('hidden');
      });
    }
  });