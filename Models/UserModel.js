const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  gmail: {
    type: String,
    required: [true, "Gmail is required"],
    validate: [validator.isEmail, "Gmail is not valid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  token: {
    type: String,
  },
  keys:{
      type: String,
      default:""
    },
    category:{
      type:String,
      default:"admin"
    }
});

const userModel = mongoose.model("User", userSchema); 
module.exports = userModel;
