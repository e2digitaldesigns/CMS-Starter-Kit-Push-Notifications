let https = require("http");
const express = require("express");
const app = express();
const fs = require("fs");
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: "https://2948cdf0a6674931b32699ee081cce4e@sentry.io/1805408"
});

let options = {};
if (process.env.MODE === "PROD_") {
  options = {
    key: fs.readFileSync("certs/key.key"),
    cert: fs.readFileSync("certs/crt.crt")
  };
}

const serverPort = process.env.PORT || 8002;
const server = https.createServer(options, app);
const io = require("socket.io")(server);

//SET APP HEADERS
app.use(function(req, res, next) {
  "use strict";
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//Get HTML
app.get("/", function(req, res) {
  "use strict";
  res.sendFile(__dirname + "/e2ps.html");
});

//Set Services
io.on("connection", function(socket) {
  socket.on("chatServices", function(data) {
    socket.broadcast.emit("chatServices", data);
  });

  socket.on("notificationServices", function(data) {
    io.emit("notificationServices", data);
  });

  socket.on("userChatServices", function(data) {
    io.emit("userChatServices", data);
  });
});

//Set Server & Listen
server.listen(serverPort, () =>
  console.log("E2PS Push Notification Server at ", serverPort)
);
