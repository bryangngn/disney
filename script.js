const grid = document.getElementById("grid");
const scoreEl = document.getElementById("score");
let score = 0;
let isPlaying = false; // ← bandera para controlar si ya hay una reproducción en curso

// 🎵 Lista de archivos de audio (usa nombres reales con tildes)
const fileNames = [
  "hércules",
  "encanto",
  "pesadilla_antes_de_navidad",
  "hermano_oso",
  "los_increíbles",
  "dumbo",
  "vaiana",
  "101_dálmatas",
  "el_planeta_del_tesoro",
  "la_sirenita",
  "bambi",
  "mulán",
  "la_cenicienta",
  "el_emperador_y_sus_locuras",
  "mary_poppins",
  "alicia en el país de las maravillas",
  "coco",
  "la_dama_y_el_vagabundo",
  "rompe_ralph!",
  "el_rey_león",
  "pocahontas",
  "elemental",
  "cars",
  "big_hero_6",
  "el_libro_de_la_selva",
  "tiana_y_el_sapo",
  "frozen",
  "el_jorobado_de_notre_dame",
  "la_bella_durmiente",
  "tarzán",
  "bolt",
  "brave",
  "toy_story",
  "enredados",
  "buscando_a_nemo",
  "wish",
  "aladdin",
  "los_aristogatos",
  "la_bella_y_la_bestia",
  "monstruos_sa",
  "lilo_y_stitch",
  "todd_y_toby",
  "el_viaje_de_arlo",
  "ratatouille",
  "peter_pan",
  "soul",
  "pinocho",
  "fantasía",
  "robin_hood",
  "blancanieves_y_los_7_enanitos",
];

const songs = fileNames.map((fileName, i) => ({
  id: i + 1,
  src: `audio/${fileName}.mp3`,
  title: decodeURIComponent(fileName.replace(/_/g, " ")).toUpperCase()
}));

let progress = JSON.parse(localStorage.getItem("musicaProgress")) || {
  aciertos: [],
  score: 0
};

score = progress.score;
scoreEl.textContent = `Puntuación: ${score} / ${songs.length}`;

// Modal y referencias
const answerModal = document.getElementById("answer-modal");
const answerInput = document.getElementById("answer-input");
const suggestionsBox = document.getElementById("suggestions");
const submitAnswerBtn = document.getElementById("submit-answer");
const cancelAnswerBtn = document.getElementById("cancel-answer");

let currentSong = null;
let currentButton = null;

// Mostrar modal personalizado
function openAnswerModal(song, button) {
  currentSong = song;
  currentButton = button;
  answerInput.value = "";
  suggestionsBox.innerHTML = "";
  answerModal.style.display = "flex";
  answerInput.focus();
}

// Validar respuesta sin cerrar el modal si falla
submitAnswerBtn.addEventListener("click", () => {
  if (!currentSong || !currentButton) return;

  const userAnswer = answerInput.value.toUpperCase().trim();

  if (userAnswer === currentSong.title) {
    if (!progress.aciertos.includes(currentSong.id)) {
      progress.aciertos.push(currentSong.id);
      score++;
      progress.score = score;
      localStorage.setItem("musicaProgress", JSON.stringify(progress));
    }

    currentButton.classList.remove("incorrect");
    currentButton.classList.add("correct");
    currentButton.disabled = true;
    answerModal.style.display = "none";
    scoreEl.textContent = `Puntuación: ${score} / ${songs.length}`;

    if (score === songs.length) {
      document.getElementById("victory-banner").style.display = "flex";
    }
  } else {
    currentButton.classList.add("incorrect");
    alert("Incorrecto. Puedes intentarlo de nuevo o salir.");
  }
});

// Salir del modal
cancelAnswerBtn.addEventListener("click", () => {
  answerModal.style.display = "none";
});

// Autocompletado dinámico
answerInput.addEventListener("input", () => {
  const query = answerInput.value.toUpperCase();
  suggestionsBox.innerHTML = "";

  if (query.length === 0) return;

  const matches = songs
    .map(s => s.title)
    .filter(title => title.includes(query));

  matches.forEach(title => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.textContent = title;
    div.addEventListener("click", () => {
      answerInput.value = title;
      suggestionsBox.innerHTML = "";
    });
    suggestionsBox.appendChild(div);
  });
});

// Generar cuadrícula
songs.forEach((song, i) => {
  const cell = document.createElement("div");
  cell.className = "song-cell";

  const btn = document.createElement("button");
  btn.className = "song-btn";
  btn.textContent = (i + 1).toString();

  if (progress.aciertos.includes(song.id)) {
    btn.classList.add("correct");
    btn.disabled = true;
  }

  btn.addEventListener("click", () => {
    if (btn.classList.contains("correct") || isPlaying) return;

    isPlaying = true;
    const audio = new Audio(song.src);
    audio.play();

    setTimeout(() => {
      audio.pause();
      isPlaying = false;
      openAnswerModal(song, btn);
    }, 5000);
  });

  cell.appendChild(btn);
  grid.appendChild(cell);
});

// Mostrar / ocultar soluciones
let solutionsVisible = false;
document.getElementById("toggle-solutions").addEventListener("click", () => {
  const buttons = document.querySelectorAll(".song-btn");

  buttons.forEach((btn, index) => {
    const song = songs[index];
    const existing = btn.parentNode.querySelector(".solution-text");

    if (solutionsVisible) {
      if (existing) existing.remove();
    } else {
      if (!existing) {
        const solution = document.createElement("div");
        solution.className = "solution-text";
        solution.textContent = song.title;
        btn.parentNode.appendChild(solution);
      }
    }
  });

  solutionsVisible = !solutionsVisible;
  document.getElementById("toggle-solutions").textContent = solutionsVisible
    ? "Ocultar soluciones"
    : "Mostrar soluciones";
});

// Reiniciar juego
document.getElementById("reset").addEventListener("click", () => {
  if (confirm("¿Seguro que quieres reiniciar el juego?")) {
    localStorage.removeItem("musicaProgress");
    location.reload();
  }
});

// Volver a jugar
document.getElementById("play-again").addEventListener("click", () => {
  localStorage.removeItem("musicaProgress");
  location.reload();
});

// Prevenir inspección básica
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I', 'J'].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && ['U', 'S'].includes(e.key.toUpperCase()))
  ) {
    e.preventDefault();
  }
});