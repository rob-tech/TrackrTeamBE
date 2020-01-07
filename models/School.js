
const mongoose = require('mongoose');
const { Schema } = require("mongoose")
const Users = require("./User")


const SchoolSchema = new Schema({
    schoolName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
},
//    Users: [{ 
//     type: Schema.Types.ObjectId, ref: 'users',
//     role: "Manager"
//    }],
   address:{
       type:String
   }},
     {
        timestamps: true
    });      

var Schools = mongoose.model('schools', SchoolSchema);
module.exports = Schools;