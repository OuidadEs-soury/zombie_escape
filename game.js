const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

let player = {
    x:400,
    y:250,
    size:20,
    speed:4
}

let zombies = []
let bullets = []
let score = 0
let gameRunning = true

let keys = {}

document.addEventListener("keydown",e=>{
    keys[e.key]=true
})

document.addEventListener("keyup",e=>{
    keys[e.key]=false
})

document.addEventListener("click",shoot)

function shoot(){
    bullets.push({
        x:player.x,
        y:player.y,
        dx:0,
        dy:-7,
        size:5
    })
}

function spawnZombie(){
    zombies.push({
        x:Math.random()*canvas.width,
        y:0,
        size:20,
        speed:1 + Math.random()*1.5
    })
}

setInterval(spawnZombie,1500)

function update(){

    if(!gameRunning) return

    if(keys["ArrowLeft"] || keys["a"]) player.x -= player.speed
    if(keys["ArrowRight"] || keys["d"]) player.x += player.speed
    if(keys["ArrowUp"] || keys["w"]) player.y -= player.speed
    if(keys["ArrowDown"] || keys["s"]) player.y += player.speed

    bullets.forEach(b=>{
        b.y += b.dy
    })

    zombies.forEach(z=>{
        if(z.x < player.x) z.x += z.speed
        if(z.x > player.x) z.x -= z.speed
        if(z.y < player.y) z.y += z.speed
        if(z.y > player.y) z.y -= z.speed
    })

    bullets.forEach((b,bi)=>{
        zombies.forEach((z,zi)=>{
            let dist = Math.hypot(b.x-z.x,b.y-z.y)
            if(dist < z.size){
                zombies.splice(zi,1)
                bullets.splice(bi,1)
                score++
                document.getElementById("score").innerText=score
            }
        })
    })

    zombies.forEach(z=>{
        let dist = Math.hypot(player.x-z.x,player.y-z.y)
        if(dist < player.size){
            endGame()
        }
    })

}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height)

    ctx.fillStyle="lime"
    ctx.beginPath()
    ctx.arc(player.x,player.y,player.size,0,Math.PI*2)
    ctx.fill()

    ctx.fillStyle="red"
    zombies.forEach(z=>{
        ctx.beginPath()
        ctx.arc(z.x,z.y,z.size,0,Math.PI*2)
        ctx.fill()
    })

    ctx.fillStyle="yellow"
    bullets.forEach(b=>{
        ctx.beginPath()
        ctx.arc(b.x,b.y,b.size,0,Math.PI*2)
        ctx.fill()
    })

}

function gameLoop(){
    update()
    draw()
    requestAnimationFrame(gameLoop)
}

gameLoop()

function endGame(){
    gameRunning=false
    document.getElementById("gameOver").classList.remove("hidden")
}

function restartGame(){
    zombies=[]
    bullets=[]
    score=0
    player.x=400
    player.y=250
    gameRunning=true
    document.getElementById("score").innerText=0
    document.getElementById("gameOver").classList.add("hidden")
}