const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ojek = { x: 225, y: 500, width: 50, height: 50, speed: 5 };
let order = null;
let balance = 0;
let traffic = [];
let gameRunning = true;

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

function drawTraffic() {
    ctx.fillStyle = "red";
    traffic.forEach(car => {
        ctx.fillRect(car.x, car.y, car.width, car.height);
    });
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOjek();
    drawOrder();
    drawTraffic();

    // Update posisi kendaraan lain
    traffic.forEach(car => car.y += 2);
    traffic = traffic.filter(car => car.y < canvas.height);

    // Cek jika ojek sampai ke lokasi jemput
    if (order && !order.pickedUp && checkCollision(ojek, order.pickup)) {
        order.pickedUp = true;
        document.getElementById("status").innerText = "Mengantar pelanggan...";
    }

    // Cek jika ojek sampai ke tujuan
    if (order && order.pickedUp && checkCollision(ojek, order.destination)) {
        balance += 10000;
        document.getElementById("money").innerText = "Saldo: Rp " + balance;
        document.getElementById("status").innerText = "Menunggu pesanan...";
        order = null;
        setTimeout(generateOrder, 2000);
    }

    // Cek tabrakan dengan kendaraan lain
    traffic.forEach(car => {
        if (checkCollision(ojek, car)) {
            alert("Kamu kecelakaan! Game Over.");
            gameRunning = false;
        }
    });

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

function generateTraffic() {
    traffic.push({
        x: Math.random() * (canvas.width - 50),
        y: 0,
        width: 50,
        height: 50
    });
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + 30 &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + 30 &&
           obj1.y + obj1.height > obj2.y;
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && ojek.x > 0) ojek.x -= ojek.speed;
    if (e.key === "ArrowRight" && ojek.x < canvas.width - ojek.width) ojek.x += ojek.speed;
    if (e.key === "ArrowUp" && ojek.y > 0) ojek.y -= ojek.speed;
    if (e.key === "ArrowDown" && ojek.y < canvas.height - ojek.height) ojek.y += ojek.speed;
});

setInterval(generateTraffic, 3000);
setTimeout(generateOrder, 2000);
updateGame();
