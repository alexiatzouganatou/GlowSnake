// ===== CANVAS SETUP =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Real size for drawing
let tileSize = 20;
let gridCount = 21;

canvas.width = tileSize * gridCount;
canvas.height = tileSize * gridCount;

// ===== GAME VARIABLES =====
let snake = [{ x: 5, y: 5 }];
let vx = 1, vy = 0;
let food = { x: 10, y: 10 };
let score = 0;

let highScore = localStorage.getItem("glowHigh") || 0;
document.getElementById("highScore").textContent = highScore;

let speed = 160;
let gameRunning = false;

// ===== START GAME =====
document.getElementById("playBtn").onclick = () => {
    document.getElementById("startScreen").style.display = "none";
    document.querySelector(".game-container").style.display = "flex";
    gameRunning = true;
    gameLoop();
};

// ===== MAIN GAME LOOP =====
function gameLoop() {
    if (!gameRunning) return;

    let head = {
        x: snake[0].x + vx,
        y: snake[0].y + vy
    };

    // Wall collision
    if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
        return gameOver();
    }

    // Body collision
    for (let p of snake) {
        if (p.x === head.x && p.y === head.y) {
            return gameOver();
        }
    }

    snake.unshift(head);

    // Eating food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("glowHigh", highScore);
            document.getElementById("highScore").textContent = highScore;
        }

        placeFood();
    } else {
        snake.pop();
    }

    draw();
    setTimeout(gameLoop, speed);
}

// ===== DRAW EVERYTHING =====
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // === FOOD (Bright Blue) ===
    ctx.fillStyle = "#00c7ff";
    ctx.beginPath();
    ctx.arc(
        food.x * tileSize + tileSize / 2,
        food.y * tileSize + tileSize / 2,
        tileSize / 2,
        0, Math.PI * 2
    );
    ctx.fill();

    // === SNAKE ===
    for (let i = 0; i < snake.length; i++) {
        let s = snake[i];

        // Blue snake
        ctx.fillStyle = i === 0 ? "#0077cc" : "#0096ff";

        ctx.beginPath();
        ctx.arc(
            s.x * tileSize + tileSize / 2,
            s.y * tileSize + tileSize / 2,
            tileSize / 2,
            0, Math.PI * 2
        );
        ctx.fill();

        // ==== EYES FOR HEAD ====
        if (i === 0) {
            // White eyes
            ctx.fillStyle = "white";

            ctx.beginPath();
            ctx.arc(
                s.x * tileSize + tileSize * 0.35,
                s.y * tileSize + tileSize * 0.30,
                tileSize * 0.12,
                0, Math.PI * 2
            );
            ctx.arc(
                s.x * tileSize + tileSize * 0.65,
                s.y * tileSize + tileSize * 0.30,
                tileSize * 0.12,
                0, Math.PI * 2
            );
            ctx.fill();

            // Black pupils
            ctx.fillStyle = "black";

            ctx.beginPath();
            ctx.arc(
                s.x * tileSize + tileSize * 0.35,
                s.y * tileSize + tileSize * 0.30,
                tileSize * 0.06,
                0, Math.PI * 2
            );
            ctx.arc(
                s.x * tileSize + tileSize * 0.65,
                s.y * tileSize + tileSize * 0.30,
                tileSize * 0.06,
                0, Math.PI * 2
            );
            ctx.fill();
        }
    }
}

// ===== RANDOM FOOD =====
function placeFood() {
    food.x = Math.floor(Math.random() * gridCount);
    food.y = Math.floor(Math.random() * gridCount);
}

// ===== GAME OVER =====
function gameOver() {
    gameRunning = false;
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOverScreen").style.display = "block";
}

// ===== RESTART =====
document.getElementById("restartBtn").onclick = () => {
    location.reload();
};

// ===== KEYBOARD CONTROLS =====
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && vy !== 1) { vx = 0; vy = -1; }
    if (e.key === "ArrowDown" && vy !== -1) { vx = 0; vy = 1; }
    if (e.key === "ArrowLeft" && vx !== 1) { vx = -1; vy = 0; }
    if (e.key === "ArrowRight" && vx !== -1) { vx = 1; vy = 0; }
});

// ===== MOBILE BUTTONS =====
document.querySelectorAll(".arrow-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        let dir = btn.dataset.dir;

        if (dir === "UP" && vy !== 1) { vx = 0; vy = -1; }
        if (dir === "DOWN" && vy !== -1) { vx = 0; vy = 1; }
        if (dir === "LEFT" && vx !== 1) { vx = -1; vy = 0; }
        if (dir === "RIGHT" && vx !== -1) { vx = 1; vy = 0; }
    });
});
