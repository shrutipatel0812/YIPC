const mongoose = require("mongoose");

const jobsSchema= new mongoose.Schema({
    employeesType:{type:"String"},
    numberOfOpening:{type:"String"},
    jobDescription:{type:"String"},
    whoCanApply:{type:"String"},
    salary:{type:"String"},
    duration:{type:"String"},
    lastDate:{type:"String"},
    workFromHome:{type:"Boolean"},
    workFromOffice:{type:"Boolean"},
})

module.exports= mongoose.model("Jobs" ,jobsSchema);