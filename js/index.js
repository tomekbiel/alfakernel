document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const sections = document.querySelectorAll(".tab-content");
    const loginToggle = document.getElementById("login-toggle");
    const loginBox = document.getElementById("login-box");

    // Tabs interaction
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            // Hide all sections
            sections.forEach(section => section.classList.remove("active"));
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove("active"));
            
            // Show the selected section
            const target = document.getElementById(tab.dataset.target);
            if (target) target.classList.add("active");
            tab.classList.add("active");
        });
    });

    // Login toggle
    loginToggle?.addEventListener("click", function (e) {
        e.stopPropagation();
        loginBox.style.display = loginBox.style.display === "block" ? "none" : "block";
    });

    // Close login box when clicking elsewhere
    document.addEventListener("click", function () {
        loginBox.style.display = "none";
    });

    // Prevent login box from closing when clicking inside it
    loginBox?.addEventListener("click", function (e) {
        e.stopPropagation();
    });
});