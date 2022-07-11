// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
import { getDatabase, ref, set, onDisconnect, onValue, onChildAdded, onChildRemoved, get, child, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_N4MUBtnNsmZi2Mip0EbnHNtnytP44Ww",
  authDomain: "amongusclone-53a59.firebaseapp.com",
  databaseURL: "https://amongusclone-53a59-default-rtdb.firebaseio.com",
  projectId: "amongusclone-53a59",
  storageBucket: "amongusclone-53a59.appspot.com",
  messagingSenderId: "850151153699",
  appId: "1:850151153699:web:5388ec319c419041889196"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");

var ss = new Image; ss.src = "spritesheet.png";
var aml = new Image; aml.src = "amonguslobby.png";
var amm10 = new Image; amm10.src = "amongusmenu1-0.png";
var amm11 = new Image; amm11.src = "amongusmenu1-1.png";
var ssRed = new Image; ssRed.src = "spritesheet_red.png";

window.addEventListener("keydown", keyPressed, false);
window.addEventListener("keyup", keyReleased, false);

var keys = [];
var type = [];

function keyPressed(event){
    keys[event.keyCode] = true;
    // 8 = backspace, 13 = enter
    if (event.keyCode != 8 && event.keyCode != 13) {
        type.push(event.keyCode);
    } else {
        if (event.keyCode == 8) {
            type.pop();
        }
    }
}

function keyReleased(event){
    keys[event.keyCode] = false;
}

var mX;
var mY;

window.addEventListener("mousemove", function(evt) {
    mX = evt.clientX - c.getBoundingClientRect().left;
    mY = evt.clientY - c.getBoundingClientRect().top;
});

var mouseDown;

window.addEventListener("mousedown", function(){
    mouseDown = true;
});

window.addEventListener("mouseup", function(){
    mouseDown = false;
});

var prevTime;
var dT; // deltaTime

var gameRef;
var gameID;
var playerRef;
var playerID;

var pLocalGame;
var localGame;

var drs = 150; // default run speed

var screen = 0;

var enterJoinCode;

var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var mapLines = [];

function generateCode() {
    var code = "";
    for (var i = 0; i < 6; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
    }

    return code;
}

class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

var lobbyLines = [new Line(-260, 140, -260, -130), new Line(300, 140, 300, -130), new Line(-260, -130, -100, -190), new Line(300, -130, 140, -190), new Line(-100, -190, 140, -190), new Line(-260, 140, -225, 190), new Line(300, 140, 265, 190), new Line(265, 190, -225, 190)];

function collisionLineLine(line1, line2) {
    var uA = ((line2.x2-line2.x1)*(line1.y1-line2.y1) - (line2.y2-line2.y1)*(line1.x1-line2.x1)) / ((line2.y2-line2.y1)*(line1.x2-line1.x1) - (line2.x2-line2.x1)*(line1.y2-line1.y1));
    var uB = ((line1.x2-line1.x1)*(line1.y1-line2.y1) - (line1.y2-line1.y1)*(line1.x1-line2.x1)) / ((line2.y2-line2.y1)*(line1.x2-line1.x1) - (line2.x2-line2.x1)*(line1.y2-line1.y1));

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true;
    }
    return false;
}

function collisionBoxLine(x, y, w, h, line) {
    var l0 = new Line (x, y, x + w, y);
    var l1 = new Line (x + w, y, x + w, y - h);
    var l2 = new Line (x + w, y - h, x, y - h);
    var l3 = new Line (x, y - h, x, y);

    if (collisionLineLine(l0, line) || collisionLineLine(l1, line) || collisionLineLine(l2, line) || collisionLineLine(l3, line)) {
        return true;
    }
    return false;
}

function drawPlayer(x, y, file, frame, dir) {
    // dir can be 0 (right) or 1 (left)

    var dx, dy, dw, dh, w, h;

    switch (Math.floor(frame / 2)) {
        // idle
        case 0: {
            dx = 2;
            dy = 1;
            dw = 152;
            dh = 202;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 2, 1, 152, 202, x, y, 42, 56);
            break;
        }
        // run
        case 1: {
            dx = 408;
            dy = 1494;
            dw = 72;
            dh = 91;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 408, 1494, 72, 91, x, y, 42, 56);
            break;
        }
        case 2: {
            dx = 408;
            dy = 1494;
            dw = 72;
            dh = 91;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 408, 1494, 72, 91, x, y, 42, 56);
//            ctx.drawImage(file, 390, 1718, 72, 91, x, y, 42, 56);
            break;
        }
        case 3: {
            dx = 10;
            dy = 1489;
            dw = 80;
            dh = 111;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 10, 1489, 80, 111, x, y, 42, 56);
            break;
        }
        case 4: {
            dx = 10;
            dy = 1489;
            dw = 80;
            dh = 111;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 10, 1489, 80, 111, x, y, 42, 56);
//            ctx.drawImage(file, 10, 868, 80, 103, x, y, 42, 56);
            break;
        }
        case 5: {
            dx = 10;
            dy = 1489;
            dw = 80;
            dh = 111;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 10, 1489, 80, 111, x, y, 42, 56);
//            ctx.drawImage(file, 10, 1105, 80, 108, x, y, 42, 56);
            break;
        }
        case 6: {
            dx = 10;
            dy = 1489;
            dw = 80;
            dh = 111;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 10, 1489, 80, 111, x, y, 42, 56);
//            ctx.drawImage(file, 10, 1363, 80, 109, x, y, 42, 56);
            break;
        }
        case 7: {
            dx = 306;
            dy = 1396;
            dw = 72;
            dh = 94;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 306, 1396, 72, 94, x, y, 42, 56);
            break;
        }
        case 8: {
            dx = 306;
            dy = 1396;
            dw = 72;
            dh = 94;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 306, 1396, 72, 94, x, y, 42, 56);
//            ctx.drawImage(file, 300, 1610, 72, 93, x, y, 42, 56);
            break;
        }
        case 9: {
            dx = 11;
            dy = 1228;
            dw = 74;
            dh = 116;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 11, 1228, 74, 116, x, y, 42, 56);
            break;
        }
        case 10: {
            dx = 11;
            dy = 1228;
            dw = 74;
            dh = 116;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 11, 1228, 74, 116, x, y, 42, 56);
//            ctx.drawImage(file, 10, 1617, 74, 114, x, y, 42, 56);
            break;
        }
        case 11: {
            dx = 11;
            dy = 1228;
            dw = 74;
            dh = 116;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 11, 1228, 74, 116, x, y, 42, 56);
//            ctx.drawImage(file, 10, 1748, 74, 113, x, y, 42, 56);
            break;
        }
        case 12: {
            dx = 11;
            dy = 1228;
            dw = 74;
            dh = 116;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 11, 1228, 74, 116, x, y, 42, 56);
        }
        default: {
            break;
        }
    }

    // flip image based on direction
    if (dir) {
        ctx.drawImage(file, (1320 - dx) - dw, dy, dw, dh, x, y, w, h);
    } else {
        ctx.drawImage(file, dx, dy, dw, dh, x, y, w, h);
    }
}

function createGame() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // logged in
            playerID = user.uid;
            gameID = user.uid;
            // players node does not exist yet but firing of this will create the node as well as populate it with the player id
            // after the players node is created, all other player ids will be populated into the existing player node
            gameRef = ref(database, `games/${playerID}`);

            var code = generateCode();

            set(gameRef, {
                gameId: playerID,
                // possible (but unlikely) that two of the same code are generated
                gameCode: code,
                gameState: "Lobby", // possiblities: Lobby, Roles, Game, Meeting, Endscreen
                sabotage: "None", // possiblities: None, O2, Reactor, Comms, etc...
                gameSettings: {
                    map: "Skeld",
                    confirmEjects: "off",
                    emergencyMeetings: 1,
                    anonymousVotes: "on",
                    emergencyCooldown: 20,
                    discussionTime: 0,
                    votingTime: 300,
                    playerSpeed: 1.25,
                    taskBarUpdates: "Meetings", // possiblities: Always, Meetings, Never
                    visualTasks: "on",
                    commonTasks: 2,
                    longTasks: 3,
                    shortTasks: 5,
                },
                gamePlayers: {}
            });

            playerRef = ref(database, `games/${gameID}/gamePlayers/${playerID}`);

            set(playerRef, {
                playerId: playerID,
                playerName: "Zasharan2",
                playerColour: "White",
                playerAccessory1: "sword",
                playerAccessory2: "killer_mask",
                playerSkin: "magma",
                playerState: "Alive", // possiblities: Alive, Dead
                // playerDeadBy only applicable if player is dying, provides information as to who should be animated killing the player
                playerDeadBy: "None",
                playerRole: "None",
                playerRoleData: {},
                playerX: 0,
                playerY: 0,
                playerDir: "right",
                // playerBodyX, playerBodyY, & playerBodyDir will be same as playerX, playerY, & playerDir if player is still alive
                playerBodyX: 0,
                playerBodyY: 0,
                playerBodyDir: "right",
                playerRunning: "false",
                playerFrame: 0
            });

            onDisconnect(gameRef).remove();

            initGame();

            mapLines = lobbyLines;

            screen = 2;
        } else {
            // logged out
        }
    });

    sia();
}

function joinGame(code) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // logged in
            playerID = user.uid;

            get(child(ref(database), `games`)).then((snapshot) => {
                if (snapshot.exists()) {
                    for (var key in snapshot.val()){
                        if (snapshot.val()[key]['gameCode'] == code) {
                            gameID = snapshot.val()[key]['gameId'];
                            localGame = snapshot.val()[key];
                        }
                    }
                }

                gameRef = ref(database, `games/${gameID}`);

                playerRef = ref(database, `games/${gameID}/gamePlayers/${playerID}`);

                localGame["gamePlayers"][playerID] = {
                    playerId: playerID,
                    playerName: "Zasharan2",
                    playerColour: "White",
                    playerAccessory1: "sword",
                    playerAccessory2: "killer_mask",
                    playerSkin: "magma",
                    playerState: "Alive", // possiblities: Alive, Dead
                    // playerDeadBy only applicable if player is dying, provides information as to who should be animated killing the player
                    playerDeadBy: "None",
                    playerRole: "None",
                    playerRoleData: {},
                    playerX: 0,
                    playerY: 0,
                    playerDir: "right",
                    // playerBodyX, playerBodyY, & playerBodyDir will be same as playerX, playerY, & playerDir if player is still alive
                    playerBodyX: 0,
                    playerBodyY: 0,
                    playerBodyDir: "right",
                    playerRunning: "false",
                    playerFrame: 0
                }

                set(playerRef, localGame["gamePlayers"][playerID]);
    
                onDisconnect(playerRef).remove();
    
                initGame();

                mapLines = lobbyLines;

                screen = 2;
            });
        } else {
            // logged out
        }
    });

    sia();
}

function sia() {
    signInAnonymously(auth).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        console.log(errorCode, errorMessage);
    });
}

function initGame() {
    // callback will occur whenever player ref changes
    onValue(gameRef, (snapshot) => {
        if (localGame) {
            pLocalGame = localGame;
        }
        localGame = snapshot.val();
    });
}

function main() {
    dT = (Date.now() / 1000) - prevTime;
    prevTime = (Date.now() / 1000);

    switch (screen) {
        // create or join game
        case 0: {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 720, 480);

            ctx.beginPath();
            ctx.drawImage(amm10, 0, 37.5, 720, 405);

            // create game button
            if ((mX > 295 && mY > (85 + 37.5) && mX < 426 && mY < (119 + 37.5))) {
                ctx.beginPath();
                ctx.drawImage(amm11, 780, 220, 360, 110, 292.5, 82.5 + 37.5, 135, 41.25);
                if (mouseDown) {
                    createGame();
                    break;
                }
            }
            if (keys[67]) {
                createGame();
                break;
            }

            // join game button
            if ((mX > 295 && mY > 360 && mX < 426 && mY < 400)) {
                ctx.beginPath();
                ctx.drawImage(amm11, 780, 870, 360, 110, 292.5, 326.25 + 37.5, 135, 41.25);
                if (mouseDown) {
                    type = [];
                    screen = 1;
                    break;
                }
            }
            if (keys[74]) {
                type = [];
                screen = 1;
                break;
            }
            
            break;
        }
        // join game screen
        case 1: {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 720, 480);

            enterJoinCode = (letters[type[0] - 65] || "") + (letters[type[1] - 65] || "") + (letters[type[2] - 65] || "") + (letters[type[3] - 65] || "") + (letters[type[4] - 65] || "") + (letters[type[5] - 65] || "");

            ctx.beginPath();
            ctx.fillStyle = "#ffffff";
            ctx.font = "25px Comic Sans MS";
            ctx.fillText(`Enter Code: ${enterJoinCode}`, 20, 40);

            if (type.length > 5) {
                type = [];
                joinGame(enterJoinCode);
            }

            break;
        }
        // lobby
        case 2: {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 720, 480);

            if (localGame["gameState"] == "Lobby" || localGame["gameState"] == "Game") {
                if (localGame["gameState"] == "Lobby") {
                    ctx.beginPath();
                    ctx.drawImage(aml, -255 - localGame["gamePlayers"][playerID]["playerBodyX"], -200 - localGame["gamePlayers"][playerID]["playerBodyY"], 1231, 999);
                }
                
                // draw other players
                for (var id in localGame["gamePlayers"]){
                    if (id != playerID) {
                        ctx.beginPath();
                        if (localGame["gamePlayers"][id]["playerState"] == "Alive") {
                            if (localGame["gamePlayers"][id]["playerDir"] == "left") {
                                drawPlayer(339 + localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], 212 + localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], ssRed, localGame["gamePlayers"][id]["playerFrame"], 1);
                            } else {
                                drawPlayer(339 + localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], 212 + localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], ssRed, localGame["gamePlayers"][id]["playerFrame"], 0);
                            }
                        } else {
                            if (localGame["gamePlayers"][id]["playerState"] == "Dead") {
                                //ctx.drawImage(pSprite, 300, 0, 150, 198, 339 + localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], 212 + localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], 42, 20);
                            }
                        }
                    }
                }

                if (localGame["gamePlayers"][playerID]["playerState"] == "Alive") {
                    localGame["gamePlayers"][playerID]["playerRunning"] = "false";
                    if (keys[65] || keys[68] || keys[83] || keys[87]) {
                        localGame["gamePlayers"][playerID]["playerRunning"] = "true";
                        if (localGame["gamePlayers"][playerID]["playerFrame"] < 24) {
                            localGame["gamePlayers"][playerID]["playerFrame"] += 50 * dT;
                        }
                        if (localGame["gamePlayers"][playerID]["playerFrame"] >= 24) {
                            localGame["gamePlayers"][playerID]["playerFrame"] = 50 * dT;
                        }
                    }
                    if (localGame["gamePlayers"][playerID]["playerRunning"] == "false") {
                        localGame["gamePlayers"][playerID]["playerFrame"] = 0;
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                    if (keys[65]) {
                        localGame["gamePlayers"][playerID]["playerX"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        localGame["gamePlayers"][playerID]["playerBodyX"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        localGame["gamePlayers"][playerID]["playerDir"] = "left";
                        for (var i = 0; i < mapLines.length; i++) {
                            if (collisionBoxLine(localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][playerID]["playerBodyY"], 42, 28, mapLines[i])) {
                                localGame["gamePlayers"][playerID]["playerX"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                localGame["gamePlayers"][playerID]["playerBodyX"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                break;
                            }
                        }
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                    if (keys[68]) {
                        localGame["gamePlayers"][playerID]["playerX"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        localGame["gamePlayers"][playerID]["playerBodyX"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        localGame["gamePlayers"][playerID]["playerDir"] = "right";
                        for (var i = 0; i < mapLines.length; i++) {
                            if (collisionBoxLine(localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][playerID]["playerBodyY"], 42, 28, mapLines[i])) {
                                localGame["gamePlayers"][playerID]["playerX"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                localGame["gamePlayers"][playerID]["playerBodyX"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                break;
                            }
                        }
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                    if (keys[83]) {
                        localGame["gamePlayers"][playerID]["playerY"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        localGame["gamePlayers"][playerID]["playerBodyY"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        for (var i = 0; i < mapLines.length; i++) {
                            if (collisionBoxLine(localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][playerID]["playerBodyY"], 42, 28, mapLines[i])) {
                                localGame["gamePlayers"][playerID]["playerY"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                localGame["gamePlayers"][playerID]["playerBodyY"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                break;
                            }
                        }
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                    if (keys[87]) {
                        localGame["gamePlayers"][playerID]["playerY"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        localGame["gamePlayers"][playerID]["playerBodyY"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        for (var i = 0; i < mapLines.length; i++) {
                            if (collisionBoxLine(localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][playerID]["playerBodyY"], 42, 28, mapLines[i])) {
                                localGame["gamePlayers"][playerID]["playerY"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                localGame["gamePlayers"][playerID]["playerBodyY"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                break;
                            }
                        }
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                }

                // draw player
                ctx.beginPath();
                if (localGame["gamePlayers"][playerID]["playerDir"] == "left") {
                    drawPlayer(339, 212, ssRed, localGame["gamePlayers"][playerID]["playerFrame"], 1);
                } else {
                    drawPlayer(339, 212, ssRed, localGame["gamePlayers"][playerID]["playerFrame"], 0);
                }

                // draw join code
                ctx.beginPath();
                ctx.fillStyle = "#ffffff";
                ctx.font = "25px Comic Sans MS";
                ctx.fillText("Code:", 330, 420);
                ctx.font = "30px Comic Sans MS";
                ctx.fillText(localGame["gameCode"], 300, 460);
            }

            break;
        }
        default: {
            break;
        }
    }

    window.requestAnimationFrame(main);
}

prevTime = (Date.now() / 1000);
window.requestAnimationFrame(main);