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
const { OAuth2Client } = require("google-auth-library");
const User = require("./models/UserModel");
const UserInfo = require("./models/UserInfoModel");
const WorkingPreferences = require("./models/WorkingPreferencesModel");
const jwt = require("jsonwebtoken");

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
app.use(bodyParser.json({ limit: "500mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "500mb",
    parameterLimit: 1000000,
  })
);
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

routes(app);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
app.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      // Tạo UserInfo
      const userInfo = await UserInfo.create({
        fullName: name || "Google User",
        jobTitle: "Unknown",
        phoneNumber: "123456789",
        currentDegree: "Unknown",
        currentIndustries: ["Unknown"],
        currentJobFunction: "Unknown",
        yearsExperience: 0,
        currentSalary: 0,
        highestDegree: "Unknown",
        country: "Unknown",
        city: "Unknown",
        district: "Unknown",
        address: "",
        gender: 1,
        maritalStatusId: 1,
        dateOfBirth: "1970-01-01",
      });

      const workingPreferences = await WorkingPreferences.create({
        locations: ["Unknown"],
        jobFunction: "Unknown",
        companyIndustries: ["Unknown"],
        desiredJobLevel: "Entry",
        salary: 0,
        isRelocate: 1,
        benefits: ["Unknown"],
      });

      user = await User.create({
        googleId: sub,
        email,
        userInfoId: userInfo._id,
        workingPreferences: workingPreferences._id,
      });
    }

    const isProfileComplete = Boolean(
      user.userInfoId && user.workingPreferences
    );

    const accessToken = jwt.sign(
      { userid: user._id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { userid: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      isProfileComplete: isProfileComplete,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
  }
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
