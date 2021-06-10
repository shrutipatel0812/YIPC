const mongoose = require("mongoose");

const jobsSchema= new mongoose.Schema({
    recruiterId: {type:mongoose.Schema.Types.ObjectId,
        ref:"Recruiters"
    },
    jobTitle:{type:"String"},
    location:{type:"String"},
    jobDescription:{type:"String"},
    
})

module.exports= mongoose.model("Jobs" ,jobsSchema);