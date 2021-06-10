const mongoose = require("mongoose");

const recruitersSchema= new mongoose.Schema({
    email:{type:"String"},
    companyName:{type:"String"},
    companyDescription:{type:"String"},
    currentJobRole:{type:"String"},
    workExperience:{type:"String"},
    
})

module.exports= mongoose.model("Recruiters" ,recruitersSchema);