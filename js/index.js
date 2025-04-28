// index.js

function showTab(tabName) {
    document.querySelectorAll('section').forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById(tabName).classList.remove('hidden');
  }
  
  function toggleLogin() {
    const loginForm = document.getElementById('login-form');
    if (loginForm.style.display === 'block') {
      loginForm.style.display = 'none';
    } else {
      loginForm.style.display = 'block';
    }
  }
  