const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");

const dbClient = require("./models/db");

const emergencyRoute = require("./routes/emergencyRoutes");
const assignStationRoute = require("./routes/stationRoutes");
const assignofficerRoute = require("./routes/officerRoutes");
const officerEmergenciesRoute = require("./routes/officerEmergencyRoutes");
const googleMapUrlRoute = require("./routes/googleMapRoutes");
const policeStationsRoutes = require("./routes/policeStationsRoutes");
const policeofficersRoute = require("./routes/policeOfficersRoutes");
const dutyAssignRoute = require("./routes/emergencyDutyAssignmentRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // Allow all origins for now (configure for production)
    methods: ["GET", "POST"],
  },
});

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

// Middleware to attach Socket.io instance to the request object
app.use((req, res, next) => {
  req.io = io; // Pass the io instance to controllers
  next();
});

// API Routes
app.use("/api/emergencies", emergencyRoute);
app.use("/api/assign-station", assignStationRoute);
app.use("/api/assign-officer", assignofficerRoute);
app.use("/api/officer-emergencies", officerEmergenciesRoute);
app.use("/api/generate-map-url", googleMapUrlRoute);
app.use("/api/police-stations", policeStationsRoutes);
app.use("/api/police-officers", policeofficersRoute);
app.use("/api/duty-assign", dutyAssignRoute);

// Handle Socket.io Connections
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
