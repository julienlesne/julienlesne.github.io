
const size = 600;
zero = size/2;
text_offset = 10;
circle_size = 2;

const QT_NODE_CAPACITY = 1;

const addButton = document.getElementById("add");
const canvas = document.getElementById("myCanvas");
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext("2d");

ctx.font = "12px Monospace";
ctx.textAlign = "center";


class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class AABB {
    constructor(origin, dimension) {
        this.origin = origin;
        this.dimension = dimension;
    }

    contains(point) {
        if (point.x < this.origin.x || point.x > this.origin.x + this.dimension) {
            return false;
        }

        if (point.y < this.origin.y || point.y > this.origin.y + this.dimension) {
            return false;
        }

        return true;
    }

    /*
    intersects(other) {
        var self = this;
        if (self.center.x + self.halfDimension > other.center.x - other.halfDimension) {
            return true;
        }

        if (self.center.x - self.halfDimension < other.center.x + other.halfDimension) {
            return true;
        }

        if (self.center.y + self.halfDimension > other.center.y - other.halfDimension) {
            return true;
        }

        if (self.center.y - self.halfDimension < other.center.y + other.halfDimension) {
            return true;
        }
        return false;
    }
        */
}

class QuadTree {
    constructor(boundry) {
        this.boundry = boundry;

        ctx.strokeStyle = "red";
        ctx.strokeRect(this.boundry.origin.x,
                       this.boundry.origin.y,
                       this.boundry.dimension,this.boundry.dimension);

        this.points = [];

        this.NW = null;
        this.NE = null;
        this.SE = null;
        this.SW = null;
    }

    subdivide() {
        var halfDim = this.boundry.dimension / 2;

        this.NW = new QuadTree(new AABB(new Point(this.boundry.origin.x,
                                                  this.boundry.origin.y), halfDim))
        this.NE = new QuadTree(new AABB(new Point(this.boundry.origin.x + halfDim,
                                                  this.boundry.origin.y), halfDim))
        this.SW = new QuadTree(new AABB(new Point(this.boundry.origin.x,
                                                  this.boundry.origin.y + halfDim), halfDim))
        this.SE = new QuadTree(new AABB(new Point(this.boundry.origin.x + halfDim,
                                                  this.boundry.origin.y + halfDim), halfDim))
    }

    insert(point) {
        if (!this.boundry.contains(point)) {
            return false;
        }

        if (this.points.length < QT_NODE_CAPACITY && this.NW == null) {
            this.points.push(point);

            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(point.x, point.y, circle_size, 0, 2 * Math.PI);
            ctx.fill();
       
            ctx.fillStyle = "green";
            ctx.fillText('(' + (point.x-zero) + ', ' + (-(point.y-zero)) + ')',
                point.x, point.y - text_offset);
            return true;
        }

        if (this.NW == null) {
            console.log("subdividing...");
            this.subdivide();

            // Redistribuer les points existants dans les sous-arbres
            this.points.forEach(p => {
                this.NW.insert(p) || this.NE.insert(p) || this.SW.insert(p) || this.SE.insert(p);
            });
            this.points = []; // Effacer les points du nœud parent
        }

        if (this.NW.insert(point)) {
            console.log("NW insert");
            return true;
        }
        if (this.NE.insert(point)) {
            console.log("NE insert");
            return true;
        }
        if (this.SW.insert(point)) {
            console.log("SW insert");
            return true;
        }
        if (this.SE.insert(point)) {
            console.log("SE insert");
            return true;
        }
        return false;
    }
}

var qt = new QuadTree(new AABB(new Point(0, 0), size));

addButton.onclick = function(){
    console.log("add");

    var point_x = Math.floor(Math.random() * size);
    var point_y = Math.floor(Math.random() * size);
    console.log('(' + point_x + ', ' + point_y + ')');

    if (!qt.insert(new Point(point_x, point_y))) {
        alert("Point outside boundry");
    } else {
        console.log("Point inserted");
    }
};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

canvas.onclick = function(evt){
    console.log("canvas click");
    var pos = getMousePos(canvas, evt);
    var point_x = Math.floor(pos.x);
    var point_y = Math.floor(pos.y);
    console.log('(' + point_x + ', ' + point_y + ')');
    if (!qt.insert(new Point(point_x, point_y))) {
        alert("Point outside boundry");
    } else {
        console.log("Point inserted");
    }
}

function generateRandomPoints(numPoints) {
    for (let i = 0; i < numPoints; i++) {
        let point_x = Math.floor(Math.random() * size);
        let point_y = Math.floor(Math.random() * size);
        qt.insert(new Point(point_x, point_y));
    }
}

document.getElementById("balance").onclick = function () {
    generateRandomPoints(50);
}

const resetButton = document.getElementById("reset");
resetButton.onclick = function () {
    ctx.clearRect(0, 0, size, size);
    qt = new QuadTree(new AABB(new Point(0, 0), size));
}