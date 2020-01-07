const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

var User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    githubRepo: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },

    jobApp: [{ 
        type: Schema.Types.ObjectId, ref: 'JobApp'
     }],

    jobLocation: {
        type: String,
        required: false
    },

    schoolName: {
        type: String,
        required: false
    },
    companyName: {
        type: String,
        required: false
    },
    batchMonth: {
        type: String,
        required: false
    },
    userType: {
        type: String,
        enum: ["School", "Student", "Admin", "Business"]
    }
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", User)