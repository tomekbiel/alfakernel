// 📓 index.js — obsługuje kartkowanie zakładek

document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.tab-section');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Dezaktywuj wszystkie zakładki i sekcje
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('visible'));
  
        // Aktywuj klikniętą zakładkę
        tab.classList.add('active');
        
        // Pokaż odpowiednią sekcję
        const target = tab.getAttribute('data-target');
        document.getElementById(target).classList.add('visible');
      });
    });
  });
  