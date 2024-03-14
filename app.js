(function() {

let playerId;
let playerRef;
let allApplesRef;
let players = {};
let queueList = [];
let myFunc = new Worker("holder.js");
let worker = new Worker("holder.js");
let countingDown = false;
let count;
let alreadyStartedCountDown = false;
let someonePlayingGame = false;
let moves = [];
let apples = [];
let gameIsRunning = false;

const snakeGrid = document.getElementById("snakeGrid");
const gameOverScreen = document.getElementById("gameOverScreen");
const ranIntoSnakeName = document.getElementById("ranIntoSnakeName");
const stats = document.getElementById("stats");
const menu = document.getElementById("menu");
let titleScreen = document.getElementById("TitleScreen");

moves.push("right");

for (let i = 0; i < 20; i++) {
    const row = document.createElement("div");
    row.style.display = "flex";
    for (let j = 0; j < 50; j++) {
        const box = document.createElement("div")
        box.id = j + "," + i;
        box.classList.add("box");
        box.style.width = (parseInt(snakeGrid.clientWidth) / 50) + "px";
        box.style.height = (parseInt(snakeGrid.clientWidth) / 50) + "px";
        row.appendChild(box);
    }
    snakeGrid.appendChild(row);
}

const previewSnake = document.getElementById("previewSnake");

for (let i = 0; i < 5; i++) {
    const previewSnakeBlock = document.createElement("div");
    previewSnakeBlock.style.width = (parseInt(snakeGrid.clientWidth) / 50) + "px";
    previewSnakeBlock.style.height = (parseInt(snakeGrid.clientWidth) / 50) + "px";
    previewSnakeBlock.style.backgroundColor = "green";
    previewSnakeBlock.style.border = "1px solid black";
    previewSnake.appendChild(previewSnakeBlock);
}

const usernameInput = document.getElementById("usernameInput");
const snakeName = document.getElementById("snakeName");

usernameInput.addEventListener("input", function (event) {
    if (playerId != null && players[playerId].queued) {
        event.preventDefault();
    }
    else {
        snakeName.innerHTML = usernameInput.value;
    }
});

const arrowRight = document.getElementsByClassName("arrow")[1];
const arrowLeft = document.getElementsByClassName("arrow")[0];


let nameOfSnakes = [];

const background = document.getElementById("background");

// background.appendChild(nameOfSnake);


let colors = ["green", "orange", "blue", "yellow", "red", "purple", "pink", "black", "white"];
let colorIndex = 0;

var children = previewSnake.children;


arrowRight.addEventListener('click', function () {
    colorIndex++;
    if (colorIndex >= colors.length) {
        colorIndex = 0;
    }
    for (let i = 0; i < children.length; i++) {
        children[i].style.backgroundColor = colors[colorIndex];
    }
});

arrowLeft.addEventListener('click', function () {
    colorIndex--;
    if (colorIndex < 0) {
        colorIndex = colors.length - 1;
    }
    for (let i = 0; i < children.length; i++) {
        children[i].style.backgroundColor = colors[colorIndex];
    }
});

menu.addEventListener('click', function () {
    players[playerId].died = false;
    usernameInput.readOnly = false;
    queued = false;
    JoinButton.innerHTML = "Join";
    queueWait.style.display = "none";
    arrowLeft.style.display = "block";
    arrowRight.style.display = "block";
    players[playerId].queued = false;
    players[playerId].queueCounter = 15;
    alreadyStartedCountDown = false;
    countingDown = false;
    playerRef.set(players[playerId]);
    gameOverScreen.style.display = "none";
    titleScreen.style.display = "flex";
    moves = [];
    apples = [];
    gameIsRunning = false;
    moves.push("right");
    nameOfSnakes = [];
});

let queued = false;

let queueWait = document.getElementById("queueWait");

JoinButton.addEventListener('click', function () {

    if (!queued) {
        usernameInput.readOnly = true;
        queued = true;
        JoinButton.innerHTML = "Leave";
        queueWait.style.display = "block";
        arrowLeft.style.display = "none";
        arrowRight.style.display = "none";

        if (playerId == null) {

            firebase.auth().onAuthStateChanged((user) => {
                //means the users is logged in the site
                if (user) {
                    //sets the users playerId to the user.uid
                    playerId = user.uid;
                    //makes a reference to the current player object
                    playerRef = firebase.database().ref(`players/${playerId}`);

                    

                    //picks a random x value for the user to start in
                    let randomX = Math.floor(Math.random() * 50);
                    //picks a random y value for the user to start in
                    let randomY = Math.floor(Math.random() * 20);

                    //id (holds the users id)
                    //name (holds the snakes actual name)
                    //inGame = false (means player is in or out game)
                    //x = [] (keeps track of players x positions)
                    //y = [] (keeps track of players y positions)
                    //queued (checks to see if the player is in the queue or not)
                    //color (holds the users snakes color)

                    //initalizes the player object

                    playerRef.set({
                        id: playerId,
                        name: snakeName.innerHTML,
                        inGame: false,
                        x: [randomX, randomX-1, randomX-2],
                        y: [randomY, randomY, randomY],
                        queued: true,
                        color: colors[colorIndex],
                        queueCounter: 15,
                        died: false
                    })

                    //if the player disconnects it needs to be removed from the player reference
                    playerRef.onDisconnect().remove();

                    //creates a reference to all the players in the database
                    const allPlayersRef = firebase.database().ref(`players`);

                    allApplesRef = firebase.database().ref(`apples`);

                    allApplesRef.on("child_added", (snapshot) => {
                        const apple = snapshot.val();
                        apples.push(apple);
                        const appleElement = document.getElementById(apple.x + "," + apple.y);
                        appleElement.style.backgroundColor = "red";
                    })

                    allApplesRef.on("child_removed", (snapshot) => {
                        const apple = snapshot.val();
                        for(let i = 0; i < apples.length; i++){
                            if(apples[i].x == apple.x && apples[i].y == apple.y){
                                apples.splice(i, 1);
                                i--;
                            }
                        }
                    });

                    

                    

                    //means any value from any player was updated
                    allPlayersRef.on("value", (snapshot) => {

                        for (let i = 0; i < 20; i++) {
                            for (let j = 0; j < 50; j++) {
                                const boxHolder = document.getElementById(j + "," + i);
                                boxHolder.style.backgroundColor = "gray";
                            }
                        }

                        for(let i = 0; i < apples.length; i++){
                            const appleHolder = document.getElementById(apples[i].x + "," + apples[i].y);
                            appleHolder.style.backgroundColor = "red";
                        }

                        players = snapshot.val() || {};
                        let playerNotInGameCounter = 0;
                        let totalPlayers = 0;
                        Object.keys(players).forEach(key => {
                            totalPlayers++;
                            const characterState = players[key];
                            if (players[key].queued && !queueList.includes(players[key].id)) {
                                queueList.push(players[key].id);
                            }
                            if (!players[key].queued && queueList.includes(players[key].id)) {
                                for (let i = 0; i < queueList.length; i++) {
                                    if (queueList[i] == players[key].id) {
                                        queueList.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                            if (players[key].inGame) {

                                for(let j = 0; j < players[key].x.length; j++){
                                    let snake = document.getElementById(players[key].x[j] + "," + players[key].y[j]);
                                    snake.style.backgroundColor = players[key].color;
                                    
                                }

                                let head = document.getElementById(players[key].x[0] + "," + players[key].y[0]);
                                for(let i = 0; i < nameOfSnakes.length; i++){
                                    if(nameOfSnakes[i][0] == key){
                                        nameOfSnakes[i][1].style.left = head.getBoundingClientRect().left + "px";
                                        nameOfSnakes[i][1].style.top = head.getBoundingClientRect().top + "px";
                                        break;
                                    }
                                }
                                someonePlayingGame = true;
                            }
                            else{
                                playerNotInGameCounter++;
                                if(players[key].died){
                                    for(let i = 0; i < nameOfSnakes.length; i++){
                                        if(nameOfSnakes[i][0] == key){
                                            background.removeChild(nameOfSnakes[i][1]);
                                            nameOfSnakes.splice(i, 1);
                                            nameOfSnakes.splice(i, 0);
                                            break;
                                        }
                                    }
                                }
                            }
                        })

                        if(playerNotInGameCounter == totalPlayers){
                            someonePlayingGame = false;
                            for(let i = apples.length-1; i >= 0; i--){
                                firebase.database().ref(`apples/${apples[i].x + "," + apples[i].y}`).remove();
                            }
                        }
                        
                        for (let i = 0; i < queueList.length; i++) {
                            if (players[queueList[i]] == null) {
                                queueList.splice(i, 1);
                                i--;
                            }
                        }
                        if (queueWait.style.display != 'none' && players[playerId].queueCounter == 15 && !players[playerId].inGame && !alreadyStartedCountDown) {
                            queueWait.innerHTML = "Player List";
                            const timer = document.createElement("h1");
                            timer.classList.add("playerListName")
                            if (someonePlayingGame) {
                                timer.innerText = "Wait For Game To End";
                                queueWait.appendChild(timer);
                            }
                            else {
                                timer.innerText = "Need More PLayers To Start";
                                queueWait.appendChild(timer);
                                if (queueList.length >= 2 && !alreadyStartedCountDown) {
                                    alreadyStartedCountDown = true;
                                    count = 15;
                                    for (let i = 0; i < queueList.length; i++) {
                                        if (players[queueList[i]].queueCounter < 15) {
                                            count = players[queueList[i]].queueCounter;
                                            break;
                                        }
                                    }
                                    myFunc = new Worker('queueInterval.js');
                                    countingDown = true;
                                    myFunc.onmessage = function() {
                                        
                                        timer.innerText = "Game Starts In: " + count + "s";
                                        let anyOneInGame = false;
                                        Object.keys(players).forEach(key => {
                                            if (players[key].inGame) {
                                                anyOneInGame = true;
                                            }
                                        })
                                        if (queueList.length < 2 && !anyOneInGame) {
                                            players[playerId].queueCounter = 15;
                                            alreadyStartedCountDown = false;
                                            playerRef.set(players[playerId]);
                                            myFunc.terminate();
                                        }
                                        else {
                                            if (count <= 0) {
                                                //game is actually starting
                                                placeApple();
                                                gameIsRunning = true;
                                                
                                                titleScreen.style.display = 'none';
                                                let named = [];
                                                for (let i = 0; i < queueList.length; i++) {
                                                    named .push(queueList[i]);
                                                    players[queueList[i]].inGame = true;
                                                    players[queueList[i]].queued = false;
                                                    queued = false;
                                                    let snake = document.getElementById(players[queueList[i]].x[0] + "," + players[queueList[i]].y[0]);
                                                    snake.style.backgroundColor = players[queueList[i]].color;

                                                    nameOfSnakes.push([queueList[i], document.createElement("div")]);
                                                    nameOfSnakes[i][1].classList.add("snakeName");
                                                    nameOfSnakes[i][1].id = queueList[i];
                                                    nameOfSnakes[i][1].innerHTML = players[queueList[i]].name;
                                                    nameOfSnakes[i][1].style.position = "absolute";
                                                    nameOfSnakes[i][1].style.left = document.getElementById(players[queueList[i]].x[0] + "," + players[queueList[i]].y[0]).getBoundingClientRect().left + "px";
                                                    nameOfSnakes[i][1].style.top = (document.getElementById(players[queueList[i]].x[0] + "," + players[queueList[i]].y[0]).getBoundingClientRect().top-5) + "px";
                                                    nameOfSnakes[i][1].style.display = "block";
                                                    background.appendChild(nameOfSnakes[i][1])
                                                }

                                                Object.keys(players).forEach(key => {
                                                    if(players[key].inGame && !named.includes(key)){
                                                        nameOfSnakes.push([key, document.createElement("div")]);
                                                        nameOfSnakes[nameOfSnakes.length-1][1].classList.add("snakeName");
                                                        nameOfSnakes[nameOfSnakes.length-1][1].id = key;
                                                        nameOfSnakes[nameOfSnakes.length-1][1].innerHTML = players[key].name;
                                                        nameOfSnakes[nameOfSnakes.length-1][1].style.position = "absolute";
                                                        nameOfSnakes[nameOfSnakes.length-1][1].style.left = document.getElementById(players[key].x[0] + "," + players[key].y[0]).getBoundingClientRect().left + "px";
                                                        nameOfSnakes[nameOfSnakes.length-1][1].style.top = (document.getElementById(players[key].x[0] + "," + players[key].y[0]).getBoundingClientRect().top-5) + "px";
                                                        nameOfSnakes[nameOfSnakes.length-1][1].style.display = "block";
                                                        background.appendChild(nameOfSnakes[nameOfSnakes.length-1][1])
                                                    }
                                                })

                                                console.log(nameOfSnakes);
                                                
                                                queueList = [];
                                                // setInterval(gameLoop, 100);
                                                worker = new Worker('gameLoopInterval.js');
                                                worker.onmessage = function() {
                                                    gameLoop();
                                                }

                                                playerRef.set(players[playerId])
                                                alreadyStartedCountDown = false;
                                                myFunc.terminate();
                                            }
                                            count--;
                                            if (queued) {
                                                players[playerId].queueCounter = count;
                                                playerRef.set(players[playerId]);
                                            }
                                        }
                                    }
                                    
                                }
                            }
                            for (let i = 0; i < queueList.length; i++) {
                                const playerName = document.createElement("h1");
                                playerName.classList.add("playerListName")
                                playerName.innerText = "Player: " + (i + 1) + ": " + players[queueList[i]].name;
                                queueWait.appendChild(playerName);
                            }
                        }
                    })
                    //means that a new player wants to join the game
                    allPlayersRef.on("child_added", (snapshot) => {
                        const addedPlayer = snapshot.val();
                    })
                    //remove user
                    allPlayersRef.on("child_removed", (snapshot) => {
                        const removedKey = snapshot.val().id;
                        for(let i = 0; i < nameOfSnakes.length; i++){
                            if(nameOfSnakes[i][0] == removedKey){
                                background.removeChild(nameOfSnakes[i][1]);
                                nameOfSnakes.splice(i, 1);
                                nameOfSnakes.splice(i, 0);
                                break;
                            }
                        }

                        for(let i = 0; i < queueList.length; i++){
                            if(queueList[i] == removedKey){
                                queueList.splice(i);
                                break;
                            }
                        }
                    })
                }
            })
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
            firebase.auth().signInAnonymously();
        }
        else {
            players[playerId].name = snakeName.innerHTML;
            players[playerId].inGame = false;
            players[playerId].queued = true;
            players[playerId].color = colors[colorIndex];
            //update for all users
            playerRef.set(players[playerId]);
        }

    }
    else {
        usernameInput.readOnly = false;
        queued = false;
        JoinButton.innerHTML = "Join";
        queueWait.style.display = "none";
        arrowLeft.style.display = "block";
        arrowRight.style.display = "block";
        players[playerId].queued = false;
        players[playerId].queueCounter = 15;
        alreadyStartedCountDown = false;
        if(!countingDown){
            myFunc.terminate();
        }
        countingDown = false;

        playerRef.set(players[playerId]);
    }
})

document.addEventListener("keydown", (e) => {
    if(gameIsRunning){
        if (players[playerId].inGame) {
            if ((e.key == 'ArrowUp' || e.key == 'W') && moves[moves.length-1] != "down") {
                moves.push("up");
            }
            if (e.key == 'ArrowDown' && moves[moves.length-1] != "up") {
                moves.push("down");
            }
            if (e.key == 'ArrowLeft' && moves[moves.length-1] != "right") {
                moves.push("left");

            }
            if (e.key == 'ArrowRight' && moves[moves.length-1] != "left") {
                moves.push("right");
            }
        }
    }
});

function gameLoop() {
    Object.keys(players).forEach(key => {
        if(players[key].inGame)
        if(players[key].id != playerId){
            for(let i = 0; i < players[key].x.length; i++){
                if(players[playerId].x[0] == players[key].x[i] && players[playerId].y[0] == players[key].y[i]){
                    ranIntoSnakeName.innerHTML = players[key].name;
                    coolLooseAnimation();
                }
            }
        }
        else{
            for(let i = 1; i < players[key].x.length; i++){
                if(players[playerId].x[0] == players[key].x[i] && players[playerId].y[0] == players[key].y[i]){
                    ranIntoSnakeName.innerHTML = "Yourself";
                    coolLooseAnimation();
                    players[playerId].inGame = false;
                }
            }
        }
    })
    for(let i = players[playerId].x.length-1; i > 0; i--){
        players[playerId].x[i] = players[playerId].x[i-1];
        players[playerId].y[i] = players[playerId].y[i-1];
    }
    
    let direction = moves[0];
    if (direction == "right") {
        if (players[playerId].x[0] < 49) {
            players[playerId].x[0]++;
        }
        else {
            players[playerId].x[0] = 0;
        }
    }
    else if (direction == "up") {
        if (players[playerId].y[0] > 0) {
            players[playerId].y[0]--;
        }
        else {
            players[playerId].y[0] = 19;
        }
    }
    else if (direction == "down") {
        if (players[playerId].y[0] < 19) {
            players[playerId].y[0]++;
        }
        else {
            players[playerId].y[0] = 0;
        }
    }
    else if (direction == "left") {
        if (players[playerId].x[0] > 0) {
            players[playerId].x[0]--;
        }
        else {
            players[playerId].x[0] = 49;
        }
    }
    if (moves.length > 1) {
        moves.shift();
    }

    for(let i = 0; i < apples.length; i++){
        if(players[playerId].x[0] == apples[i].x && players[playerId].y[0] == apples[i].y){
            firebase.database().ref(`apples/${apples[i].x + "," + apples[i].y}`).remove();
            players[playerId].x.push(players[playerId].x[players[playerId].x.length-1]);
            players[playerId].y.push(players[playerId].y[players[playerId].y.length-1]);
            placeApple();
        }
    }

    playerRef.set(players[playerId]);

    Object.keys(players).forEach(key => {
        if(players[key].inGame)
        if(players[key].id != playerId){
            for(let i = 0; i < players[key].x.length; i++){
                if(players[playerId].x[0] == players[key].x[i] && players[playerId].y[0] == players[key].y[i]){
                    ranIntoSnakeName.innerHTML = players[key].name;
                    coolLooseAnimation();
                }
            }
        }
        else{
            for(let i = 1; i < players[key].x.length; i++){
                if(players[playerId].x[0] == players[key].x[i] && players[playerId].y[0] == players[key].y[i]){
                    ranIntoSnakeName.innerHTML = "Yourself";
                    coolLooseAnimation();
                    players[playerId].inGame = false;
                }
            }
        }
    })


    playerRef.set(players[playerId]);
}

function coolLooseAnimation(){
    gameOverScreen.style.display = "flex";
    // stats.style.top = "0px";
    stats.style.transition = "0s";
    stats.style.top = "-500px";

    gameOverScreen.style.transition = "0s";
    gameOverScreen.style.backgroundColor = "rgba(255, 165, 165, 0)";
    setTimeout(() => {
        stats.style.transition = "2s";
        stats.style.top = "0px";
        gameOverScreen.style.transition = "1s";

        gameOverScreen.style.backgroundColor = "rgba(255, 165, 165, 0.404)";
    }, 50); // Delay the transition change to ensure it takes effect after the initial style change

    //picks a random x value for the user to start in
    let randomX = Math.floor(Math.random() * 50);
    //picks a random y value for the user to start in
    let randomY = Math.floor(Math.random() * 20);
    worker.terminate();
    playerRef.set({
        id: playerId,
        name: snakeName.innerHTML,
        inGame: false,
        x: [randomX, randomX-1, randomX-2],
        y: [randomY, randomY, randomY],
        queued: false,
        color: colors[colorIndex],
        queueCounter: 15,
        died: true
    })
}

function placeApple(){ 
    //picks a random x value for the user to start in
    let randomX = Math.floor(Math.random() * 50);
    //picks a random y value for the user to start in
    let randomY = Math.floor(Math.random() * 20);
    
    const appleRef = firebase.database().ref(`apples/${randomX + "," + randomY}`)
    appleRef.set({
        x: randomX,
        y: randomY
    })
}
})();