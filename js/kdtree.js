const size = 600;
const zero = size / 2;
const text_offset = 10;
const circle_size = 2;

const addButton = document.getElementById("add");
const canvas = document.getElementById("myCanvas");
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext("2d");

let pointList = [];

ctx.font = "12px Monospace";
ctx.textAlign = "center";

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class KDTree {
    constructor(depth = 0, boundary = { xMin: 0, xMax: size, yMin: 0, yMax: size }) {
        this.boundary = boundary;
        this.point = null;
        this.left = null;
        this.right = null;
        this.depth = depth;
    }

    insert(point) {
        if (this.point === null) {
            this.point = point;
            pointList.push(point);
            // Affichage du point
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(point.x, point.y, circle_size, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = "green";
            ctx.fillText('(' + (point.x - zero) + ', ' + (-(point.y - zero)) + ')',
                point.x, point.y - text_offset);

            return true;
        }

        const axis = this.depth % 2; // 0: vertical division (x-axis), 1: horizontal division (y-axis)

        if (axis === 0) { // Division selon x
            if (point.x < this.point.x) {
                if (!this.left) {
                    const newBoundary = { ...this.boundary, xMax: this.point.x };
                    this.left = new KDTree(this.depth + 1, newBoundary);
                }
                this.left.insert(point);
            } else {
                if (!this.right) {
                    const newBoundary = { ...this.boundary, xMin: this.point.x };
                    this.right = new KDTree(this.depth + 1, newBoundary);
                }
                this.right.insert(point);
            }
            // Dessine la ligne verticale de division
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.moveTo(this.point.x, this.boundary.yMin);
            ctx.lineTo(this.point.x, this.boundary.yMax);
            ctx.stroke();
        } else { // Division selon y
            if (point.y < this.point.y) {
                if (!this.left) {
                    const newBoundary = { ...this.boundary, yMax: this.point.y };
                    this.left = new KDTree(this.depth + 1, newBoundary);
                }
                this.left.insert(point);
            } else {
                if (!this.right) {
                    const newBoundary = { ...this.boundary, yMin: this.point.y };
                    this.right = new KDTree(this.depth + 1, newBoundary);
                }
                this.right.insert(point);
            }
            // Dessine la ligne horizontale de division
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.moveTo(this.boundary.xMin, this.point.y);
            ctx.lineTo(this.boundary.xMax, this.point.y);
            ctx.stroke();
        }
    }
}

let kdtree = new KDTree();
kdtree.insert(new Point(zero, zero));

addButton.onclick = function () {
    const point_x = Math.floor(Math.random() * size);
    const point_y = Math.floor(Math.random() * size);
    console.log('(' + point_x + ', ' + point_y + ')');
    kdtree.insert(new Point(point_x, point_y));
};

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.onclick = function (evt) {
    const pos = getMousePos(canvas, evt);
    const point_x = Math.floor(pos.x);
    const point_y = Math.floor(pos.y);
    console.log('(' + point_x + ', ' + point_y + ')');
    kdtree.insert(new Point(point_x, point_y));
    console.log(pointList);
};

function kdtree_build(points) {
    // Réinitialiser le KDTree
    kdtree = new KDTree();

    // Fonction récursive pour construire le KDTree
    function build(points, depth = 0, boundary = { xMin: 0, xMax: size, yMin: 0, yMax: size }) {
        if (points.length === 0) return;

        // Déterminer l'axe de séparation
        const axis = depth % 2; // 0 pour x, 1 pour y

        // Trier les points selon l'axe
        const sortedPoints = points.sort((a, b) => (axis === 0 ? a.x - b.x : a.y - b.y));

        // Trouver le point médian
        const medianIndex = Math.floor(sortedPoints.length / 2);
        const medianPoint = sortedPoints[medianIndex];

        // Insérer le point médian dans le KDTree
        kdtree.insert(medianPoint);

        // Construire les sous-arbres pour les points à gauche et à droite du point médian
        build(sortedPoints.slice(0, medianIndex), depth + 1, { ...boundary, xMax: medianPoint.x, yMax: medianPoint.y });
        build(sortedPoints.slice(medianIndex + 1), depth + 1, { ...boundary, xMin: medianPoint.x, yMin: medianPoint.y });
    }

    // Appeler la fonction de construction
    build(points);
}

// Utilisation du bouton pour reconstruire le KDTree
const balanceButton = document.getElementById("balance");
balanceButton.onclick = function () {
    ctx.clearRect(0, 0, size, size);
    points = pointList;
    pointList = [];
    kdtree_build(points);
};

const resetButton = document.getElementById("reset");
resetButton.onclick = function () {
    ctx.clearRect(0, 0, size, size);
    kdtree = new KDTree();
    pointList = [];
    kdtree.insert(new Point(zero, zero));
}
