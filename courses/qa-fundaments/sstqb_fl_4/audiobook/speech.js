// speech.js
const debugFlag = false;

import * as loader from './loader.js';
import * as parser from './parser.js';
import * as domTTS from './domTTS.js';
import * as ui from './ui.js';

const selector = document.getElementById('selector');

(async function () {
  async function loadAndParseFile(filename) {
    const mdText = await loader.loadMarkdownText(new URL(`lessons/${filename}`, import.meta.url).href);
    const phrases = parser.parseMarkdown(mdText);

    domTTS.setPhrases(phrases);
    ui.initUI(phrases);
  }

  async function init() {
    const files = await loader.loadFileList('./audiobook/lessons.md');
    if (!files.length) {
      alert('No se encontraron archivos para leer.');
      return;
    }

    files.forEach(file => {
      const opt = document.createElement('option');
      opt.value = file;
      opt.textContent = file;
      selector.appendChild(opt);
    });

    ui.createFooterControls();

    await loadAndParseFile(files[0]);

    selector.onchange = async () => {
      domTTS.cancel();
      await loadAndParseFile(selector.value);
    };
  }

  init();
})();
