const router = require("express").Router();
const Student =require("../models/studentsModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();


//register new student
router.post('/register',async(req,res)=>{
    try{

        const { email, password, confirmPassword} = req.body;

        if (!email || !password || !confirmPassword)
        return res
            .status(400)
            .json({ errorMessage: "Please enter all required fields." });
        
            if (password !== confirmPassword)
                return res.status(400).json({
                errorMessage: "Please enter the same password twice.",
            });

            const existingStudent = await Student.findOne({ email });
            if (existingStudent)
                return res.status(400).json({
                    errorMessage: "An account with this email already exists.",
            });

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);


            const newStudent = new Student({
                email,
                passwordHash,
              });

            const savedStudent = await newStudent.save();
            console.log(savedStudent._id);
            
            const token = jwt.sign(
                {
                    user: savedStudent._id,
                    userType:"student"
                },
                process.env.JWT_SECRET
              );
          
              // send the token in a HTTP-only cookie
                console.log(req.user);
              res
                .cookie("token", token, {
                  httpOnly: true,
                  secure: true,
                  sameSite: "none",
                })
                .send();
        
    }catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

//login new student
router.post("/login",async(req,res)=>{
    try{
        const { email, password } = req.body;

    // validate

    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    
        const existingStudent = await Student.findOne({ email });
        if (!existingStudent)
            return res.status(401).json({ errorMessage: "Wrong email or password." });
        
        const passwordCorrect = await bcrypt.compare(
                password,
                existingStudent.passwordHash
        );
        if (!passwordCorrect)
                return res.status(401).json({ errorMessage: "Wrong email or password." });
        
        // sign the token

    const token = jwt.sign(
        {
            user: existingStudent._id,
            userType:"student"
        },
        process.env.JWT_SECRET
      );
      
      res
      .cookie("token", token, {
        httpOnly: true,
       
      })
      .send("hii");
  
    }catch (err) {
        console.error(err);
        res.status(500).send();
    }
})



//student loggedIn
router.get('/loggedIn' ,(req,res)=>{
    try{
          
        const token = req.cookies.token;
        if(!token){
            return res.json("");
        }
    
        const verified = jwt.verify(token ,process.env.JWT_SECRET)
            
            req.user=verified.user;
          console.log(req.user);
      res.send(req.userType);
  }catch(err){
      res.json(false)
  }
  })


//student loggedOut
router.get("/logout", (req, res) => {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
       
      })
      .send();
  });


router.post("/:_id/profile",async(req,res)=>{
    try{
        const { firstName,lastName,course,collage,
        address,aboutMe, email,website,role,workExperience,dob,phoneNo} = req.body;

        const foundCandidate= await Student.findByIdAndUpdate({_id:req.params._id},{
            $set:{ 
                firstName,lastName,course,collage,
        address,aboutMe, email,website,role,workExperience,dob,phoneNo
                }
        },{
            new:true,
            useFindAndModify:false
        } );

        console.log(foundCandidate);
        if(!foundCandidate)
            return res
            .status(400)
            .json({ errorMessage: " no candidate." });

        console.log(foundCandidate);

        res.send();

    }catch (err) {
        console.error(err);
        res.status(500).send();
    }
})


module.exports=router;