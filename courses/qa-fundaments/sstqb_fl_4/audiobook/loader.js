// loader.js
const debugFlag = false;

export async function loadVoices() {
  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
    } else {
      // Esperar evento voiceschanged para cargar voces si no están listas
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
}

export async function loadFileList(filePath) {
  try {
    if (debugFlag) console.log(`filePath: ${filePath}`);

    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Error al cargar ${filePath}: ${res.status}`);
    const text = await res.text();

    if (debugFlag) console.log(`filePath text: ${text}`);

    return text.split('\n').filter(line => line.trim());
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function loadMarkdownText(filename, baseURL = import.meta.url) {
  try {
    const fullPath = new URL(filename, baseURL).href;
    const res = await fetch(fullPath);

    if (!res.ok) throw new Error(`Error cargando archivo: ${res.statusText}`);

    const text = await res.text();

    if (debugFlag) console.log(`Cargando...: ${text}`);

    return text;
  } catch (e) {
    console.error(e);
    return '';
  }
}