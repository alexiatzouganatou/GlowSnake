const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// FIX: Proper canvas size
canvas.width = 420;
canvas.height = 420;

let tile = 20;
let grid = canvas.width / tile;

let speed = 150;
let snake = [{ x: 5, y: 5 }];
let vx = 1, vy = 0;

let food = { x: 10, y: 10 };
let score = 0;

let highScore = localStorage.getItem("glowHigh") || 0;
document.getElementById("highScore").textContent = highScore;

document.getElementById("playBtn").onclick = () => {
    document.getElementById("startScreen").style.display = "none";
    document.querySelector(".game-container").style.display = "flex";
    gameLoop();
};

function gameLoop() {
    let head = {
        x: snake[0].x + vx,
        y: snake[0].y + vy
    };

    // wall collision
    if (head.x < 0 || head.x >= grid || head.y < 0 || head.y >= grid) {
        return gameOver();
    }

    // body collision
    for (let p of snake) {
        if (p.x === head.x && p.y === head.y) return gameOver();
    }

    snake.unshift(head);

    // eating
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // food
    ctx.fillStyle = "#00c7a5";
    ctx.beginPath();
    ctx.arc(food.x * tile + tile / 2, food.y * tile + tile / 2, tile / 2, 0, Math.PI * 2);
    ctx.fill();

    // snake
    for (let i = 0; i < snake.length; i++) {
        let s = snake[i];
        ctx.fillStyle = i === 0 ? "#333" : "#555";
        ctx.beginPath();
        ctx.arc(s.x * tile + tile / 2, s.y * tile + tile / 2, tile / 2, 0, Math.PI * 2);
        ctx.fill();

        // eyes
        if (i === 0) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(s.x * tile + 6, s.y * tile + 6, 3, 0, Math.PI * 2);
            ctx.arc(s.x * tile + 14, s.y * tile + 6, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * grid);
    food.y = Math.floor(Math.random() * grid);
}

function gameOver() {
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOverScreen").style.display = "block";
}

document.getElementById("restartBtn").onclick = () => location.reload();

// keyboard
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && vy !== 1) { vx = 0; vy = -1; }
    if (e.key === "ArrowDown" && vy !== -1) { vx = 0; vy = 1; }
    if (e.key === "ArrowLeft" && vx !== 1) { vx = -1; vy = 0; }
    if (e.key === "ArrowRight" && vx !== -1) { vx = 1; vy = 0; }
});

// mobile
document.querySelectorAll(".arrow-btn").forEach(btn => {
    btn.onclick = () => {
        let d = btn.dataset.dir;
        if (d === "UP" && vy !== 1) { vx = 0; vy = -1; }
        if (d === "DOWN" && vy !== -1) { vx = 0; vy = 1; }
        if (d === "LEFT" && vx !== 1) { vx = -1; vy = 0; }
        if (d === "RIGHT" && vx !== -1) { vx = 1; vy = 0; }
    };
});
