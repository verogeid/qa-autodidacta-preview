// speech.js
const debugFlag = false;

import * as loader from './loader.js';
import * as parser from './parser.js';
import * as domTTS from './domTTS.js';
import * as ui from './ui.js';

const selector = document.getElementById('selector');

(async function () {
    let files = [];
    let currentFile = '';

    // Función para manejar la carga de un archivo y la reproducción
    async function init(filename) {
        if (filename) {
            currentFile = filename;
        }

        const mdText = await loader.loadMarkdownText(new URL(`lessons/${currentFile}`, import.meta.url).href);
        const phrases = parser.parseMarkdown(mdText);
        
        ui.renderPhrases(phrases);
        domTTS.setPhrases(phrases);
        ui.onPhraseStart(domTTS.getCurrentIndex());

        const onPlaybackEndHandler = createOnPlaybackEndHandler();
        domTTS.playFromDOM(ui.onPhraseStart, onPlaybackEndHandler);
        ui.updateButtons();
    }
    
    // Handler para el final de la reproducción
    function createOnPlaybackEndHandler() {
        return () => {
            const currentOptionIndex = selector.selectedIndex;
            let nextValidIndex = -1;

            for (let i = currentOptionIndex + 1; i < selector.options.length; i++) {
                if (!selector.options[i].disabled) {
                    nextValidIndex = i;
                    break;
                }
            }

            if (nextValidIndex !== -1) {
                selector.selectedIndex = nextValidIndex;
                const nextOption = selector.options[nextValidIndex];
                domTTS.resetPlayback();
                init(nextOption.value);
            } else {
                const lastVisibleIndex = domTTS.getLastVisiblePhraseIndex();
                if (lastVisibleIndex !== -1) {
                    ui.onPhraseStart(lastVisibleIndex);
                }
                domTTS.stopPlayback(false);
            }
        };
    }

    // ⭐ Función principal de inicialización de la aplicación
    async function initializeApp() {
        const lessonsMetadata = await loader.loadCourseMetadata('lessons.md');
        const config = await loader.loadConfig('config.json');

        // ✅ Se añade esta línea para pasar la configuración al parser.
        parser.setConfig(config);

        const { title, files: lessonFiles } = lessonsMetadata;
        // ⭐ CORRECCIÓN: Usar "lang" en lugar de "languages"
        const { lang, modalHeader, voices } = config; 
        files = lessonFiles;
        
        if (debugFlag) console.log(`title: ${title}`);
        
        if (!files || !files.length) {
            alert('No se encontraron archivos para leer.');
            return;
        }

        let firstValid = null;
        for (const file of files) {
            const opt = document.createElement('option');
            const name = file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const fullPath = `./lessons/${file}`;
            
            try {
                const res = await fetch(fullPath, { method: "HEAD" });
                const exists = res.ok;
                opt.value = file;
                opt.textContent = exists ? name : `${name} 🧩`;
                opt.disabled = !exists;
                if (exists && !firstValid) {
                    firstValid = file;
                }
            } catch {
                opt.value = file;
                opt.textContent = `${name} 🧩`;
                opt.disabled = true;
            }
            selector.appendChild(opt);
        }

        const availableVoices = await loader.loadVoices();
        
        ui.setUITexts({ title, modalHeader, voices });
        // ⭐ CORRECCIÓN: Pasar "lang" en lugar de "languages"
        ui.setAvailableVoices(availableVoices, lang); 
        // Nota: La siguiente línea es redundante y puede eliminarse, ya que setAvailableVoices ya llama a loadVoicePreferences.
        ui.loadVoicePreferences();
        domTTS.setVoicePreferences(ui.getVoicePreferences());
        
        const onPlaybackEndHandler = createOnPlaybackEndHandler();
        ui.createFooterControls();
        ui.initUI(onPlaybackEndHandler);
        
        if (firstValid) {
            selector.value = firstValid;
            await init(firstValid);
        } else {
            alert("No hay lecciones disponibles para cargar.");
        }

        selector.onchange = async () => {
            const selected = selector.options[selector.selectedIndex];
            if (selected.disabled) {
                return;
            }
            domTTS.stopPlayback();
            await init(selected.value);
        };
    }
    
    initializeApp();
})();
