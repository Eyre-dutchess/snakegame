const scoreEl = document.querySelector(".score");
const highScoreEl = document.querySelector(".high-score");
const gameBoardEl = document.querySelector(".game-board");
const resetEl = document.querySelector(".reset-game");

let gameStarted = false
const gridSize = 20;
let highScore = 0;
let snake = [{x:10, y:10}];
let food = generateFood()
let gameSpeedDelay = 400;
let direction = "right";
let gameInterval ;

function checkCollision(){
    const head = snake[0];
    console.log("collision", head);
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame()
    }
    for(let i = 1; i < snake.length; i ++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame()
        }
    }
}
function createElement(tag, className){
    const tempEl = document.createElement(tag);
    tempEl.className = className;
    return tempEl
}
function draw(){
    gameBoardEl.innerHTML = " ";
    drawSnake();
    drawFood();
    updateScore()
}
function drawFood(){
    if(gameStarted){
        const foodEl = createElement("div", "food");
        setPosition(foodEl, food);
        gameBoardEl.appendChild(foodEl)
    }
}
function drawSnake(){
    if(gameStarted){
        snake.forEach((segment)=>{
            const snakeEl = createElement("div", "snake");
            setPosition(snakeEl, segment);
            gameBoardEl.appendChild(snakeEl)
        })
    }
}
function generateFood(){
    const x = Math.floor(Math.random()* gridSize) + 1;
    const y = Math.floor(Math.random()* gridSize) + 1;
    return {x, y}
}
function handleKeyPress(e){
    if((!gameStarted && e.code === "Space")||
        (!gameStarted && e.key === " ")){
            startGame()
        }
    else{
        switch(e.key){
            case "ArrowUp":
                direction = "up";
                break;
            case "ArrowDown":
                direction = "down";
                break;
            case "ArrowLeft":
                direction = "left";
                break;
            case "ArrowRight":
                direction = "right";
                break;
        }
    }
}
function increaseSpeed(){
    if(gameSpeedDelay > 300){
        gameSpeedDelay -= 5
    }else if(gameSpeedDelay > 200){
        gameSpeedDelay -= 3
    }else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 2
    }else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 1
    }
}
function playerMove(){
    const head = {...snake[0]};
    console.log("playermove", head)
    if(snake.length ===1){
        switch(direction){
            case "up":
                head.y --
                break;
            case "down":
                head.y ++
                break;
            case "left":
                head.x --
                break;
            case "right":
                head.x ++
                break;
            }
    }else{
        if((snake[0].y < snake[1].y) && direction === "down"){
            head.x --;
            
        }else if(direction === "down"){
            head.y ++
            
        }else if((snake[0].y > snake[1].y) && direction === "up"){
            head.x ++;
        }else if(direction === "up"){
            head.y --
            
        }else if((snake[0].x < snake[1].x) && direction === "right"){
            head.y ++;
            
        }else if(direction === "right"){
            head.x ++
            
        }else if((snake[0].x > snake[1].x) && direction === "left"){
            head.y --;
            
        }else if(direction === "left"){
            head.x --
            
        }
    }
    snake.unshift(head)
    if(head.x === food.x && head.y === food.y){
       food= generateFood();
       increaseSpeed();
       clearInterval(gameInterval);
       gameInterval = setInterval(()=>{
            playerMove()
            checkCollision()
            draw()
        }, gameSpeedDelay)
    }else{
        snake.pop()
    }
}
function resetGame(){
    updateHighScore()
    stopGame()
    snake = [{x:10, y:10}];
    food = generateFood();
    direction = "right";
    gameSpeedDelay = 300;
    updateScore()
}
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}
function startGame(){
    gameStarted = true
    resetEl.style.display = "none";
    gameInterval = setInterval(()=>{
        playerMove();
        checkCollision();
        draw()
    }, gameSpeedDelay)
}
function stopGame(){
    resetEl.style.display = "flex";
    clearInterval(gameInterval);
    gameStarted = false
}
function updateHighScore(){
    const curScore = snake.length - 1;
    if(curScore > highScore){
        highScore = curScore
    }
    highScoreEl.textContent = highScore.toString().padStart(3, "0")
}
function updateScore(){
    const curScore = snake.length - 1
    scoreEl.textContent = curScore.toString().padStart(3, "0")
}
document.addEventListener("keydown", handleKeyPress)