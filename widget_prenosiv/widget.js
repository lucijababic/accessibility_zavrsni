// Dinamičko kreiranje HTML widgeta
const body = document.body;

const widgetHTML = `
    <button id="accessibility-toggle" aria-label="Pristupačnost">A</button>
    <div id="accessibility-menu" aria-hidden="true">
        <button id="increase-font">Povećaj font</button>
        <button id="decrease-font">Smanji font</button>
        <button id="letter-spacing-btn">Razmak slova</button>
        <button id="line-height-btn">Visina reda</button>
        <button id="toggle-contrast">Kontrast</button>
        <button id="bold-text">Podebljaj tekst</button>
        <button id="lexend-font">Lexend font</button>
        <button id="atkinson-font">Atkinson font</button>
        <button id="text-to-speech">Čitaj tekst</button>
        <button id="reset-settings">Reset</button>
    </div>
`;
body.insertAdjacentHTML('beforeend', widgetHTML);

// Dobavljanje elemenata
const toggleBtn = document.getElementById('accessibility-toggle');
const menu = document.getElementById('accessibility-menu');
const text = body;
const letterBtn = document.getElementById('letter-spacing-btn');
const lineBtn = document.getElementById('line-height-btn');
const increaseFontBtn = document.getElementById('increase-font');
const decreaseFontBtn = document.getElementById('decrease-font');
const toggleContrastBtn = document.getElementById('toggle-contrast');
const boldToggle = document.getElementById('bold-text');
const lexendFontBtn = document.getElementById('lexend-font');
const atkinsonFontBtn = document.getElementById('atkinson-font');
const resetBtn = document.getElementById('reset-settings');

let menuOpen = false;
let fontSize = 16;
let letterExpanded = false;
let lineExpanded = false;

// Funkcionalnosti
toggleBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menu.style.display = menuOpen ? 'flex' : 'none';
    toggleBtn.setAttribute('aria-expanded', menuOpen);
    menu.setAttribute('aria-hidden', !menuOpen);
});

letterBtn.addEventListener('click', () => {
    text.style.letterSpacing = letterExpanded ? 'normal' : '0.3em';
    letterExpanded = !letterExpanded;
});

lineBtn.addEventListener('click', () => {
    text.style.lineHeight = lineExpanded ? '1.5' : '2.5';
    lineExpanded = !lineExpanded;
});

increaseFontBtn.addEventListener('click', () => {
    if (fontSize < 24) {
        fontSize += 2;
        text.style.fontSize = fontSize + 'px';
    }
});

decreaseFontBtn.addEventListener('click', () => {
    if (fontSize > 12) {
        fontSize -= 2;
        text.style.fontSize = fontSize + 'px';
    }
});

toggleContrastBtn.addEventListener('click', () => {
    text.classList.toggle('high-contrast');
});

boldToggle.addEventListener('click', () => {
    text.classList.toggle('bold-text');
});

lexendFontBtn.addEventListener('click', () => {
    text.classList.toggle('lexend-font');
    text.classList.remove('atkinson-font');
});

atkinsonFontBtn.addEventListener('click', () => {
    text.classList.toggle('atkinson-font');
    text.classList.remove('lexend-font');
});

resetBtn.addEventListener('click', () => {
    text.className = '';
    fontSize = 16;
    text.style.fontSize = '16px';
    text.style.letterSpacing = 'normal';
    text.style.lineHeight = '1.5';
});

// Dugmi s ikonama
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
    element.textContent = btn.label;
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

