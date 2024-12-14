const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");

const dbClient = require("./models/db");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(cors());

//Connect Database
dbClient
  .connect()
  .then(() => {
    console.log("connect to database");
  })
  .catch(() => {
    console.log("error connecting to database");
  });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
