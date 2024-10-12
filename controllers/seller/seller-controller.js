// ---------------  Models Used
const Seller = require("../../models/seller/seller-model");
const SellerPasswordReset = require("../../models/seller/password-reset-seller-model");
const Blacklist = require("../../models/blacklist-model");

//-------------- External Libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mailer = require("../../helpers/mail-helper");
const randomstring = require("randomstring");

const {
  deleteFile,
  deleteCloudSingle,
} = require("../../helpers/delete-file-helper");

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
    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Booklio Email Verification</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Hi ${name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Please verify your email to activate your <b>seller account</b> on <b>Booklio</b>.
        </p>
        <p style="text-align: center;">
          <a href="${process.env.MAIL_VERIFICATION}/api/v1/seller/mail-verification?id=${sellerData._id}" 
             style="display: inline-block; padding: 15px 30px; margin: 20px 0; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 30px; font-size: 16px;">
             Verify Your Email
          </a>
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you did not sign up for a seller account, please ignore this email.
        </p>
      </div>
      <div style="background-color: #333; padding: 15px; text-align: center; color: #fff; font-size: 14px;">
        <p>© 2024 Booklio. All rights reserved.</p>
        <p><a href="https://booklio.com" style="color: #4CAF50; text-decoration: none;">Visit our website</a></p>
      </div>
    </div>
  `;

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

    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Booklio Email Verification</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Hi ${sellerData.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Please verify your email to activate your <b>seller account</b> on <b>Booklio</b>.
        </p>
        <p style="text-align: center;">
          <a href="${process.env.MAIL_VERIFICATION}/api/v1/seller/mail-verification?id=${sellerData._id}" 
             style="display: inline-block; padding: 15px 30px; margin: 20px 0; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 30px; font-size: 16px;">
             Verify Your Email
          </a>
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you did not sign up for a seller account, please ignore this email.
        </p>
      </div>
      <div style="background-color: #333; padding: 15px; text-align: center; color: #fff; font-size: 14px;">
        <p>© 2024 Booklio. All rights reserved.</p>
        <p><a href="https://booklio.com" style="color: #4CAF50; text-decoration: none;">Visit our website</a></p>
      </div>
    </div>
  `;

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

    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Booklio Password Reset</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Hi ${sellerData.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          We received a request to reset the password for your <b>seller account</b> on <b>Booklio</b>. If you did not make this request, please ignore this email.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          To reset your password, please click the button below:
        </p>
        <p style="text-align: center;">
          <a href="${process.env.FORGOT_URL}/api/v1/seller/reset-password?token=${randomString}" 
             style="display: inline-block; padding: 15px 30px; margin: 20px 0; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 30px; font-size: 16px;">
             Reset Your Password
          </a>
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you did not request this change, you can safely ignore this email.
        </p>
      </div>
      <div style="background-color: #333; padding: 15px; text-align: center; color: #fff; font-size: 14px;">
        <p>© 2024 Booklio. All rights reserved.</p>
        <p><a href="https://booklio.com" style="color: #4CAF50; text-decoration: none;">Visit our website</a></p>
      </div>
    </div>
  `;

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

//------- To send data to ejs file from token --------

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

    return res.render("reset-password-seller", { resetData });
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

//----- Login And Token Generation User -------

const generateAccessToken = async (credDecode) => {
  const token = jwt.sign(credDecode, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h",
  });

  return token;
};

const generateRefreshToken = async (credDecode) => {
  const token = jwt.sign(credDecode, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "4h",
  });

  return token;
};

const loginSeller = async (req, res) => {
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

    const sellerData = await Seller.findOne({ email });

    if (!sellerData) {
      return res.status(401).json({
        success: false,
        msg: "Email And Password is Incorrect",
      });
    }

    const passwordMatch = await bcrypt.compare(password, sellerData.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        msg: "Email And Password is Incorrect",
      });
    }

    if (sellerData.is_verified == 0) {
      return res.status(401).json({
        success: false,
        msg: "please verify your mail",
      });
    }

    const accessToken = await generateAccessToken({ credDecode: sellerData });
    const refreshToken = await generateRefreshToken({ credDecode: sellerData });

    return res.status(200).json({
      success: true,
      msg: "Login Successfully",
      sellerData: sellerData,
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

//--------- To get the user Profile --------------
const sellerProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      msg: "Seller Profile Data",
      // data: req.cred,
      data: req.cred.credDecode,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

//--------- To update user Profile ---------------

const updateSellerProfile = async (req, res) => {
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
      mobile,
      storeName,
      storeDescription,
      image,
      upiId,
      address: { street, city, state, country, zipCode } = {}, // Nested destructuring for address
      gstNumber,
      socialMediaLinks: { facebook, instagram, linkedin } = {}, // Nested destructuring for social media links
    } = req.body;

    const data = {
      name,
      mobile,
      storeName,
      storeDescription,
      image,
      upiId,
      address: {
        street,
        city,
        state,
        country,
        zipCode,
      },
      gstNumber,
      socialMediaLinks: {
        facebook,
        instagram,
        linkedin,
      },
    };
    //------------------Working but need to fix latter here seller
    const seller_id = req.cred.credDecode._id;

    if (req.file !== undefined) {
      // Step 1: Set the new image URL/path
      data.image = req.image || "images/" + req.file.filename;

      // Step 2: Retrieve the existing user data to find the old image
      const oldUser = await Seller.findOne({ _id: seller_id });

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

    const sellerData = await Seller.findByIdAndUpdate(
      { _id: req.cred.credDecode._id },
      {
        $set: data,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Seller Updated Successfully",
      sellerData: sellerData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

// ------ To Refresh tokens to the client side -------

const refreshToken = async (req, res) => {
  try {
    //------------------Working but need to fix latter here seller
    const sellerId = req.cred.credDecode._id;
    const sellerData = await Seller.findOne({ _id: sellerId });

    const accessToken = await generateAccessToken({ credDecode: sellerData });
    const refreshToken = await generateRefreshToken({ credDecode: sellerData });

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

// ------------ To Logout the User --------------

const logoutSeller = async (req, res) => {
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
  sellerRegister,
  mailVerification,
  sendMailVerification,
  forgotPassword,
  resetPassword,
  updatePassword,
  resetSuccess,
  generateAccessToken,
  generateRefreshToken,
  loginSeller,
  sellerProfile,
  updateSellerProfile,
  refreshToken,
  logoutSeller,
};
