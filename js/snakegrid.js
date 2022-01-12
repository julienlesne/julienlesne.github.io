
const snakeContainer = document.getElementById('snake-container');
const scoreContainer = document.getElementById('score-container');
const speed = 5;

var direction = { x: 0, y: 0};
var lastDirection = { x: 0, y: 0};
var snake = [ {x: 3, y: 5} ];
var food = { x: 9, y: 5 }
var score = 0;
var gameOver = false;

window.onload = function() {
    setInterval(game, 1000/speed);
}

function reset() {
    direction = { x: 0, y: 0};
    lastDirection = { x: 0, y: 0};
    snake = [ {x: 3, y: 5} ];
    food = { x: 9, y: 5 }
    score = 0;
    gameOver = false;
}

function game() {

    // UPDATE
    lastDirection = direction;
    scoreContainer.innerHTML = "Score : " + score

    // MOVE SNAKE
    for (let i = snake.length - 2; i >= 0; i--) {
        snake[i + 1] = { ...snake[i] }
    }
    snake[0].x += direction.x
    snake[0].y += direction.y

    // OUTSIDE
    if (snake[0].x == 0 || snake[0].x == 13 || snake[0].y == 0 || snake[0].y == 10) {
        gameOver = true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            gameOver = true
        }
    }

    // GAME OVER
    if (gameOver) {
        alert('Game Over !');
        reset();
    }

    // BORDERS
    /*if (snake[0].x == 0) {
        snake[0].x = 12
    }
    if (snake[0].x == 13) {
        snake[0].x = 1
    }

    if (snake[0].y == 0) {
        snake[0].y = 9
    }
    if (snake[0].y == 10) {
        snake[0].y = 1
    }*/

    // EAT FOOD
    if (snake[0].x == food.x && snake[0].y == food.y) {
        snake.push({ ...snake[snake.length - 1] })
        score++;
        scoreContainer.innerHTML = "Score : " + score
        food = { x: Math.floor(Math.random()* 12)+1, y: Math.floor(Math.random()* 8)+1}
    }

    // CLEAR GAME
    snakeContainer.innerHTML = "";

    // DRAW FOOD
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    snakeContainer.appendChild(foodElement)
    foodElement.innerHTML = "F"
    
    // DRAW SNAKE
    snake.forEach(part => {
        const snakePart = document.createElement('div')
        snakePart.style.gridRowStart = part.y
        snakePart.style.gridColumnStart = part.x
        snakePart.classList.add('snake')
        snakeContainer.appendChild(snakePart)
        if (part === snake[0]) {
            snakePart.innerHTML = "T_T"
        } else {
            snakePart.innerHTML = "S"
        }
    })

}

// OnKeyDown
document.onkeydown = function (event) {
    switch (event.keyCode) {
        case 37:
            console.log("Left");
            if (lastDirection.x !== 0) break;
            direction = { x: -1, y: 0};
            break;
        case 38:
            console.log("Up");
            if (lastDirection.y !== 0) break;
            direction = { x: 0, y: -1};
            break;
        case 39:
            console.log("Right");
            if (lastDirection.x !== 0) break;
            direction = { x: 1, y: 0};
            break;
        case 40:
            console.log("Down");
            if (lastDirection.y !== 0) break;
            direction = { x: 0, y: 1};
            break;
        /*case 32:
            console.log("Space");
            direction = { x: 0, y: 0};
            break;*/
    }
};