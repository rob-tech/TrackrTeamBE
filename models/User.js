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
    schoolId:{
        type: Schema.Types.ObjectId,
        required: true
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
    status:
    {
     type:String,
     default:"Pending"
    },
    // jobApp: [{ 
    //     type: Schema.Types.ObjectId, ref: 'JobApp'
    //  }],
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