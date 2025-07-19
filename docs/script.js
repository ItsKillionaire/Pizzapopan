document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const sound = document.getElementById('logo-sound');

    if (logo && sound) {
        logo.addEventListener('click', () => {
            sound.currentTime = 0; // Rewind to the start
            sound.play();
        });
    }
});
