document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const sound = document.getElementById('logo-sound');
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuModal = document.getElementById('menu-modal');
    const phoneNumber = document.querySelector('.phone-number');
    const yearSpan = document.getElementById('year');

    const toggleModal = (modal, show) => {
        if (modal) {
            const isActive = modal.classList.contains('active');
            if (isActive === show) return;

            modal.classList.toggle('active', show);
            document.body.style.overflow = show ? 'hidden' : '';

            if (show) {
                history.pushState({ modalOpen: true }, null);
            } else if (history.state && history.state.modalOpen) {
                history.back();
            }
        }
    };

    window.addEventListener('popstate', (event) => {
        if (menuModal && menuModal.classList.contains('active')) {
            toggleModal(menuModal, false);
        }
        if (imagePopupOverlay && imagePopupOverlay.classList.contains('active')) {
            toggleModal(imagePopupOverlay, false);
        }
    });

    if (logo && sound) {
        logo.addEventListener('click', () => {
            sound.currentTime = 0;
            sound.play().catch(error => console.error("Error playing sound:", error));
        });
    }

    if (openMenuBtn && menuModal) {
        openMenuBtn.addEventListener('click', () => toggleModal(menuModal, true));
    }

    if (closeMenuBtn && menuModal) {
        closeMenuBtn.addEventListener('click', () => toggleModal(menuModal, false));
    }

    if (menuModal) {
        menuModal.addEventListener('click', (event) => {
            if (event.target === menuModal) {
                toggleModal(menuModal, false);
            }
        });
    }

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
            popupImage.alt = image.alt;
            toggleModal(imagePopupOverlay, true);
        });
    });

    imagePopupOverlay.addEventListener('click', () => toggleModal(imagePopupOverlay, false));

    if (phoneNumber) {
        phoneNumber.addEventListener('click', (event) => {
            const isDesktop = window.matchMedia("(min-width: 769px)").matches;

            if (isDesktop) {
                event.preventDefault();
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

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});