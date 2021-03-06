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

import { drawPlayer, drawAccessory, accCount } from "./drawFuncs.js";
import { Line } from "./classes.js";

var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");

var aml = new Image; aml.src = "amonguslobby.png";
var amm10 = new Image; amm10.src = "amongusmenu1-0.png";
var amm11 = new Image; amm11.src = "amongusmenu1-1.png";
var acc = new Image; acc.src = "spritesheet_accessories.png";
var sB = new Image; sB.src = "startbutton.png";
var uB = new Image; uB.src = "usebutton.png";
var uB_g = new Image; uB_g.src = "usebutton_greyed.png";
var cB = new Image; cB.src = "customizebutton.png";
var wB = new Image; wB.src = "wardrobebutton.png";
var lrBs = new Image; lrBs.src = "leftrightbuttons.png";

var colorFileList = ["spritesheet_red.png", "spritesheet_orange.png", "spritesheet_yellow.png", "spritesheet_lime.png", "spritesheet_mint.png", "spritesheet_green.png", "spritesheet_olive.png", "spritesheet_cyan.png", "spritesheet_cobalt.png", "spritesheet_blue.png", "spritesheet_purple.png", "spritesheet_faocfe.png", "spritesheet_pink.png", "spritesheet_coral.png", "spritesheet_black.png", "spritesheet_grey.png", "spritesheet_white.png", "spritesheet_brown.png", "spritesheet_bronze.png", "spritesheet_beige.png"];

for (var i = 0; i < colorFileList.length; i++) {
    var ss = new Image; ss.src = colorFileList[i];
    colorFileList[i] = ss;
}

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

var t22 = 0;

function generateCode() {
    var code = "";
    for (var i = 0; i < 6; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
    }

    return code;
}



//                outside walls
var lobbyLines = [new Object([new Line(340, 350, 340, 605), new Line(890, 350, 890, 605), new Line(340, 350, 510, 290), new Line(890, 350, 720, 290), new Line(510, 290, 720, 290), new Line(340, 605, 375, 650), new Line(890, 605, 855, 650), new Line(375, 650, 855, 650)]),
//                lower left box
                  new Object([new Line(410, 485, 410, 550), new Line(410, 550, 450, 585), new Line(450, 585, 515, 560), new Line(515, 560, 515, 500), new Line(515, 500, 470, 460), new Line(470, 460, 410, 485)]),
//                lower right box
                  new Object([new Line(735, 435, 735, 500), new Line(735, 500, 800, 525), new Line(800, 525, 840, 490), new Line(840, 490, 840, 430), new Line(840, 430, 785, 405), new Line(785, 405, 735, 435)]),
//                game settings box
                  new Object([new Line(470, 350, 470, 390), new Line(470, 390, 500, 410), new Line(500, 410, 535, 395), new Line(535, 395, 535, 360), new Line(535, 360, 510, 335), new Line(510, 335, 470, 350)]),
//                customization box
                  new Object([new Line(685, 355, 685, 380), new Line(685, 380, 725, 395), new Line(725, 395, 745, 385), new Line(745, 385, 745, 360), new Line(745, 360, 705, 345), new Line(705, 345, 685, 355)])];

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
    var l1 = new Line (x + w, y, x + w, y + h);
    var l2 = new Line (x + w, y + h, x, y + h);
    var l3 = new Line (x, y + h, x, y);

    if (collisionLineLine(l0, line) || collisionLineLine(l1, line) || collisionLineLine(l2, line) || collisionLineLine(l3, line)) {
        return true;
    }
    return false;
}

function clickingButton(bx, by, bw, bh, click) {
    if (click) {
        if (mouseDown && mX > bx && mX < (bx + bw) && mY > by && mY < (by + bh)) {
            return true;
        } else {
            return false;
        }
    } else {
        if (mX > bx && mX < (bx + bw) && mY > by && mY < (by + bh)) {
            return true;
        } else {
            return false;
        }
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
                playerColour: 0,
                playerAccessory1: 0,
                playerAccessory2: 0,
                playerSkin: 0,
                playerState: "Alive", // possiblities: Alive, Dead
                // playerDeadBy only applicable if player is dying, provides information as to who should be animated killing the player
                playerDeadBy: "None",
                playerRole: "None",
                playerRoleData: {},
                playerX: 595,
                playerY: 400,
                playerDir: "right",
                // playerBodyX, playerBodyY, & playerBodyDir will be same as playerX, playerY, & playerDir if player is still alive
                playerBodyX: 595,
                playerBodyY: 400,
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
                    playerColour: 0,
                    playerAccessory1: 0,
                    playerAccessory2: 0,
                    playerSkin: 0,
                    playerState: "Alive", // possiblities: Alive, Dead
                    // playerDeadBy only applicable if player is dying, provides information as to who should be animated killing the player
                    playerDeadBy: "None",
                    playerRole: "None",
                    playerRoleData: {},
                    playerX: 595,
                    playerY: 400,
                    playerDir: "right",
                    // playerBodyX, playerBodyY, & playerBodyDir will be same as playerX, playerY, & playerDir if player is still alive
                    playerBodyX: 595,
                    playerBodyY: 400,
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
            if (clickingButton(295, (85 + 37.5), 131, 34, 0)) {
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
            if (clickingButton(295, 360, 131, 40, 0)) {
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

            if (localGame["gameState"] == "Lobby") {
                // draw lobby
                ctx.beginPath();
                ctx.drawImage(aml, 339 - localGame["gamePlayers"][playerID]["playerBodyX"], 212 - localGame["gamePlayers"][playerID]["playerBodyY"], 1231, 999);
                
                // draw other players
                for (var id in localGame["gamePlayers"]){
                    if (id != playerID) {
                        ctx.beginPath();
                        if (localGame["gamePlayers"][id]["playerState"] == "Alive") {
                            if (localGame["gamePlayers"][id]["playerDir"] == "left") {
                                drawPlayer(ctx, localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], colorFileList[localGame["gamePlayers"][id]["playerColour"]], localGame["gamePlayers"][id]["playerFrame"], 1);
                                drawAccessory(ctx, localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], acc, localGame["gamePlayers"][id]["playerAccessory1"], 1, 0);
                                drawAccessory(ctx, localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], acc, localGame["gamePlayers"][id]["playerAccessory2"], 1, 0);
                            } else {
                                drawPlayer(ctx, localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], colorFileList[localGame["gamePlayers"][id]["playerColour"]], localGame["gamePlayers"][id]["playerFrame"], 0);
                                drawAccessory(ctx, localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], acc, localGame["gamePlayers"][id]["playerAccessory1"], 0, 0);
                                drawAccessory(ctx, localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], acc, localGame["gamePlayers"][id]["playerAccessory2"], 0, 0);
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
                            for (var j = 0; j < mapLines[i].length; j++) {
                                if (collisionBoxLine(localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][playerID]["playerBodyY"] + 42, 42, 14, mapLines[i][j])) {
                                    localGame["gamePlayers"][playerID]["playerX"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                    localGame["gamePlayers"][playerID]["playerBodyX"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                    break;
                                }
                            }
                        }
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                    if (keys[68]) {
                        localGame["gamePlayers"][playerID]["playerX"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        localGame["gamePlayers"][playerID]["playerBodyX"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        localGame["gamePlayers"][playerID]["playerDir"] = "right";
                        for (var i = 0; i < mapLines.length; i++) {
                            for (var j = 0; j < mapLines[i].length; j++) {
                                if (collisionBoxLine(localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][playerID]["playerBodyY"] + 42, 42, 14, mapLines[i][j])) {
                                    localGame["gamePlayers"][playerID]["playerX"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                    localGame["gamePlayers"][playerID]["playerBodyX"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                    break;
                                }
                            }
                        }
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                    if (keys[83]) {
                        localGame["gamePlayers"][playerID]["playerY"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        localGame["gamePlayers"][playerID]["playerBodyY"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        for (var i = 0; i < mapLines.length; i++) {
                            for (var j = 0; j < mapLines[i].length; j++) {
                                if (collisionBoxLine(localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][playerID]["playerBodyY"] + 42, 42, 14, mapLines[i][j])) {
                                    localGame["gamePlayers"][playerID]["playerY"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                    localGame["gamePlayers"][playerID]["playerBodyY"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                    break;
                                }
                            }
                        }
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                    if (keys[87]) {
                        localGame["gamePlayers"][playerID]["playerY"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        localGame["gamePlayers"][playerID]["playerBodyY"] -= (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                        for (var i = 0; i < mapLines.length; i++) {
                            for (var j = 0; j < mapLines[i].length; j++) {
                                if (collisionBoxLine(localGame["gamePlayers"][playerID]["playerBodyX"], localGame["gamePlayers"][playerID]["playerBodyY"] + 42, 42, 14, mapLines[i][j])) {
                                    localGame["gamePlayers"][playerID]["playerY"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                    localGame["gamePlayers"][playerID]["playerBodyY"] += (drs * localGame["gameSettings"]["playerSpeed"] * dT);
                                    break;
                                }
                            }
                        }
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                }

                // draw player
                ctx.beginPath();
                if (localGame["gamePlayers"][playerID]["playerDir"] == "left") {
                    drawPlayer(ctx, 0, 0, colorFileList[localGame["gamePlayers"][playerID]["playerColour"]], localGame["gamePlayers"][playerID]["playerFrame"], 1);
                    drawAccessory(ctx, 0, 0, acc, localGame["gamePlayers"][playerID]["playerAccessory1"], 1, 0);
                    drawAccessory(ctx, 0, 0, acc, localGame["gamePlayers"][playerID]["playerAccessory2"], 1, 0);
                } else {
                    drawPlayer(ctx, 0, 0, colorFileList[localGame["gamePlayers"][playerID]["playerColour"]], localGame["gamePlayers"][playerID]["playerFrame"], 0);
                    drawAccessory(ctx, 0, 0, acc, localGame["gamePlayers"][playerID]["playerAccessory1"], 0, 0);
                    drawAccessory(ctx, 0, 0, acc, localGame["gamePlayers"][playerID]["playerAccessory2"], 0, 0);
                }

                // draw join code
                ctx.beginPath();
                ctx.fillStyle = "#ffffff";
                ctx.font = "20px Comic Sans MS";
                ctx.fillText("Code:", 335, 370);
                ctx.font = "25px Comic Sans MS";
                ctx.fillText(localGame["gameCode"], 305, 400);

                // draw start button
                if (localGame["gameId"] == playerID) {
                    ctx.beginPath();
                    ctx.drawImage(sB, 315, 410, 84, 52);
    
                    if (clickingButton(315, 410, 84, 52, 1)) {
                        localGame["gameState"] = "Roles";
                        set(gameRef, localGame);
                        screen = 3
                    }
                }

                // draw use/customize/wardrobe button
                if (Math.sqrt(Math.pow(localGame["gamePlayers"][playerID]["playerBodyX"] - 690, 2) + Math.pow(localGame["gamePlayers"][playerID]["playerBodyY"] - 340, 2)) < 100) {
                    ctx.drawImage(wB, 618, 365, 72, 80);
                    if (clickingButton(618, 365, 72, 80, 1)) {
                        screen = 2.2;
                        localGame["gamePlayers"][playerID]["playerFrame"] = 0;
                        set(playerRef, localGame["gamePlayers"][playerID]);
                        t22 = 20;
                    }
                } else {
                    if (localGame["gameId"] == playerID) {
                        if (Math.sqrt(Math.pow(localGame["gamePlayers"][playerID]["playerBodyX"] - 480, 2) + Math.pow(localGame["gamePlayers"][playerID]["playerBodyY"] - 310, 2)) < 80) {
                            ctx.drawImage(cB, 615, 375, 72, 80);
                            if (clickingButton(615, 375, 72, 80, 1)) {
                                screen = 2.1;
                                localGame["gamePlayers"][playerID]["playerFrame"] = 0;
                                set(playerRef, localGame["gamePlayers"][playerID]);
                            }
                        } else {
                            ctx.drawImage(uB_g, 620, 380, 68, 67);
                        }
                    } else {
                        ctx.drawImage(uB_g, 620, 380, 68, 67);
                    }
                }

            } else {
                if (localGame["gameState"] == "Roles") {
                    screen = 3;
                }
            }

            break;
        }

        // customize settings
        case 2.1: {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 720, 480);

            // back button
            if (clickingButton(10, 420, 80, 40, 0)) {
                ctx.drawImage(amm11, 54, 941, 180, 90, 10, 420, 80, 40);
                if (mouseDown) {
                    screen = 2;
                }
            } else {
                ctx.drawImage(amm10, 54, 941, 180, 90, 10, 420, 80, 40);
            }

            break;
        }

        // wardrobe
        case 2.2: {
            t22++;

            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 720, 480);

            // back button
            if (clickingButton(10, 420, 80, 40, 0)) {
                ctx.drawImage(amm11, 54, 941, 180, 90, 10, 420, 80, 40);
                if (mouseDown) {
                    screen = 2;
                }
            } else {
                ctx.drawImage(amm10, 54, 941, 180, 90, 10, 420, 80, 40);
            }

            // accessory 1 buttons
            ctx.drawImage(lrBs, 0, 0, 96, 110, 80, 40, 48, 55)
            if (clickingButton(80, 40, 48, 55, 1) && t22 > 20) {
                localGame["gamePlayers"][playerID]["playerAccessory1"]--;
                if (localGame["gamePlayers"][playerID]["playerAccessory1"] < 0) {
                    localGame["gamePlayers"][playerID]["playerAccessory1"] = accCount - 1;
                }
                set(playerRef, localGame["gamePlayers"][playerID]);
                t22 = 0;
            }
            ctx.drawImage(lrBs, 96, 0, 96, 110, 592, 40, 48, 55)
            if (clickingButton(592, 40, 48, 55, 1) && t22 > 20) {
                localGame["gamePlayers"][playerID]["playerAccessory1"]++;
                if (localGame["gamePlayers"][playerID]["playerAccessory1"] >= accCount) {
                    localGame["gamePlayers"][playerID]["playerAccessory1"] = 0;
                }
                set(playerRef, localGame["gamePlayers"][playerID]);
                t22 = 0;
            }

            // accessory 2 buttons
            ctx.drawImage(lrBs, 0, 0, 96, 110, 80, 120, 48, 55)
            if (clickingButton(80, 120, 48, 55, 1) && t22 > 20) {
                localGame["gamePlayers"][playerID]["playerAccessory2"]--;
                if (localGame["gamePlayers"][playerID]["playerAccessory2"] < 0) {
                    localGame["gamePlayers"][playerID]["playerAccessory2"] = accCount - 1;
                }
                set(playerRef, localGame["gamePlayers"][playerID]);
                t22 = 0;
            }
            ctx.drawImage(lrBs, 96, 0, 96, 110, 592, 120, 48, 55)
            if (clickingButton(592, 120, 48, 55, 1) && t22 > 20) {
                localGame["gamePlayers"][playerID]["playerAccessory2"]++;
                if (localGame["gamePlayers"][playerID]["playerAccessory2"] >= accCount) {
                    localGame["gamePlayers"][playerID]["playerAccessory2"] = 0;
                }
                set(playerRef, localGame["gamePlayers"][playerID]);
                t22 = 0;
            }

            // colour buttons
            ctx.drawImage(lrBs, 0, 0, 96, 110, 80, 200, 48, 55)
            if (clickingButton(80, 200, 48, 55, 1) && t22 > 20) {
                localGame["gamePlayers"][playerID]["playerColour"]--;
                if (localGame["gamePlayers"][playerID]["playerColour"] < 0) {
                    localGame["gamePlayers"][playerID]["playerColour"] = colorFileList.length - 1;
                }
                set(playerRef, localGame["gamePlayers"][playerID]);
                t22 = 0;
            }
            ctx.drawImage(lrBs, 96, 0, 96, 110, 592, 200, 48, 55)
            if (clickingButton(592, 200, 48, 55, 1) && t22 > 20) {
                localGame["gamePlayers"][playerID]["playerColour"]++;
                if (localGame["gamePlayers"][playerID]["playerColour"] >= colorFileList.length) {
                    localGame["gamePlayers"][playerID]["playerColour"] = 0;
                }
                set(playerRef, localGame["gamePlayers"][playerID]);
                t22 = 0;
            }

            // skin buttons
            ctx.drawImage(lrBs, 0, 0, 96, 110, 80, 280, 48, 55)
            ctx.drawImage(lrBs, 96, 0, 96, 110, 592, 280, 48, 55)

            // player
            ctx.drawImage(colorFileList[localGame["gamePlayers"][playerID]["playerColour"]], 2, 1, 152, 202, 256, 88, 168, 224);
            drawAccessory(ctx, -73, -149, acc, localGame["gamePlayers"][playerID]["playerAccessory1"], 0, 1);
            drawAccessory(ctx, -73, -149, acc, localGame["gamePlayers"][playerID]["playerAccessory2"], 0, 1);

            break;
        }

        // roles
        case 3: {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 720, 480);

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