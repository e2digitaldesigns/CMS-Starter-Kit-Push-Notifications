console.clear();
require("dotenv").config();
let https = require("http");
if (process.env.MODE === "PROD_") {
  https = require("https");
}
const express = require("express");
const app = express();
const fs = require("fs");
// const Sentry = require("@sentry/node");
// Sentry.init({
//   dsn: "https://2948cdf0a6674931b32699ee081cce4e@sentry.io/1805408"
// });

let options = {};
if (process.env.MODE === "PROD_") {
  options = {
    key: fs.readFileSync("certs/key.key"),
    cert: fs.readFileSync("certs/crt.crt")
  };
}

// const ipAddress = process.env[process.env.MODE + "IP_ADDRESS"];

const serverPort = process.env.PORT || 8002;
const server = https.createServer(options, app);
const io = require("socket.io")(server);

// const globalFunctions = require("./e2ps_modules/global-functions");

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

//GET APPLICATION`
app.get("/", function(req, res) {
  "use strict";
  // res.sendFile(__dirname + "/e2ps.html");
  res.send(serverPort);
  //   io.emit("chatServices", getParams(req.url));
  io.emit("chatServices", { a: "b", c: "d", serverPort });
});

//SEND NOTIFICATION
io.on("connection", function(socket) {
  socket.on("chatServices", function(data) {
    socket.broadcast.emit("chatServices", data);
  });

  socket.on("notificationServices", function(data) {
    console.log(60, "Notification");
    io.emit("notificationServices", data);
  });
});

//LISTEN CONFIRMATION
// server.listen(serverPort, ipAddress, function() {
//   console.log("E2PS Push Notification Server at %s port", serverPort);
// });

server.listen(serverPort, () =>
  console.log("E2PS Push Notification Server at ", serverPort)
);
