// DOM Elements
const timerDisplay = document.getElementById('timer-display');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const setTimeButton = document.getElementById('set-time');
const startPauseButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const toggleThemeButton = document.getElementById('toggle-theme');

let intervalId = null;
let isRunning = false;
let totalSeconds = 0;

// Inicializar display del temporizador
function updateTimerDisplay(time) {
  const pad = (num) => String(num).padStart(2, '0');
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Iniciar o pausar el temporizador
function startTimer() {
  if (!isRunning) {
    if (totalSeconds <= 0) {
      alert("Por favor, configura un tiempo válido.");
      return;
    }

    isRunning = true;
    startPauseButton.textContent = '⏸ Pausar';

    intervalId = setInterval(() => {
      totalSeconds--;
      updateTimerDisplay(totalSeconds);

      if (totalSeconds <= 0) {
        clearInterval(intervalId);
        playAudio();
        startPauseButton.textContent = '▶️ Iniciar';
        isRunning = false;
      }
    }, 1000);
  } else {
    isRunning = false;
    clearInterval(intervalId);
    startPauseButton.textContent = '▶️ Iniciar';
  }
}

// Reiniciar el temporizador
function resetTimer() {
  clearInterval(intervalId);
  isRunning = false;
  totalSeconds = 0;
  updateTimerDisplay(totalSeconds);
  startPauseButton.textContent = '▶️ Iniciar';
}

// Configurar tiempo personalizado
function setCustomTime() {
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;

  totalSeconds = hours * 3600 + minutes * 60 + seconds;
  updateTimerDisplay(totalSeconds);
}

// Reproducir sonido cuando termina el tiempo
function playAudio() {
  const audio = new Audio('assets/sounds/notification.mp3'); // Asegúrate de tener este archivo
  audio.play().catch(err => console.warn("No se pudo reproducir el sonido:", err));
}

// Manejo del tema claro/oscuro
let isDarkMode = false;

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  toggleThemeButton.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i> Modo Claro' : '<i class="fas fa-moon"></i> Modo Oscuro';
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Cargar preferencia guardada del tema
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('darkMode');

  if (savedTheme === 'enabled') {
    isDarkMode = true;
    document.body.classList.add('dark-mode');
    toggleThemeButton.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
  } else if (savedTheme === 'disabled') {
    isDarkMode = false;
    toggleThemeButton.innerHTML = '<i class="fas fa-moon"></i> Modo Oscuro';
  } else {
    // Usar preferencia del sistema si no hay una guardada
    isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      toggleThemeButton.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
    } else {
      toggleThemeButton.innerHTML = '<i class="fas fa-moon"></i> Modo Oscuro';
    }
  }

  // Enfocar automáticamente minutos al cargar
  minutesInput.focus();
});

// Atajos de teclado
document.addEventListener('keydown', (event) => {
  const targetIsInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);

  if (event.key === ' ' && !targetIsInput) {
    event.preventDefault(); // Evita activar accidentalmente botones
    startTimer();
  } else if (event.key.toLowerCase() === 'r' && !targetIsInput) {
    resetTimer();
  } else if (event.key.toLowerCase() === 'm' && !targetIsInput) {
    toggleTheme();
  } else if (event.key === 'Escape' && !targetIsInput) {
    resetTimer();
  } else if (event.key === 'Enter' && targetIsInput) {
    event.preventDefault(); // Evita recargar página al usar Enter en inputs
    setCustomTime();
  }
});

// Event Listeners
setTimeButton.addEventListener('click', setCustomTime);
startPauseButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
toggleThemeButton.addEventListener('click', toggleTheme);

// Inicialización inicial
updateTimerDisplay(totalSeconds);