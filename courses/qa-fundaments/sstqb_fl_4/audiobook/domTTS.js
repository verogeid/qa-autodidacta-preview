// domTTS.js
const debugFlag = true;

let phrases = [];
let currentIndex = 0;

const speechState = {
    spans: [],
    index: 0,
    playing: false,
    paused: false,
    repeat: false,
    utterance: null,
};

export function playFromDOM({ repeat = false } = {}) {
    if (speechState.playing && !speechState.paused) return;

    speechState.spans = [...document.querySelectorAll('.phrase')];
    speechState.repeat = repeat;
    speechState.playing = true;
    speechState.paused = false;

    speakNext();
}

function speakNext() {
    if (!speechState.playing || speechState.paused) return;

    const span = speechState.spans[speechState.index];
    if (!span) {
        if (speechState.repeat) {
        speechState.index = 0;
        return speakNext();
        } else {
        speechState.playing = false;
        return;
        }
    }

    const text = span.textContent.trim();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';

    utterance.onstart = () => {
        speechState.spans.forEach(s => s.classList.remove('active'));
        span.classList.add('active');
        span.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (debugFlag) console.log(`🔊 Leyendo: ${text}`);
    };

    utterance.onend = () => {
        speechState.index++;
        speakNext();
    };

    speechState.utterance = utterance;
    speechSynthesis.speak(utterance);
}

export function setPhrases(p) {
    phrases = p;
    currentIndex = 0;

    if (debugFlag) {
        console.log('🗂️ Frases cargadas:', phrases);
    }
}

export function pausePlayback() {
    if (speechState.playing && !speechState.paused) {
        speechSynthesis.pause();
        speechState.paused = true;
    }
}

export function resumePlayback() {
    if (speechState.playing && speechState.paused) {
        speechSynthesis.resume();
        speechState.paused = false;
    }
}

export function stopPlayback() {
    speechSynthesis.cancel();
    speechState.playing = false;
    speechState.paused = false;
}

export function resetPlayback() {
    speechState.index = 0;
}

export function nextPhrase() {
    stopPlayback();
    speechState.index = Math.min(speechState.index + 1, speechState.spans.length - 1);
    playFromDOM({ repeat: speechState.repeat });
}

export function prevPhrase() {
    stopPlayback();
    speechState.index = Math.max(speechState.index - 1, 0);
    playFromDOM({ repeat: speechState.repeat });
}

export function toggleRepeat() {
    speechState.repeat = !speechState.repeat;
    return speechState.repeat;
}

export function isPlaying() {
    return speechState.playing;
}

export function isPaused() {
    return speechState.paused;
}

export function isRepeating() {
    return speechState.repeat;
}

export function getCurrentIndex() {
    return speechState.index;
}

export function togglePlayPause() {
    if (speechState.playing && !speechState.paused) {
        pausePlayback();
    } else if (speechState.playing && speechState.paused) {
        resumePlayback();
    } else {
        playFromDOM({ repeat: speechState.repeat });
    }
}
