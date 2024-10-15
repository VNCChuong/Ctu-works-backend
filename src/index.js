const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ limit: '500mb', parameterLimit: 1000000 }))
app.use(cookieParser());
app.use(express.json({ limit: "500mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "500mb",
    parameterLimit: 1000000,
  })
);

routes(app);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect DB Success");
  })
  .catch((err) => {
    console.log(err);
  });

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.listen(port, () => {
  console.log("Server running in port: ", +port);
});
