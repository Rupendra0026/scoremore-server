const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const userModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
app.use(cookieparser());

const RegisterUser = async (req, res) => {
  try {
    let responseData = await req.body.data;
    let { name, gmail, password } = responseData;
    let userCheck = await userModel.findOne({ gmail: gmail });
    if (userCheck) {
      res.send({ msg: "Gmail already exists" });
    } else {
      let passwordHash = await bcrypt.hash(password, 10);
      console.log(passwordHash);
      let addUser = await new userModel({
        name,
        gmail,
        password: passwordHash,
      });
      await addUser.save();
      res.send({ status: 200, msg: "Registered successfully" });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      let errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).send({ msg: "User validation failed" });
    }
    // Handle other errors
    console.error(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const RegisterStudent = async (req, res) => {
  try {
    let responseData = await req.body.data;
    console.log(responseData)
    let { name, gmail, password ,category,passKey} = responseData;
    let userCheck = await userModel.findOne({ gmail: gmail });
    if (userCheck) {
      res.send({ msg: "Gmail already exists" });
    } 
    else {
    let keycheck=await userModel.findOne({keys:passKey})
    if(keycheck){
        let passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        let addUser = await new userModel({
          name,
          gmail,
          password: passwordHash,
          category,
          keys:passKey,
        });
        await addUser.save();
        res.send({ status: 200, msg: "Registered successfully" });
      }
      else{
        res.send({msg:"Invalid passkey"})
      }
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).send({ msg: errors });
    }
    // Handle other errors
    console.error(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const Login = async (req, res) => {
  try {
    let responseData = await req.body.data;
    let { gmail, password } = responseData;
    let checkUser = await userModel.findOne({ gmail: gmail });
    if (checkUser) {
      let checkPassword = await bcrypt.compare(password, checkUser.password);
      if (checkPassword) {
        let key = "fgjhlk;l";
        console.log(checkUser._id);
        let token = jwt.sign({ _id: checkUser._id }, key);
        let updateToken = await userModel
          .updateOne(
            { _id: checkUser._id },
            {
              $set: {
                token: token,
              },
            }
          )
          .then((res) => {
            console.log(res);
          });
        let showData = await userModel.findOne(
          { _id: checkUser._id },
          { name: 1, gmail: 1, token: 1, keys: 1,category:1 }
        );
        res.cookie("token", token, { maxAge: 86400000, httpOnly: true });
        // let showData=await userModel.findOne({_id:checkUser._id},{password:0});
        res.status(200).send({status:200, msg: "logged in", data: showData });
      } else {
        res.status(202).send({ msg: "Invalid credentials" });
      }
    } else {
      res.status(202).send({ msg: "User not found" });
    }
  } catch (error) {
    res.send({ msg: error });
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.send({ status: 200, msg: "Logged out successfully" });
  } catch (err) {
    res.send({ msg: "Failed to logout user" });
    console.log(err);
  }
};

// const AddKey=async(req,res,key)=>{
//     let userToken=await req.cookies.token
//     console.log(userToken)
//     const userResponse=await req.params.key
//     res.send(userResponse)
// }

const studentProfile=async(req,res)=>{
  try{
    if(req.userId){
      let userId=await req.userId;
      let userData=await userModel.findOne({_id:userId},{category:1,name:1,gmail:1,keys:1});
      let author=await userModel.findOne({keys:userData.keys,_id:{$ne:userData._id}},{name:1,gmail:1});
      res.send({status:200,data:{student:userData,admin:author}});
    }
  }
  catch(err){
    res.send({status:400,msg:"Internal server error"});
    console.log(err);
  }
}

module.exports = { Login, RegisterUser, Logout,RegisterStudent,studentProfile };
