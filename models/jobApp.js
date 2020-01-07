const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const { Schema } = require("mongoose")

var JobApp = new mongoose.Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    companyName: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    roleTitle: {
        type: String,
    },
    contractType: {
        type: String,
    },
    description: {
        type: String,
    },
    applyUrl: {
        type: String,
    },
    deadline: {
        type: Date,
    },
    applied: {
        type: Date
    },
    interview1: {
        type: Date
    },
    interview2: {
        type: Date
    },
    status: {
        type: String,
        enum: ["wishlist", "applied", "interview", "offer", "application withdrawn", "rejected"]
    },
}, {
   
    timestamps: true,

  
});





module.exports = mongoose.model("JobApp", JobApp)