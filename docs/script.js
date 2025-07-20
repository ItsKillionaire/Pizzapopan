document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const sound = document.getElementById('logo-sound');
    const menuSound = document.getElementById('menu-sound');
    const pizzaTimeSound = document.getElementById('pizza-time-sound');
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuModal = document.getElementById('menu-modal');
    const phoneNumber = document.querySelector('.phone-number');
    const yearSpan = document.getElementById('year');

    let clickCount = 0;
    const easterEggImages = [
        'assets/piffle_cat.gif',
        'assets/pizza-dancing-pizza.gif'
    ];
    const easterEggContainer = document.getElementById('easter-egg-container');

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

    if (logo && sound && pizzaTimeSound) {
        logo.addEventListener('click', () => {
            clickCount++;
            if (clickCount % 10 === 0) {
                pizzaTimeSound.currentTime = 0;
                pizzaTimeSound.play().catch(error => console.error("Error playing pizza time sound:", error));
                triggerEasterEgg();
            } else {
                sound.currentTime = 0;
                sound.play().catch(error => console.error("Error playing sound:", error));
            }
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

    function triggerEasterEgg() {
        const randomImageSrc = easterEggImages[Math.floor(Math.random() * easterEggImages.length)];
        const eggImage = document.createElement('img');
        eggImage.src = randomImageSrc;
        eggImage.className = 'easter-egg-image';
        easterEggContainer.appendChild(eggImage);

        const logoWidth = logo.offsetWidth;
        const logoHeight = logo.offsetHeight;

        // Set initial size of the egg image to match the logo
        eggImage.style.width = `${logoWidth}px`;
        eggImage.style.height = `${logoHeight}px`;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let x, y, vx, vy;
        const speed = 10; // Base speed of the image
        const minVelocityMagnitude = speed / 2; // Ensure a minimum speed in each axis

        // Randomly choose a side to enter from (0: top, 1: right, 2: bottom, 3: left)
        const entrySide = Math.floor(Math.random() * 4);

        switch (entrySide) {
            case 0: // Top
                x = Math.random() * (screenWidth - logoWidth);
                y = -logoHeight;
                vx = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * speed + minVelocityMagnitude);
                vy = Math.random() * speed + minVelocityMagnitude; // Always move down
                break;
            case 1: // Right
                x = screenWidth;
                y = Math.random() * (screenHeight - logoHeight);
                vx = -(Math.random() * speed + minVelocityMagnitude); // Always move left
                vy = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * speed + minVelocityMagnitude);
                break;
            case 2: // Bottom
                x = Math.random() * (screenWidth - logoWidth);
                y = screenHeight;
                vx = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * speed + minVelocityMagnitude);
                vy = -(Math.random() * speed + minVelocityMagnitude); // Always move up
                break;
            case 3: // Left
                x = -logoWidth;
                y = Math.random() * (screenHeight - logoHeight);
                vx = Math.random() * speed + minVelocityMagnitude; // Always move right
                vy = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * speed + minVelocityMagnitude);
                break;
        }

        let bounces = 0;
        const maxBounces = Math.floor(Math.random() * 3) + 3; // Random between 3 and 5
        let animationFrameId;

        function animate() {
            x += vx;
            y += vy;

            let bouncedThisFrame = false;

            // Collision detection and bounce
            if (bounces < maxBounces) {
                // Horizontal collision
                if (x + logoWidth > screenWidth) { // Hit right edge
                    x = screenWidth - logoWidth; // Clamp position
                    if (vx > 0) { // Only reverse if moving towards the edge
                        vx *= -1;
                        bouncedThisFrame = true;
                    }
                } else if (x < 0) { // Hit left edge
                    x = 0; // Clamp position
                    if (vx < 0) { // Only reverse if moving towards the edge
                        vx *= -1;
                        bouncedThisFrame = true;
                    }
                }

                // Vertical collision
                if (y + logoHeight > screenHeight) { // Hit bottom edge
                    y = screenHeight - logoHeight; // Clamp position
                    if (vy > 0) { // Only reverse if moving towards the edge
                        vy *= -1;
                        bouncedThisFrame = true;
                    }
                } else if (y < 0) { // Hit top edge
                    y = 0; // Clamp position
                    if (vy < 0) { // Only reverse if moving towards the edge
                        vy *= -1;
                        bouncedThisFrame = true;
                    }
                }

                if (bouncedThisFrame) {
                    bounces++;
                }
            }

            eggImage.style.transform = `translate(${x}px, ${y}px)`;

            // Remove image if it goes too far off-screen after max bounces
            const removalThreshold = Math.max(logoWidth, logoHeight) * 2; // Go further off screen
            const isCompletelyOffScreen = x > screenWidth + removalThreshold || x < -removalThreshold || y > screenHeight + removalThreshold || y < -removalThreshold;

            if (bounces >= maxBounces && isCompletelyOffScreen) {
                eggImage.remove();
                cancelAnimationFrame(animationFrameId);
                return;
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();
    }
});