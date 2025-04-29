document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const sections = document.querySelectorAll(".tab-content");
    const loginToggle = document.getElementById("login-toggle");
    const loginBox = document.getElementById("login-box");
  
    // Tabs interaction
    tabs.forEach(tab => {
      tab.addEventListener("mouseenter", function () {
        // Usuwamy aktywne sekcje
        sections.forEach(section => section.style.display = "none");
        tabs.forEach(t => t.classList.remove("active"));
  
        // Pokazujemy odpowiednią
        const target = document.getElementById(tab.dataset.target);
        if (target) target.style.display = "block";
        tab.classList.add("active");
      });
    });
  
    // Login toggle
    loginToggle?.addEventListener("click", function () {
      loginBox.style.display = loginBox.style.display === "block" ? "none" : "block";
    });
  });
  