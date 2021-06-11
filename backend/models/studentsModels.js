const mongoose = require("mongoose");

const studentsSchema= new mongoose.Schema({
    passwordHash:{type:"String"},
    firstName:{type:"String"},
    lastName:{type:"String"},
    course:{type:"String"},
    collage:{type:"String"},
    address:{type:"String"},
    aboutMe:{type:"String"},
    email:{type:"String"},
    website:{type:"String"},
    role:{type:"String"},
    workExperience:{type:"String"},
    dob:{type:"String"},
    phoneNo:{type:"String"},
})

module.exports= mongoose.model("Students" ,studentsSchema)