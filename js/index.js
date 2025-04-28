// === Toggle Login Popup ===
document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginBtn');
    const loginPopup = document.getElementById('loginPopup');
  
    loginButton.addEventListener('click', function () {
      if (loginPopup.style.display === "block") {
        loginPopup.style.display = "none";
      } else {
        loginPopup.style.display = "block";
      }
    });
  
    // Hide login popup when clicking outside
    document.addEventListener('click', function (event) {
      if (!loginPopup.contains(event.target) && event.target !== loginButton) {
        loginPopup.style.display = "none";
      }
    });
  
    // === Tabs functionality ===
    const tabs = document.querySelectorAll('.tab');
    const sidebarLinks = document.querySelectorAll('.sidebar ul li');
  
    sidebarLinks.forEach((link, index) => {
      link.addEventListener('mouseenter', function () {
        tabs.forEach(tab => tab.classList.add('hidden'));
        tabs[index].classList.remove('hidden');
      });
    });
  });
  