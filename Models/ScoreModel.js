const mongoose=require("mongoose")

const Score=new mongoose.Schema({
    authorID:{
        type:String,
        required:true
    },
    testName:{
        type:String
    },
    studentName:{
        type:String
    },
    studentID:{
        type:String,
        required:true
    },
    testID:{
        type:String,
        required:true
    },
    score:{
        type:Number,
        required:true,
        default:0
    },
    time:{
        type:Date,
        default:Date.now
    }
})

const ScoreModel=mongoose.model("ScoreModel",Score);
module.exports=ScoreModel