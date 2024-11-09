


const express = require("express");
const mongoose = require("mongoose");

const route = require("./route/routes");
require("dotenv").config();

const port = process.env.PORT || 3001;
mongoose.set("strictQuery", true);
const app = express();
const cors = require('cors')
const passport = require("./controller/passport");
const session = require("express-session");


app.use(cors())


app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});


// Session setup
app.use(
  session({
    secret: "neha",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(
    "mongodb+srv://nehajaiswal:neha123@nehadb.pcorgpc.mongodb.net/socialite",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("mongoDB is connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/", route);

// Facebook Auth Routes
// route/routes.js


app.listen(port,  () => {
  console.log(`App is running on port ${port}`);
});
console.log("Facebook Client ID:", '1462946945093819');
console.log("Facebook Client Secret:", '7973bf8a3e219d4081db44103dc4df22');
