document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    const logo = document.querySelector('.logo');
    const sound = document.getElementById('logo-sound');
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuModal = document.getElementById('menu-modal');

    // --- Event Listener for Logo Sound ---
    // Plays a sound when the main logo is clicked.
    if (logo && sound) {
        logo.addEventListener('click', () => {
            sound.currentTime = 0; // Rewind to the start
            sound.play();
        });
    }

    // --- Menu Modal Logic ---
    // Opens the menu modal when the 'Ver Menú' button is clicked.
    if (openMenuBtn && menuModal) {
        openMenuBtn.addEventListener('click', () => {
            menuModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling on the body
        });
    }

    // Closes the menu modal when the close button (X) is clicked.
    if (closeMenuBtn && menuModal) {
        closeMenuBtn.addEventListener('click', () => {
            menuModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling on the body
        });
    }

    // Closes the menu modal if the user clicks on the overlay (outside the content).
    if (menuModal) {
        menuModal.addEventListener('click', (event) => {
            if (event.target === menuModal) {
                menuModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Image Popup Logic ---
    // Creates and manages a popup for viewing larger images from the menu.
    const imagePopupOverlay = document.createElement('div');
    imagePopupOverlay.classList.add('image-popup-overlay');
    imagePopupOverlay.innerHTML = `
        <div class="image-popup-content">
            <img src="" alt="Popup Image">
        </div>
    `;
    document.body.appendChild(imagePopupOverlay);

    const menuImages = document.querySelectorAll('.menu-item img');
    const popupImage = imagePopupOverlay.querySelector('.image-popup-content img');

    // Attaches a click event to each menu image to open the popup.
    menuImages.forEach(image => {
        image.addEventListener('click', () => {
            popupImage.src = image.src;
            imagePopupOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent body scrolling
        });
    });

    // Closes the image popup when the overlay is clicked.
    imagePopupOverlay.addEventListener('click', () => {
        imagePopupOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scrolling
    });
});