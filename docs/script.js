document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const sound = document.getElementById('logo-sound');
    const menuSound = document.getElementById('menu-sound');
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuModal = document.getElementById('menu-modal');
    const phoneNumber = document.querySelector('.phone-number');
    const yearSpan = document.getElementById('year');

    const imagePopupOverlay = document.createElement('div');
    imagePopupOverlay.className = 'image-popup-overlay';
    imagePopupOverlay.innerHTML = `
        <div class="image-popup-content">
            <img src="" alt="Popup Image" />
        </div>
    `;
    document.body.appendChild(imagePopupOverlay);
    const popupImage = imagePopupOverlay.querySelector('img');

    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        // Only restore scrolling if no other modals are active
        if (!document.querySelector('.modal-overlay.active, .image-popup-overlay.active')) {
            document.body.style.overflow = '';
        }
    };

    const handleHashChange = () => {
        switch(window.location.hash) {
            case '#menu':
                openModal(menuModal);
                closeModal(imagePopupOverlay);
                break;
            case '#image':
                openModal(menuModal); // Ensure menu stays open
                openModal(imagePopupOverlay);
                break;
            default:
                closeModal(menuModal);
                closeModal(imagePopupOverlay);
                break;
        }
    };

    // Use onhashchange to handle back/forward and manual hash changes
    window.addEventListener('hashchange', handleHashChange);
    // Initial check in case user lands with a hash
    handleHashChange();

    if (logo && sound) {
        logo.addEventListener('click', () => {
            sound.currentTime = 0;
            sound.play().catch(error => console.error("Error playing sound:", error));
        });
    }

    if (openMenuBtn) {
        openMenuBtn.addEventListener('click', () => {
            if (menuSound) {
                menuSound.currentTime = 0;
                menuSound.play().catch(error => console.error("Error playing sound:", error));
            }
            window.location.hash = 'menu';
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

    if (menuModal) {
        menuModal.addEventListener('click', (event) => {
            if (event.target === menuModal) {
                window.history.back();
            }
        });
    }

    document.querySelectorAll('.menu-item img').forEach(image => {
        image.addEventListener('click', () => {
            popupImage.src = image.src;
            popupImage.alt = image.alt;
            window.location.hash = 'image';
        });
    });

    imagePopupOverlay.addEventListener('click', () => {
        window.history.back();
    });

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

    // Shine animation for menu button
    if (openMenuBtn) {
        const triggerShine = () => {
            openMenuBtn.classList.add('shine-effect');
            setTimeout(() => {
                openMenuBtn.classList.remove('shine-effect');
            }, 1500); // Animation duration is 1.5s
        };

        // Trigger shine randomly between 10 to 20 seconds
        setInterval(() => {
            const randomDelay = Math.random() * (10000) + 10000; // Random between 10s and 20s
            setTimeout(triggerShine, randomDelay);
        }, 10000); // Check every 10 seconds if a shine should be triggered

        // Initial shine after a short delay
        setTimeout(triggerShine, 2000);
    }
});
