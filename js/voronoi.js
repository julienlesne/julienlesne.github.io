// Configuration settings for the canvas
const canvasSize = 600;
const canvasCenter = canvasSize / 2;
const pointRadius = 3;
const textOffset = 10;
let points = []; // Array to store points added to the canvas
let pointColors = [];

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

// Point class representing a 2D point with x and y coordinates
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Add a point on the canvas and triggers the Voronoi cell calculations
function addPoint(point, color) {
    if (!points.some(p => p.x === point.x && p.y === point.y)) {
        points.push(point); // Adds point to the array if not already present
        pointColors.push(getRandomColor()); // Generate and store a random color for the new point
    }
}

// Function to draw a single point on the canvas
function drawPoint(point, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
    ctx.fill();
}

// Function to draw the Voronoi diagram by calculating cell areas for each point
function drawVoronoiDiagram() {
    ctx.clearRect(0, 0, canvasSize, canvasSize); // Clear canvas

    // Loop through each pixel in the canvas to determine its closest point
    for (let x = 0; x < canvasSize; x++) {
        for (let y = 0; y < canvasSize; y++) {
            let closestPoint = null;
            let minDistance = Infinity;

            // Find the closest point to the current pixel
            points.forEach((point, index) => {
                const distance = (point.x - x) ** 2 + (point.y - y) ** 2; // Squared distance to avoid sqrt
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = index;
                }
            });

            // Set the pixel color based on the closest point
            if (closestPoint !== null) {
                ctx.fillStyle = pointColors[closestPoint];
                ctx.fillRect(x, y, 1, 1); // Draw pixel
            }
        }
    }

    // Draw each point on top of the Voronoi cells
    points.forEach((point) => {
        drawPoint(point, "black");
    });
}

// Get the perpendicular bisector between two points
function getPerpendicularBisector(a, b) {
    const midpoint = new Point((a.x + b.x) / 2, (a.y + b.y) / 2);
}

// Event listeners for UI controls
addButton.onclick = () => {
    addRandomPoint();
    drawVoronoiDiagram();
};
balanceButton.onclick = () => generateRandomPoints(50);
customButton.onclick = () => generateRandomPoints(parseInt(pointCountInput.value) || 10);
resetButton.onclick = () => resetCanvas();
canvas.onclick = event => {
    const pos = getMousePos(canvas, event);
    addPoint(new Point(pos.x, pos.y), "black");
    drawVoronoiDiagram();
};

// Function to generate a random hex color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Adds a random point within the canvas bounds
function addRandomPoint() {
    const x = Math.random() * canvasSize;
    const y = Math.random() * canvasSize;
    addPoint(new Point(x, y), "black");
}

// Generates a specified number of random points
function generateRandomPoints(numPoints) {
    for (let i = 0; i < numPoints; i++) {
        addRandomPoint();
    }
    drawVoronoiDiagram();
}

// Utility function to get the mouse position relative to the canvas
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Resets the canvas and clears all points and colors
function resetCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    points = [];
    pointColors = []; // Clear color array as well
}
