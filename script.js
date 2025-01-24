const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ojek = { x: 225, y: 500, width: 50, height: 50, speed: 5 };
let order = null;
let balance = 0;
let fuel = 100;
let timeLeft = 60;
let gameRunning = true;

// Tombol kontrol
document.getElementById("up").addEventListener("click", () => moveOjek("up"));
document.getElementById("down").addEventListener("click", () => moveOjek("down"));
document.getElementById("left").addEventListener("click", () => moveOjek("left"));
document.getElementById("right").addEventListener("click", () => moveOjek("right"));

function drawOjek() {
    ctx.fillStyle = "green";
    ctx.fillRect(ojek.x, ojek.y, ojek.width, ojek.height);
}

function drawOrder() {
    if (order) {
        ctx.fillStyle = "blue";
        ctx.fillRect(order.pickup.x, order.pickup.y, 30, 30);
        if (order.pickedUp) {
            ctx.fillStyle = "orange";
            ctx.fillRect(order.destination.x, order.destination.y, 30, 30);
        }
    }
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOjek();
    drawOrder();

    // Cek jemput pelanggan
    if (order && !order.pickedUp && checkCollision(ojek, order.pickup)) {
        order.pickedUp = true;
        document.getElementById("status").innerText = "Mengantar pelanggan...";
    }

    // Cek antar pelanggan
    if (order && order.pickedUp && checkCollision(ojek, order.destination)) {
        balance += 10000;
        fuel = Math.min(fuel + 20, 100);
        document.getElementById("money").innerText = "Saldo: Rp " + balance;
        document.getElementById("fuel").innerText = "Bensin: " + fuel + "%";
        document.getElementById("status").innerText = "Menunggu pesanan...";
        order = null;
        setTimeout(generateOrder, 2000);
    }

    requestAnimationFrame(updateGame);
}

function generateOrder() {
    order = {
        pickup: { x: Math.random() * (canvas.width - 30), y: Math.random() * (canvas.height / 2) },
        destination: { x: Math.random() * (canvas.width - 30), y: Math.random() * (canvas.height / 2) },
        pickedUp: false
    };
    document.getElementById("status").innerText = "Ada pesanan! Pergi ke lokasi jemput.";
}

function moveOjek(direction) {
    if (!gameRunning || fuel <= 0) return;

    if (direction === "left" && ojek.x > 0) ojek.x -= ojek.speed;
    if (direction === "right" && ojek.x < canvas.width - ojek.width) ojek.x += ojek.speed;
    if (direction === "up" && ojek.y > 0) ojek.y -= ojek.speed;
    if (direction === "down" && ojek.y < canvas.height - ojek.height) ojek.y += ojek.speed;

    fuel -= 0.5;
    document.getElementById("fuel").innerText = "Bensin: " + Math.max(0, fuel) + "%";

    if (fuel <= 0) {
        document.getElementById("status").innerText = "Bensin habis! Game Over.";
        gameRunning = false;
    }
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + 30 &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + 30 &&
           obj1.y + obj1.height > obj2.y;
}

function countdown() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById("time").innerText = "Waktu: " + timeLeft + "s";
    } else {
        document.getElementById("status").innerText = "Waktu habis! Game Over.";
        gameRunning = false;
    }
}

setInterval(countdown, 1000);
setTimeout(generateOrder, 2000);
updateGame();
