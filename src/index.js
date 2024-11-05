const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.set("io", io);

const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
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
  .connect(process.env.MONGO_DB)
  .then(() => console.log("Connect DB Success"))
  .catch((err) => console.log(err));
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => console.log("user disconnected"));
});
server.listen(port, () => {
  console.log("Server running in port: ", port);
});