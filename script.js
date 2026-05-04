const easyPrefixes = [
  "Acute", "Chronic", "Mild", "Severe", "Primary", "Secondary",
  "Viral", "Bacterial", "Common", "Simple", "Painful", "Recurrent",
  "Sudden", "Early", "Late", "Uncomplicated", "Febrile", "Traumatic",
  "Allergic", "Inflammatory"
];

const easyTerms = [
  "Fever", "Cough", "Headache", "Migraine", "Nausea", "Vomiting",
  "Diarrhea", "Constipation", "Fatigue", "Dizziness", "Syncope",
  "Hypertension", "Hypotension", "Diabetes", "Asthma", "Pneumonia",
  "Bronchitis", "Anemia", "Fracture", "Sprain", "Burn", "Rash",
  "Infection", "Seizure", "Stroke", "Heartburn", "Dehydration",
  "Appendicitis", "Tonsillitis", "Sinusitis"
];

const mediumPrefixes = [
  "Autoimmune", "Ischemic", "Obstructive", "Restrictive", "Hemolytic",
  "Inflammatory", "Metabolic", "Endocrine", "Neurologic", "Renal",
  "Hepatic", "Pulmonary", "Cardiac", "Gastrointestinal", "Vascular",
  "Postinfectious", "Congenital", "Malignant", "Benign", "Idiopathic"
];

const mediumTerms = [
  "Ulcerative Colitis", "Crohn Disease", "Cushing Syndrome",
  "Addison Disease", "Graves Disease", "Hashimoto Thyroiditis",
  "Myasthenia Gravis", "Multiple Sclerosis", "Guillain-Barré Syndrome",
  "Rheumatoid Arthritis", "Systemic Lupus Erythematosus",
  "Scleroderma", "Pericarditis", "Endocarditis", "Myocarditis",
  "Pancreatitis", "Cholecystitis", "Pyelonephritis", "Nephrotic Syndrome",
  "Nephritic Syndrome", "Celiac Disease", "Diverticulitis",
  "Osteomyelitis", "Meningitis", "Encephalitis"
];

const hardPrefixes = [
  "Inherited", "Paraneoplastic", "Granulomatous", "Necrotizing",
  "Cholestatic", "Demyelinating", "Vasculitic", "Thrombotic",
  "Hypercoagulable", "Mitochondrial", "Lysosomal", "Peroxisomal",
  "X-linked", "Autosomal Recessive", "Autosomal Dominant",
  "Antibody-mediated", "T-cell-mediated", "Fibrosing",
  "Seronegative", "Paroxysmal"
];

const hardTerms = [
  "Pseudohypoparathyroidism", "Granulomatosis with Polyangiitis",
  "Goodpasture Syndrome", "Primary Sclerosing Cholangitis",
  "Dubin-Johnson Syndrome", "Crigler-Najjar Syndrome",
  "Hereditary Hemochromatosis", "Von Hippel-Lindau Disease",
  "Charcot-Marie-Tooth Disease", "Lambert-Eaton Syndrome",
  "Wilson Disease", "Alpha-1 Antitrypsin Deficiency",
  "Wiskott-Aldrich Syndrome", "DiGeorge Syndrome",
  "Chédiak-Higashi Syndrome", "Lesch-Nyhan Syndrome",
  "McArdle Disease", "Pompe Disease", "Tay-Sachs Disease",
  "Niemann-Pick Disease", "Gaucher Disease", "Kartagener Syndrome",
  "Ehlers-Danlos Syndrome", "Marfan Syndrome", "MEN 1"
];

const easyForbidden = [
  "Patient", "Doctor", "Pain", "Sick", "Hospital", "Medicine",
  "Body", "Symptom", "Clinic", "Treatment"
];

const mediumForbidden = [
  "Inflammation", "Autoimmune", "Antibody", "Organ", "Disease",
  "Diagnosis", "Lab", "Chronic", "Acute", "Immune"
];

const hardForbidden = [
  "Mutation", "Syndrome", "Gene", "Antibody", "Deficiency",
  "Inheritance", "Pathology", "Chromosome", "Enzyme", "Classic"
];

function makeForbiddenWords(term, backupWords) {
  let words = term
    .replace(/-/g, " ")
    .replace(/[()]/g, "")
    .split(" ")
    .filter(word => word.length > 3);

  let forbidden = [...words];

  while (forbidden.length < 4) {
    const randomWord = backupWords[Math.floor(Math.random() * backupWords.length)];

    if (!forbidden.includes(randomWord)) {
      forbidden.push(randomWord);
    }
  }

  return forbidden.slice(0, 4);
}

function generateDeck(prefixes, terms, backupForbidden, targetCount) {
  const deck = [];

  for (let i = 0; i < prefixes.length; i++) {
    for (let j = 0; j < terms.length; j++) {
      if (deck.length >= targetCount) break;

      const term = `${prefixes[i]} ${terms[j]}`;

      deck.push({
        term: term,
        forbidden: makeForbiddenWords(term, backupForbidden)
      });
    }
  }

  return deck;
}

const cards = {
  easy: generateDeck(easyPrefixes, easyTerms, easyForbidden, 300),
  medium: generateDeck(mediumPrefixes, mediumTerms, mediumForbidden, 300),
  hard: generateDeck(hardPrefixes, hardTerms, hardForbidden, 300)
};

let currentMode = "";
let currentDeck = [];
let currentIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;
let scoreSaved = false;

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");

const modeText = document.getElementById("modeText");
const scoreText = document.getElementById("scoreText");
const timerText = document.getElementById("timerText");
const termText = document.getElementById("termText");
const forbiddenWords = document.getElementById("forbiddenWords");
const finalScore = document.getElementById("finalScore");
const playerName = document.getElementById("playerName");
const startLeaderboard = document.getElementById("startLeaderboard");
const endLeaderboard = document.getElementById("endLeaderboard");

window.onload = function () {
  displayLeaderboards();
};

function startGame(mode) {
  currentMode = mode;
  currentDeck = shuffle([...cards[mode]]);
  currentIndex = 0;
  score = 0;
  timeLeft = 30;
  scoreSaved = false;

  playerName.value = "";

  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  modeText.textContent = capitalize(mode);
  scoreText.textContent = score;
  timerText.textContent = timeLeft;

  showNewWord();
  startTimer();
}

function showNewWord() {
  if (currentIndex >= currentDeck.length) {
    currentDeck = shuffle([...cards[currentMode]]);
    currentIndex = 0;
  }

  const card = currentDeck[currentIndex];

  termText.textContent = card.term;
  forbiddenWords.innerHTML = "";

  card.forbidden.forEach(word => {
    const span = document.createElement("span");
    span.className = "forbidden-word";
    span.textContent = word;
    forbiddenWords.appendChild(span);
  });
}

function correctAnswer() {
  score++;
  scoreText.textContent = score;

  currentIndex++;
  showNewWord();
}

function skipWord() {
  currentIndex++;
  showNewWord();
}

function startTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;
    timerText.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timer);

  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  finalScore.textContent = score;
  displayLeaderboards();
}

function saveHighScore() {
  if (scoreSaved) {
    alert("Score already saved for this round!");
    return;
  }

  let name = playerName.value.trim();

  if (name === "") {
    name = "Anonymous";
  }

  const newScore = {
    name: name,
    score: score,
    mode: capitalize(currentMode),
    date: new Date().toLocaleDateString()
  };

  let highScores = JSON.parse(localStorage.getItem("medicalSayLessHighScores")) || [];

  highScores.push(newScore);

  highScores.sort((a, b) => b.score - a.score);

  highScores = highScores.slice(0, 10);

  localStorage.setItem("medicalSayLessHighScores", JSON.stringify(highScores));

  scoreSaved = true;

  displayLeaderboards();
}

function displayLeaderboards() {
  const highScores = JSON.parse(localStorage.getItem("medicalSayLessHighScores")) || [];

  startLeaderboard.innerHTML = "";
  endLeaderboard.innerHTML = "";

  if (highScores.length === 0) {
    startLeaderboard.innerHTML = "<li>No scores yet. Be the first!</li>";
    endLeaderboard.innerHTML = "<li>No scores yet. Be the first!</li>";
    return;
  }

  highScores.forEach(entry => {
    const liStart = document.createElement("li");
    liStart.textContent = `${entry.name} — ${entry.score} points — ${entry.mode}`;

    const liEnd = document.createElement("li");
    liEnd.textContent = `${entry.name} — ${entry.score} points — ${entry.mode}`;

    startLeaderboard.appendChild(liStart);
    endLeaderboard.appendChild(liEnd);
  });
}

function resetGame() {
  endScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");

  score = 0;
  timeLeft = 30;
  currentIndex = 0;

  displayLeaderboards();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}