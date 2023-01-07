const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let start = document.getElementById("start");
let gameCanvas = document.getElementById("canvas");
let gameOverScr = document.getElementById("game-over");
let levelEasy = document.getElementById("easy");
let levelHard = document.getElementById("hard");
let trayAgain = document.getElementById("repeat");
let scoreEl = document.getElementById("game-score");


//x is right and left (-x) directions
//y is down and up (-y) directions
const snakeParts = [];
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const r = 10;
let dotsArrX = [];
let dotsArrY = [];
let counter = 0;
let tailLength = 2;
let speed = 7;
let tileCount = 20;
let tileBlock = canvas.width / tileCount;
let tileSize = tileBlock - 2;
let headX = 10;
let headY = 10;
let appleX = 5;
let appleY = 5;
let xVelocity = 0;
let yVelocity = 0;
let score = 0;
let xVelocityBefore = 0;
let yVelocityBefore = 0;
let gameMode = [];
let snakeColor = [];
let colorArr = [
    "#AD08D1",
    "#AEFEFD",
    "#FF9C01",
    "#00D1CC",
    "#BD48FF"
];

let color = colorArr[Math.floor(Math.random() * colorArr.length)];

class SnakePart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

scoreEl.innerHTML = score;

levelEasy.onclick = function() {
    start.style.display = "none";
    yVelocity = -1;
    xVelocity = 0;
    gameMode.push("Beginner");
    drawGrid();
    drawGame();
}

levelHard.onclick = function() {
    start.style.display = "none";
    yVelocity = 0;
    xVelocity = -1;
    gameMode.push("Expert");
    drawGrid();
    drawGame();
}

trayAgain.onclick = function() {
    window.location.reload();
}

function drawGame() {
    checkSnakePosition();    
    changeSnakePosition();
    let result = gameOver();
    if (result) return;
    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();
    drawSpeed();
    drawLevel();
    setTimeout(drawGame, 1000/speed);
}


function drawGrid() {
    let dotMargin = 2;
    let rowsNum = 20;
    let colsnum = 20;
    let dotWidth = (canvas.width - 2 * dotMargin) / colsnum - dotMargin;
    let dotHeight = (canvas.height - 2 * dotMargin) / rowsNum - dotMargin;
    let dotD;
    let xMargin;
    let yMargin;

    if (dotWidth > dotHeight) {
        dotD = dotHeight;
        xMargin = (canvas.width - (2 * dotMargin + colsnum * dotD)) / colsnum;
        yMargin = dotMargin;
    } else {
        dotD = dotWidth;
        xMargin = dotMargin;
        yMargin = (canvas.height - (2 * dotMargin + rowsNum * dotD)) / rowsNum;
    }

    let dotR = dotD * 0.5;
    for (let i = 0; i < rowsNum; i++) {
        for (let j = 0; j < colsnum; j++) {
            let px = j * (dotD + xMargin) + dotMargin + xMargin / 2 + dotR;
            let py = i * (dotD + yMargin) + dotMargin + yMargin / 2 + dotR; 
        dotsArrX.push(px);
        dotsArrY.push(py);
        }
    }
}


function gameOver() {
    let gameOver = false;
    if (xVelocity === 0 && yVelocity === 0) {
        return false;
    }

    if (gameMode == "Expert") {
        if (headX <= 0) {
            gameOver = true; 
            } else if (headX === tileCount) {
                gameOver = true;
            } else if (headY <= 0) {
                gameOver = true;
            } else if(headY === tileCount) {
                    gameOver = true;
            }
    }

    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        start.style.display = "none";
        gameOverScr.style.display = "block";
    }
    return gameOver;
}

function drawSpeed() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Game Speed: " + speed, canvas.width - 400, 10);
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Score: " + score, canvas.width - 50, 10);
}

function drawLevel() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Game Category: " + gameMode, canvas.width - 250, 10);
}

function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {    
    ctx.fillStyle = "green";
    for (let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        if (snakeParts.length > 3) {
            ctx.fillStyle = snakeColor[snakeColor.length - 2];
        }
        ctx.beginPath();
        ctx.arc(part.x * tileBlock, part.y * tileBlock, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    snakeParts.push(new SnakePart(headX, headY)); 
    while (snakeParts.length > tailLength){
        snakeParts.shift(); 
    }

    ctx.fillStyle = "#16f530";
    ctx.beginPath();
    ctx.arc(headX * tileBlock, headY * tileBlock, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

function drawApple() {
    ctx.beginPath();
    ctx.arc(appleX * tileBlock, appleY * tileBlock, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.shadowBlur = 30;
    ctx.shadowColor = "rgba(255,255,255, 0.5 )";
    ctx.fill();
    ctx.shadowBlur = 0;
}

function checkSnakePosition() {
    if (xVelocityBefore === 1 && xVelocity === -1) {
        xVelocity = xVelocityBefore;
    };

    if (xVelocityBefore === -1 && xVelocity === 1) {
        xVelocity = xVelocityBefore;
    };

    if (yVelocityBefore === -1 && yVelocity === 1) {
        yVelocity = yVelocityBefore;
    };

    if (yVelocityBefore === 1 && yVelocity === -1) {
        yVelocity = yVelocityBefore;
    };
    
    xVelocityBefore = xVelocity;
    yVelocityBefore = yVelocity;
}

function changeSnakePosition() {
    if (headX < 0) {
        headX = 20; 
    } else if (headX > 20) {
       headX = 0;
    } else if (headY < 0) {
        headY = 20;
    } else if (headY > 20) {
        headY = 0;
    }
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function checkAppleCollision() {
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileBlock) + 1;
        appleY = Math.floor(Math.random() * tileBlock) + 1;
        color = colorArr[Math.floor(Math.random() * colorArr.length)];
        snakeColor.push(color);
        tailLength++;
        score++;
        scoreEl.innerHTML = score;
        if (gameMode == "Beginner") {
            speed += 0.5;
        } else {
            speed += 1;
        }
    }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(e) {
    //up
    if (e.keyCode == 87 || e.keyCode == 38) {
        yVelocity = -1;
        xVelocity = 0;
    }
    //down
    if (e.keyCode == 83 || e.keyCode == 40) {
        yVelocity = 1;
        xVelocity = 0;
    }
    //left
    if (e.keyCode == 65 || e.keyCode == 37) {
        yVelocity = 0;
        xVelocity = -1;
    }
    //right
    if (e.keyCode == 68 || e.keyCode == 39) {
        yVelocity = 0;
        xVelocity = 1;
    }
}
