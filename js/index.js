// === OBSŁUGA ZAKŁADEK ===
document.querySelectorAll('.sidebar li').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
  
      // Ukryj wszystkie sekcje
      document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
      });
  
      // Pokaż tylko odpowiednią
      const activeSection = document.getElementById(target);
      if (activeSection) {
        activeSection.classList.remove('hidden');
        activeSection.classList.add('active');
      }
  
      // Schowaj sekcję główną
      document.getElementById('home').classList.add('hidden');
    });
  });
  
  // === SIGN IN POPUP ===
  const signInBtn = document.getElementById('signInBtn');
  const signInPopup = document.getElementById('signInPopup');
  
  signInBtn.addEventListener('click', () => {
    signInPopup.classList.toggle('hidden');
  });
  