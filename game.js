const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

let player
let bullets=[]
let zombies=[]
let explosions=[]
let powerups=[]

let score=0
let level=1
let health=3

let highScore = localStorage.getItem("zombieHighScore") || 0

let keys={}
let mouse={x:0,y:0}

let gameRunning=false
let canShoot=true

document.addEventListener("keydown",e=>{
keys[e.key]=true
})

document.addEventListener("keyup",e=>{
keys[e.key]=false
})

canvas.addEventListener("mousemove",e=>{
const rect=canvas.getBoundingClientRect()
mouse.x=e.clientX-rect.left
mouse.y=e.clientY-rect.top
})

canvas.addEventListener("click",shoot)

function createPlayer(){

player={
x:200,
y:250,
size:20,
speed:5,
boost:false
}

}

function shoot(){

if(!gameRunning || !canShoot)return

let angle=Math.atan2(mouse.y-player.y,mouse.x-player.x)

bullets.push({
x:player.x,
y:player.y,
dx:Math.cos(angle)*8,
dy:Math.sin(angle)*8
})

canShoot=false

setTimeout(()=>{
canShoot=true
},250)

}

function spawnZombie(){

let side=Math.random()

let x,y

if(side<0.5){
x=canvas.width
y=Math.random()*canvas.height
}else{
x=Math.random()*canvas.width
y=0
}

zombies.push({
x:x,
y:y,
size:20,
speed:1+level*0.3
})

}

function spawnPowerup(){

let type=Math.random()<0.5?"health":"speed"

powerups.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
type:type,
size:15
})

}

function updatePlayer(){

let speed=player.boost?8:5

if(keys["w"]||keys["ArrowUp"])player.y-=speed
if(keys["s"]||keys["ArrowDown"])player.y+=speed
if(keys["a"]||keys["ArrowLeft"])player.x-=speed
if(keys["d"]||keys["ArrowRight"])player.x+=speed

}

function updateBullets(){

bullets.forEach((b,i)=>{

b.x+=b.dx
b.y+=b.dy

if(b.x<0||b.x>canvas.width||b.y<0||b.y>canvas.height){
bullets.splice(i,1)
}

})

}

function updateZombies(){

zombies.forEach((z,i)=>{

let angle=Math.atan2(player.y-z.y,player.x-z.x)

z.x+=Math.cos(angle)*z.speed
z.y+=Math.sin(angle)*z.speed

let dx=z.x-player.x
let dy=z.y-player.y
let dist=Math.sqrt(dx*dx+dy*dy)

if(dist<25){

zombies.splice(i,1)

health--

document.getElementById("health").innerText="❤️ "+health

if(health<=0){
gameOver()
}

}

})

}

function updateExplosions(){

explosions.forEach((e,i)=>{

e.radius+=2

if(e.radius>20){
explosions.splice(i,1)
}

})

}

function collision(){

bullets.forEach((b,bi)=>{

zombies.forEach((z,zi)=>{

let dx=b.x-z.x
let dy=b.y-z.y

let dist=Math.sqrt(dx*dx+dy*dy)

if(dist<20){

explosions.push({
x:z.x,
y:z.y,
radius:2
})

zombies.splice(zi,1)
bullets.splice(bi,1)

score++

document.getElementById("score").innerText="Score: "+score

checkLevel()

}

})

})

}

function checkPowerups(){

powerups.forEach((p,i)=>{

let dx=p.x-player.x
let dy=p.y-player.y

let dist=Math.sqrt(dx*dx+dy*dy)

if(dist<25){

if(p.type==="health"){

health++

document.getElementById("health").innerText="❤️ "+health

}

if(p.type==="speed"){

player.boost=true

setTimeout(()=>{
player.boost=false
},5000)

}

powerups.splice(i,1)

}

})

}

function checkLevel(){

if(score%10===0){

level++

document.getElementById("level").innerText="Level: "+level

}

}

function drawPlayer(){

ctx.fillStyle="cyan"

ctx.beginPath()
ctx.arc(player.x,player.y,player.size,0,Math.PI*2)
ctx.fill()

}

function drawBullets(){

ctx.fillStyle="lime"

bullets.forEach(b=>{

ctx.beginPath()
ctx.arc(b.x,b.y,5,0,Math.PI*2)
ctx.fill()

})

}

function drawZombies(){

ctx.fillStyle="red"

zombies.forEach(z=>{

ctx.beginPath()
ctx.arc(z.x,z.y,z.size,0,Math.PI*2)
ctx.fill()

})

}

function drawExplosions(){

ctx.fillStyle="orange"

explosions.forEach(e=>{

ctx.beginPath()
ctx.arc(e.x,e.y,e.radius,0,Math.PI*2)
ctx.fill()

})

}

function drawPowerups(){

powerups.forEach(p=>{

ctx.fillStyle=p.type==="health"?"pink":"yellow"

ctx.beginPath()
ctx.arc(p.x,p.y,p.size,0,Math.PI*2)
ctx.fill()

})

}

function gameLoop(){

if(!gameRunning)return

ctx.clearRect(0,0,canvas.width,canvas.height)

updatePlayer()
updateBullets()
updateZombies()
updateExplosions()

collision()
checkPowerups()

drawPlayer()
drawBullets()
drawZombies()
drawExplosions()
drawPowerups()

requestAnimationFrame(gameLoop)

}

let zombieInterval
let powerInterval

function startGame(){

document.getElementById("startBtn").style.display="none"

createPlayer()

gameRunning=true

zombieInterval=setInterval(spawnZombie,2000)
powerInterval=setInterval(spawnPowerup,8000)

gameLoop()

}

function gameOver(){

gameRunning=false

clearInterval(zombieInterval)
clearInterval(powerInterval)

if(score>highScore){

highScore=score

localStorage.setItem("zombieHighScore",score)

}

document.getElementById("gameOverScreen").classList.remove("hidden")

document.getElementById("finalScore").innerText=
"Final Score: "+score+" | High Score: "+highScore

}

function restartGame(){

location.reload()

}