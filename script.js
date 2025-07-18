const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const alsoFlex = document.getElementById("alsoFlex");

// Create highscore display, WPM display, and reset button once
const highScore = document.createElement("div");
const newEl = document.createElement("div");
const reset = document.createElement("button");

highScore.classList.add("newEl");
newEl.classList.add("newEl");
reset.classList.add("newEl");

let temp = parseInt(localStorage.getItem("myHighscore")) || 0;
highScore.innerText = "Highscore: " + temp;
reset.innerText = "Reset Highscore";

// Append once at start
alsoFlex.appendChild(highScore);
alsoFlex.appendChild(newEl);
alsoFlex.appendChild(reset);

reset.addEventListener("click", () => {
  localStorage.setItem("myHighscore", "0");
  temp = 0;
  highScore.innerText = "Highscore: 0";
  newEl.innerText = "Gross WPM: 0";
});

let i = 0;
let timerInterval;
let startTime;

// Typing input listener
quoteInputElement.addEventListener("input", () => {
  i += 1;
  if (i === 1) {
    startTimer();
  }

  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");

  let correct = true;

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  if (correct) {
    const timeInSeconds = parseInt(timerElement.innerText);
    const grossWPM = timeInSeconds > 0 ? Math.round(i / 5 / (timeInSeconds / 60)) : 0;

    newEl.innerText = "Gross WPM: " + grossWPM;

    if (grossWPM > temp) {
      temp = grossWPM;
      highScore.innerText = "Highscore: " + temp;
      localStorage.setItem("myHighscore", temp.toString());
    }

    clearInterval(timerInterval);
    renderNextQuote();
  }
});

// Fetch a random quote (returns Promise<string>)
function getRandomQuote() {
  return fetch('https://api.api-ninjas.com/v1/quotes', {
    method: 'GET',
    headers: { 'X-Api-Key': 'TWix4JwG0yE6OCqkwMcjzg==SdvTU6eojjdpf5p0' }
  })
    .then(response => response.json())
    .then(data => data[0].quote)
    .catch(error => {
      console.error('Error:', error);
      return "Failed to fetch quote. Try again.";  // Fallback quote
    });
}

// Display a new quote
async function renderNextQuote() {
  i = 0;
  quoteInputElement.value = "";
  timerElement.innerText = "0";
  clearInterval(timerInterval);

  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = "";

  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
}

// Timer functions
function startTimer() {
  clearInterval(timerInterval);
  timerElement.innerText = 0;
  startTime = new Date();
  timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

// Start the first quote
renderNextQuote();
