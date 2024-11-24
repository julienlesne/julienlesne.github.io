const canvasSize = 600;
const canvasCenter = canvasSize / 2;
const textOffset = 10;
const pointRadius = 3;

let spiderRadius = 100;
let points = [];
let useEuclidean = true;
let nbVoisins = 2;

// Canvas and context setup
const canvas = document.getElementById("myCanvas");
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext("2d");
ctx.font = "12px Monospace";
ctx.textAlign = "center";

// Define UI controls
const addButton = document.getElementById("add");
const balanceButton = document.getElementById("balance");
const resetButton = document.getElementById("reset");
const customButton = document.getElementById("addCustom");
const pointCountInput = document.getElementById("pointCount");

// Bouton pour basculer entre les distances
const distanceButton = document.getElementById("toggleDistance");
const spanDistance = document.getElementById("distanceType");
distanceButton.onclick = () => {
    useEuclidean = !useEuclidean;
    if (useEuclidean) {
        spanDistance.textContent = "Euclidean";
    } else {
        spanDistance.textContent = "Manhattan";
    }
};

// Point class representing a 2D point
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Draw a point on the canvas
function drawPoint(point, pointColor) {
    ctx.beginPath();
    ctx.fillStyle = pointColor;
    ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawCircle(center, circleColor) {
    ctx.beginPath();
    ctx.strokeStyle = circleColor;
    ctx.arc(center.x, center.y, spiderRadius, 0, 2 * Math.PI);
    ctx.stroke();
}

// Draw a line between two points
function drawLine(p1, p2, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

// Add single random point
addButton.onclick = () => {
    addRandomPoint();
    drawGraph(knn(points, nbVoisins));
}

// Add 50 random points
balanceButton.onclick = () => generateRandomPoints(50);

// Add custom number of random points based on user input
customButton.onclick = () => generateRandomPoints(parseInt(pointCountInput.value) || 10);

// Reset QuadTree and clear canvas
resetButton.onclick = () => resetCanvas();

// Add a point at mouse click location
canvas.onclick = (event) => {
    const pos = getMousePos(canvas, event);
    const clickedPoint  = new Point(pos.x, pos.y);
    points.push(clickedPoint);
    drawPoint(clickedPoint, "black");
    drawGraph(knn(points, nbVoisins));
};

// On Mouse Move
canvas.onmousemove = (event) => {
    clearCanvas();
    const pos = getMousePos(canvas, event);
    const mouse = new Point(pos.x, pos.y);

    points.forEach((point) => {
        const distance = euclideanDistance(point, mouse);
        if (distance < spiderRadius) {
            drawLine(point, mouse, "red");
            drawPoint(point, "green");
        } else {
            drawPoint(point, "black");
        }
            
    });
    drawPoint(mouse, "blue");
    drawCircle(mouse, "red");
};

// Utility: Add a random point within the canvas
function addRandomPoint() {
    const x = Math.floor(Math.random() * canvasSize);
    const y = Math.floor(Math.random() * canvasSize);
    const point = new Point(x, y);
    points.push(point);
    drawPoint(point, "black");
}

// Utility: Generate multiple random points
function generateRandomPoints(numPoints) {
    for (let i = 0; i < numPoints; i++) {
        addRandomPoint();
    }
    drawGraph(knn(points, nbVoisins));
}

// Utility: Get mouse position relative to the canvas
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

// Utility: Calculate the Euclidean distance between two points
function euclideanDistance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Utility: Calculate the Manhattan distance between two points
function manhattanDistance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function calculateDistance(p1, p2) {
    return useEuclidean ? euclideanDistance(p1, p2) : manhattanDistance(p1, p2);
}

// Utility: Reset the canvas
function resetCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    points = [];
}

// Utility: Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

// Générer une couleur aléatoire
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Fonction pour obtenir les k plus proches voisins d'un point donné dans une liste de points
function knn(points, k) {
    // Créer un graphe des voisins pour chaque point
    let neighborsGraph = [];

    // Pour chaque point, on calcule la distance avec tous les autres points
    points.forEach((point, index) => {
        let distances = [];
        
        // Calculer la distance entre ce point et tous les autres points
        points.forEach((otherPoint, otherIndex) => {
            if (index !== otherIndex) {
                distances.push({
                    index: otherIndex,
                    distance: calculateDistance(point, otherPoint)
                });
            }
        });

        // Trier les distances et prendre les k plus proches voisins
        distances.sort((a, b) => a.distance - b.distance);
        neighborsGraph[index] = distances.slice(0, k); // Sélectionner les k plus proches voisins
    });

    return neighborsGraph;
}

// Fonction pour dessiner les segments reliant les points voisins
function drawGraph(neighbors) {
    clearCanvas();
    ctx.lineWidth = 1;
    neighbors.forEach((neighborsList, index) => {
        neighborsList.forEach(neighbor => {
            drawLine(points[index], points[neighbor.index], "yellow");
        });
    });
    points.forEach((point) => {
        drawPoint(point, "black");
    });
}

const nbVoisinsSlider = document.getElementById("nbVoisinsSlider");
const nbVoisinsDisplay = document.getElementById("nbVoisinsDisplay");

// Update the displayed node capacity value
nbVoisinsSlider.oninput = () => {
    nbVoisins = parseInt(nbVoisinsSlider.value);
    nbVoisinsDisplay.textContent = nbVoisins;
    drawGraph(knn(points, nbVoisins));
};