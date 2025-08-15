// ui.js
const debugFlag = false;

import * as domTTS from './domTTS.js';

let availableVoices = [];
let voicePreferences = {};
let availableLanguages = [];
let roleNames = {};

/**
 * Crea una clave única para una voz.
 * @param {SpeechSynthesisVoice} voice Objeto de la voz.
 * @returns {string} Clave única.
 */
function createVoiceKey(voice) {
    return `${voice.name.trim()}_${voice.lang}`;
}

/**
 * Busca la mejor voz predeterminada para un idioma.
 * Prioriza las voces de Google, luego la voz predeterminada del sistema, y finalmente la primera voz disponible.
 * @param {Array<SpeechSynthesisVoice>} voices Lista de voces disponibles.
 * @param {string} lang Código del idioma a buscar.
 * @returns {SpeechSynthesisVoice|null} La voz recomendada o null si no se encuentra ninguna.
 */
function findBestDefaultVoice(voices, lang) {
    if (!voices || voices.length === 0 || !lang) {
        return null;
    }

    const filtered = voices.filter(voice => voice.lang.startsWith(lang));
    
    // 1. Prioriza las voces de Google
    const googleVoice = filtered.find(voice => voice.name.includes('Google'));
    if (googleVoice) {
        if (debugFlag) console.log(`[ui] ⭐ Voz por defecto para "${lang}": Priorizando Google (${googleVoice.name}).`);
        return googleVoice;
    }
    
    // 2. Si no hay Google, busca la predeterminada del sistema
    const systemDefaultVoice = filtered.find(voice => voice.default === true);
    if (systemDefaultVoice) {
        if (debugFlag) console.log(`[ui] ⭐ Voz por defecto para "${lang}": Usando la voz por defecto del sistema (${systemDefaultVoice.name}).`);
        return systemDefaultVoice;
    }

    // 3. Si no hay ninguna de las anteriores, usa la primera de la lista
    if (filtered.length > 0) {
        if (debugFlag) console.log(`[ui] ⭐ Voz por defecto para "${lang}": Usando la primera voz disponible (${filtered[0].name}).`);
        return filtered[0];
    }
    
    return null;
}

export function setUITexts({ title, modalHeader, voices }) {
    if (debugFlag) console.log('[ui] 📝 Estableciendo textos de UI desde config.json y lessons.md');

    if (title) {
        document.querySelector('h1').textContent = title;
        document.title = title;
        if (debugFlag) console.log(`[ui] 📄 Título de la página y h1 establecidos: ${title}`);
    }

    if (modalHeader) {
        const modalTitle = document.querySelector('#voice-config-title');
        if (modalTitle) {
            modalTitle.textContent = modalHeader;
            if (debugFlag) console.log(`[ui] ⚙️ Encabezado del modal establecido: ${modalHeader}`);
        } else {
            if (debugFlag) console.warn('[ui] ❌ No se encontró el <h3> del modal de configuración.');
        }
    }

    if (voices && Array.isArray(voices)) {
        roleNames = {};
        voices.forEach(v => {
            roleNames[v.id] = v.name;
        });
        if (debugFlag) console.log('[ui] 🗣️ Nombres de roles actualizados:', roleNames);
    } else {
        if (debugFlag) console.warn('[ui] ❌ No se proporcionó un array de roles válido en la configuración.');
        roleNames = {
            'voice-1': 'Personaje 1',
            'voice-2': 'Personaje 2',
            'voice-3': 'Personaje 3',
            'voice-4': 'Narrador 1',
            'voice-5': 'Narrador 2'
        };
    }
}

function renderVoiceOptions() {
    if (debugFlag) console.log('[ui] ⚙️ Llamando a renderVoiceOptions... ui.js');
    const container = document.getElementById('voice-options-container');
    container.innerHTML = '';
    
    if (debugFlag) console.log('[ui] 🌍 Idiomas disponibles en renderVoiceOptions:', availableLanguages);

    if (!Array.isArray(availableLanguages) || availableLanguages.length === 0) {
        if (debugFlag) console.warn('[ui] ❌ No se han cargado los idiomas. No se pueden renderizar las opciones de voz.');
        return;
    }
    
    const allRoles = Object.keys(roleNames);
    
    const characterColumn = document.createElement('div');
    characterColumn.className = 'voice-column';
    
    const narratorColumn = document.createElement('div');
    narratorColumn.className = 'voice-column';
    
    const systemLang = window.navigator.language || 'es';
    const primaryLanguageCode = availableLanguages[0] || systemLang.split('-')[0];
    const secondaryLanguageCode = availableLanguages[1] || null;
    
    if (debugFlag) console.log (`[ui] System lang: ${systemLang} | Primary lang: ${primaryLanguageCode} | Secondary lang: ${secondaryLanguageCode}`);
    
    const createOptions = (roles, parentContainer) => {
        roles.forEach(role => {
            const div = document.createElement('div');
            div.className = 'voice-option';
            
            const label = document.createElement('label');
            label.textContent = roleNames[role];
            div.appendChild(label);

            const select = document.createElement('select');
            select.dataset.role = role;
            
            let filteredVoices = [];
            let langToFilter;
            
            if (role === 'voice-4') {
                langToFilter = primaryLanguageCode;
                if (debugFlag) console.log(`[ui] 🔍 Filtrando voces para el rol ${role} (Narrador 1) con el idioma principal: ${langToFilter}`);
            } else {
                langToFilter = secondaryLanguageCode || primaryLanguageCode;
                if (debugFlag) console.log(`[ui] 🔍 Filtrando voces para el rol ${role} con el idioma: ${langToFilter}`);
            }
            
            if (langToFilter) {
                filteredVoices = availableVoices.filter(voice => voice.lang.startsWith(langToFilter));
            }
            
            if (filteredVoices.length === 0) {
                if (debugFlag) console.warn(`[ui] No se encontraron voces para el idioma "${langToFilter}". Usando todas las voces.`);
                filteredVoices = availableVoices;
            }

            filteredVoices.forEach(voice => {
                const option = document.createElement('option');
                
                option.value = createVoiceKey(voice);
                option.textContent = `${voice.name} (${voice.lang})`;
                select.appendChild(option);
            });
        
            const savedVoiceKey = voicePreferences[role];
            if (savedVoiceKey) {
                select.value = savedVoiceKey;
            } else {
                // Nueva lógica para seleccionar la mejor voz por defecto si no hay preferencias guardadas
                const defaultVoice = findBestDefaultVoice(filteredVoices, langToFilter);
                select.value = defaultVoice ? createVoiceKey(defaultVoice) : (filteredVoices.length > 0 ? createVoiceKey(filteredVoices[0]) : null);
            }
            
            div.appendChild(select);
            parentContainer.appendChild(div);
        });
    };

    createOptions(allRoles.filter(role => role.startsWith('voice-1') || role.startsWith('voice-2') || role.startsWith('voice-3')), characterColumn);
    createOptions(allRoles.filter(role => role.startsWith('voice-4') || role.startsWith('voice-5')), narratorColumn);

    container.appendChild(characterColumn);
    container.appendChild(narratorColumn);
}

function handleEsc(e) {
    if (e.key === 'Escape' && document.getElementById('voice-config-menu').style.display === 'block') {
        e.preventDefault();
        hideConfigMenu();
        document.getElementById('config-btn').focus();
    }
}

function showConfigMenu() {
    if (debugFlag) console.log('[ui] ⚙️ Botón de configuración pulsado. Abriendo el menú.');
    renderVoiceOptions();
    const modalMenu = document.getElementById('voice-config-menu');
    modalMenu.style.display = 'block';
    
    const firstSelect = document.querySelector('#voice-options-container select');
    if (firstSelect) {
        firstSelect.focus();
    }
    
    setupModalKeyboardNavigation();
    document.addEventListener('keydown', handleEsc);
}

function hideConfigMenu() {
    if (debugFlag) console.log('[ui] ⚙️ Cerrando el menú de configuración.');
    document.getElementById('voice-config-menu').style.display = 'none';

    document.removeEventListener('keydown', handleEsc);
}

export function loadVoicePreferences(languages) {
    if (languages && Array.isArray(languages) && languages.length > 0) {
        if (debugFlag) console.log('[ui] ⚙️ Se están pasando los idiomas a loadVoicePreferences.');
        availableLanguages = languages.flat();
    }
    if (debugFlag) console.log('[ui] 🌍 Idiomas disponibles para asignar preferencias:', availableLanguages);

    const preferences = localStorage.getItem('voicePreferences');
    if (preferences) {
        try {
            voicePreferences = JSON.parse(preferences);
            if (debugFlag) console.log('[ui] 💾 Preferencias de voz cargadas desde localStorage:', voicePreferences);
        } catch (e) {
            console.error('[ui] Error al parsear las preferencias de voz de localStorage. Reiniciando.', e);
            voicePreferences = {};
        }
    } else {
        if (debugFlag) console.log('[ui] ⭐ No se encontraron preferencias guardadas. No se asignarán valores por defecto.');
        voicePreferences = {};
    }
}

export function saveVoicePreferences() {
    if (debugFlag) console.log('[ui] 💾 Guardando preferencias de voz...');
    const selects = document.querySelectorAll('#voice-options-container select');
    const newPreferences = {};
    selects.forEach(select => {
        if (select.value) {
            newPreferences[select.dataset.role] = select.value;
        }
    });
    localStorage.setItem('voicePreferences', JSON.stringify(newPreferences));
    voicePreferences = newPreferences;
    domTTS.setVoicePreferences(voicePreferences);
    
    hideConfigMenu();
    document.getElementById('selector').focus();
}

export function setAvailableVoices(voices, languages) {
    availableVoices = voices;
    if (!languages || !Array.isArray(languages) || languages.length === 0) {
        const systemLang = window.navigator.language || 'es';
        const primaryLanguageCode = systemLang.split('-')[0];
        if (debugFlag) console.warn(`[ui] Idiomas no proporcionados. Usando el idioma del sistema como fallback: ${systemLang} -> ${primaryLanguageCode}.`);
        availableLanguages = [primaryLanguageCode];
    } else {
        if (debugFlag) console.log('[ui] 🌍 Idiomas proporcionados:', languages);
        const langArray = languages.flat();
        if (langArray.length >= 2) {
            availableLanguages = [langArray[0], langArray[1]];
        } else {
            availableLanguages = [langArray[0]];
        }
        if (debugFlag) console.log('[ui] 🌍 Idiomas globales asignados de forma explícita:', availableLanguages);
    }

    if (debugFlag) {
        console.log('[ui] 🗣️ Voces disponibles cargadas:', availableVoices.map(v => `${v.name} (${v.lang})`));
        console.log('[ui] 🌍 Idiomas globales DESPUÉS de asignar:', availableLanguages);
    }
    loadVoicePreferences(availableLanguages);
    domTTS.setVoicePreferences(getVoicePreferences());
}

export function getVoicePreferences() {
    return voicePreferences;
}

export function createFooterControls() {
    const footer = document.querySelector('footer');
    if (!footer) {
        console.warn('[ui] No se encontró el elemento <footer> en el DOM.');
        return;
    }

    footer.innerHTML = `
        <div class="buttons-container">
            <button id="btnPrev" aria-label="Anterior" label="Previous">⏪</button>
            <button id="btnPlayPause" aria-label="Reproducir/Pausar" label="Play/Pause">⏯️</button>
            <button id="btnNext" aria-label="Siguiente" label="Next">⏩</button>
            <button id="btnRestart" aria-label="Reiniciar" label="Restart">⏮️</button>
            <button id="config-btn" aria-label="Configuración" label="Config">⚙️</button>
        </div>
    `;
}

export function renderPhrases(phrasesHtml) {
    const container = document.getElementById('text');
    if (container) {
        container.innerHTML = phrasesHtml.join('');
    }
}

export function onPhraseStart(index) {
    const container = document.getElementById('text');
    if (!container) return;

    const phrases = container.querySelectorAll('.phrase');
    phrases.forEach(p => p.classList.remove('active'));

    if (index >= 0) {
        const currentPhrase = container.querySelector(`.phrase[data-index="${index}"]`);
        if (currentPhrase) {
            if (!currentPhrase.hasAttribute('data-pause-ms')) {
                currentPhrase.classList.add('active');
            }
            currentPhrase.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    if (debugFlag) {
        const active = container.querySelector('.phrase.active');
        console.log(`[ui] ✨ Highlight (currentIndex ${index}):`, active?.textContent?.trim() || '[ninguna]');
    }
}

export function updateHighlight() {
    onPhraseStart(domTTS.getCurrentIndex());
}

export function updateButtons() {
    const btnPlayPause = document.getElementById('btnPlayPause');
    if (btnPlayPause) {
        btnPlayPause.textContent = domTTS.isPlaying()
        ? (domTTS.isPaused() ? '⏯️' : '⏯️')
        : '⏯️';
    }
}


function setupKeyboardNavigation() {
    const selector = document.getElementById('selector');
    const footerButtons = document.querySelectorAll('footer button');
    const lastButton = footerButtons[footerButtons.length - 1];

    if (!selector || !lastButton) {
        if (debugFlag) console.warn('[ui] No se pudieron encontrar todos los elementos para configurar la navegación por teclado.');
        return;
    }

    lastButton.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            selector.focus();
        }
    });

    selector.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            lastButton.focus();
        }
    });
}

function setupModalKeyboardNavigation() {
    const modalSelects = document.querySelectorAll('#voice-options-container select');
    const saveButton = document.getElementById('save-config-btn');
    
    if (modalSelects.length === 0 || !saveButton) {
        if (debugFlag) console.warn('[ui] No se pudieron encontrar los elementos para la navegación del modal.');
        return;
    }
    
    const firstSelect = modalSelects[0];
    const lastSelect = modalSelects[modalSelects.length - 1];
    
    lastSelect.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            saveButton.focus();
        }
    });

    saveButton.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            lastSelect.focus();
        }
    });

    firstSelect.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            saveButton.focus();
        }
    });

    saveButton.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            firstSelect.focus();
        }
    });
}


export function initUI(onPlaybackEndCallback) {
    const btnPlayPause = document.getElementById('btnPlayPause');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnRestart = document.getElementById('btnRestart');
    const btnConfig = document.getElementById('config-btn');

    if (!btnPlayPause || !btnPrev || !btnNext || !btnRestart || !btnConfig) {
        console.warn('[ui] Faltan botones de control en el DOM.');
        return;
    }
    
    updateButtons();
    
    setupKeyboardNavigation();

    btnPlayPause.onclick = () => {
        if (debugFlag) console.log('[ui] ⏯️ Click Play&Pause');
        domTTS.togglePlayPause(onPhraseStart, onPlaybackEndCallback);
        updateButtons();
    };

    btnPrev.onclick = () => {
        if (debugFlag) console.log('[ui] ⏪ Click Prev');
        domTTS.prevPhrase();
        onPhraseStart(domTTS.getCurrentIndex());
        updateButtons();
    };

    btnNext.onclick = () => {
        if (debugFlag) console.log('[ui] ⏩ Click Next');
        domTTS.nextPhrase();
        onPhraseStart(domTTS.getCurrentIndex());
        updateButtons();
    };

    btnRestart.onclick = () => {
        if (debugFlag) console.log('[ui] ⏮️ Click Restart');
        domTTS.resetPlayback();
        onPhraseStart(domTTS.getCurrentIndex());
        updateButtons();
    };
    
    if (debugFlag) console.log('[ui] 👂 Configurando el listener de clic para el botón de configuración.');
    btnConfig.addEventListener('click', showConfigMenu);
    document.getElementById('save-config-btn').addEventListener('click', saveVoicePreferences);

    const modalMenu = document.getElementById('voice-config-menu');

    modalMenu.addEventListener('click', (event) => {
        if (event.target.id === 'voice-config-menu') {
            hideConfigMenu();
        }
    });
    
    setupModalKeyboardNavigation();
}