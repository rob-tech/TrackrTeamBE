const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport")
const jobApp = require("../models/jobApp")
const userRouter = express.Router();
const UserSchema = require("../models/User");
const { createToken, getToken, token } = require("../authenticate")
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_KEY);

userRouter.post("/", (req, res) => {
  var reqBody = req.body
  const msg = {
    to: reqBody.Email,
    from: 'test@gmail.com',
    subject: 'Welcome to Tracker',
    text: 'You are selected ',
    html: '<strong>You can now login with the system. user id : ' + reqBody.Email + ' password : 1234536  </strong>',
    //   attachments: [
    //     {
    //         filename: 'attendees.json',    
    //         path : './attendees.json',                                     
    //         contentType: 'application/json'
    //     }]
  };
  sgMail.send(msg);
  res.send("send")
});

userRouter.post("/register", async (req, res) => {
  try {
    req.body.username = req.body.email
    var user = await UserSchema.register(req.body, req.body.password);
    res.send(user);
  } catch (err) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  }
});

userRouter.post("/refresh", token, (req, res) => {
  try {
    var token = createToken({ _id: req.user._id, email: req.user.email })
    res.statusCode = 200
    res.json({
      status: "New Token Generated",
      user: req.user,
      token: token,
      success: true,
    })
  } catch (err) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  }
})

userRouter.get("/me", passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req.user._id)
  console.log(req)
  res.send(req.user)
})

userRouter.post("/login", passport.authenticate("local"), (req, res) => {
  try {
    var token = createToken({ _id: req.user._id });
    res.send({
      success: true,
      email: req.user.email,
      token: token,
      role:req.user.role,
      user: req.user,
    });
  }
  catch (ex) {
    res.send(ex)
  }
});

userRouter.get("/", async (req, res) => {
  try {
    var users = await UserSchema.find({})
    res.send(users)
  }
  catch (ex) {
    res.send(ex)
  }
})

userRouter.get("/manager", async (req, res) => {
  try {
    var users = await UserSchema.find({ role: { $in: 'Manager' } })
    res.send(users)
  }
  catch (ex) {
    res.send(ex)
  }
})

userRouter.get("/student", async (req, res) => {
  try {
    var users = await UserSchema.find({ role: { $in: 'Student' } })
    var studentUsers = users.length
    res.send({ studentUsers: studentUsers })
  }
  catch (ex) {
    res.send(ex)
  }
})

userRouter.get("/:id", async (req, res) => {
  try {
    var users = await UserSchema.findById({ _id: req.params.id })
    res.send(users)
  }
  catch (ex) {
    res.send(ex)
  }
})

userRouter.delete("/:id", async (req, res) => {
  try {
    var users1 = await UserSchema.findById({ _id: req.params.id })
    var application = await jobApp.findOne({ studentId: req.params.id });
    if (application) {
      res.send("user can not be deleted as it is refered in Job application.")
    }
    else {
      var users = await UserSchema.findByIdAndDelete({ _id: req.params.id })
      res.send("user deleted successfully.")
    }

  }
  catch (ex) {
    res.send(ex)
  }
})

userRouter.put("/:id", async (req, res) => {
  try {
    console.log(req.body)
    var users = await UserSchema.findByIdAndUpdate({ _id: req.params.id },  { $set: req.body },  { useUnifiedTopology: true })
    res.send(users)
  }
  catch (ex) {
    res.send(ex)
  }
})

module.exports = userRouter;
