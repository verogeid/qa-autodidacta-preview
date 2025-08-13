// domTTS.js
const debugFlag = false;

const speechState = {
    phrases: [],
    index: 0,
    playing: false,
    paused: false,
    onPhraseStart: null,
    onPlaybackEnd: null,
    voicePreferences: {},
    availableVoices: [],
    lastUsedVoiceIndex: {},
};

function createVoiceKey(voice) {
    return `${voice.name.trim()}_${voice.lang}`;
}

export async function getVoices() {
    return new Promise(resolve => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            speechState.availableVoices = voices;
            resolve(voices);
        } else {
            speechSynthesis.onvoiceschanged = () => {
                const updatedVoices = speechSynthesis.getVoices();
                speechState.availableVoices = updatedVoices;
                resolve(updatedVoices);
            };
        }
    });
}

export function setVoicePreferences(preferences) {
    speechState.voicePreferences = preferences;
    for (const role in preferences) {
        if (Array.isArray(preferences[role])) {
            speechState.lastUsedVoiceIndex[role] = -1;
        }
    }
    if (debugFlag) console.log('[domTTS] Preferencias de voz aplicadas:', preferences);
}

function getPhrases() {
    return [...document.querySelectorAll('.phrase')];
}

export function setPhrases(p) {
    speechState.phrases = p;
    speechState.index = 0;
}

export async function playFromDOM(onPhraseStartCallback, onPlaybackEndCallback) {
    if (speechState.playing && !speechState.paused) return;
    
    await getVoices();
    if (debugFlag) console.log(`[domTTS] Voces cargadas. Total: ${speechState.availableVoices.length}`);

    const phrases = getPhrases();
    if (!phrases.length) {
        if (debugFlag) console.warn('[domTTS] No hay frases para leer.');
        return;
    }

    speechSynthesis.cancel();

    speechState.playing = true;
    speechState.paused = false;
    speechState.onPhraseStart = onPhraseStartCallback;
    speechState.onPlaybackEnd = onPlaybackEndCallback;
    
    if (speechState.index === 0) {
        resetLastUsedVoiceIndex();
    }

    speakNext();
}

function resetLastUsedVoiceIndex() {
    for (const role in speechState.lastUsedVoiceIndex) {
        speechState.lastUsedVoiceIndex[role] = -1;
    }
}

function speakNext() {
    if (!speechState.playing || speechState.paused) return;

    const phrases = getPhrases();
    const currentPhraseSpan = phrases[speechState.index];

    if (!currentPhraseSpan) {
        if (speechState.onPlaybackEnd) {
            speechState.onPlaybackEnd();
        }
        return;
    }

    if (speechState.onPhraseStart) {
        speechState.onPhraseStart(speechState.index);
    }
    
    if (currentPhraseSpan.hasAttribute('data-pause-ms')) {
        const pauseMs = parseInt(currentPhraseSpan.getAttribute('data-pause-ms'), 10);
        if (debugFlag) console.log(`[domTTS] ⏳ Pausa de ${pauseMs}ms.`);

        setTimeout(() => {
            if (!speechState.paused) {
                speechState.index++;
                speakNext();
            }
        }, pauseMs);
        return;
    }
    
    const textToSpeak = currentPhraseSpan.getAttribute('data-speech') || currentPhraseSpan.textContent.trim();

    if (textToSpeak) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        const pitchAttr = currentPhraseSpan.getAttribute('data-pitch');
        if (pitchAttr) {
            const pitchValue = parseFloat(pitchAttr);
            if (!isNaN(pitchValue)) {
                utterance.pitch = pitchValue;
                if (debugFlag) console.log(`[domTTS] 🎵 Pitch ajustado a: ${pitchValue}`);
            }
        }

        let role = currentPhraseSpan.getAttribute('data-role');
        if (!role) {
            role = 'voice-4';
            if (debugFlag) console.log("[domTTS] Rol no definido, usando el rol por defecto 'voice-4'.");
        }
        if (debugFlag) console.log(`[domTTS] Rol '${role}'`);
        
        let selectedVoice = null;
        const voicePreferencesForRole = speechState.voicePreferences[role];

        if (debugFlag) console.log(`voicePreferencesForRole: ${voicePreferencesForRole}`);
        
        if (voicePreferencesForRole) {
            let savedVoiceKey;
            
            if (Array.isArray(voicePreferencesForRole) && voicePreferencesForRole.length > 0) {
                let lastIndex = speechState.lastUsedVoiceIndex[role] || -1;
                let nextIndex = (lastIndex + 1) % voicePreferencesForRole.length;
                savedVoiceKey = voicePreferencesForRole[nextIndex];
                speechState.lastUsedVoiceIndex[role] = nextIndex;
            } else if (typeof voicePreferencesForRole === 'string') {
                savedVoiceKey = voicePreferencesForRole;
            }
            
            if (savedVoiceKey) {
                if (debugFlag) console.log(`[domTTS] 🔍 Buscando voz con el identificador guardado: '${savedVoiceKey}'`);

                selectedVoice = speechState.availableVoices.find(v => {
                    const currentVoiceKey = createVoiceKey(v);
                    if (debugFlag) console.log(`[domTTS] ➡️ Comparando con voz disponible: '${currentVoiceKey}'`);
                    return currentVoiceKey === savedVoiceKey;
                });
            }
        }
        
        if (selectedVoice) {
            if (debugFlag) console.log(`[domTTS] ✅ Voz encontrada y usada: '${selectedVoice.name}' (${selectedVoice.lang})`);
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        } else {
            if (debugFlag) console.warn(`[domTTS] ❌ No se pudo encontrar una voz para el rol '${role}'. Usando la voz por defecto del sistema.`);
        }
        
        utterance.onstart = () => {
            if (debugFlag) console.log(`[domTTS] 🔊 Leyendo: ${textToSpeak}`);
        };

        utterance.onend = () => {
            if (speechState.playing && !speechState.paused) {
                speechState.index++;
                speakNext();
            }
        };

        speechSynthesis.speak(utterance);
    } else {
        speechState.index++;
        speakNext();
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
        
        if (!speechSynthesis.speaking) {
            speakNext();
        }
    }
}

export function stopPlayback(clearHighlight = true) {
    speechSynthesis.cancel();
    speechState.playing = false;
    speechState.paused = false;
    speechState.onPlaybackEnd = null;
    if (clearHighlight && speechState.onPhraseStart) {
        speechState.onPhraseStart(-1);
    }
}

export function resetPlayback() {
    stopPlayback();
    speechState.index = 0;
    resetLastUsedVoiceIndex();
}

export function nextPhrase() {
    stopPlayback();
    const phrases = getPhrases();
    const lastVisibleIndex = getLastVisiblePhraseIndex();
    
    if (speechState.index < lastVisibleIndex) {
        let nextIndex = speechState.index + 1;
        while (nextIndex <= lastVisibleIndex && phrases[nextIndex].hasAttribute('data-pause-ms')) {
            nextIndex++;
        }
        speechState.index = nextIndex > lastVisibleIndex ? lastVisibleIndex : nextIndex;
    } else {
        speechState.index = lastVisibleIndex;
    }
}

export function prevPhrase() {
    stopPlayback();
    const phrases = getPhrases();
    let prevIndex = speechState.index - 1;
    while (prevIndex >= 0 && phrases[prevIndex].hasAttribute('data-pause-ms')) {
        prevIndex--;
    }
    speechState.index = Math.max(prevIndex, 0);
}

export function isPlaying() {
    return speechState.playing;
}

export function isPaused() {
    return speechState.paused;
}

export function getCurrentIndex() {
    return speechState.index;
}

export function togglePlayPause(onPhraseStartCallback, onPlaybackEndCallback) {
    if (!speechState.playing) {
        playFromDOM(onPhraseStartCallback, onPlaybackEndCallback);
    } else {
        if (speechState.paused) {
            resumePlayback();
        } else {
            pausePlayback();
        }
    }
}

export function getLastVisiblePhraseIndex() {
    const phrases = getPhrases();
    for (let i = phrases.length - 1; i >= 0; i--) {
        if (!phrases[i].hasAttribute('data-pause-ms')) {
            return i;
        }
    }
    return -1;
}
