const nextBtn = document.querySelector("#nextBtn");
const ansOptions = document.querySelector("#ansOptions");
const correctSpan = document.querySelector("#correct");
const wrongSpan = document.querySelector("#wrong");
const ansOp1 = document.querySelector("#ansOp1");
const ansOp2 = document.querySelector("#ansOp2");
const ansOp3 = document.querySelector("#ansOp3");
const ansOp4 = document.querySelector("#ansOp4");
const noQuestionSpan = document.querySelector("#noQuestion");
const nextDogBtn = document.querySelector("#nextDogBtn");
const progressBarFull = document.querySelector("#progressBarFull");
const documentBody = document.querySelector("body");

const prevDogs = [];
let correct = 0;
let wrong = 0;
let dogCount = 0;
let dog = {};
const answersArray = [ansOp1, ansOp2, ansOp3, ansOp4];
let correctOpt = 1;
let haveClicked = false;

ansOp1.addEventListener("click", checkResult);
ansOp2.addEventListener("click", checkResult);
ansOp3.addEventListener("click", checkResult);
ansOp4.addEventListener("click", checkResult);
nextDogBtn.addEventListener("click", nextDog);

const fetchData = async (searchTerm) => {
  try {
    const response = await axios.get(
      "https://api.thedogapi.com/v1/breeds/search?",
      {
        params: {
          q: searchTerm,
        },
      }
    );
    return response.data[0];
  } catch (error) {
    console.log(error);
  }
};

async function nextDog() {
  let randIndex = Math.floor(Math.random() * dogBreeds.length);
  while (prevDogs.some((idx) => idx === randIndex)) {
    randIndex = Math.floor(Math.random() * dogBreeds.length);
    console.log(randIndex);
  }
  prevDogs.push(randIndex);
  dog = await fetchData(dogBreeds[randIndex]);
  
  console.log(dog);

  haveClicked = false;
  dogCount++;
  nextDogBtn.classList.add("hidden");
  progressBarFull.style.width = `${(dogCount / 20) * 100}%`;
  noQuestionSpan.innerText = dogCount;

  ansOp1.style.backgroundColor = "";
  ansOp2.style.backgroundColor = "";
  ansOp3.style.backgroundColor = "";
  ansOp4.style.backgroundColor = "";

  answersArray[correctOpt].classList.remove("correctAnswer");
  answersArray[correctOpt].innerText = "";

  const correctAnswer = (opt) => opt === dog.name;
  document.getElementById(
    "dogImg"
  ).src = `https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`;

  const answerArray = [];
  answerArray.push(dogBreeds[Math.floor(Math.random() * dogBreeds.length)]);
  answerArray.push(dogBreeds[Math.floor(Math.random() * dogBreeds.length)]);
  answerArray.push(dogBreeds[Math.floor(Math.random() * dogBreeds.length)]);
  answerArray.push(dogBreeds[randIndex]);
  console.log(answerArray);
  shuffle(answerArray);

  ansOp1.innerText = answerArray[0];
  ansOp2.innerText = answerArray[1];
  ansOp3.innerText = answerArray[2];
  ansOp4.innerText = answerArray[3];

  correctOpt = answerArray.findIndex(correctAnswer);
}

function checkResult(e) {
  if (haveClicked === true) return;
  haveClicked = true;

  nextDogBtn.classList.remove("hidden");

  if (this.innerText === dog.name) {
    correct++;
    correctSpan.innerText = correct;

    this.classList.add("correctAnswer");
    this.innerHTML = `${dog.name}   &#10004`;
  } else {
    wrong++;
    wrongSpan.innerText = wrong;

    this.style.backgroundColor = "hsl(294, 100%, 87%)";
    answersArray[correctOpt].classList.add("correctAnswer");
    answersArray[correctOpt].innerHTML = `${dog.name}  &#10004`;
  }
  if (dogCount === 20) {
    return endGame();
  }
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function endGame() {
  while (documentBody.firstChild) {
    documentBody.removeChild(documentBody.lastChild);
  }
  const div = document.createElement("div");
  div.innerHTML = `
            <h1 id="">End of game</h1>
            <h2 id="gameFinished">You guessed ${correct} correct answers out of 20!</h2>
            <a class="btn gameAgainBtn" href="/Dog-Breeds-Quiz/index.html">Play Again</a>
        `;
  documentBody.classList.add("centerBody");
  documentBody.appendChild(div);
}

nextDog();
