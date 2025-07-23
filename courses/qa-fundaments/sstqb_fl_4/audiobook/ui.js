// ui.js
const debugFlag = true;

import * as domTTS from './domTTS.js';

let spans = [];
let currentIndex = 0;
let isSpeaking = false;
let paused = false;
let currentUtterance = null;

export function createFooterControls() {
  const footer = document.querySelector('footer');
  if (!footer) {
    console.warn('No se encontró el elemento <footer> en el DOM.');
    return;
  }

  footer.innerHTML = `
    <div class=buttons-container>
      <button id="btnPrev" aria-label="Previous">⏪</button>
      <button id="btnPlayPause" aria-label="PlayPause">▶️</button>
      <button id="btnNext" aria-label="Next">⏩</button>
      <button id="btnRepeat" aria-label="Repeat">🔁</button>
      <button id="btnRestart" aria-label="Restart">⏮️</button>
    </div>
  `;
}

export function highlightCurrentPhrase(phrases, currentIndex) {
  const container = document.getElementById('text');
  if (!container) return;

  container.innerHTML = '';
  let p = document.createElement('p');

  phrases.forEach((phrase) => {
    if (phrase.textDisplay === '\n') {
      if (p.childNodes.length > 0) container.appendChild(p);
      p = document.createElement('p');
      return;
    }

    const temp = document.createElement('div');
    temp.innerHTML = phrase.textDisplay;
    const inner = temp.firstElementChild;

    if (inner && inner.classList.contains('phrase')) {
      if (phrase.textSpeech) {
        inner.dataset.index = phrase.speakableIndex;
        if (phrase.speakableIndex === currentIndex) {
          inner.classList.add('active');
        }
      }
      p.appendChild(inner);
      p.append(' ');
    } else {
      p.appendChild(document.createTextNode(inner?.textContent || phrase.textDisplay));
      p.append(' ');
    }
  });


  if (p.childNodes.length > 0) container.appendChild(p);

  const active = container.querySelector(`.phrase[data-index="${currentIndex}"]`);
  if (active) {
    active.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (debugFlag) {
    const active = document.querySelector('.phrase.active');
    console.log(`✨ Highlight (currentIndex ${currentIndex}):`, active?.textContent?.trim() || '[ninguna]');
  }
}

export function playFromDOM() {
  if (isSpeaking) return;

  spans = [...document.querySelectorAll('.phrase')];
  if (!spans.length) return;

  isSpeaking = true;
  paused = false;

  speakNext();
}

function speakNext() {
  if (!isSpeaking || paused || currentIndex >= spans.length) {
    isSpeaking = false;
    return;
  }

  const span = spans[currentIndex];
  const text = span?.textContent?.trim();
  if (!text) {
    currentIndex++;
    speakNext();
    return;
  }

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'es-ES';

  currentUtterance.onstart = () => {
    spans.forEach(s => s.classList.remove('active'));
    span.classList.add('active');
    span.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (debugFlag) console.log(`🔊 Leyendo (DOM index ${currentIndex}): ${text}`);
  };

  currentUtterance.onend = () => {
    if (!paused) {
      currentIndex++;
      speakNext();
    }
  };

  speechSynthesis.speak(currentUtterance);
}


export function initUI(phrases) {
  const btnPlayPause = document.getElementById('btnPlayPause');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnRepeat = document.getElementById('btnRepeat');
  const btnRestart = document.getElementById('btnRestart');

  if (!btnPlayPause || !btnPrev || !btnNext || !btnRepeat || !btnRestart) {
    console.warn('Faltan botones de control en el DOM.');
    return;
  }

  function updateButtons() {
    btnPlayPause.textContent = domTTS.isPlaying()
      ? (domTTS.isPaused() ? '▶️' : '⏸️')
      : '▶️';
    btnRepeat.style.backgroundColor = domTTS.isRepeating() ? '#AAF' : '';
  }

  function updateHighlight() {
    highlightCurrentPhrase(phrases, domTTS.getCurrentIndex());
  }

  domTTS.setPhrases(phrases);
  updateHighlight();
  updateButtons();

  btnPlayPause.onclick = () => {
    domTTS.togglePlayPause();
    updateButtons();
  };

  btnPrev.onclick = () => {
    domTTS.prevPhrase();
    updateHighlight();
  };

  btnNext.onclick = () => {
    domTTS.nextPhrase();
    updateHighlight();
  };

  btnRepeat.onclick = () => {
    domTTS.toggleRepeat();
    updateButtons();
  };

  btnRestart.onclick = () => {
    domTTS.stopPlayback();
    domTTS.resetPlayback();
    domTTS.playFromDOM();

    updateHighlight();
    updateButtons();
  };
}

