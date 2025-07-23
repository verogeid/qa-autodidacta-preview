// tts.js
const debugFlag = true;

import { highlightCurrentPhrase } from './ui.js';

let voices = [];
let phrases = [];
let speakablePhrases = [];
let currentIndex = 0;
let isPlaying = false;
let isPaused = false;
let isRepeating = false;
let utterance = null;
let wasCancelled = false;


export function setVoices(v) {
  voices = v;
}

export function getCurrentIndex() {
  return currentIndex;
}

export function isPlayingState() {
  return isPlaying;
}

export function isPausedState() {
  return isPaused;
}

export function isRepeatingState() {
  return isRepeating;
}

export function toggleRepeat() {
  isRepeating = !isRepeating;
}

export function speakCurrentPhrase(onEndCallback) {
  if (phrases.length === 0 || !voices.length) return;

  if (isPlaying) cancel();

  const phrase = phrases[currentIndex];
  if (!phrase) return;

  // ✨ Highlight, solo si no es silenciosa
  if (!phrase.silent) {
    highlightCurrentPhrase(phrases, currentIndex);
  }

  if (debugFlag) {
    console.log(`🔊 Leyendo (currentIndex ${currentIndex}): ${phrase.textSpeech || '[pausa silenciosa]'}`);
    console.log(`✨ Highlight (currentIndex ${currentIndex}): ${phrase.rawText}`);
  }

  // ⏸️ Pausa silenciosa
  if (phrase.silent) {
    isPlaying = true;
    setTimeout(() => {
      isPlaying = false;
      currentIndex++;
      if (currentIndex < phrases.length) {
        speakCurrentPhrase(onEndCallback);
      } else if (onEndCallback) {
        onEndCallback();
      }
    }, phrase.pauseMs || 400);
    return;
  }

  // 🔊 Habla si tiene texto
  if (phrase.textSpeech) {
    utterance = new SpeechSynthesisUtterance(phrase.textSpeech);
    utterance.voice = voices[0];
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      isPlaying = false;
      isPaused = false;

      if (wasCancelled) return (wasCancelled = false);

      if (isRepeating) {
        speakCurrentPhrase(onEndCallback);
      } else {
        currentIndex++;
        if (currentIndex < phrases.length) {
          speakCurrentPhrase(onEndCallback);
        } else if (onEndCallback) {
          onEndCallback();
        }
      }
    };

    utterance.onerror = (e) => {
      console.error('Error en síntesis de voz:', e.error);
      isPlaying = false;
      isPaused = false;
      if (onEndCallback) onEndCallback();
    };

    speechSynthesis.speak(utterance);
    isPlaying = true;
    isPaused = false;
    return;
  }

  // ⏩ Si no es ni silent ni tiene texto
  currentIndex++;
  speakCurrentPhrase(onEndCallback);
}

export async function playOrPause() {
  if (synth.speaking || synth.pending) {
    synth.cancel();
    btnPlayPause.textContent = '▶️';
    return;
  }

  btnPlayPause.textContent = '⏸️';

  if (currentIndex >= phrases.length) {
    currentIndex = 0;
  }

  await startSpeaking();
  btnPlayPause.textContent = '▶️';
}

export function pausePlayback() {
  paused = true;
  isSpeaking = false;
  speechSynthesis.cancel();
}

export function resumePlayback() {
  if (!paused) return;
  paused = false;
  isSpeaking = true;
  speakNext();
}

export function stopPlayback() {
  speechSynthesis.cancel();
  isSpeaking = false;
  paused = false;
  currentIndex = 0;
}

export function nextPhrase() {
  if (currentIndex < spans.length - 1) {
    currentIndex++;
    speechSynthesis.cancel();
    speakNext();
  }
}

export function prevPhrase() {
  if (currentIndex > 0) {
    currentIndex--;
    speechSynthesis.cancel();
    speakNext();
  }
}

export function repeatPhrase() {
  speechSynthesis.cancel();
  speakNext();
}


export function resetIndex() {
  currentIndex = 0;
}

export async function start() {
  if (isPlaying || isPaused) return;

  isPlaying = true;
  isPaused = false;

  await playFrom(currentIndex);
}

async function playFrom(index) {
  if (!isPlaying || index >= phrases.length) {
    isPlaying = false;
    return;
  }

  currentIndex = index;
  const phrase = phrases[currentIndex];
  highlightCurrentPhrase(phrases, currentIndex);

  if (phrase.silent) {
    await new Promise(r => setTimeout(r, phrase.pauseMs || 400));
  } else if (phrase.textSpeech) {
    await new Promise((resolve) => {
      const utter = new SpeechSynthesisUtterance(phrase.textSpeech);
      utter.voice = voices[0];
      utter.onend = resolve;
      utter.onerror = resolve;
      speechSynthesis.speak(utterance = utter);
    });
  }

  await playFrom(currentIndex + 1);
}

