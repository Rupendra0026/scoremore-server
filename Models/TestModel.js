const mongoose=require("mongoose")

const testSchema=new mongoose.Schema({
    testName:{
        type:String,
        required:[true,"Test name is required"]
    },
    testTime:{
        type:Number,
        required:[true,"Test time is required"]
    },
    testCode:{
        type:String
    },
    noofQuestions:{
        type:Number
    },
    testQuestions:[],
    testAnswers:[],
    authorId:{
        type:String
    },
    attempts:[
        {
            type:String
        }
    ]
});

const TestModel=mongoose.model("TestSchema",testSchema)
module.exports=TestModel;