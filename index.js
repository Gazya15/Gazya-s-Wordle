let gameStatus = false;
let random;
let row = 1;
let guesses = 0;
let score = 0;
let num = 6;
const another = document.querySelector(".try");
const start = document.querySelector(".start");
const inputs = document.querySelectorAll(".row");
const final = document.querySelectorAll(".letter");

another.addEventListener("click", restart);
start.addEventListener("click", Start);
final.forEach(function (btn) {
  btn.addEventListener("keyup", cc);
});

if (!gameStatus) {
  another.style.display = "none";
}

function cc(e) {
  if (e.key === "Enter") {
    game();
    const input = document.querySelector(`.row${row - 1}.l1`);
    input.disabled = false;
    input.focus();
  }
  e.preventDefault();
}

function enable(row) {
  const inputs = document.querySelectorAll(`.row${row}`);
  inputs.forEach(function (input) {
    input.disabled = false;
  });
}

function Start() {
  enable(row);
  row++;
  generate();
  start.style.display = "none";
  another.style.display = "inline-block";
}

async function generate() {
  // const first = await fetch(
  //   `https://random-word-api.herokuapp.com/word?length=5`
  // );
  // const second = await first.json;
  // console.log(first);

  fetch(`https://random-word-api.herokuapp.com/word?length=5`)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      random = data[0];
      console.log(random);
    });
}

function game() {
  let word = getWord();

  if (word.length == 5) {
    guesses += 1;
    disable();
    if (word == random) {
      document.querySelector(".winner").style.display = "block";
      compare(word, random);
      score++;
      disable();
      showModal();
    } else {
      if (guesses >= 6) {
        compare(word, random);
        enable(row);
        row++;
        document.querySelector(".loser").style.display = "block";
        showModal();
      } else {
        loser();
        compare(word, random);
        enable(row);
        row++;
      }
    }
  } else {
    console.log("what?");
  }
}

function getWord() {
  let word = "";
  const inputs = document.querySelectorAll(`.row${row - 1}`);
  inputs.forEach(function (input) {
    word += input.value;
  });
  return word;
}

function disable() {
  const inputs = document.querySelectorAll(`.row${row - 1}`);
  inputs.forEach(function (input) {
    input.disabled = true;
  });
}

function letterChange(i, color) {
  const state = document.querySelectorAll(`.row${row - 1}`);
  state.forEach(function (row) {
    if (row.classList.contains(`l${i}`)) {
      row.style.color = `#${color}`;
    }
  });
}

function compare(word, rand) {
  let Found = false;
  let message = "";
  for (let i = 0; i < 5; i++) {
    Found = false;
    message = "";
    for (let j = 0; j < 5; j++) {
      if (word[i].toLowerCase() == rand[j].toLowerCase() && i == j) {
        Found = true;
        message = "00A300";
        break;
      } else if (word[i].toLowerCase() == rand[j].toLowerCase() && i != j) {
        message = "F0E68C";
        Found = true;
      }
    }
    if (!Found) {
      letterChange(i + 1, "ff2e2e");
    } else {
      letterChange(i + 1, message);
    }
  }
}

function restart() {
  window.top.location = window.top.location;
  Start();
}

function loser() {
  if (guesses > 3) {
    document.querySelector(".tloser").style.display = "block";
    setTimeout(change, 1500);
  }
}

function change() {
  document.querySelector(".tloser").style.display = "none";
}

Start();

function showModal() {
  editModal();
  $("#exampleModal").modal("show");
}

function editModal() {
  const answer = document.createElement("div.answer");
  const part = document.createElement("h3");
  const wword = random;
  part.textContent = `The word is ${random.toUpperCase()}`;
  answer.appendChild(part);
  const modal = document.querySelector(".modal-body");
  const title = document.querySelector("h4");
  modal.insertBefore(answer, title);
}

$("input").keyup(function (e) {
  if (e.key === "Backspace") {
    e.target.parentElement.previousElementSibling.children[0].focus();
  } else {
    e.target.parentElement.nextElementSibling.children[0].focus();
  }
});
