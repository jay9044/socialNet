const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

//Load Routes
const usersAuth = require("./routes/api/usersAuth");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Config
const db = require("./config/keys").mongoURI;

//connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("Mongo db connected"))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//use routes Section 2
app.use("/api/usersAuth", usersAuth);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));
