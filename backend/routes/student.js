const router = require("express").Router();
const Student =require("../models/studentsModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_AUTH);
const fetch= require('node-fetch');

require("dotenv").config();


//register new student
router.post('/register',async(req,res)=>{
    try{

        const { firstName , lastName ,phoneNo,email, password, confirmPassword} = req.body;

        if (!firstName||!lastName||!phoneNo||!email || !password || !confirmPassword)
        return reo
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
                firstName,
                lastName,
                email,
                phoneNo,
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
            
            req.userType=verified.userType;
        if(req.userType=== "student"){
            res.send(true);
        }
      res.send(false);
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



  router.post("/googleLogin",async(req,res)=>{
    const {tokenId} = req.body;
    client.verifyIdToken({idToken:tokenId, audience:process.env.GOOGLE_AUTH})
    .then(response =>{
        const{email_verified, name,email}=response.payload;
        console.log(response.payload);
        console.log(email_verified);
        if(email_verified){
          console.log("email_verified");
          Student.findOne({email}).exec(async(err ,student)=>{
            if(err){
              return res.status(400).json({
                error:"somthing went wrong"
              })
            }else{
              if(student){
                
            const token = jwt.sign(
                {
                    user: student._id,
                    userType:"student"
                },
                process.env.JWT_SECRET
              );
          
              // send the token in a HTTP-only cookie
               
              res
                .cookie("token", token, {
                  httpOnly: true,
                  secure: true,
                  sameSite: "none",
                })
                .send();
                  
              }else{
                let password = email+ process.env.JWT_SECRET;
                const salt = await bcrypt.genSalt();
                const passwordHash = await bcrypt.hash(password, salt);
                const newStudent = new Student({email,passwordHash});
                newStudent.save((err,data)=>{
                  if(err){
                    return res.status(400).json({
                      error:"Somthing went wrong"
                    })
                  }
                  
            const token = jwt.sign(
                {
                    user: newStudent._id,
                    userType:"student"
                },
                process.env.JWT_SECRET
              );
          
              // send the token in a HTTP-only cookie
               
              res
                .cookie("token", token, {
                  httpOnly: true,
                  secure: true,
                  sameSite: "none",
                })
                .send();
                })
              }
            }
          })
        }else{
          console.log("email not verified");
        }
    })
})


router.post("/facebookLogin",(req,res)=>{
    console.log('FACEBOOK LOGIN REQ BODY', req.body);
    const { userID, accessToken } = req.body;
  
    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
  
    return (
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        // .then(response => console.log(response))
        .then(response => {
          const { email, name } = response;
          Student.findOne({ email }).exec(async(err, student) => {
            if(err){
              return res.status(400).json({
                error:"somthing went wrong"
              })
            }else{
              if(student){
                const token = jwt.sign(
                  {
                    user: student._id,
                  },
                  process.env.JWT_SECRET
                );
            
                // send the token in a HTTP-only cookie
                  console.log(token);
                res
                  .cookie("token", token, {
                    httpOnly: true,
                   
                  })
                  .send();
            } else {
              let password = email+ process.env.JWT_SECRET;
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
            const newStudent = new Student({email,passwordHash});
                newStudent.save((err,data)=>{
                    if(err){
                        return res.status(400).json({
                        error:"Somthing went wrong"
                        })
                    }
                    
              const token = jwt.sign(
                  {
                        user: newStudent._id,
                        userType:"student"
                  },
                  process.env.JWT_SECRET
                );
            
                // send the token in a HTTP-only cookie
                 
                res
                  .cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                  })
                  .send();
                  })
             
            }
          }
          });
        })
        .catch(error => {
          res.json({
            error: 'Facebook login failed. Try later'
          });
        })
    );
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