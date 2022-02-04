const memoryContainer = document.getElementById('memory-container');
const scoreContainer = document.getElementById('score-container');
const missContainer = document.getElementById('miss-container');

const CARD_NUMBER = 16

var card_array = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];

let isClicked = false;
let firstCard;
let secondCard;
let blockBoard = false
let score = 0;
let miss = 0;

// Chargement du jeu
window.onload = function() {
    shuffle();
};

// Shuffle Cards
function shuffle() {
    card_array = card_array.sort(()=> Math.random() - 0.5);
    for (let i = 0; i < CARD_NUMBER; i++) {
        const initCard = document.createElement('div');
        initCard.classList.add('card');
        initCard.innerHTML = "<p class='hidden'>" + card_array[i] + "</p>";
        memoryContainer.appendChild(initCard);
        initCard.addEventListener('click', memory);
    }
};

// Reset Game
function resetGame() {
    memoryContainer.innerHTML = "";
    [isClicked, blockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
    [score, miss] = [0, 0];
    scoreContainer.innerHTML = "Score : 0";
    missContainer.innerHTML = "Miss : 0";
    shuffle();
};

// Memory Card Game
function memory() {
    // Block les click sur plateau de jeu
    if (blockBoard) return;
    // Empeche de cliquer 2x sur la même carte
    if (this === firstCard) return;

    // First click
    if (!isClicked) {
        isClicked = true;
        firstCard = this;
        this.children[0].classList="";
    }
    // Second click
    else {
        isClicked = false;
        secondCard = this;
        this.children[0].classList="";

        // Carte pareil
        if (firstCard.children[0].innerHTML === secondCard.children[0].innerHTML) {
            firstCard.removeEventListener('click', memory);
            secondCard.removeEventListener('click', memory);
            score++;
            scoreContainer.innerHTML = "Score : " + score;
            if (score == 8) {
                alert('Good Job !');
                resetGame();
            }
        }
        // Carte différente
        else {
            blockBoard = true;
            // Affiche les cartes puis les cache
            setTimeout(() => {
                firstCard.children[0].classList="hidden";
                secondCard.children[0].classList="hidden";

                // reset firstCard
                firstCard = null;
                secondCard = null;
                miss++;
                missContainer.innerHTML = "Miss : " + miss;
                blockBoard = false;
            }, 500);
        }
    }
}