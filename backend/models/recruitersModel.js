const mongoose = require("mongoose");

const recruitersSchema= new mongoose.Schema({
    passwordHash:{type:"String"},
    companyName:{type:"String"},
    name:{type:"String"},
    domain:{type:"String"},
    address:{type:"String"},
    aboutUs:{type:"String"},
    email:{type:"String"},
    website:{type:"String"},
    officialContact:{type:"String"},
    nameHR:{type:"String"},
    emailHR:{type:"String"},
    phoneNo:{type:"String"},
    
})

module.exports= mongoose.model("Recruiters" ,recruitersSchema);