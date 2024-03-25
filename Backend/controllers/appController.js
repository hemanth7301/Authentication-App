const userModel = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
require("dotenv").config();

async function register(req, res) {
  try {
    const { userName, password, profile, email } = req.body;

    const existuserName = new Promise((resolve, reject) => {
      userModel.findOne({ userName }, function (err, userName) {
        if (err) new Error(err);
        if (userName) reject({ error: "Username already exists" });
        resolve();
      });
    });

    const existEmail = new Promise((resolve, reject) => {
      userModel.findOne({ email }, function (err, email) {
        if (err) new Error(err);
        if (email) reject({ error: "Email already exists" });
        resolve();
      });
    });

    Promise.all([existEmail, existuserName])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new userModel({
                userName,
                email,
                password: hashedPassword,
                profile: profile || " ",
              });
              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "User Registered Successfully" })
                )
                .catch((error) =>
                  res.status(500).send({ msg: "Unable to save in DB" })
                );
            })
            .catch((error) => {
              return res
                .status(500)
                .send({ error: "Unable to hash the password" });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    res.status(500).send({ error });
  }
}

async function verifyUser(req, res, next) {
  try {
    const { userName } = req.method == "GET" ? req.query : req.body;
    const userExists = await userModel.findOne({ userName });
    if (!userExists)
      return res.status(500).send({ error: "Cant find this user" });
    next();
  } catch (error) {
    return res.status(500).send({ error: "Authentication error" });
  }
}

async function login(req, res) {
  const { userName, password } = req.body;
  try {
    userModel
      .findOne({ userName })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(400).send({ error: "Password doesn't match" });
            }
            const token = jwt.sign(
              { userId: user._id, userName: userName },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );
            return res
              .status(200)
              .send({ msg: "Login Successful", userName: userName, token });
          })
          .catch((error) => {
            res.status(400).send({ error: "Unable to compare passwords" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "User not found" });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function getUser(req, res) {
  const { userName } = req.params;
  try {
    if (!userName) return res.status(501).send({ error: "Invalid Username" });
    userModel.findOne({ userName }, function (err, user) {
      if (err) return res.status(500).send({ err });
      if (!user) return res.status(500).send({ user });
      const { password, ...rest } = user.toJSON();
      return res.status(201).send({ rest });
    });
  } catch (error) {
    return res.status(404).send({ error: "Cant find the user" });
  }
}

async function updateUser(req, res) {
  try {
    const { userId } = req.user;
    if (userId) {
      const body = req.body;
      userModel.updateOne({ _id: userId }, body, function (err, data) {
        if (err) throw err;
        return res.status(201).send({ msg: "Record Updated" });
      });
    } else {
      return res.status(401).send({ error: "User Not Found...!" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ msg: req.app.locals.OTP });
}

async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(code) == parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "OTP Verified Successfully" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

async function resetCreateSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: true });
  }
  return res.status(440).send({ error: "Session Expired" });
}

async function resetPassword(req, res) {
  const { userName, password } = req.body;
  try {
  } catch (error) {
    return res.status();
  }
}

module.exports = {
  register,
  verifyUser,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  resetCreateSession,
  resetPassword,
};
