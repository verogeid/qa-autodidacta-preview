// parser.js
const debugFlag = true;

export function parseMarkdown(text) {
  if (!text) return [];

  let defaultVoice = '4';
  const phrases = [];
  let speakableCounter = 0;

  const blocks = splitIntoBlocks(text);

  for (const block of blocks) {
    if (block.trim() === '{es}') {
      defaultVoice = '4';
      continue;
    }
    if (block.trim() === '{en}') {
      defaultVoice = '5';
      continue;
    }

    const { voice, content } = extractVoiceAndContent(block, defaultVoice);
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // ✅ Detectar línea que sea solo una pausa
      if (/^\[(short pause|pause|long pause)\]$/i.test(trimmed)) {
        const pauseMap = {
          'short pause': 200,
          'pause': 400,
          'long pause': 800,
        };

        const label = trimmed.toLowerCase().replace(/\[|\]/g, '');

        phrases.push({
          textDisplay: '<span class="phrase"></span>',
          textSpeech: null,
          voice,
          lang: voice === '5' ? 'en' : 'es',
          pauseMs: pauseMap[label] || 400,
          silent: true,
        });
        continue;
      }

      if (!trimmed) {
        phrases.push({
          textDisplay: '\n',
          textSpeech: null,
          voice,
          lang: voice === '5' ? 'en' : 'es',
          pauseMs: 0,
          silent: true,
        });
        continue;
      }

      const isList = isListItem(line);
      const endsWithDoubleSpace = /\s\s$/.test(line);
      const fragments = splitLineIntoFragments(line);

      for (const { text, pauseMs, silent = false } of fragments) {
        if (!text.trim() && !silent) continue;

        const phrase = {
          textDisplay: formatDisplay(text, isList),
          textSpeech: silent ? null : text,
          voice,
          lang: voice === '5' ? 'en' : 'es',
          pauseMs,
          silent,
        };

        if (!silent && text) {
          phrase.speakableIndex = speakableCounter++;
        }

        phrases.push(phrase);
      }

      if (endsWithDoubleSpace) {
        phrases.push({
          textDisplay: '\n',
          textSpeech: null,
          voice,
          lang: voice === '5' ? 'en' : 'es',
          pauseMs: 0,
          silent: true,
        });
      }
    }
  }

  return phrases;
}



function splitIntoBlocks(text) {
  return text.split(/(?=\{(?:\d)(?:\([^)]*\))?:)/g);
}

function extractVoiceAndContent(block, defaultVoice) {
  const voiceMatch = block.match(/^\{(\d)(?:\([^)]*\))?:/);
  if (voiceMatch) {
    const voice = voiceMatch[1];
    const content = block.replace(/^\{\d(?:\([^)]*\))?:/, '').replace(/\}$/, '');
    return { voice, content };
  }
  return { voice: defaultVoice, content: block };
}

function splitLineIntoFragments(line) {
  const pauseRegex = /\[(short pause|pause|long pause)\]/gi;
  const pauseMap = {
    'short pause': 200,
    'pause': 400,
    'long pause': 800,
  };

  const fragments = [];
  let lastIndex = 0;
  let match;

  while ((match = pauseRegex.exec(line)) !== null) {
    const text = line.slice(lastIndex, match.index);
    if (text.trim()) {
      fragments.push({ text: text.trim(), pauseMs: 400 });
    }

    const pauseLabel = match[1].toLowerCase();
    fragments.push({ text: '', pauseMs: pauseMap[pauseLabel] || 400, silent: true });

    lastIndex = pauseRegex.lastIndex;
  }

  const remaining = line.slice(lastIndex);
  if (remaining.trim()) {
    fragments.push({ text: remaining.trim(), pauseMs: 400 });
  }

  return fragments;
}

function formatDisplay(text) {
  if (text === '<br>') return '<br>';

  const tempDiv = document.createElement('div');
  tempDiv.textContent = text;
  let escaped = tempDiv.innerHTML;

  // Formato combinado
  escaped = escaped
    .replace(/\*\*\*(.+?)\*\*\*/g, '<b><i>$1</i></b>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
    .replace(/__(.+?)__/g, '<u>$1</u>');

  // Detectar listas enumeradas
  const listMatch = escaped.match(/^(([a-zA-Z]|\d+)[\.\)]\s+)(.+)$/);
  if (listMatch) {
    const marker = listMatch[1];
    const content = listMatch[3];
    return `<span class="phrase" data-type="list-item-enum">${marker}${content}</span>`;
  }

  // Detectar listas con guion o asterisco
  const bulletMatch = escaped.match(/^([-*]\s+)(.+)$/);
  if (bulletMatch) {
    const marker = bulletMatch[1];
    const content = bulletMatch[2];
    return `<span class="phrase" data-type="list-item-bullet">${marker}${content}</span>`;
  }

  return `<span class="phrase" data-type="text">${escaped}</span>`;
}

function isListItem(line) {
  return /^(\s*[-*] |\s*\d+\.\s)/.test(line);
}
