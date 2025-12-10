// Audio management script for persistent playback across pages
(function() {
    // Create audio object
    const audio = new Audio('nadin.mp3');
    audio.preload = 'auto';

    // Function to save audio state
    function saveAudioState() {
        localStorage.setItem('audioTime', audio.currentTime);
        localStorage.setItem('audioPlaying', audio.paused ? 'false' : 'true');
    }

    // Function to load audio state
    function loadAudioState() {
        const savedTime = localStorage.getItem('audioTime');
        const wasPlaying = localStorage.getItem('audioPlaying') === 'true';

        if (savedTime) {
            audio.currentTime = parseFloat(savedTime);
        }

        if (wasPlaying) {
            audio.play().catch(e => console.log('Play blocked:', e));
        }
    }

    // Function to start audio on user interaction
    function startAudio() {
        if (audio.paused) {
            audio.play().catch(e => console.log('Play blocked:', e));
            localStorage.setItem('audioPlaying', 'true');
        }
    }

    // Event listeners
    audio.addEventListener('ended', function() {
        // Restart the audio when it ends
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Play blocked:', e));
    });

    // Save state periodically
    setInterval(saveAudioState, 1000);

    // Save state on page unload
    window.addEventListener('beforeunload', saveAudioState);

    // Load state on page load
    window.addEventListener('load', loadAudioState);

    // Start audio on first user interaction or play button click
    let started = false;
    function onFirstInteraction() {
        if (!started) {
            started = true;
            startAudio();
            document.removeEventListener('click', onFirstInteraction);
            document.removeEventListener('keydown', onFirstInteraction);
            document.removeEventListener('touchstart', onFirstInteraction);
        }
    }
    document.addEventListener('click', onFirstInteraction);
    document.addEventListener('keydown', onFirstInteraction);
    document.addEventListener('touchstart', onFirstInteraction);

    // Handle play button
    const playButton = document.getElementById('playAudio');
    if (playButton) {
        playButton.addEventListener('click', function() {
            if (audio.paused) {
                audio.play().catch(e => console.log('Play blocked:', e));
                this.textContent = '⏸ Pause Music';
                this.style.background = '#ffb6c1';
                localStorage.setItem('audioPlaying', 'true');
            } else {
                audio.pause();
                this.textContent = '▶ Play Music';
                this.style.background = '#ff69b4';
                localStorage.setItem('audioPlaying', 'false');
            }
        });
    }
})();
