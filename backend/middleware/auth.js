const { json } = require('express');
const jwt = require('jsonwebtokens');

function auth(req ,res ,next){
    try{

        const token =req.cookies.token;
        if(!token){
            return res.status(401).json({errorMessage:"unauthorised"})
        }
        const verified = jwt.verify(token ,process.env.JWT_SECRET)
        
        req.user=verified.user;
        next();

    }catch(err){
        res.status(401).json({errorMessage: "Unauthorised"})
    }
}