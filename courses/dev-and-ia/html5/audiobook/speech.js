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
    let playbackEndHandler = null;

    /**
     * Carga un archivo Markdown, lo procesa y lo renderiza en el DOM.
     * Esta función solo prepara la lección, no inicia la reproducción.
     * @param {string} filename Nombre del archivo Markdown a cargar.
     */
    async function init(filename) {
        if (filename) {
            currentFile = filename;
        }
        if (debugFlag) console.log(`[speech] 🔄 Cargando y preparando la lección: ${currentFile}`);

        const mdText = await loader.loadMarkdownText(new URL(`lessons/${currentFile}`, import.meta.url).href);
        const phrases = parser.parseMarkdown(mdText);
        
        ui.renderPhrases(phrases);
        domTTS.setPhrases(phrases);
        domTTS.resetPlayback(); // Aseguramos que el índice de reproducción esté en 0
        ui.onPhraseStart(domTTS.getCurrentIndex());
        
        // No iniciar la reproducción aquí. Se iniciará al presionar el botón de Play.
        ui.updateButtons();
    }
    
    /**
     * Manejador que se ejecuta cuando una lección termina.
     * Carga la siguiente lección e intenta iniciar la reproducción automáticamente.
     * @returns {Function} La función del manejador.
     */
    function createOnPlaybackEndHandler() {
        return () => {
            if (debugFlag) console.log('[speech] 🎶 Reproducción de la lección actual terminada.');
            const currentOptionIndex = selector.selectedIndex;
            let nextValidIndex = -1;

            // Buscar el siguiente archivo de lección disponible
            for (let i = currentOptionIndex + 1; i < selector.options.length; i++) {
                if (!selector.options[i].disabled) {
                    nextValidIndex = i;
                    break;
                }
            }

            if (nextValidIndex !== -1) {
                if (debugFlag) console.log(`[speech] ⏭️ Cargando la siguiente lección automáticamente: ${selector.options[nextValidIndex].value}`);
                selector.selectedIndex = nextValidIndex;
                const nextOption = selector.options[nextValidIndex];
                
                // Cargar y preparar la siguiente lección
                init(nextOption.value).then(() => {
                    // ⭐ Lógica clave: Intentar reproducir automáticamente la nueva lección
                    // después de que se haya cargado. Esto podría ser bloqueado por el navegador.
                    domTTS.playFromDOM(ui.onPhraseStart, playbackEndHandler);
                });
            } else {
                if (debugFlag) console.log('[speech] 🏁 Fin de todas las lecciones.');
                domTTS.stopPlayback(false); // Detiene la reproducción completamente
            }
            ui.updateButtons();
            ui.updateHighlight();
        };
    }

    /**
     * Función principal de inicialización de la aplicación.
     */
    async function initializeApp() {
        const lessonsMetadata = await loader.loadCourseMetadata('lessons.md');
        const config = await loader.loadConfig('config.json');

        parser.setConfig(config);

        const { title, files: lessonFiles } = lessonsMetadata;
        const { lang, modalHeader, voices } = config; 
        files = lessonFiles;
        
        if (debugFlag) console.log(`title: ${title}`);
        
        if (!files || !files.length) {
            console.error('No se encontraron archivos para leer.');
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
                opt.textContent = `${name} �`;
                opt.disabled = true;
            }
            selector.appendChild(opt);
        }

        const availableVoices = await loader.loadVoices();
        
        ui.setUITexts({ title, modalHeader, voices });
        ui.setAvailableVoices(availableVoices, lang); 
        domTTS.setVoicePreferences(ui.getVoicePreferences());
        
        playbackEndHandler = createOnPlaybackEndHandler();
        ui.createFooterControls();
        ui.initUI(playbackEndHandler);
        
        if (firstValid) {
            selector.value = firstValid;
            await init(firstValid);
        } else {
            console.error("No hay lecciones disponibles para cargar.");
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