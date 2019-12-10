const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
//Port from environment variable or default - 4001
const port = process.env.PORT || 4001;

//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
let socket = require("socket.io-client")("http://localhost:4001");
//Setting up a socket with the namespace "connection" for new sockets
io.on("connection", socket => {
  console.log("New client connected");

  //Here we listen on a new namespace called "incoming data"
  socket.on("incoming", data => {
    //Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
    console.log(data);
    socket.broadcast.emit("outgoing_data", { stock: data });
  });

  //A special namespace "disconnect" for when a client disconnects
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
const fs = require("fs");

function readMe() {
  fs.readFile("stock.json", (err, data) => {
    if (err) throw err;
    let stockData = JSON.parse(data);
    socket.emit("incoming", stockData);
  });
}

setInterval(() => {
  readMe();
}, 10000);
