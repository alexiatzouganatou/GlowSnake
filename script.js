const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function setCanvasSize() {
    if (window.innerWidth < 700) {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerWidth * 1.05;
    } else {
        canvas.width = 480;
        canvas.height = 520;
    }
}
setCanvasSize();

let size = 18;
let cols, rows;

function resizeGrid() {
    cols = Math.floor(canvas.width / size);
    rows = Math.floor(canvas.height / size);
}

let snake, vx, vy, food;
let score = 0;
let highScore = localStorage.getItem("glowHighScore") || 0;

let lastMove = 0;
let moveDelay = 120;

let mobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
let glow = mobile ? 4 : 9;

function resetGame() {
    const startX = Math.floor(cols / 2);
    const startY = Math.floor(rows / 2);

    snake = [{ x: startX, y: startY }];
    vx = 1;
    vy = 0;
    score = 0;
    moveDelay = mobile ? 140 : 120;
    placeFood();
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
    };
}

function drawCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.shadowBlur = glow;
    ctx.shadowColor = color;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function drawEyes(x, y) {
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x - 3, y - 2, 2, 0, Math.PI * 2);
    ctx.arc(x + 3, y - 2, 2, 0, Math.PI * 2);
    ctx.fill();
}

function update(t) {
    if (t - lastMove > moveDelay) {
        const head = { x: snake[0].x + vx, y: snake[0].y + vy };

        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("glowHighScore", highScore);
            }
            placeFood();
            if (moveDelay > 70) moveDelay -= 3;
        } else {
            snake.pop();
        }

        lastMove = t;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach((p, i) => {
        let px = p.x * size + size / 2;
        let py = p.y * size + size / 2;
        drawCircle(px, py, size / 2.2, i === 0 ? "#28f7d1" : "#45ffe6");
        if (i === 0) drawEyes(px, py);
    });

    drawCircle(food.x * size + size / 2, food.y * size + size / 2, size / 2.4, "#00ffd0");

    document.getElementById("score").textContent = score;
    document.getElementById("highScore").textContent = highScore;
}

function gameLoop(time) {
    if (!gameRunning) return;
    update(time);
    draw();
    requestAnimationFrame(gameLoop);
}

let gameRunning = false;

document.getElementById("playBtn").onclick = () => {
    document.getElementById("startScreen").style.display = "none";
    document.querySelector(".game-container").style.display = "flex";

    setCanvasSize();
    resizeGrid();
    resetGame();

    gameRunning = true;
    requestAnimationFrame(gameLoop);
};

function endGame() {
    gameRunning = false;

    document.getElementById("finalScore").textContent = score;
    document.getElementById("finalHigh").textContent = highScore;

    document.getElementById("gameOverScreen").style.display = "block";
}

document.getElementById("restartBtn").onclick = () => {
    document.getElementById("gameOverScreen").style.display = "none";

    setCanvasSize();
    resizeGrid();
    resetGame();

    gameRunning = true;
    requestAnimationFrame(gameLoop);
};


document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && vy !== 1) { vx = 0; vy = -1; }
    if (e.key === "ArrowDown" && vy !== -1) { vx = 0; vy = 1; }
    if (e.key === "ArrowLeft" && vx !== 1) { vx = -1; vy = 0; }
    if (e.key === "ArrowRight" && vx !== -1) { vx = 1; vy = 0; }
});


function handleDirection(dir) {
    if (dir === "UP" && vy !== 1)  { vx = 0; vy = -1; }
    if (dir === "DOWN" && vy !== -1){ vx = 0; vy = 1; }
    if (dir === "LEFT" && vx !== 1) { vx = -1; vy = 0; }
    if (dir === "RIGHT" && vx !== -1){ vx = 1; vy = 0; }
}

document.querySelectorAll(".arrow-btn").forEach(btn => {

    const dir = btn.getAttribute("data-dir");

    btn.style.touchAction = "none";
    btn.style.webkitTapHighlightColor = "transparent";
    btn.style.userSelect = "none";

    btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        handleDirection(dir);
    });

    btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        handleDirection(dir);
    }, { passive: false });

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        handleDirection(dir);
    });
});
