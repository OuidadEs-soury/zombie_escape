const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
    x: 400,
    y: 250,
    size: 20,
    speed: 5
};

let bullets = [];
let zombies = [];
let score = 0;

let keys = {};

document.addEventListener("keydown", e => {
    keys[e.key] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

document.addEventListener("click", shoot);

function shoot() {
    bullets.push({
        x: player.x,
        y: player.y,
        speed: 7
    });
}

function spawnZombie() {

    let y = Math.random() * canvas.height;

    zombies.push({
        x: canvas.width,
        y: y,
        size: 20,
        speed: 1 + Math.random()
    });
}

function updatePlayer() {

    if (keys["w"] || keys["ArrowUp"]) player.y -= player.speed;
    if (keys["s"] || keys["ArrowDown"]) player.y += player.speed;
    if (keys["a"] || keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["d"] || keys["ArrowRight"]) player.x += player.speed;
}

function updateBullets() {

    bullets.forEach(b => {
        b.x += b.speed;
    });
}

function updateZombies() {

    zombies.forEach(z => {
        z.x -= z.speed;
    });
}

function collisionDetection() {

    bullets.forEach((b, bIndex) => {

        zombies.forEach((z, zIndex) => {

            let dx = b.x - z.x;
            let dy = b.y - z.y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20) {

                zombies.splice(zIndex, 1);
                bullets.splice(bIndex, 1);

                score++;

                document.getElementById("score").innerText =
                    "Score: " + score;
            }

        });

    });

}

function drawPlayer() {

    ctx.fillStyle = "blue";

    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();
}

function drawBullets() {

    ctx.fillStyle = "lime";

    bullets.forEach(b => {

        ctx.beginPath();
        ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
        ctx.fill();

    });

}

function drawZombies() {

    ctx.fillStyle = "red";

    zombies.forEach(z => {

        ctx.beginPath();
        ctx.arc(z.x, z.y, z.size, 0, Math.PI * 2);
        ctx.fill();

    });

}

function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    updateBullets();
    updateZombies();

    collisionDetection();

    drawPlayer();
    drawBullets();
    drawZombies();

    requestAnimationFrame(gameLoop);
}

function startGame() {

    setInterval(spawnZombie, 2000);

    gameLoop();
}