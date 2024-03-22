const dotenv=require("dotenv")
dotenv.config()
const express=require("express")
const app=express()
const Routes=require('./ServerRoutes/Routes')
const mongoose=require("mongoose")
app.use(Routes);
mongoose.connect(process.env.mongoDbUrl,({useNewUrlParser:true,useUnifiedTopology: true}))
.then((res)=>{
    console.log("connected to data base")
})

app.listen(5000,()=>{
    console.log("server running")
})