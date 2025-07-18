const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const alsoFlex = document.getElementById("alsoFlex");

const newEl = document.createElement("div");
newEl.classList.add("newEl");

const highScore = document.createElement("div");
highScore.classList.add("newEl");

const reset = document.createElement("button");
reset.classList.add("newEl")

let i = 0;
let temp = 0;

if (localStorage.getItem("myHighscore") === null || Infinity) {
  temp = 0;
} else {
  temp = parseInt(localStorage.getItem("myHighscore"));
}

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

      quoteInputElement.setAttribute("maxlength", index + 2);
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;

      quoteInputElement.setAttribute("maxlength", index = 1);
    }
  });

  if (correct) {
    grossWPM = Math.round(i / 5 / (timerElement.innerText / 60));

    highScore.innerText = "Highscore: " + temp;
    alsoFlex.appendChild(highScore);

    if (temp < grossWPM) {
      highScore.innerText = "Highscore: " + grossWPM;
      // alsoFlex.appendChild(highScore);
      temp = grossWPM;
      localStorage.setItem("myHighscore", temp.toString());
    }

    // console.log("Gross WPM:", grossWPM);

    newEl.innerText = "Gross WPM: " + grossWPM;
    alsoFlex.appendChild(newEl);

    reset.innerText = "Reset Highscore"
    alsoFlex.appendChild(reset)
    reset.addEventListener("click", ()=>{
      localStorage.setItem("myHighscore", "0")
      highScore.innerText = "Highscore: " + localStorage.getItem("myHighscore");
    });

    renderNextQuote();
  }
});

function getRandomQuote() {
  // return fetch(RANDOM_QUOTE_API_URL)
  $.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/quotes',
    headers: { 'X-Api-Key': 'TWix4JwG0yE6OCqkwMcjzg==SdvTU6eojjdpf5p0'},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderNextQuote() {
  i = 0;

  const quote = await getRandomQuote();
  // console.log(quote);
  quoteDisplayElement.innerHTML = "";
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  // word = quote.split(" ").length
  quoteInputElement.value = null;
}

let startTime;
function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return i === 0
    ? timerElement.innerText
    : Math.floor((new Date() - startTime) / 1000);
}

renderNextQuote();
