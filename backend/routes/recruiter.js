const router = require("express").Router();
const Recruiter =require("../models/recruitersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_AUTH);
const fetch= require('node-fetch');

require("dotenv").config();

//register new recruiter
router.post('/register',async(req,res)=>{
    try{

        const {companyName,phoneNo, email, password, confirmPassword} = req.body;

        if (!companyName|| !phoneNo|| !email || !password || !confirmPassword)
        return res
            .status(400)
            .json({ errorMessage: "Please enter all required fields." });
        
            if (password !== confirmPassword)
                return res.status(400).json({
                errorMessage: "Please enter the same password twice.",
            });

            const existingRecruiter = await Recruiter.findOne({ email });
            if (existingRecruiter)
                return res.status(400).json({
                    errorMessage: "An account with this email already exists.",
            });

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);


            const newRecruiter = new Recruiter({
                companyName,
                email,
                phoneNo,
                passwordHash
              });

            const savedRecruiter = await newRecruiter.save();
            console.log(savedRecruiter._id);
            
            const token = jwt.sign(
                {
                    user: savedRecruiter._id,
                    userType:"recruiter"
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

//login new recruiter
router.post("/login",async(req,res)=>{
    try{
        const { email, password } = req.body;

    // validate

    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    
        const existingRecruiter = await Recruiter.findOne({ email });
        if (!existingRecruiter)
            return res.status(401).json({ errorMessage: "Wrong email or password." });
        
        const passwordCorrect = await bcrypt.compare(
                password,
                existingRecruiter.passwordHash
        );
        if (!passwordCorrect)
                return res.status(401).json({ errorMessage: "Wrong email or password." });
        
        // sign the token

    const token = jwt.sign(
        {
            user: existingRecruiter._id,
            userType:"recruiter"
        },
        process.env.JWT_SECRET
      );
      
      res
      .cookie("token", token, {
        httpOnly: true,
       
      })
      .send("succesfully Logged In");
  
    }catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

router.get('/loggedIn' ,(req,res)=>{
    try{
          
        const token = req.cookies.token;
        if(!token){
            return res.json("");
        }
    
        const verified = jwt.verify(token ,process.env.JWT_SECRET)
            
            req.userType=verified.userType;
        if(req.userType==="recruiter"){
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
            Recruiter.findOne({email}).exec(async(err ,recruiter)=>{
            if(err){
              return res.status(400).json({
                error:"somthing went wrong"
              })
            }else{
              if(recruiter){
                
            const token = jwt.sign(
                {
                    user: recruiter._id,
                    userType:"recruiter"
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
                const newRecruiter = new Recruiter({email,passwordHash});
                newRecruiter.save((err,data)=>{
                  if(err){
                    return res.status(400).json({
                      error:"Somthing went wrong"
                    })
                  }
                  
            const token = jwt.sign(
                {
                    user: newRecruiter._id,
                    userType:"recruiter"
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
          Recruiter.findOne({ email }).exec(async(err, recruiter) => {
            if(err){
              return res.status(400).json({
                error:"somthing went wrong"
              })
            }else{
              if(recruiter){
                const token = jwt.sign(
                  {
                    user: recruiter._id,
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
                  const newRecruiter = new Recruiter({email,passwordHash});
                  newRecruiter.save((err,data)=>{
                    if(err){
                      return res.status(400).json({
                        error:"Somthing went wrong"
                      })
                    }
                    
              const token = jwt.sign(
                  {
                      user: newRecruiter._id,
                      userType:"recruiter"
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

//recruiter profile
  router.post("/:_id/profile",async(req,res)=>{
    try{
        const { 
        name,
        domain,
        address,
        aboutUs,
        email,
        website,
        officialContact,
        nameHR,
        emailHR,
        phoneNo} = req.body;

        const foundRecruiter= await Recruiter.findByIdAndUpdate({_id:req.params._id},{
            $set:{ 
        name,
        domain,
        address,
        aboutUs,
        email,
        website,
        officialContact,
        nameHR,
        emailHR,
        phoneNo
                }
        },{
            new:true,
            useFindAndModify:false
        } );

        console.log(foundRecruiter);
        if(!foundRecruiter)
            return res
            .status(400)
            .json({ errorMessage: " no candidate." });

        console.log(foundRecruiter);

        res.send();

    }catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

module.exports = router;