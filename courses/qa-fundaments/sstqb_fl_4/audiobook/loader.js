// loader.js
const debugFlag = false;

/**
 * Carga los metadatos de un archivo Markdown y extrae el título y los archivos.
 * @param {string} filePath El camino al archivo de metadatos (lessons.md).
 * @returns {Promise<{title: string, files: Array<string>}>} Un objeto con el título y la lista de archivos.
 */
export async function loadCourseMetadata(filePath) {
  try {
    if (debugFlag) console.log(`[loader] Cargando metadatos desde: ${filePath}`);
    
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Error al cargar ${filePath}: ${res.status}`);
    const text = await res.text();

    const lines = text.split('\n').filter(line => line.trim());
    let title = '';
    
    const metadataLines = lines.filter(line => line.startsWith('title:'));
    const contentLines = lines.filter(line => !line.startsWith('title:'));

    // Extrae solo el título de los metadatos
    metadataLines.forEach(line => {
      if (line.startsWith('title:')) {
        title = line.substring('title:'.length).trim();
      }
    });
    const files = contentLines;
    
    if (debugFlag) console.log(`[loader] Título cargado: ${title}, Archivos: ${files.length}`);
    return { title, files };
  } catch (err) {
    console.error(`Error en loadCourseMetadata: ${err}`);
    return { title: '', files: [] };
  }
}

/**
 * Carga los datos de configuración desde un archivo JSON.
 * @param {string} filePath El camino al archivo de configuración (config.json).
 * @returns {Promise<Object>} El objeto de configuración completo.
 */
export async function loadConfig(filePath) {
  try {
    if (debugFlag) console.log(`[loader] Cargando configuración desde: ${filePath}`);
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Error al cargar ${filePath}: ${res.status}`);
    const config = await res.json();
    
    // ✅ CORRECCIÓN: Devolvemos el objeto de configuración completo,
    // incluyendo las propiedades pitchEntonacion y pauseMap.
    if (debugFlag) console.log('[loader] Configuración cargada:', config);
    return config;
  } catch (err) {
    console.error(`Error en loadConfig: ${err}`);
    return { languages: [], modalHeader: '', voices: [], pitchEntonacion: {}, pauseMap: {} };
  }
}

/**
 * Carga la lista de voces disponibles en el sistema.
 * @returns {Promise<SpeechSynthesisVoice[]>} Un array con las voces disponibles.
 */
export async function loadVoices() {
    return new Promise(resolve => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        speechSynthesis.onvoiceschanged = () => {
          resolve(speechSynthesis.getVoices());
        };
      }
    });
}

/**
 * Carga el texto de un archivo Markdown.
 * @param {string} filePath El camino al archivo Markdown.
 * @returns {Promise<string>} El contenido del archivo como texto plano.
 */
export async function loadMarkdownText(filePath) {
    if (debugFlag) console.log(`[loader] Cargando archivo Markdown: ${filePath}`);
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Error al cargar ${filePath}: ${res.status}`);
    return res.text();
}
