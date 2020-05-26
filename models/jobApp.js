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
        required: true,
    },
    companyLogo: {
        type: String,
    },
    roleTitle: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    }, 
    description: {
        type: String,
        required: true,
    },
    applyUrl: {
        type: String,
    },
    replyDateTime: {
        type: Date,
    },
    statusDateTime: {
        type: Date
    },
    intDateTime: {
        type: Date
    },
    notes: [{
        type: String,
    }],
    tasks: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ["wishlist", "applied", "interview", "offer", "application_withdrawn", "rejected"],
        required: true,
    },
}, {
   
    timestamps: true,

  
});


module.exports = mongoose.model("jobapps", JobApp)