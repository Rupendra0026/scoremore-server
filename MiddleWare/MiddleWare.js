const cookieParser = require("cookie-parser");
const express=require("express")
const jwt=require("jsonwebtoken")
const app=express()
app.use(cookieParser())


const checkUser=async(req,res,next)=>{
    try{
        let token=await req.cookies.token;
    if(token){
        let verify=await jwt.verify(token,"fgjhlk;l")
        req.userId=verify._id
        next()
    }
    else{
        res.send({msg:"Inavlid authorisation"})
    }
    }
    catch(err){
        console.log(err)
        res.send({msg:"internal error rupendra"})
    }
}

module.exports=checkUser 