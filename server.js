const express = require("express");
const request = require("request");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const jobappRouter = require("./routes/jobappRouter");
const userRouter = require("./routes/userRouter");
const schoolRouter = require("./routes/schoolRouter");
const companyApiRouter = require("./routes/companyApi");
const auth = require("./authenticate");
const { studentOnly, managerOnly, token } = require("./authenticate");

require("dotenv").config();

const server = express();

server.set("port", process.env.PORT || 4000);

server.use(cors());
server.use(express.json());
server.use(passport.initialize());
server.use(bodyParser.json());

server.use("/application", jobappRouter);
server.use("/user", userRouter);
server.use("/school", schoolRouter);
server.use("/companyApi", companyApiRouter);

mongoose
  .connect(process.env.MONGOCONNECT, {
    useNewUrlParser: true
  })
  .then(
    server.listen(server.get("port"), () => {
      console.log("SERVER IS RUNNING ON " + server.get("port"));
    })
  )
  // (server.listen(port,  () => {
  //   console.log("server is running on port 3000")
  .catch(err => console.log(err));

server.get("/", (req, res) => {
  res.send("Hello");
});
