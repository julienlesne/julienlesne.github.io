const canvasSize = 600;
const canvasCenter = canvasSize / 2;
const textOffset = 10;
const pointRadius = 3;

// Default QuadTree node capacity
let NODE_CAPACITY = 1;

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
const nodeCapacitySlider = document.getElementById("nodeCapacitySlider");
const nodeCapacityDisplay = document.getElementById("nodeCapacityDisplay");

// Update the displayed node capacity value
nodeCapacitySlider.oninput = () => {
    NODE_CAPACITY = parseInt(nodeCapacitySlider.value);
    nodeCapacityDisplay.textContent = NODE_CAPACITY;
    updateQuadTree(); // Update the QuadTree to apply the new capacity
};

// Point class representing a 2D point
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Axis-Aligned Bounding Box class to manage rectangular regions
class AABB {
    constructor(origin, dimension) {
        this.origin = origin;
        this.dimension = dimension;
    }

    // Check if a point is within the AABB
    contains(point) {
        return (
            point.x >= this.origin.x && point.x <= this.origin.x + this.dimension &&
            point.y >= this.origin.y && point.y <= this.origin.y + this.dimension
        );
    }
}

// QuadTree class to manage spatial data structure and operations
class QuadTree {
    constructor(boundary) {
        this.boundary = boundary;
        this.points = []; // Points in this region
        this.subdivided = false; // Subdivision state

        // Draw boundary
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.boundary.origin.x, this.boundary.origin.y, this.boundary.dimension, this.boundary.dimension);
    }

    // Subdivide this QuadTree node into four quadrants
    subdivide() {
        const halfDim = this.boundary.dimension / 2;
        const x = this.boundary.origin.x;
        const y = this.boundary.origin.y;

        this.northwest = new QuadTree(new AABB(new Point(x, y), halfDim));
        this.northeast = new QuadTree(new AABB(new Point(x + halfDim, y), halfDim));
        this.southwest = new QuadTree(new AABB(new Point(x, y + halfDim), halfDim));
        this.southeast = new QuadTree(new AABB(new Point(x + halfDim, y + halfDim), halfDim));

        this.subdivided = true;
    }

    // Insert a point into the QuadTree
    insert(point) {
        // Ignore points outside the boundary
        if (!this.boundary.contains(point)) {
            return false;
        }

        // If capacity is not reached, add the point here
        if (this.points.length < NODE_CAPACITY && !this.subdivided) {
            this.points.push(point);
            this.drawPoint(point, "black", "green"); // Visualize point with coordinates
            return true;
        }

        // If capacity is reached and not yet subdivided, subdivide this node
        if (!this.subdivided) {
            this.subdivide();
            // Re-insert points into appropriate quadrants after subdivision
            this.points.forEach(p => {
                this.northwest.insert(p) || this.northeast.insert(p) || this.southwest.insert(p) || this.southeast.insert(p);
            });
            this.points = [];
        }

        // Attempt to insert into one of the quadrants
        return (
            this.northwest.insert(point) || this.northeast.insert(point) ||
            this.southwest.insert(point) || this.southeast.insert(point)
        );
    }

    // Search for nearest point
    nearestNeighbor(target, best = { point: null, distance: Infinity }) {
        this.points.forEach(p => {
            const d = distance(target, p);
            if (d < best.distance) {
                best.point = p;
                best.distance = d;
            }
        });

        if (this.subdivided) {
            this.northwest.nearestNeighbor(target, best);
            this.northeast.nearestNeighbor(target, best);
            this.southwest.nearestNeighbor(target, best);
            this.southeast.nearestNeighbor(target, best);
        }

        return best.point;
    }

    // Draw a point on the canvas with optional text for coordinates
    drawPoint(point, pointColor, textColor) {
        ctx.beginPath();
        ctx.fillStyle = pointColor;
        ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Display rounded coordinates next to the point
        ctx.fillStyle = textColor;
        const roundedX = Math.round(point.x - canvasCenter);
        const roundedY = Math.round(-(point.y - canvasCenter));
        ctx.fillText(`(${roundedX}, ${roundedY})`, point.x, point.y - textOffset);
    }
}

// Initialize the QuadTree with the canvas boundary
let quadTree = new QuadTree(new AABB(new Point(0, 0), canvasSize));

// Add single random point
addButton.onclick = () => addRandomPoint();

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
    quadTree.insert(clickedPoint ) || alert("clickedPoint outside boundary");

    /*
    const nearest = quadTree.nearestNeighbor(clickedPoint);

    if (nearest) {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(nearest.x, nearest.y, pointRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Wait 1 sec before cleaning
        setTimeout(() => {
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(nearest.x, nearest.y, pointRadius, 0, 2 * Math.PI);
            ctx.fill();
        }, 1000);
    }
    */
};

// Utility: Add a random point within the canvas
function addRandomPoint() {
    const x = Math.floor(Math.random() * canvasSize);
    const y = Math.floor(Math.random() * canvasSize);
    quadTree.insert(new Point(x, y));
}

// Utility: Generate multiple random points
function generateRandomPoints(numPoints) {
    for (let i = 0; i < numPoints; i++) {
        addRandomPoint();
    }
}

// Utility: Get mouse position relative to the canvas
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}


// Utility: Calculate the Euclidean distance between two points
function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Utility: Reset the canvas and reinitialize QuadTree
function resetCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    quadTree = new QuadTree(new AABB(new Point(0, 0), canvasSize));
}

// Utility: Collect all points from the current QuadTree structure
function collectPoints(tree, points) {
    points.push(...tree.points);
    if (tree.subdivided) {
        collectPoints(tree.northwest, points);
        collectPoints(tree.northeast, points);
        collectPoints(tree.southwest, points);
        collectPoints(tree.southeast, points);
    }
}

// Update the QuadTree with the new node capacity without clearing points
function updateQuadTree() {
    // Collect all points from the current QuadTree
    const allPoints = [];
    collectPoints(quadTree, allPoints);

    // Clear canvas to remove visual elements without clearing the structure
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Create a new QuadTree with the updated NODE_CAPACITY
    quadTree = new QuadTree(new AABB(new Point(0, 0), canvasSize));

    // Re-insert all points to apply the new NODE_CAPACITY
    allPoints.forEach(point => quadTree.insert(point));
}
