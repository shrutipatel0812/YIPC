const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors =require("cors");
import formRoutes from './routes/form.js';

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:["http://localhost:3000"],
  credentials:true
}));

const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/yipc', { useNewUrlParser: true ,useUnifiedTopology: true}).
  catch(error => handleError(error));
  
  app.use('/updates' , formRoutes);

const recruiterRouter = require("./routes/recruiter");
  app.use("/recruiters", recruiterRouter);

const JobRouter = require("./routes/jobs");
  app.use("/jobs", JobRouter);

const studentRouter = require("./routes/student");
  app.use("/students", studentRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
  