const mongoose=require("mongoose");

const feedback=new mongoose.Schema({
    examName:{
        type:String,
        required:true
    },
    studentName:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        required:true
    }
});
const feedbackSchema=mongoose.model("feedbackModel",feedback);

module.exports=feedbackSchema;