const express = require("express");
const TestModel = require("../Models/TestModel");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/UserModel");
const ScoreModel = require("../Models/ScoreModel");
const app = express();
app.use(cookieParser());

const addTest = async (req, res) => {
  try {
    let data = await req.body.data;
    if (req.userId) {
      let id = req.userId;
      const {
        testName,
        testCode,
        noofQuestions,
        testTime,
        testQuestions,
        testAnswers,
      } = data;
      try {
        const addTest = await new TestModel({
          testName,
          testTime,
          testCode: data.keys,
          testQuestions,
          testAnswers,
          noofQuestions,
          authorId: id,
        });
        addTest.save().then((result) => {
          res.send({ status: 200, msg: "Test Added successfully" });
        });
      } catch (err) {
        res.send({ status: 400, msg: "Failed to save test" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

const deleteKey = async (req, res) => {
  try {
    if (req.userId) {
      let id = req.userId;
      const findUser = await userModel.findOne({ _id: id });
      const result = await userModel.deleteMany({
        keys: findUser.keys,
        _id: { $ne: id },
      });
      const clearTests = await TestModel.deleteMany(
        { authorId: id },
        { testCode: findUser.keys }
      );
      const clear = await userModel.updateOne(
        { _id: id },
        {
          $set: {
            keys: "",
          },
        }
      );
      const user = await userModel.findOne(
        { _id: id },
        { name: 1, gmail: 1, token: 1, keys: 1, category: 1 }
      );
      res.send({ status: 200, msg: "key deleted successfully", data: user });
    }
  } catch (err) {
    res.send({ status: 400, msg: "Failed to delete key" });
    console.log(err);
  }
};

const updateKey = async (req, res, key) => {
  try {
    if (req.userId) {
      let id = req.userId;
      let keyval = await req.params.key;
      keyval = keyval.toLowerCase();
      console.log(keyval);
      let findkeys = await userModel.find({ keys: keyval });
      if (findkeys.length < 1) {
        const user = await userModel.findOne({ _id: id });
        const updateStudentsKey = await userModel.updateMany(
          { keys: user.keys },
          {
            $set: {
              keys: keyval,
            },
          }
        );
        const updateKeyVal = await userModel.updateOne(
          { _id: id },
          {
            $set: {
              keys: keyval,
            },
          }
        );

        const updateTestKeys = await TestModel.updateMany(
          { authorId: id },
          {
            $set: {
              testCode: keyval,
            },
          }
        );
        const updatedData = await userModel.findOne(
          { _id: id },
          { name: 1, gmail: 1, keys: 1, token: 1, category: 1 }
        );
        res.send({ status: 200, msg: "key updated", data: updatedData });
      }
      else{
        res.send({msg:"Key already exist! try new one"})
      }
    } else {
      res.send({ msg: "invalid user" });
    }
  } catch (err) {
    console.log(err);
    res.send({ err: "internal error" });
  }
};

const AdminTestsList = async (req, res) => {
  try {
    if (req.userId) {
      let id = req.userId;
      let testsList = await TestModel.find({ authorId: id });
      res.send({ status: 200, data: testsList });
    }
  } catch (err) {
    res.send({ msg: "internal error" });
    console.log(err);
  }
};

const studentTests = async (req, res) => {
  try {
    if (req.userId) {
      let id = req.userId;
      let user = await userModel.findOne({ _id: id });
      let verify = await TestModel.find(
        { testCode: user.keys },
        { testName: 1, noofQuestions: 1, testTime: 1 }
      );
      res.send({ status: 200, Tests: verify });
    }
  } catch (err) {
    res.send({ msg: "internal error try after sometime" });
    console.log(err);
  }
};

const takeTest = async (req, res, testid) => {
  try {
    if (req.userId) {
      const testIds = await req.params.testid;
      let id = req.userId;
      let user = await userModel.findOne({ _id: id });
      let testVerification = await TestModel.findOne(
        { _id: testIds },
        { testAnswers: 0 }
      );

      if (!testVerification) {
        return res.status(404).json({ status: 404, msg: "Test not found" });
      }

      // Check if the test has already been taken
      const attempts = testVerification.attempts.filter((e) => e.includes(id));
      if (attempts.length >= 1) {
        return res.status(202).json({ status: 202, msg: "Test already taken" });
      }
      try {
        const addDefaultScore = await new ScoreModel({
          authorID: testVerification.authorId,
          studentID: req.userId,
          studentName: user.name,
          testID: testIds,
          testName: testVerification.testName,
          score: 0,
        });
        addDefaultScore.save();
      } catch (err) {
        // console.log(err);
        return res
          .status(500)
          .json({ status: 500, msg: "Internal Server Error" });
      }

      // Update attempts array
      await TestModel.findOneAndUpdate(
        { _id: testIds },
        { $push: { attempts: id } }
      );

      return res.status(200).json({ status: 200, data: testVerification });
    }
  } catch (err) {
    // console.log(err);
    res.send({ status: 202, msg: "internal error" });
  }
};

const submitTest = async (req, res, testid) => {
  try {
    if (req.userId) {
      const userId = await req.userId;
      const testId = await req.params.testid;
      const exam = await TestModel.findOne({ _id: testId });
      const testAnswers = exam.testAnswers;
      const data = await req.body.data;
      for (let i in data) {
        if (parseInt(testAnswers[i]) == parseInt(data[i])) {
          console.log(i);
          const score = await ScoreModel.findOne({
            studentID: userId,
            testID: testId,
          });
          console.log(score.score);
          const updateScore = await ScoreModel.updateOne(
            { studentID: userId, testID: testId },
            {
              $set: {
                score: score.score + 1,
              },
            }
          );
          console.log(updateScore);
        }
      }
    }
    res.send({ status: 200, msg: "Test Submitted succefully" });
  } catch (err) {
    // console.log(err);
    res.send({ status: 400, msg: "internal server error" });
    // console.log("error occured");
  }
};

const studentScore = async (req, res) => {
  try {
    if (req.userId) {
      let studentId = req.userId;
      let scores = await ScoreModel.find(
        { studentID: studentId },
        { score: 1, testName: 1 }
      );
      res.send({ status: 200, data: scores });
    }
  } catch (err) {
    res.send({ status: 400, msg: "Internal Error" });
    // console.log(err);
  }
};

const adminCreateTests = async (req, res) => {
  try {
    if (req.userId) {
      let testCreated = await TestModel.find(
        { authorId: req.userId },
        { testName: 1 }
      );
      res.send({ status: 200, data: testCreated });
      console.log(testCreated);
    }
  } catch (err) {
    console.log(err);
    res.send({ status: 400, msg: "Internal Error" });
  }
};
const deleteAdmintest = async (req, res, testid) => {
  try {
    if (req.userId) {
      let testId = await req.params.testid;
      console.log(testId);
      let deleteOneTest = await TestModel.deleteOne({ _id: testId });
      console.log(deleteOneTest);
      let deleteScores = await ScoreModel.deleteMany({ testID: testId });

      let remainTests = await TestModel.find({ authorId: req.userId });
      res.send({ status: 200, data: remainTests, msg: "Test deleted" });
    } else {
      res.send({ status: 202, msg: "unauthorised" });
    }
  } catch (err) {
    console.log(err);
    res.send({ status: 400, msg: "Internal error" });
  }
};

const sendScores = async (req, res, testid) => {
  try {
    if (req.userId) {
      let newdataarr = [];
      let testId = await req.params.testid;
      let testScores = await ScoreModel.find(
        { testID: testId },
        { testName: 1, studentName: 1, score: 1 }
      );
      res.send({ status: 200, data: testScores });
    } else {
      res.send({ status: 202, msg: "unauthorised" });
    }
  } catch (err) {
    console.log(err);
    res.send({ status: 400, msg: "Internal error" });
  }
};
module.exports = {
  addTest,
  deleteKey,
  updateKey,
  AdminTestsList,
  studentTests,
  takeTest,
  submitTest,
  studentScore,
  adminCreateTests,
  deleteAdmintest,
  sendScores,
};
