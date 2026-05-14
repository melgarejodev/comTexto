const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const charCounter = document.getElementById('charCounter');

const translateBtn = document.getElementById('translateBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const coffeeBtn = document.getElementById('coffeeBtn');

const modeButtons = document.querySelectorAll('.mode-btn');
const exampleButtons = document.querySelectorAll('.example-btn');

const MAX_LENGTH_TEXT = 500;
const MIN_LENGTH_TEXT = 8;

// const API_URL = 'http://localhost:8080/translate';
const API_URL = 'https://dialetus-api.up.railway.app/translate';

let selectedMode = 'corporatives';

function updateCharCounter() {
  const currentLength = inputText.value.length;
  charCounter.textContent = `${currentLength}/500`;
}

function normalizeText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function setSelectedMode(mode) {
  selectedMode = mode;

  modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === mode;

    button.classList.toggle('active', isActive);
    button.classList.toggle('btn-dark', isActive);
    button.classList.toggle('btn-outline-dark', !isActive);
  });
}

function validateInput(text) {
  if (!text) {
    alert('Digite algum texto para traduzir.');
    return false;
  }

  if (text.length < MIN_LENGTH_TEXT) {
    alert(`Digite pelo menos ${MIN_LENGTH_TEXT} caracteres.`);
    return false;
  }

  if (text.length > MAX_LENGTH_TEXT) {
    alert(`O limite é de ${MAX_LENGTH_TEXT} caracteres.`);
    return false;
  }

  return true;
}

async function translateText() {
  const normalizedText = normalizeText(inputText.value);

  if (!validateInput(normalizedText)) {
    return;
  }

  translateBtn.disabled = true;
  translateBtn.textContent = 'Traduzindo...';
  outputText.value = '';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: normalizedText,
        mode: selectedMode
      })
    });

    if (response.status === 429) {
      throw new Error("Calma, dedo nervoso. Muitas traduções em pouco tempo.");
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Não consegui traduzir agora. Tente de novo.');
    }

    outputText.value = data.translatedText;
  } catch (error) {
    result.value = error.message;
    alert(error.message || 'Erro inesperado ao traduzir.');
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = 'Traduzir';
  }
}

function copyResult() {
  const result = outputText.value;

  if (!result) {
    alert('Nada para copiar ainda.');
    return;
  }

  navigator.clipboard.writeText(result)
    .then(() => {
      copyBtn.textContent = 'Copiado!';
      setTimeout(() => {
        copyBtn.textContent = 'Copiar';
      }, 1200);
    })
    .catch(() => {
      alert('N�o consegui copiar automaticamente.');
    });
}

function clearAll() {
  inputText.value = '';
  outputText.value = '';
  updateCharCounter();
  inputText.focus();
}

function loadExample(exampleText) {
  inputText.value = exampleText;
  updateCharCounter();
  inputText.focus();
}

function handleCoffeeClick() {
  alert('Aqui depois entra o link do caf� ?');
}

inputText.addEventListener('input', updateCharCounter);

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setSelectedMode(button.dataset.mode);
  });
});

translateBtn.addEventListener('click', translateText);
copyBtn.addEventListener('click', copyResult);
clearBtn.addEventListener('click', clearAll);
coffeeBtn.addEventListener('click', handleCoffeeClick);

exampleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    loadExample(button.textContent.trim());
  });
});

setSelectedMode(selectedMode);
updateCharCounter();