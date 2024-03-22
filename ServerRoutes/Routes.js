const express=require("express");
const {  Login, RegisterUser, AddKey, Logout, RegisterStudent, studentProfile } = require("../Controllers/AuthControllers");
const {addTest,deleteKey,updateKey, AdminTestsList, studentTests, takeTest, submitTest, studentScore, adminCreateTests, deleteAdmintest, sendScores} = require("../Controllers/TestControllers");
const cookieParser = require("cookie-parser");
const checkUser = require("../MiddleWare/MiddleWare");
const { studentFeedBack } = require("../Controllers/GeneralControllers");
const routes=express.Router()
routes.use(express.json())
routes.use(cookieParser())

routes.get('/check',(req,res)=>{
    res.send("working fine bro");
})
routes.post('/login',Login)
routes.post('/registeruser',RegisterUser)
routes.post('/RegisterStudent',RegisterStudent)
routes.post('/addTest',checkUser,addTest)
routes.get('/logout',Logout)
routes.get('/deletekey',checkUser, deleteKey)
routes.get('/updatekey/:key', checkUser ,updateKey)
routes.get('/adminTestsList', checkUser,AdminTestsList)
routes.get('/studentTests',checkUser,studentTests)
routes.get('/student/takeTest/:testid',checkUser,takeTest)
routes.post('/student/exam/submit/:testid',checkUser,submitTest)
routes.get('/student/scores',checkUser,studentScore);
routes.get('/student/profile',checkUser,studentProfile)
routes.get('/admincreatedtests',checkUser,adminCreateTests);
routes.get('/delete/test/:testid',checkUser,deleteAdmintest);
routes.get('/student/scores/:testid',checkUser,sendScores);
routes.post('/student/feedback',checkUser,studentFeedBack);
// routes.get("/addkey/:key",AddKey)

module.exports=routes;