


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const route = require("./route/routes");
dotenv.config();
const port = process.env.PORT || 3001;
mongoose.set("strictQuery", true);
const app = express();
const cors = require('cors')

app.use(cors())


app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

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

app.listen(port,  () => {
  console.log(`App is running on port ${port}`);
});