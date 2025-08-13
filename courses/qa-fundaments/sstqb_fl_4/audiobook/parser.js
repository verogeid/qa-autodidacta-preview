// parser.js
const debugFlag = false;

let configData = {};

export function setConfig(newConfig) {
    if (debugFlag) console.log('[parser] ⚙️ Configuración del parser actualizada.');
    configData = newConfig;
}

const voiceMap = {
    '1': 'voice-1',
    '2': 'voice-2',
    '3': 'voice-3',
    '4': 'voice-4',
    '5': 'voice-5'
};

const defaultVoiceRoles = {
    'es': 'voice-4',
    'en': 'voice-5'
};

function stripMarkdown(text) {
    return text.replace(/\*\*\*(.+?)\*\*\*/g, '$1')
                .replace(/\*\*(.+?)\*\*/g, '$1')
                .replace(/\*(.+?)\*/g, '$1');
}

export function parseMarkdown(text) {
    if (!text) return [];
    
    if (Object.keys(configData).length === 0) {
        console.error('[parser] ❌ Error: La configuración no se ha cargado. Llamar a setConfig() primero.');
        return [];
    }

    let currentLang = 'es';
    const htmlPhrases = [];
    let phraseIndex = 0;
    
    let currentParagraphHtml = '';
    
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (debugFlag) console.log(`\n[parser] --- Procesando línea ${i + 1}: "${line}" ---`);

        const trimmedLine = line.trim();
        const isBlankLine = trimmedLine === '';
        const isSeparator = trimmedLine === '---';

        if (isBlankLine || isSeparator) {
            if (currentParagraphHtml) {
                htmlPhrases.push(`<p>${currentParagraphHtml}</p>`);
                currentParagraphHtml = '';
                if (debugFlag) console.log('[parser] [Detección de párrafo] Línea vacía o separador. Se cierra el párrafo anterior.');
            }
            if (isSeparator) {
                htmlPhrases.push('<hr>');
                if (debugFlag) console.log('[parser] [Detección de separador] Se añade un separador <hr>.');
            }
            continue;
        }

        const langPattern = /^\{(es|en)\}$/;
        const langMatch = trimmedLine.match(langPattern);
        if (langMatch) {
            currentLang = langMatch[1];
            if (debugFlag) console.log(`[parser] [Detección de idioma] Nuevo idioma por defecto: ${currentLang}`);
            continue;
        }

        let contentToProcess = trimmedLine;
        let role = null;
        let specialTagHtml = '';
        let isCharacterSpeech = false;
        let dataSpeech = '';
        
        const voicePattern = /\{([1-5])(?:\(([^)]+)\))?:\s*(.+)\}/;
        const voiceMatch = trimmedLine.match(voicePattern);

        if (voiceMatch) {
            const voiceNumber = voiceMatch[1];
            const tag = voiceMatch[2];
            let content = voiceMatch[3].trim();
            
            if (debugFlag) {
                console.log(`[parser] [Paso 1: Voz Detectada] trimmedLine: "${trimmedLine}"`);
                console.log(`[parser] [Paso 1: Voz Detectada] voiceMatch: ${JSON.stringify(voiceMatch)}`);
                console.log(`[parser] [Paso 1: Voz Detectada] Contenido crudo extraído (voiceMatch[3]): "${content}"`);
            }
            
            const verbalizationPattern = /^(.*?)\s*\{(.+?)\}$/;
            const verbalizationMatch = content.match(verbalizationPattern);

            if (verbalizationMatch) {
                contentToProcess = verbalizationMatch[1].trim();
                const textToSpeak = verbalizationMatch[2].trim();
                dataSpeech = ` data-speech="${textToSpeak}"`;
                if (debugFlag) console.log(`[parser] [Paso 2: Verbalización] Detectada. Mostrar: "${contentToProcess}", Leer: "${textToSpeak}"`);
            } else {
                contentToProcess = content;
                if (debugFlag) console.log(`[parser] [Paso 2: Verbalización] No detectada. Usando: "${contentToProcess}"`);
            }
            
            role = voiceMap[voiceNumber];
            specialTagHtml = tag ? `${tag}: ` : '';
            isCharacterSpeech = true;
        } else {
            contentToProcess = trimmedLine;
            if (debugFlag) console.log('[parser] [Paso 1: Sin Voz] No se detectó un rol de voz.');
        }

        if (currentParagraphHtml) {
            currentParagraphHtml += '<br>';
        }

        const fragments = splitLineIntoFragments(contentToProcess);
        if (debugFlag) console.log(`[parser] [Paso 3: Fragmentación] Se ha dividido la línea en ${fragments.length} fragmentos.`);
        if (debugFlag) console.log(`[parser] [Paso 3: Fragmentación] Contenido de los fragmentos: ${JSON.stringify(fragments)}`);

        for (const fragment of fragments) {
            if (fragment.silent) {
                currentParagraphHtml += `<span class="phrase" data-index="${phraseIndex}" data-pause-ms="${fragment.pauseMs}"></span>`;
                if (debugFlag) console.log(`[parser] [Paso 4: Generando HTML] Fragmento silencioso (${fragment.pauseMs}ms) para el index ${phraseIndex}.`);
            } else {
                const fragmentRole = role || defaultVoiceRoles[currentLang];
                let fragmentTextToShow = fragment.text;
                
                let dataPitch = '';
                const unformattedText = stripMarkdown(fragmentTextToShow).trim();

                if (unformattedText.startsWith('¡') && unformattedText.endsWith('!')) {
                    dataPitch = ` data-pitch="${configData.pitchEntonacion.exclamacion}"`;
                } else if (unformattedText.startsWith('¿') && unformattedText.endsWith('?')) {
                    dataPitch = ` data-pitch="${configData.pitchEntonacion.pregunta}"`;
                }

                let textWithFormat = formatDisplay(fragmentTextToShow);
                
                if (isCharacterSpeech) {
                    textWithFormat = `<i>${textWithFormat}</i>`;
                }
                
                const finalDataSpeech = (dataSpeech && fragment === fragments[0]) ? dataSpeech : '';
                
                const finalHtml = `${specialTagHtml}<span class="phrase" data-index="${phraseIndex}" data-role="${fragmentRole}" data-lang="${currentLang}"${dataPitch}${finalDataSpeech}>${textWithFormat}</span>`;
                currentParagraphHtml += finalHtml;
                if (debugFlag) console.log(`[parser] [Paso 4: Generando HTML] HTML final para el index ${phraseIndex}: "${finalHtml}"`);
                specialTagHtml = '';
            }
            phraseIndex++;
        }
    }

    if (currentParagraphHtml) {
        htmlPhrases.push(`<p>${currentParagraphHtml}</p>`);
        if (debugFlag) console.log('[parser] [Final del documento] Se cierra el último párrafo.');
    }
    
    return htmlPhrases;
}

function splitLineIntoFragments(line) {
    const pauseRegex = /\[(short pause|pause|long pause)\]/gi;

    const fragments = [];
    let lastIndex = 0;
    let match;

    while ((match = pauseRegex.exec(line)) !== null) {
        const text = line.slice(lastIndex, match.index);
        if (text.trim()) {
            fragments.push({ text: text.trim() });
        }
        const pauseLabel = match[1].toLowerCase();

        fragments.push({ text: '', pauseMs: configData.pauseMap[pauseLabel] || 400, silent: true });
        lastIndex = pauseRegex.lastIndex;
    }

    const remaining = line.slice(lastIndex);
    if (remaining.trim()) {
        fragments.push({ text: remaining.trim() });
    }

    return fragments;
}

function formatDisplay(text) {
    let escaped = text.replace(/\*\*\*(.+?)\*\*\*/g, '<b><i>$1</i></b>')
        .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.+?)\*/g, '<i>$1</i>');
    return escaped;
}
