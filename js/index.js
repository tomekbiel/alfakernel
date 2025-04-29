document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const signInBtn = document.getElementById('signInBtn');
    const signInPopup = document.getElementById('signInPopup');
    const tabItems = document.querySelectorAll('.sidebar li');
    const tabContents = document.querySelectorAll('.tab-content');
    const homeSection = document.getElementById('home');

    // Show/hide login popup
    signInBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        signInPopup.classList.toggle('hidden');
    });

    // Close popup when clicking outside
    document.addEventListener('click', function() {
        signInPopup.classList.add('hidden');
    });

    // Prevent popup from closing when clicking inside
    signInPopup.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Tab switching functionality
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all tabs
            tabItems.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab contents and home section
            tabContents.forEach(content => content.classList.remove('active'));
            homeSection.style.display = 'none';
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // Initialize first tab as active
    if (tabItems.length > 0) {
        tabItems[0].classList.add('active');
        const firstTabId = tabItems[0].getAttribute('data-tab');
        const firstTabContent = document.getElementById(firstTabId);
        if (firstTabContent) {
            homeSection.style.display = 'none';
            firstTabContent.classList.add('active');
        }
    }
});