var canvas = document.getElementById("gameboard")
var ctx = canvas.getContext("2d");
var message = document.getElementById("message");
var currentscore = document.querySelector(".current-score");
var highscore = document.querySelector(".high-score");

var snakeWidth = 10;
var snakeHeight = 10;

var snake = [[0,0]];

var foodX = 0;
var foodY = 0;

var foodOnBoard = false;

var left = false;
var right = true;
var up = false;
var down = false;

var score = 0;
var gameOver = false;

var timer;

if (localStorage.getItem(highscore) !== null) {
    highscore.innerText = localStorage.getItem(highscore);
}

window.onload = function () {
    timer = setInterval(startGame, 100);
};

window.addEventListener('keydown', (event) => {
    if (event.defaultPrevented){
        return;
    } 

    switch(event.key) {
        case "ArrowUp":
            if (!down) {
                up = true;
                left = false,
                right = false;
                down = false;
            }
            break;
        case "ArrowDown":
            if (!up) {
                up = false;
                left = false,
                right = false;
                down = true;
            }
            break;
        case "ArrowLeft":
            if (!right) {
                up = false;
                left = true,
                right = false;
                down = false;
            }
            break;
        case "ArrowRight":
            if (!left) {
                up = false;
                left = false,
                right = true;
                down = false;
            }
            break;
        case "Enter":
            window.location.reload();
            break;
    }

    event.preventDefault();
}, true);

function startGame() {
    renderSnake();

    checkWallCollision();
    checkFoodCollision();
    checkSnakePartCollision();

    if(!foodOnBoard) {
        generateFood();
    }

    if (gameOver) {
        clearInterval(timer);
        message.innerText = "GAME OVER! Click enter to restart!";
        message.classList.toggle("game-over");
        if (score > parseInt(highscore.innerText)) {
            highscore.innerText = score;
            localStorage.setItem(highscore, score);
        }
    }
}

function renderSnake() {
    for (let i = snake.length - 1; i >= 0; i--) {
        if (i === 0) {
            ctx.clearRect(snake[i][0], snake[i][1], snakeWidth, snakeHeight);
            if (left) {
                snake[i][0] -= snakeWidth;
            } else if (right) {
                snake[i][0] += snakeWidth;
            } else if (up) {
                snake[i][1] -= snakeHeight;
            } else if (down) {
                snake[i][1] += snakeHeight;
            }
        } else {
            ctx.clearRect(snake[i][0], snake[i][1], snakeWidth, snakeHeight);
            snake[i][0] = snake[i - 1][0];
            snake[i][1] = snake[i - 1][1];
        }
    }

    for (let i = 0; i < snake.length; i++) {
        drawSnake(snake[i][0], snake[i][1]);
    }
}

function drawSnake(x, y) {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x, y, snakeWidth, snakeHeight);
}

function generateFood() {
    
    if (snake.length > 2) {
        let isCollided = false;
        do {
            randomizeFood();
            for (let i = 1; i < snake.length; i++) {
                if (foodX === snake[i][0] && foodY === snake[i][1]) isCollided = true;
            }
        } while (isCollided);
    } else {
        randomizeFood();
    }

    ctx.fillStyle = "#46da05";
    ctx.fillRect(foodX, foodY, snakeWidth, snakeHeight);

    foodOnBoard = true;
}

function randomizeFood () {
    let maxX = canvas.width/snakeWidth;
    let maxY = canvas.height/snakeHeight;
    foodX = Math.floor(Math.random()*maxX);
    foodY = Math.floor(Math.random()*maxY);

    foodX = foodX * snakeWidth;
    foodY = foodY * snakeHeight;
}

function checkWallCollision() {
    if (snake[0][0] < 0 || snake[0][0] > canvas.width || snake[0][1] < 0 || snake[0][1] > canvas.height) gameOver = true; 
}

function checkFoodCollision() {
    if (snake[0][0] === foodX && snake[0][1] === foodY) {
        foodOnBoard = false; 
        score += 10;
        currentscore.innerText = score;
        snake.push([snake[snake.length-1][0], snake[snake.length-1][1]]);
    }
}

function checkSnakePartCollision() {
    if (snake.length > 2) {
        for (let i = 1; i < snake.length; i++) {
            if (snake[0][0] === snake[i][0] && snake[0][1] === snake[i][1]) gameOver = true;
        }
    }
}