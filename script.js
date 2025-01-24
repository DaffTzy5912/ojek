const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ojek = { x: 180, y: 400, width: 40, height: 50, speed: 5 };
let passengers = [];
let obstacles = [];
let score = 0;
let gameOver = false;

function drawOjek() {
    ctx.fillStyle = "green";
    ctx.fillRect(ojek.x, ojek.y, ojek.width, ojek.height);
}

function drawPassengers() {
    ctx.fillStyle = "blue";
    passengers.forEach(p => ctx.fillRect(p.x, p.y, p.size, p.size));
}

function drawObstacles() {
    ctx.fillStyle = "red";
    obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.width, o.height));
}

function updateGame() {
    if (gameOver) {
        alert("Game Over! Skor Anda: " + score);
        document.location.reload();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOjek();
    drawPassengers();
    drawObstacles();

    passengers.forEach(p => p.y += 2);
    passengers = passengers.filter(p => p.y < canvas.height);

    obstacles.forEach(o => o.y += 3);
    obstacles = obstacles.filter(o => o.y < canvas.height);

    passengers.forEach((p, i) => {
        if (ojek.x < p.x + p.size && ojek.x + ojek.width > p.x && ojek.y < p.y + p.size && ojek.y + ojek.height > p.y) {
            passengers.splice(i, 1);
            score += 10;
            document.getElementById("score").innerText = "Skor: " + score;
        }
    });

    obstacles.forEach(o => {
        if (ojek.x < o.x + o.width && ojek.x + ojek.width > o.x && ojek.y < o.y + o.height && ojek.y + ojek.height > o.y) {
            gameOver = true;
        }
    });

    requestAnimationFrame(updateGame);
}

function spawnPassenger() {
    let size = 20;
    passengers.push({ x: Math.random() * (canvas.width - size), y: 0, size: size });
}

function spawnObstacle() {
    let width = 40, height = 40;
    obstacles.push({ x: Math.random() * (canvas.width - width), y: 0, width: width, height: height });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && ojek.x > 0) ojek.x -= ojek.speed;
    if (e.key === "ArrowRight" && ojek.x < canvas.width - ojek.width) ojek.x += ojek.speed;
});

setInterval(spawnPassenger, 2000);
setInterval(spawnObstacle, 1500);

updateGame();
