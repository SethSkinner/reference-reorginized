const express = require("express");
const session = require("express-session");
const bodyparser = require("body-parser");
const HallEvents = require("./routes/api/SocketHallEvents");
const HomeEvents = require("./routes/api/SocketHomeEvents");
const GameEvents = require("./routes/api/SocketGameEvents");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http).of("/app");

app.set("port", (process.env.PORT || 3001));
app.set("view engine", "ejs");

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended: true}));

app.use(session({
    secret: "keyboard cat", 
    cookie: {maxAge: 3600000 },
    resave: false, 
    saveUninitialized: false
}));

app.use(express.static("client/build"));


io.on("connection", function(socket){
    console.log(`\nPlayer ${socket.id} has been connected\n`);

    HomeEvents.disconnect(socket);
    HomeEvents.joinHome(socket);
    HomeEvents.loadAllRooms(socket);
    HomeEvents.createRoom(socket);
    HomeEvents.joinRoom(socket);
    
    HallEvents.joinRoomCheck(socket);
    HallEvents.newMessage(socket);
    HallEvents.exit(socket);
    HallEvents.addBot(socket);
    HallEvents.removeBot(socket);

    GameEvents.startGameCheck(socket);
    GameEvents.requestCards(socket);
    GameEvents.sendCard(socket);
    GameEvents.buyCard(socket);
    GameEvents.timeouted(socket);
    GameEvents.newMessage(socket);
});

http.listen(app.get("port"), function () {
    console.log("Rodando na porta "+ app.get("port"));
});