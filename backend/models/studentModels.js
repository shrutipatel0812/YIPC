const mongoose = require("mongoose");

const studentSchema= new mongoose.Schema({
    email:{type:"String"},
    collage:{type:"String"},
    year:{type:"Number"},
    phoneNo:{type:"Number"},
    

})

module.exports= mongoose.model("Students" ,studentSchema)