document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".logo");
  const sound = document.getElementById("logo-sound");
  const menuSound = document.getElementById("menu-sound");
  const scarySound = document.getElementById("scary-sound");
  const rbSound = document.getElementById("rb-sound");
  const pizzaTimeSound = document.getElementById("pizza-time-sound");
  const openMenuBtn = document.getElementById("open-menu-btn");
  const closeMenuBtn = document.getElementById("close-menu-btn");
  const menuModal = document.getElementById("menu-modal");
  const phoneNumber = document.querySelector(".phone-number");
  const yearSpan = document.getElementById("year");

  let clickCount = 0;
  const easterEggImages = [
    "assets/ee/jiggly.png",
    "assets/ee/piffle_cat.gif",
    "assets/ee/pizza_1.png",
    "assets/ee/pizza_kawaii.webp",
    "assets/ee/pizza_melting.png",
    "assets/ee/pizza-dancing-pizza.gif",
  ];
  const easterEggContainer = document.getElementById("easter-egg-container");

  const blockingOverlay = document.createElement("div");
  blockingOverlay.style.position = "fixed";
  blockingOverlay.style.top = "0";
  blockingOverlay.style.left = "0";
  blockingOverlay.style.width = "100vw";
  blockingOverlay.style.height = "100vh";
  blockingOverlay.style.zIndex = "9999";
  blockingOverlay.style.display = "none";
  document.body.appendChild(blockingOverlay);

  const imagePopupOverlay = document.createElement("div");
  imagePopupOverlay.className = "image-popup-overlay";
  imagePopupOverlay.innerHTML = `
        <div class="image-popup-content">
            <img src="" alt="Popup Image" />
        </div>
    `;
  document.body.appendChild(imagePopupOverlay);
  const popupImage = imagePopupOverlay.querySelector("img");

  let bbqHotClickCount = 0;
  let bbqHotLastClickTime = 0;

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("active");
    if (
      !document.querySelector(
        ".modal-overlay.active, .image-popup-overlay.active",
      )
    ) {
      document.body.style.overflow = "";
    }
  };

  const handleHashChange = () => {
    const hash = window.location.hash.substring(1);
    if (hash === 'bbq-hot-easter-egg') {
        popupImage.src = "assets/ee/spooky/d.jpg";
        popupImage.alt = "Easter Egg";
        popupImage.style.borderRadius = "8px";
        openModal(imagePopupOverlay);
        imagePopupOverlay.style.pointerEvents = "none";

        setTimeout(() => {
            popupImage.classList.add("glitch-effect");
            setTimeout(() => {
                window.history.back();
                setTimeout(() => {
                    popupImage.classList.remove("glitch-effect");
                    imagePopupOverlay.style.pointerEvents = "auto";
                    blockingOverlay.style.display = "none";
                    bbqHotClickCount = 0;
                }, 1000);
            }, 1000);
        }, 3000);
        return;
    }

    switch (hash) {
      case "menu":
        openModal(menuModal);
        closeModal(imagePopupOverlay);
        break;
      case "image":
        openModal(menuModal);
        openModal(imagePopupOverlay);
        break;
      default:
        const foundImage = Array.from(document.querySelectorAll(".menu-item img")).find(img => {
          const pizzaName = img.alt.split(' con ')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          return pizzaName === hash;
        });

        if (foundImage) {
          popupImage.src = foundImage.src;
          popupImage.alt = foundImage.alt;
          openModal(menuModal);
          openModal(imagePopupOverlay);
        } else {
          closeModal(menuModal);
          closeModal(imagePopupOverlay);
        }
        break;
    }
  };

  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();

  if (logo && sound && pizzaTimeSound) {
    logo.addEventListener("click", () => {
      clickCount++;
      if (clickCount === 100) {
        triggerScaryEasterEgg();
      } else if (clickCount % 10 === 0) {
        pizzaTimeSound.currentTime = 0;
        pizzaTimeSound
          .play()
          .catch((error) =>
            console.error("Error playing pizza time sound:", error),
          );
        triggerEasterEgg();
      } else {
        sound.currentTime = 0;
        sound
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      }
    });
  }

  if (openMenuBtn) {
    openMenuBtn.addEventListener("click", () => {
      if (menuSound) {
        menuSound.currentTime = 0;
        menuSound
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      }
      window.location.hash = "menu";
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", () => {
      window.history.back();
    });
  }

  if (menuModal) {
    menuModal.addEventListener("click", (event) => {
      if (event.target === menuModal) {
        window.history.back();
      }
    });
  }

  document.querySelectorAll(".menu-item img").forEach((image) => {
      image.addEventListener("click", (event) => {
          if (image.alt.includes("BBQ Hot")) {
              const now = Date.now();
              if (now - bbqHotLastClickTime > 60000) {
                  bbqHotClickCount = 1;
              } else {
                  bbqHotClickCount++;
              }
              bbqHotLastClickTime = now;

              if (bbqHotClickCount === 20) {
                  event.stopPropagation();
                  const hasSeenEasterEgg = localStorage.getItem('hasSeenBBQHotEasterEgg');
                  if (!hasSeenEasterEgg) {
                    triggerNewEasterEgg();
                    localStorage.setItem('hasSeenBBQHotEasterEgg', 'true');
                  } else {
                    popupImage.src = image.src;
                    popupImage.alt = image.alt;
                    const pizzaName = image.alt.split(' con ')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    window.location.hash = pizzaName;
                  }
                  return;
              }
          }
          popupImage.src = image.src;
          popupImage.alt = image.alt;
          const pizzaName = image.alt.split(' con ')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          window.location.hash = pizzaName;
      });
  });

  imagePopupOverlay.addEventListener("click", () => {
    window.history.back();
  });

  if (phoneNumber) {
    phoneNumber.addEventListener("click", (event) => {
      const isDesktop = window.matchMedia("(min-width: 769px)").matches;

      if (isDesktop) {
        event.preventDefault();
        const phone = phoneNumber.href.replace("tel:", "").replace("+52", "");

        navigator.clipboard
          .writeText(phone)
          .then(() => {
            const originalText = phoneNumber.innerHTML;
            phoneNumber.innerHTML = "¡Copiado!";
            phoneNumber.classList.add("copied");
            setTimeout(() => {
              phoneNumber.innerHTML = originalText;
              phoneNumber.classList.remove("copied");
            }, 2000);
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
          });
      }
    });
  }

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (openMenuBtn) {
    const triggerShine = () => {
      openMenuBtn.classList.add("shine-effect");
      setTimeout(() => {
        openMenuBtn.classList.remove("shine-effect");
      }, 1500);
    };

    setInterval(() => {
      const randomDelay = Math.random() * 10000 + 10000;
      setTimeout(triggerShine, randomDelay);
    }, 10000);

    setTimeout(triggerShine, 2000);
  }

  function triggerEasterEgg() {
    const randomImageSrc =
      easterEggImages[Math.floor(Math.random() * easterEggImages.length)];
    const eggImage = document.createElement("img");
    eggImage.src = randomImageSrc;
    eggImage.className = "easter-egg-image";
    easterEggContainer.appendChild(eggImage);

    const logoWidth = logo.offsetWidth;
    const logoHeight = logo.offsetHeight;

    eggImage.style.width = `${logoWidth}px`;
    eggImage.style.height = `${logoHeight}px`;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let x, y, vx, vy;
    const speed = 10;
    const minVelocityMagnitude = speed / 2;

    const entrySide = Math.floor(Math.random() * 4);

    switch (entrySide) {
      case 0:
        x = Math.random() * (screenWidth - logoWidth);
        y = -logoHeight;
        vx =
          (Math.random() < 0.5 ? -1 : 1) *
          (Math.random() * speed + minVelocityMagnitude);
        vy = Math.random() * speed + minVelocityMagnitude;
        break;
      case 1:
        x = screenWidth;
        y = Math.random() * (screenHeight - logoHeight);
        vx = -(Math.random() * speed + minVelocityMagnitude);
        vy =
          (Math.random() < 0.5 ? -1 : 1) *
          (Math.random() * speed + minVelocityMagnitude);
        break;
      case 2:
        x = Math.random() * (screenWidth - logoWidth);
        y = screenHeight;
        vx =
          (Math.random() < 0.5 ? -1 : 1) *
          (Math.random() * speed + minVelocityMagnitude);
        vy = -(Math.random() * speed + minVelocityMagnitude);
        break;
      case 3:
        x = -logoWidth;
        y = Math.random() * (screenHeight - logoHeight);
        vx = Math.random() * speed + minVelocityMagnitude;
        vy =
          (Math.random() < 0.5 ? -1 : 1) *
          (Math.random() * speed + minVelocityMagnitude);
        break;
    }

    let bounces = 0;
    const maxBounces = Math.floor(Math.random() * 3) + 3;
    let animationFrameId;

    function animate() {
      x += vx;
      y += vy;

      let bouncedThisFrame = false;

      if (bounces < maxBounces) {
        if (x + logoWidth > screenWidth - screenWidth / 2.3) {
          x = screenWidth - logoWidth - screenWidth / 2.3;
          if (vx > 0) {
            vx *= -1;
            bouncedThisFrame = true;
          }
        } else if (x < -(screenWidth / 1.5)) {
          x = -(screenWidth / 1.5);
          if (vx < 0) {
            vx *= -1;
            bouncedThisFrame = true;
          }
        }

        if (y + logoHeight > screenHeight) {
          y = screenHeight - logoHeight;
          if (vy > 0) {
            vy *= -1;
            bouncedThisFrame = true;
          }
        } else if (y < 0) {
          y = 0;
          if (vy < 0) {
            vy *= -1;
            bouncedThisFrame = true;
          }
        }

        if (bouncedThisFrame) {
          bounces++;
        }
      }

      eggImage.style.transform = `translate(${x}px, ${y}px)`;

      const removalThreshold = Math.max(logoWidth, logoHeight) * 2;
      const isCompletelyOffScreen =
        x > screenWidth + removalThreshold ||
        x < -removalThreshold ||
        y > screenHeight + removalThreshold ||
        y < -removalThreshold;

      if (bounces >= maxBounces && isCompletelyOffScreen) {
        eggImage.remove();
        cancelAnimationFrame(animationFrameId);
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();
  }

  function triggerNewEasterEgg() {
    blockingOverlay.style.display = "block";
    rbSound.currentTime = 0;
    rbSound.play().catch(error => console.error("Error playing rb sound:", error));
    window.location.hash = "bbq-hot-easter-egg";
  }

  function triggerScaryEasterEgg() {
    const scaryImage = document.createElement("img");
    scaryImage.src = "assets/ee/spooky/rip.png";
    scaryImage.className = "easter-egg-image scary";
    scaryImage.style.position = "fixed";
    scaryImage.style.top = "50%";
    scaryImage.style.left = "50%";
    scaryImage.style.transform = "translate(-50%, -50%) scale(0)";
    scaryImage.style.transition = "transform 45s ease-in-out, opacity 15s ease-in-out";
    scaryImage.style.zIndex = "10000";
    scaryImage.style.opacity = "1";
    document.body.appendChild(scaryImage);

    scarySound.currentTime = 0;
    scarySound.play().catch(error => console.error("Error playing scary sound:", error));

    setTimeout(() => {
        scaryImage.style.transform = "translate(-50%, -50%) scale(10)";
    }, 100);

    setTimeout(() => {
        let fadeOutInterval = setInterval(() => {
            if (scarySound.volume > 0.005) {
                scarySound.volume -= 0.005;
            } else {
                scarySound.pause();
                scarySound.currentTime = 0;
                scarySound.volume = 1;
                clearInterval(fadeOutInterval);
            }
        }, 75);
        scaryImage.style.opacity = "0";
    }, 28000);

    setTimeout(() => {
        scaryImage.remove();
    }, 45000);
  }
});

