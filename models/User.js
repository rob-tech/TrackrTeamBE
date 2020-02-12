const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    githubUrl: {
        type: String
    },
    jobLocation: {
        type: String
    },
    school:{
        type:String
    },
    image: {
        type: String,
    },
    batch:{
        type:String
    },
    username: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ["Manager", "Student", "Admin", "Business"],
    },
    userStatus:{
        type:String,
        enum:["Pending","Accept","Reject"],
    },
}, {
        timestamps: true
    });   

    const options = {
        usernameField: "email",
        passwordField: "password"
      };

UserSchema.plugin(passportLocalMongoose,options) 
var Users = mongoose.model('users', UserSchema);
module.exports = Users;