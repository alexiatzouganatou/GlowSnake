const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ---------- FIX CANVAS FOR ALL DEVICES (PC / iPhone / Android) ----------
function resizeCanvas() {
    let size = Math.min(window.innerWidth * 0.9, 420); 
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// GRID SIZE
const grid = 21;
let tile = canvas.width / grid;

// Snake
let snake = [{ x: 10, y: 10 }];
let vx = 1, vy = 0;

// Food
let food = { x: 5, y: 5 };

// Score
let score = 0;
let highScore = localStorage.getItem("glowHigh") || 0;
document.getElementById("highScore").textContent = highScore;

let running = false;

// START
document.getElementById("playBtn").onclick = () => {
    document.getElementById("startScreen").style.display = "none";
    document.querySelector(".game-container").style.display = "flex";
    running = true;
    gameLoop();
};

// GAME LOOP
function gameLoop() {
    if (!running) return;

    tile = canvas.width / grid; // recalc on resize

    let head = {
        x: snake[0].x + vx,
        y: snake[0].y + vy
    };

    // WALL COLLISION
    if (head.x < 0 || head.x >= grid || head.y < 0 || head.y >= grid) return gameOver();

    // BODY COLLISION
    if (snake.some(p => p.x === head.x && p.y === head.y)) return gameOver();

    snake.unshift(head);

    // EAT
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
    setTimeout(gameLoop, 150);
}

// DRAW
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // FOOD
    ctx.fillStyle = "#00e0c6";
    ctx.beginPath();
    ctx.arc(
        food.x * tile + tile / 2,
        food.y * tile + tile / 2,
        tile * 0.4,
        0, Math.PI * 2
    );
    ctx.fill();

    // SNAKE
    snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? "#006DFF" : "#0098FF";

        ctx.beginPath();
        ctx.arc(
            p.x * tile + tile / 2,
            p.y * tile + tile / 2,
            tile * 0.45,
            0, Math.PI * 2
        );
        ctx.fill();

        // EYES
        if (i === 0) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(p.x * tile + tile * 0.30, p.y * tile + tile * 0.30, tile * 0.18, 0, Math.PI * 2);
            ctx.arc(p.x * tile + tile * 0.70, p.y * tile + tile * 0.30, tile * 0.18, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(p.x * tile + tile * 0.30, p.y * tile + tile * 0.30, tile * 0.08, 0, Math.PI * 2);
            ctx.arc(p.x * tile + tile * 0.70, p.y * tile + tile * 0.30, tile * 0.08, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// PLACE FOOD
function placeFood() {
    food.x = Math.floor(Math.random() * grid);
    food.y = Math.floor(Math.random() * grid);
}

// GAME OVER
function gameOver() {
    running = false;
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOverScreen").style.display = "block";
}

// RESTART
document.getElementById("restartBtn").onclick = () => location.reload();


// KEYBOARD
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && vy !== 1) { vx = 0; vy = -1; }
    if (e.key === "ArrowDown" && vy !== -1) { vx = 0; vy = 1; }
    if (e.key === "ArrowLeft" && vx !== 1) { vx = -1; vy = 0; }
    if (e.key === "ArrowRight" && vx !== -1) { vx = 1; vy = 0; }
});

// MOBILE CONTROLS
document.querySelectorAll(".arrow-btn").forEach(btn => {
    btn.addEventListener("touchstart", () => {
        let d = btn.dataset.dir;

        if (d === "UP" && vy !== 1) { vx = 0; vy = -1; }
        if (d === "DOWN" && vy !== -1) { vx = 0; vy = 1; }
        if (d === "LEFT" && vx !== 1) { vx = -1; vy = 0; }
        if (d === "RIGHT" && vx !== -1) { vx = 1; vy = 0; }
    });
});
