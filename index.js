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

var ss = document.getElementById("spritesheet");
var ss2 = document.getElementById("spritesheet2");
var m0 = new Image; m0.src = "amonguslobby.png";
var ssRed = new Image; ssRed.src = "spritesheet_red.png";
var pSprite = document.getElementById("player");

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

var gameRef;
var gameID;
var playerRef;
var playerID;

var pLocalGame;
var localGame;

var screen = 0;

var enterJoinCode;

var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

function generateCode() {
    var code = "";
    for (var i = 0; i < 6; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
    }

    return code;
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
                playerRunning: "false"
            });

            onDisconnect(gameRef).remove();

            initGame();

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
                    console.log(snapshot.val());
                    for (var key in snapshot.val()){
                        console.log(key);
                        console.log(snapshot.val()[key]['gameCode']);
                        if (snapshot.val()[key]['gameCode'] == code) {
                            gameID = snapshot.val()[key]['gameId'];
                            console.log(gameID);
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
                    playerRunning: "false"
                }

                set(playerRef, localGame["gamePlayers"][playerID]);
    
                onDisconnect(playerRef).remove();
    
                initGame();

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
        console.log(localGame);
    });
}

function main() {
    switch (screen) {
        // create or join game
        case 0: {
            if (keys[67]) {
                createGame();
            }
            if (keys[74]) {
                type = [];
                screen = 1;
            }
            
            break;
        }
        // join game screen
        case 1: {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 720, 480);

            ctx.beginPath();
            ctx.fillStyle = "#ffffff";
            ctx.font = "25px Comic Sans MS";
            ctx.fillText(`Enter Code: ${enterJoinCode}`, 20, 40);

            enterJoinCode = (letters[type[0] - 65] || "") + (letters[type[1] - 65] || "") + (letters[type[2] - 65] || "") + (letters[type[3] - 65] || "") + (letters[type[4] - 65] || "") + (letters[type[5] - 65] || "");

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
                    ctx.drawImage(m0, -255 - localGame["gamePlayers"][playerID]["playerBodyX"], -200 - localGame["gamePlayers"][playerID]["playerBodyY"], 1231, 999);
                }
                
                // draw other players
                for (var id in localGame["gamePlayers"]){
                    if (id != playerID) {
                        ctx.beginPath();
                        if (localGame["gamePlayers"][id]["playerState"] == "Alive") {
                            if (localGame["gamePlayers"][id]["playerDir"] == "left") {
                                ctx.drawImage(ssRed, 2, 1, 152, 202, 339 + localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], 212 + localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], 42, 56);
                            } else {
                                ctx.drawImage(ssRed, 2, 1, 152, 202, 339 + localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], 212 + localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], 42, 56);
                            }
                        } else {
                            if (localGame["gamePlayers"][id]["playerState"] == "Dead") {
                                ctx.drawImage(pSprite, 300, 0, 150, 198, 339 + localGame["gamePlayers"][id]["playerBodyX"] - localGame["gamePlayers"][playerID]["playerBodyX"], 212 + localGame["gamePlayers"][id]["playerBodyY"] - localGame["gamePlayers"][playerID]["playerBodyY"], 42, 20);
                            }
                        }
                    }
                }

                if (localGame["gamePlayers"][playerID]["playerState"] == "Alive") {
                    localGame["gamePlayers"][playerID]["playerRunning"] = "false";
                    if (keys[65]) {
                        localGame["gamePlayers"][playerID]["playerX"] -= (1.5 * localGame["gameSettings"]["playerSpeed"]);
                        localGame["gamePlayers"][playerID]["playerBodyX"] -= (1.5 * localGame["gameSettings"]["playerSpeed"]);
                        localGame["gamePlayers"][playerID]["playerDir"] = "left";
                        localGame["gamePlayers"][playerID]["playerRunning"] = "true";
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                    if (keys[68]) {
                        localGame["gamePlayers"][playerID]["playerX"] += (1.5 * localGame["gameSettings"]["playerSpeed"]);
                        localGame["gamePlayers"][playerID]["playerBodyX"] += (1.5 * localGame["gameSettings"]["playerSpeed"]);
                        localGame["gamePlayers"][playerID]["playerDir"] = "right";
                        localGame["gamePlayers"][playerID]["playerRunning"] = "true";
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                    if (keys[83]) {
                        localGame["gamePlayers"][playerID]["playerY"] += (1.5 * localGame["gameSettings"]["playerSpeed"]);
                        localGame["gamePlayers"][playerID]["playerBodyY"] += (1.5 * localGame["gameSettings"]["playerSpeed"]);
                        localGame["gamePlayers"][playerID]["playerRunning"] = "true";
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                    if (keys[87]) {
                        localGame["gamePlayers"][playerID]["playerY"] -= (1.5 * localGame["gameSettings"]["playerSpeed"]);
                        localGame["gamePlayers"][playerID]["playerBodyY"] -= (1.5 * localGame["gameSettings"]["playerSpeed"]);
                        localGame["gamePlayers"][playerID]["playerRunning"] = "true";
                        set(playerRef, localGame["gamePlayers"][playerID]);
                    }
                }

                // draw player
                ctx.beginPath();
                if (localGame["gamePlayers"][playerID]["playerDir"] == "left") {
                    ctx.drawImage(ssRed, 2, 1, 152, 202, 339, 212, 42, 56);
                } else {
                    ctx.drawImage(ssRed, 2, 1, 152, 202, 339, 212, 42, 56);
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
window.requestAnimationFrame(main);