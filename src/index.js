const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const passport = require("passport");
const { Server } = require("socket.io");
const path = require("path");
const session = require("express-session");

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

app.use(
  session({
    secret: "haha",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

routes(app);

require("./utils/Passport");

app.use(express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/google/success", (req, res) => {
  let name = req.user.email;
  console.log("User logged in: ", req.user);
  res.send("Login Success " + name);
});

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
