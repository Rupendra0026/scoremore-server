const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");
app.use(cookieParser());
const feedbackModel =require("../Models/FeedbackModel");
const userModel = require("../Models/UserModel");
const feedbackSchema = require("../Models/FeedbackModel");


const studentFeedBack=async(req,res)=>{
    try{
        if(req.userId){
            let user=await userModel.findOne({_id:req.userId});
            const data=await req.body.data;
            const newFeed=await new feedbackSchema({
                examName:data?.testName,
                studentName:user.name,
                feedback:data?.feedback
            });
            newFeed.save().then(()=>{
                res.send({status:200,msg:"Thanks for the feedback"});
            })
        }
    }
    catch(err){
        console.log(err);
        res.send({status:400,msg:"Internal Server Error"});
    }
}

module.exports={studentFeedBack}