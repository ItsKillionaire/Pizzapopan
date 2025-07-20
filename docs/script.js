document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    const logo = document.querySelector('.logo');
    const sound = document.getElementById('logo-sound');
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuModal = document.getElementById('menu-modal');
    const phoneNumber = document.querySelector('.phone-number');
    const yearSpan = document.getElementById('year');

    // --- Utility Functions ---

    /**
     * Toggles the visibility of a modal and controls body scroll.
     * @param {HTMLElement} modal - The modal element to show/hide.
     * @param {boolean} show - True to show the modal, false to hide.
     */
    const toggleModal = (modal, show) => {
        if (modal) {
            modal.classList.toggle('active', show);
            document.body.style.overflow = show ? 'hidden' : '';
        }
    };

    // --- Event Listeners ---

    // Plays a sound when the main logo is clicked.
    if (logo && sound) {
        logo.addEventListener('click', () => {
            sound.currentTime = 0; // Rewind to the start
            sound.play().catch(error => console.error("Error playing sound:", error));
        });
    }

    // Opens the menu modal.
    if (openMenuBtn && menuModal) {
        openMenuBtn.addEventListener('click', () => toggleModal(menuModal, true));
    }

    // Closes the menu modal.
    if (closeMenuBtn && menuModal) {
        closeMenuBtn.addEventListener('click', () => toggleModal(menuModal, false));
    }

    // Closes the menu modal if the overlay is clicked.
    if (menuModal) {
        menuModal.addEventListener('click', (event) => {
            if (event.target === menuModal) {
                toggleModal(menuModal, false);
            }
        });
    }

    // --- Image Popup Logic ---
    const imagePopupOverlay = document.createElement('div');
    imagePopupOverlay.className = 'image-popup-overlay';
    imagePopupOverlay.innerHTML = `
        <div class="image-popup-content">
            <img src="" alt="Popup Image" />
        </div>
    `;
    document.body.appendChild(imagePopupOverlay);
    const popupImage = imagePopupOverlay.querySelector('img');

    document.querySelectorAll('.menu-item img').forEach(image => {
        image.addEventListener('click', () => {
            popupImage.src = image.src;
            popupImage.alt = image.alt; // Copy alt text to popup
            toggleModal(imagePopupOverlay, true);
        });
    });

    imagePopupOverlay.addEventListener('click', () => toggleModal(imagePopupOverlay, false));

    // --- Phone Number Copy Logic ---
    if (phoneNumber) {
        phoneNumber.addEventListener('click', (event) => {
            const isDesktop = window.matchMedia("(min-width: 769px)").matches;

            if (isDesktop) {
                event.preventDefault(); // Prevent default 'tel:' link action only on desktop
                const phone = phoneNumber.href.replace('tel:', '').replace('+52', '');

                navigator.clipboard.writeText(phone).then(() => {
                    const originalText = phoneNumber.innerHTML;
                    phoneNumber.innerHTML = '¡Copiado!';
                    phoneNumber.classList.add('copied');
                    setTimeout(() => {
                        phoneNumber.innerHTML = originalText;
                        phoneNumber.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        });
    }

    // --- Dynamic Copyright Year ---
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});