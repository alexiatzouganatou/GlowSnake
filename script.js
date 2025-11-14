const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, direction, food, score, game;
let speed = 180;
let gameStarted = false;
function resizeCanvas() {
    let size;

    if (window.innerWidth < 700) {
        size = Math.floor(window.innerWidth * 0.90);
    } else {
        size = 600;
    }

    canvas.width = size;
    canvas.height = size;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


document.getElementById("playBtn").onclick = startGame;

function startGame() {
    gameStarted = true;
    document.getElementById("startScreen").style.display = "none";
    document.querySelector(".game-container").style.display = "flex";

    init();
    game = setInterval(draw, speed);
    enableSwipeControls();
}


function init() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    food = randomFood();
    score = 0;
    document.getElementById("score").textContent = score;
}

function randomFood() {
    const cells = Math.floor(canvas.width / box);
    return {
        x: Math.floor(Math.random() * cells) * box,
        y: Math.floor(Math.random() * cells) * box
    };
}


document.addEventListener("keydown", e => {
    if (!gameStarted) return;

    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function enableSwipeControls() {
    let startX, startY;

    canvas.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    canvas.addEventListener("touchend", e => {
        let endX = e.changedTouches[0].clientX;
        let endY = e.changedTouches[0].clientY;

        let dx = endX - startX;
        let dy = endY - startY;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
            if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
        } else {
            if (dy > 0 && direction !== "UP") direction = "DOWN";
            if (dy < 0 && direction !== "DOWN") direction = "UP";
        }
    });
}


function drawCircle(x, y, color, r = 7) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.arc(x + box/2, y + box/2, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
}


function drawHead(x, y) {
    ctx.save();
    ctx.shadowColor = "#00ffee";
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.arc(x + box/2, y + box/2, 9, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffcc";
    ctx.fill();

    /* Eyes */
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x + box/2 + 4, y + box/2 - 3, 2, 0, Math.PI * 2);
    ctx.arc(x + box/2 + 4, y + box/2 + 3, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + box/2 + 4, y + box/2 - 3, 1, 0, Math.PI * 2);
    ctx.arc(x + box/2 + 4, y + box/2 + 3, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}


function updateSpeed() {
    if (score >= 20) speed = 95;
    else if (score >= 15) speed = 110;
    else if (score >= 10) speed = 130;
    else if (score >= 5) speed = 150;
    else speed = 180;

    clearInterval(game);
    game = setInterval(draw, speed);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCircle(food.x, food.y, "#66ffe0", 8);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("score").textContent = score;
        food = randomFood();
        updateSpeed();
    } else {
        snake.pop();
    }

    const newHead = { x: headX, y: headY };

    if (
        headX < 0 || headX >= canvas.width ||
        headY < 0 || headY >= canvas.height ||
        snake.some(p => p.x === headX && p.y === headY)
    ) {
        return gameOver();
    }

    snake.unshift(newHead);

    drawHead(snake[0].x, snake[0].y);
    snake.slice(1).forEach(p => drawCircle(p.x, p.y, "#00bbaa", 7));
}

function gameOver() {
    clearInterval(game);
    document.querySelector(".game-container").style.display = "none";
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOverScreen").style.display = "block";
}

document.getElementById("restartBtn").onclick = () => location.reload();
