const User = require("../models/user-model");
const Blacklist = require("../models/blacklist-model");
const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");
const mailer = require("../helpers/mail-helper");

const randomstring = require("randomstring");
const PasswordReset = require("../models/password-reset-model");
const passwordReset = require("../models/password-reset-model");

const jwt = require("jsonwebtoken");

const path = require("path");
const {
  deleteFile,
  deleteCloudSingle,
} = require("../helpers/delete-file-helper");

const userRegister = async (req, res) => {
  try {
    // Validating the req with express validator
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        error: valErrors.array(),
      });
    }

    const { name, email, mobile, password } = req.body;

    // Check if the user already exists by email
    const isExists = await User.findOne({ email: email });
    if (isExists) {
      return res.status(400).json({
        success: false,
        msg: `Email : ${email} already registered!`,
      });
    }

    // Hash the password before saving
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User({
      name: name,
      email: email,
      mobile: mobile,
      password: hashPassword,
      // either image will come by cloud or by normal server method v1 or v2
      image: req.image || "images" + req.file.filename,
    });

    // Save the user in the database
    const userData = await user.save();

    // Also redirecting the user on mail verification link
    const msg =
      `<p>Hi ` +
      name +
      `, Please <a href="` +
      process.env.MAIL_VERIFICATION +
      `/api/v1/mail-verification?id=` +
      userData._id +
      `">Verify</a> your mail</p>`;

    // Sending mail to the user
    mailer.sendMail(email, "Mail Verification", msg);

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `${email} registered Successfully`,
      userData: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

//------------------------ Mail Verification while registration---------------

const mailVerification = async (req, res) => {
  try {
    //----- Id is there or not in parameters
    if (req.query.id == undefined) {
      return res.render("404.ejs");
    }

    const userData = await User.findOne({ _id: req.query.id });

    //------- if user exist in the db
    if (userData) {
      //------- Check for User Already verified
      if (userData.is_verified == 1) {
        return res.render("mail-verification", {
          message: "Your Mail already verified successfully",
        });
      }

      //-------- verify the user
      await User.findByIdAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            is_verified: 1,
          },
        }
      );

      return res.render("mail-verification", {
        message: "Mail has been verified successfully",
      });
    } else {
      return res.render("mail-verification", { message: "User Not Found" });
    }
  } catch (error) {
    console.log(error.message);
    return res.render("404.ejs");
  }
};

// ------------ verifying the mail after the registration --------------

const sendMailVerification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "Email dose'nt exists!",
      });
    }

    if (userData.is_verified === 1) {
      return res.status(400).json({
        success: false,
        msg: `${userData.email} mail is already verified!`,
      });
    }

    const msg =
      `<p>Hi ` +
      userData.name +
      `, Please <a href="` +
      process.env.MAIL_VERIFICATION +
      `/api/v1/mail-verification?id=` +
      userData._id +
      `">Verify</a> your mail</p>`;

    // Sending mail to the user
    mailer.sendMail(userData.email, "Mail Verification", msg);

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `verification link send to your mail ${userData.email}`,
      userData: userData,
    });
  } catch (error) {
    return res.status(100).json({
      success: false,
      msg: error,
    });
  }
};

//----------------- To send forgot Password link  to mail---------------
const forgotPassword = async (req, res) => {
  try {
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        error: valErrors.array(),
      });
    }

    const { email } = req.body;

    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "Email dose'nt exists!",
      });
    }

    const randomString = randomstring.generate();

    const msg =
      `<p>Hii ` +
      userData.name +
      `, Please click ,<a href="` +
      process.env.FORGOT_URL +
      `/api/v1/reset-password?token=` +
      randomString +
      `">here</a> to reset your password</p>`;

    // Deleting the pre existing token if present  for the same user
    await PasswordReset.deleteMany({ user_id: userData._id });

    // Seating up the token for new password generation
    const passwordReset = new PasswordReset({
      user_id: userData._id,
      token: randomString,
    });

    await passwordReset.save();

    mailer.sendMail(userData.email, "Reset Password", msg);

    return res.status(201).json({
      success: true,
      msg: "Reset Password Link Send to your mail Please check!",
    });
  } catch (error) {
    return res.status(100).json({
      success: false,
      msg: error,
    });
  }
};

//-------------------- To send data to ejs file from token  --------

const resetPassword = async (req, res) => {
  try {
    if (req.query.token == undefined) {
      return res.render("404");
    }

    const resetData = await PasswordReset.findOne({ token: req.query.token });

    if (!resetData) {
      return res.render("404");
    }

    return res.render("reset-password", { resetData });
  } catch (error) {
    return res.render("404");
  }
};

//------------- To set the new password in DB -----------

const updatePassword = async (req, res) => {
  try {
    const { user_id, password, c_password } = req.body;

    const resetData = await PasswordReset.findOne({ user_id });

    if (password != c_password) {
      return res.render("reset-password", {
        resetData,
        error: "Confirm Password Not Matching!",
      });
    }

    const hashedPassword = await bcrypt.hash(c_password, 10);

    await User.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    // deleting the entry from the passwordReset schema
    await passwordReset.deleteMany({
      user_id,
    });

    return res.redirect("/api/v1/reset-success");
  } catch (error) {
    return res.render("404");
  }
};

//---------------- To render the Success page ------------

const resetSuccess = async (req, res) => {
  try {
    return res.render("reset-success");
  } catch (error) {
    return res.render("404");
  }
};

//------------------ Login And Token Generation User -----------------

const generateAccessToken = async (user) => {
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h",
  });

  return token;
};

const generateRefreshToken = async (user) => {
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "4h",
  });

  return token;
};

const loginUser = async (req, res) => {
  try {
    const valErrors = validationResult(req);

    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        error: valErrors.array(),
      });
    }

    const { email, password } = req.body;

    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(401).json({
        success: false,
        msg: "Email And Password is Incorrect",
      });
    }

    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        msg: "Email And Password is Incorrect",
      });
    }

    if (userData.is_verified == 0) {
      return res.status(401).json({
        success: false,
        msg: "please verify your mail",
      });
    }

    const accessToken = await generateAccessToken({ user: userData });
    const refreshToken = await generateRefreshToken({ user: userData });

    return res.status(200).json({
      success: true,
      msg: "Login Successfully",
      user: userData,
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenType: "Bearer",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

//------------------ To get the user Profile ----------------------

const userProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      msg: "User Profile Data",
      // data: req.user,
      data: req.user.user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

//----------------- To update user Profile ----------------------

const updateProfile = async (req, res) => {
  try {
    // Validating the req with express validator
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        error: valErrors.array(),
      });
    }

    const { name, mobile } = req.body;

    const data = {
      name,
      mobile,
    };

    const user_id = req.user.user._id;

    if (req.file !== undefined) {
      // Step 1: Set the new image URL/path
      data.image = req.image || "images/" + req.file.filename;

      // Step 2: Retrieve the existing user data to find the old image
      const oldUser = await User.findOne({ _id: user_id });

      if (oldUser && oldUser.image) {
        const oldFilePath = oldUser.image;

        // Step 3: Check if the old image is a local file or a Cloudinary URL
        if (oldFilePath.startsWith("http")) {
          // It's a Cloudinary URL, delete it from Cloudinary
          await deleteCloudSingle(oldFilePath);
        } else {
          // It's a local file, delete it from the server
          const localFilePath = path.join(__dirname, "../public/", oldFilePath);
          await deleteFile(localFilePath);
        }
      }
    }
    const userData = await User.findByIdAndUpdate(
      { _id: req.user.user._id },
      {
        $set: data,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "User Updated Successfully",
      data: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

// ------------------- To Refresh tokens to the client side ------------------

const refreshToken = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const userData = await User.findOne({ _id: userId });

    const accessToken = await generateAccessToken({ user: userData });
    const refreshToken = await generateRefreshToken({ user: userData });

    return res.status(200).json({
      success: true,
      msg: "Token Refreshed!",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

// ------------------- To Logout the User ------------------

const logoutUser = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];

    const bearer = token.split(" ");
    const bearerToken = bearer[1];

    const newBlacklist = new Blacklist({
      token: bearerToken,
    });

    await newBlacklist.save();

    res.setHeader("Clear-Site-Data", '"cookies","storage"');

    return res.status(200).json({
      success: true,
      msg: "Yore logged out!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = {
  userRegister,
  mailVerification,
  sendMailVerification,
  forgotPassword,
  resetPassword,
  updatePassword,
  resetSuccess,
  loginUser,
  userProfile,
  updateProfile,
  refreshToken,
  logoutUser,
};
