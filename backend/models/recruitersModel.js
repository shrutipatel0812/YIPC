const mongoose = require("mongoose");

const recruitersSchema= new mongoose.Schema({
    passwordHash:{type:"String",required: true},
    name:{type:"String",required: true},
    domain:{type:"String",required: true},
    address:{type:"String",required: true},
    aboutUs:{type:"String",required: true},
    email:{type:"String",required: true},
    website:{type:"String",required: true},
    officialContact:{type:"String",required: true},
    nameHR:{type:"String",required: true},
    emailHR:{type:"String",required: true},
    phoneNo:{type:"String",required: true},
    
})

module.exports= mongoose.model("Recruiters" ,recruitersSchema);