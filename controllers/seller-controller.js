const Seller = require("../models/seller-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mailer = require("../helpers/mail-helper");

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
      `">Verify</a> your mail for seller account</p>`;

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

//------------------------ Mail Verification while registering seller---------------

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

module.exports = { sellerRegister, mailVerification };
