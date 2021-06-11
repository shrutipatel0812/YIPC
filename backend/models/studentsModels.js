const mongoose = require("mongoose");

const studentsSchema= new mongoose.Schema({
    passwordHash:{type:"String",required: true},
    firstName:{type:"String",required: true},
    lastName:{type:"String",required: true},
    course:{type:"String",required: true},
    collage:{type:"String",required: true},
    address:{type:"String",required: true},
    aboutMe:{type:"String"},
    email:{type:"String",required: true},
    website:{type:"String"},
    role:{type:"String",required: true},
    workExperience:{type:"String",required: true},
    dob:{type:"String",required: true},
    phoneNo:{type:"String",required: true},
})

module.exports= mongoose.model("Students" ,studentsSchema)