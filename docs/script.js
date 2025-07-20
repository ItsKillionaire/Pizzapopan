document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const sound = document.getElementById('logo-sound');
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuModal = document.getElementById('menu-modal');

    if (logo && sound) {
        logo.addEventListener('click', () => {
            sound.currentTime = 0; // Rewind to the start
            sound.play();
        });
    }

    if (openMenuBtn && menuModal) {
        openMenuBtn.addEventListener('click', () => {
            menuModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling on body
        });
    }

    if (closeMenuBtn && menuModal) {
        closeMenuBtn.addEventListener('click', () => {
            menuModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling on body
        });
    }

    // Close modal when clicking outside the content
    if (menuModal) {
        menuModal.addEventListener('click', (event) => {
            if (event.target === menuModal) {
                menuModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});
