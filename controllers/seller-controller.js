// ---------------  Models Used
const Seller = require("../models/seller-model");
const SellerPasswordReset = require("../models/password-reset-seller-model");

//-------------- External Libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mailer = require("../helpers/mail-helper");
const randomstring = require("randomstring");

//--------- for seller registration
const sellerRegister = async (req, res) => {
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

    const {
      name,
      email,
      mobile,
      password,
      storeName,
      storeDescription,
      upiId,
      gstNumber,
      socialMediaLinks,
      address,
    } = req.body;

    // Check if the user already exists by email
    const isExists = await Seller.findOne({ email: email });
    if (isExists) {
      return res.status(400).json({
        success: false,
        msg: `Email : ${email} already registered!`,
      });
    }

    // Hash the password before saving
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new seller instance
    const seller = new Seller({
      name,
      email,
      mobile,
      password: hashPassword,
      storeName,
      storeDescription, // either image will come by cloud or by normal server method v1 or v2
      image: req.image, // taking it from cloud
      upiId,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        zipCode: address.zipCode,
      },
      gstNumber,
      socialMediaLinks: {
        facebook: socialMediaLinks.facebook,
        instagram: socialMediaLinks.instagram,
        linkedin: socialMediaLinks.linkedin,
      },
    });

    // Save the user in the database
    const sellerData = await seller.save();

    // Also redirecting the user on mail verification link
    const msg =
      `<p>Hi ` +
      name +
      `, Please <a href="` +
      process.env.MAIL_VERIFICATION +
      `/api/v1/seller/mail-verification?id=` +
      sellerData._id +
      `">Verify</a> your mail for <b>seller account</b></p>`;

    // Sending mail to the user
    mailer.sendMail(email, "Mail Verification", msg);

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `${email} registered Successfully`,
      sellerData: sellerData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

//--------- Mail Verification while registering seller-----------

const mailVerification = async (req, res) => {
  try {
    //----- Id is there or not in parameters
    if (req.query.id == undefined) {
      return res.render("404.ejs");
    }

    const sellerData = await Seller.findOne({ _id: req.query.id });

    //------- if user exist in the db
    if (sellerData) {
      //------- Check for User Already verified
      if (sellerData.is_verified == 1) {
        return res.render("mail-verification", {
          message: "Your Mail already verified successfully",
        });
      }

      //-------- verify the user
      await Seller.findByIdAndUpdate(
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

// ---verifying the mail after the registration if he missed at the time of registration -------

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

    const sellerData = await Seller.findOne({ email });

    if (!sellerData) {
      return res.status(400).json({
        success: false,
        msg: "Email dose'nt exists!",
      });
    }

    if (sellerData.is_verified === 1) {
      return res.status(400).json({
        success: false,
        msg: `${sellerData.email} mail is already verified!`,
      });
    }

    const msg =
      `<p>Hi ` +
      sellerData.name +
      `, Please <a href="` +
      process.env.MAIL_VERIFICATION +
      `/api/v1/seller/mail-verification?id=` +
      sellerData._id +
      `">Verify</a> your mail for <b>seller account</b></p>`;

    // Sending mail to the user
    mailer.sendMail(sellerData.email, "Mail Verification", msg);

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `verification link send to your mail ${sellerData.email}`,
      sellerData: sellerData,
    });
  } catch (error) {
    return res.status(100).json({
      success: false,
      msg: error,
    });
  }
};

//------ To send forgot Password link  to mail---------
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

    const sellerData = await Seller.findOne({ email });

    if (!sellerData) {
      return res.status(400).json({
        success: false,
        msg: "Email dose'nt exists!",
      });
    }

    const randomString = randomstring.generate();

    const msg =
      `<p>Hii ` +
      sellerData.name +
      `, Please click ,<a href="` +
      process.env.FORGOT_URL +
      `/api/v1/seller/reset-password?token=` +
      randomString +
      `">here</a> to reset your <b>seller account</b> password</p>`;

    // Deleting the pre existing token if present  for the same user
    await SellerPasswordReset.deleteMany({ user_id: sellerData._id });

    // Seating up the token for new password generation
    const passwordReset = new SellerPasswordReset({
      user_id: sellerData._id,
      token: randomString,
    });

    await passwordReset.save();

    mailer.sendMail(sellerData.email, "Reset Password", msg);

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

//------- To send data to ejs file from token  --------

const resetPassword = async (req, res) => {
  try {
    if (req.query.token == undefined) {
      return res.render("404");
    }

    const resetData = await SellerPasswordReset.findOne({
      token: req.query.token,
    });

    if (!resetData) {
      return res.render("404");
    }

    return res.render("reset-password", { resetData });
  } catch (error) {
    return res.render("404");
  }
};

//------- To set the new password in DB --------

const updatePassword = async (req, res) => {
  try {
    const { user_id, password, c_password } = req.body;

    const resetData = await SellerPasswordReset.findOne({ user_id });

    if (password != c_password) {
      return res.render("reset-password", {
        resetData,
        error: "Confirm Password Not Matching!",
      });
    }

    const hashedPassword = await bcrypt.hash(c_password, 10);

    await Seller.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    // deleting the entry from the passwordReset schema
    await SellerPasswordReset.deleteMany({
      user_id,
    });

    return res.redirect("/api/v1/seller/reset-success");
  } catch (error) {
    return res.render("404");
  }
};

//----------- To render the Success page ----------

const resetSuccess = async (req, res) => {
  try {
    return res.render("reset-success");
  } catch (error) {
    return res.render("404");
  }
};

module.exports = {
  sellerRegister,
  mailVerification,
  sendMailVerification,
  forgotPassword,
  resetPassword,
  updatePassword,
  resetSuccess,
};
