const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const { Schema } = require("mongoose")

var JobApp = new mongoose.Schema({
    // studentId: {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    // },
    companyName: {
        type: String,
    },
    roleTitle: {
        type: String,
    },
    location: {
        type: String,
    }, 
    description: {
        type: String,
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
    task: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ["wishlist", "applied", "interview", "offer", "application withdrawn", "rejected"]
    },
}, {
   
    timestamps: true,

  
});





module.exports = mongoose.model("JobApp", JobApp)