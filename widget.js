document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById('accessibility-toggle');
    const menu = document.getElementById('accessibility-menu');

    const text = document.body;
    const letterBtn = document.getElementById('letter-spacing-btn');
    const lineBtn = document.getElementById('line-height-btn');
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const toggleContrastBtn = document.getElementById('toggle-contrast');

    let menuOpen = false;
    let fontSize = 16;
    const body = document.body;
    let letterExpanded = false;
    let lineExpanded = false;

    // Ikone
    const buttons = [
        { id: 'increase-font', label: '🔼 Povećaj font' },
        { id: 'decrease-font', label: '🔽 Smanji font' },
        { id: 'letter-spacing-btn', label: '🔤 Razmak slova' },
        { id: 'line-height-btn', label: '↕️ Visina reda' },
        { id: 'toggle-contrast', label: '🌑 Kontrast' },
        { id: 'bold-text', label: '🅱️ Podebljaj tekst' },
        { id: 'lexend-font', label: '🅰️ Lexend font' },
        { id: 'atkinson-font', label: '🅰️ Atkinson font' },
        { id: 'text-to-speech', label: '🔊 Čitaj tekst' },
        { id: 'reset-settings', label: '♻️ Reset' }
    ];

    buttons.forEach(btn => {
        const element = document.getElementById(btn.id);
        if (element && element.textContent.trim() === '') element.textContent = btn.label;
    });


    // Otvaranje i zatvaranje menija klikom na gumb
    toggleBtn.addEventListener('click', (event) => {
        menuOpen = !menuOpen;
        menu.style.display = menuOpen ? 'block' : 'none';
        toggleBtn.setAttribute('aria-expanded', menuOpen);
        menu.setAttribute('aria-hidden', !menuOpen);
        event.stopPropagation();
    });

    // Zatvaranje klikom izvan widgeta
    document.addEventListener('click', (event) => {
        if (menuOpen && !menu.contains(event.target) && !toggleBtn.contains(event.target)) {
            menu.style.display = 'none';
            menuOpen = false;
            toggleBtn.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
        }
    });

    // Sprječavanje zatvaranja kad klikneš unutar menija
    menu.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Razmak slova
    letterBtn.addEventListener('click', () => {
        if (!letterExpanded) {
            text.style.letterSpacing = '0.3em';
            letterExpanded = true;
        } else {
            text.style.letterSpacing = 'normal';
            letterExpanded = false;
        }
    });

    // Razmak između redova
    lineBtn.addEventListener('click', () => {
        if (!lineExpanded) {
            text.style.lineHeight = '2.5';
            lineExpanded = true;
        } else {
            text.style.lineHeight = '1.5';
            lineExpanded = false;
        }
    });

    // Povećaj font
    increaseFontBtn.addEventListener('click', () => {
        if (fontSize < 24) {
            fontSize += 2;
            body.style.fontSize = fontSize + 'px';
        }
    });

    // Smanji font
    decreaseFontBtn.addEventListener('click', () => {
        if (fontSize > 12) {
            fontSize -= 2;
            body.style.fontSize = fontSize + 'px';
        }
    });

    // Kontrast
    toggleContrastBtn.addEventListener('click', () => {
        body.classList.toggle('high-contrast');
    });

    // Podebljani tekst
    const boldToggle = document.getElementById('bold-text');
    boldToggle.addEventListener("click", () => {
        body.classList.toggle("bold-text");
    });

    // Fontovi
    const lexendFontBtn = document.getElementById('lexend-font');
    const atkinsonFontBtn = document.getElementById('atkinson-font');

    lexendFontBtn.addEventListener('click', () => {
        if (body.classList.contains('lexend-font')) {
            body.classList.remove('lexend-font');
            body.style.fontFamily = 'Roboto, sans-serif';
        } else {
            body.classList.add('lexend-font');
            body.classList.remove('atkinson-font');
            body.style.fontFamily = 'Lexend, sans-serif';
        }
    });

    atkinsonFontBtn.addEventListener('click', () => {
        if (body.classList.contains('atkinson-font')) {
            body.classList.remove('atkinson-font');
            body.style.fontFamily = 'Roboto, sans-serif';
        } else {
            body.classList.add('atkinson-font');
            body.classList.remove('lexend-font');
            body.style.fontFamily = 'Atkinson Hyperlegible, sans-serif';
        }
    });

    // Reset svih postavki
    const resetBtn = document.getElementById('reset-settings');
    resetBtn.addEventListener("click", () => {
        body.classList.remove("bold-text", "lexend-font", "atkinson-font", "high-contrast");
        fontSize = 16;
        body.style.fontSize = "16px";
        body.style.fontFamily = 'Roboto, sans-serif';
        body.style.letterSpacing = "normal";
        body.style.lineHeight = "1.5";
        letterExpanded = false;
        lineExpanded = false;
    });


    // text-to-speech
    const ttsBtn = document.getElementById('text-to-speech');

    // hidden aria-live za feedback
    const ttsStatus = document.createElement('div');
    ttsStatus.id = 'tts-status';
    ttsStatus.setAttribute('aria-live', 'polite');
    ttsStatus.style.position = 'absolute';
    ttsStatus.style.left = '-9999px';
    document.body.appendChild(ttsStatus);

    let voices = [];
    function loadVoices() {
        voices = speechSynthesis.getVoices() || [];
        console.log('voices loaded', voices.map(v => v.lang + ' / ' + v.name));
    }
   
    speechSynthesis.onvoiceschanged = loadVoices;
 
    loadVoices();

    function speakText(text) {
        if (!text) {
            ttsStatus.textContent = 'Nema teksta za čitanje.';
            return;
        }

        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hr-HR';

   
        const hr = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('hr'));
        if (hr) utterance.voice = hr;
        else if (voices.length > 0) utterance.voice = voices[0];

        utterance.onstart = () => { ttsStatus.textContent = 'Čitanje započeto.'; };
        utterance.onend = () => { ttsStatus.textContent = 'Čitanje završeno.'; };
        utterance.onerror = (err) => {
            console.error('TTS error', err);
            ttsStatus.textContent = 'Greška pri čitanju.';
        };

        try {
            speechSynthesis.speak(utterance);
        } catch (err) {
            console.error('speak failed', err);
            ttsStatus.textContent = 'Greška: ' + (err.message || err);
        }
    }

    // klik na TTS gumb
    if (ttsBtn) {
        ttsBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (speechSynthesis.speaking) {
                // ako već čita, zaustavi
                speechSynthesis.cancel();
                ttsStatus.textContent = "Čitanje zaustavljeno.";
            } else {
                // ako ne čita, kreni
                const allText = (document.querySelector('main') || document.body).innerText.trim();
                speakText(allText);
            }
        });
    } else {
        console.warn('TTS button not found: #text-to-speech');
    }


});
