// Variables globales
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.8;
canvas.height = 400;
let array = [];
let sorting = false;
let speed = 50; // Vitesse de l'animation (plus bas est plus rapide)

document.getElementById("reset").addEventListener("click", resetArray);

const sortingSpeedSlider = document.getElementById("sortingSpeedSlider");
const sortingSpeedDisplay = document.getElementById("sortingSpeedDisplay");
// Update the sorting speed
sortingSpeedSlider.oninput = () => {
    speed = parseInt(sortingSpeedSlider.value);
    sortingSpeedDisplay.textContent = speed;
};

// Générer un tableau aléatoire pour la visualisation
function resetArray() {
    if (sorting) return; // Empêcher la réinitialisation lors du tri
    array = Array.from({ length: 50 }, () => Math.floor(Math.random() * canvas.height));
    drawArray();
}

// Dessiner le tableau actuel sur le canvas
function drawArray(highlightIndex = -1, secondaryIndex = -1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / array.length;

    array.forEach((value, index) => {
        ctx.fillStyle = index === highlightIndex ? "red" : index === secondaryIndex ? "yellow" : "blue";
        ctx.fillRect(index * barWidth, canvas.height - value, barWidth, value);
    });
}

// is Sorted
function isSorted(){
    for(var i = 1; i < array.length; i++){
        if (array[i-1] > array[i]) {
            return false;
        }
    }
    return true;
};

// Shuffle
function shuffle(){
    var count = array.length, temp, index;
    while(count > 0) {
        index = Math.floor(Math.random() * count);
        count--;

        temp = array[count];
        array[count] = array[index];
        array[index] = temp;
    }
}

// Bubble Sort avec animation
async function bubbleSort() {
    sorting = true;
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            drawArray(j, j + 1);
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
                drawArray(j, j + 1);
            }
            await sleep(speed);
        }
    }
    sorting = false;
}

// Bogo Sort
async function bogoSort() {
    sorting = true;
    while(sorting) {
        shuffle();
        drawArray();
        sorting = !isSorted();
        await sleep(speed);
    }
    sorting = false;
}

// Coktail Sort avec animation
async function cocktailSort()
    {
        let swapped = true;
        let start = 0;
        let end = array.length;
  
        while (swapped == true) {
            swapped = false;
  
            for (let i = start; i < end - 1; ++i) {
                if (array[i] > array[i + 1]) {
                    await swap(i, i + 1);
                    swapped = true;
                }
            }
  
            // if nothing moved, then array is sorted.
            if (swapped == false)
                break;
            swapped = false;
            end = end - 1;
  
            for (let i = end - 1; i >= start; i--) {
                if (array[i] > array[i + 1]) {
                    await swap(i+1, i);
                    swapped = true;
                }
            }
            start = start + 1;
        }
    }

// Selection Sort avec animation
async function selectionSort() {
    sorting = true;
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            drawArray(minIndex, j);
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            await sleep(speed);
        }
        if (minIndex !== i) {
            await swap(i, minIndex);
            drawArray(i, minIndex);
        }
    }
    sorting = false;
}

// Fonction pour échanger deux éléments du tableau
async function swap(i, j) {
    [array[i], array[j]] = [array[j], array[i]];
    drawArray(i, j);
    await sleep(speed);
}

// Fonction utilitaire pour ralentir l'animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Événements pour les boutons de tri
document.getElementById("bubbleSort").addEventListener("click", () => {
    if (!sorting) bubbleSort();
});
document.getElementById("selectionSort").addEventListener("click", () => {
    if (!sorting) selectionSort();
});
document.getElementById("cocktailSort").addEventListener("click", () => {
    if (!sorting) cocktailSort();
});
document.getElementById("bogoSort").addEventListener("click", () => {
    if (!sorting) bogoSort();
});

// Initialiser le tableau
resetArray();
