// ---------------  Models Used
const User = require("../../models/user/user-model");
const Blacklist = require("../../models/blacklist-model");
const PasswordReset = require("../../models/user/password-reset-user-model");

//-------------- External Libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mailer = require("../../helpers/mail-helper");
const randomstring = require("randomstring");
const path = require("path");


const {
  deleteFile,
  deleteCloudSingle,
} = require("../../helpers/delete-file-helper");



/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Operations related to Seller
 */


//----------------- for user registration
/**
 * @swagger
 * /user/api/v2/register:
 *   post:
 *     summary: Register a new user with optional image upload
 *     description: Registers a user, hashes the password, saves the user in the database, and sends a verification email. The image URL should be provided in the request body.
 *     tags:
 *       - User 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               mobile:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPassword123!"
 *               image:
 *                 type: string
 *                 example: "https://yourcdn.com/uploads/profile.jpg"
 *                 description: URL of the uploaded profile image
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or email already registered
 */

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
    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Booklio Email Verification</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Hi ${name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Please verify your email by clicking the button below:
        </p>
        <p style="text-align: center;">
          <a href="${process.env.MAIL_VERIFICATION}/api/v1/mail-verification?id=${userData._id}" 
             style="display: inline-block; padding: 15px 30px; margin: 20px 0; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 30px; font-size: 16px;">
             Verify Your Email
          </a>
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you did not sign up, please ignore this email.
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
      userData: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

/**
 * @swagger
 * /user/api/v4/register:
 *   post:
 *     summary: use this  Register a new user without image upload
 *     description: Registers a user, hashes the password, and sends a verification email. No image upload required.
 *     tags:
 *       - User 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               mobile:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPassword123!"
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or email already registered
 */

const userRegisterV4 = async (req, res) => {
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

    console.log(req.body)

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
      // image: req.image || "images" + req.file.filename,
    });

    // Save the user in the database
    const userData = await user.save();

    // Also redirecting the user on mail verification link
    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Booklio Email Verification</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Hi ${name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Please verify your email by clicking the button below:
        </p>
        <p style="text-align: center;">
          <a href="${process.env.MAIL_VERIFICATION}/user/api/v1/mail-verification?id=${userData._id}" 
             style="display: inline-block; padding: 15px 30px; margin: 20px 0; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 30px; font-size: 16px;">
             Verify Your Email
          </a>
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you did not sign up, please ignore this email.
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
/**
 * @swagger
 * /user/api/v1/mail-verification:
 *   get:
 *     tags:
 *       - User
 *     summary: Verify user email
 *     description: Verifies the user's email based on the provided user ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: User ID for email verification
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email successfully verified
 *       400:
 *         description: User not found or already verified
 *       500:
 *         description: Internal server error
 */
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

// ---verifying the mail after the registration if he missed at the time of registration -------
/**
 * @swagger
 * /user/api/v1/send-mail-verification:
 *   post:
 *     tags:
 *       - User   
 *     summary: Send email verification link
 *     description: Sends a verification email to the user if not already verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *       400:
 *         description: Email doesn't exist or is already verified
 *       500:
 *         description: Internal server error
 */
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

    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Booklio Email Verification</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Hi ${userData.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Please verify your email by clicking the button below:
        </p>
        <p style="text-align: center;">
          <a href="${process.env.MAIL_VERIFICATION}/api/v1/mail-verification?id=${userData._id}" 
             style="display: inline-block; padding: 15px 30px; margin: 20px 0; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 30px; font-size: 16px;">
             Verify Your Email
          </a>
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you did not sign up, please ignore this email.
        </p>
      </div>
      <div style="background-color: #333; padding: 15px; text-align: center; color: #fff; font-size: 14px;">
        <p>© 2024 Booklio. All rights reserved.</p>
        <p><a href="https://booklio.com" style="color: #4CAF50; text-decoration: none;">Visit our website</a></p>
      </div>
    </div>
  `;

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
/**
 * @swagger
 * /user/api/v1/forgot-password:
 *   post:
 *     tags: 
 *      - User
 *     summary: Send forgot password link
 *     description: Sends a password reset link to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       201:
 *         description: Reset password link sent successfully
 *       400:
 *         description: Email doesn't exist
 *       500:
 *         description: Internal server error
 */
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

    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Password Reset Request</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Hi ${userData.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          We received a request to reset your password. If you did not make this request, please ignore this email.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          To reset your password, please click the link below:
        </p>
        <p style="text-align: center;">
          <a href="${process.env.FORGOT_URL}/api/v1/reset-password?token=${randomString}" 
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
/**
 * @swagger
 * /user/api/v1/reset-password:
 *   get:
 *     summary: Renders the password reset page based on a valid reset token.
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token received for password reset verification.
 *     responses:
 *       200:
 *         description: Renders the reset password page with reset data.
 *       404:
 *         description: Token is invalid or missing, rendering the 404 page.
 */
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
/**
 * @swagger
 * /user/api/v1/update-password:
 *   post:
 *     summary: Updates the user password in the database.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - password
 *               - c_password
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The unique ID of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The new password to be set.
 *               c_password:
 *                 type: string
 *                 format: password
 *                 description: Confirmation password (must match 'password').
 *     responses:
 *       302:
 *         description: Password updated successfully, redirects to success page.
 *       400:
 *         description: Passwords do not match or invalid request data.
 *       404:
 *         description: User not found or token missing, rendering the 404 page.
 */

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
    await PasswordReset.deleteMany({
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

/**
 * @swagger
 * /user/api/v1/login:
 *   post:
 *     summary: Authenticates a user and returns access and refresh tokens.
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Registered email of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Login successful, returns user data and tokens.
 *       400:
 *         description: Validation errors or request issues.
 *       401:
 *         description: Incorrect email/password or email not verified.
 */

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
        msg: "Please verify your mail ! \n Check your mail box",
      });
    }

    const accessToken = await generateAccessToken({ credDecode: userData });
    const refreshToken = await generateRefreshToken({ credDecode: userData });

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

//--------- To get the user Profile --------------

/**
 * @swagger
 * /user/api/v1/user-profile:
 *   get:
 *     summary: Retrieves the authenticated user's profile data.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile data.
 *       400:
 *         description: An error occurred while fetching profile data.
 */
const userProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      msg: "User Profile Data",
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
/**
 * @swagger
 * /user/api/v1/update-profile:
 *   put:
 *     summary: Updates the user's profile information.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the user.
 *               mobile:
 *                 type: string
 *                 description: Updated mobile number of the user.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image to be uploaded.
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *       400:
 *         description: Validation errors or update failure.
 */
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

    const user_id = req.cred.credDecode._id;

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
      { _id: req.cred.credDecode._id },
      {
        $set: data,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "User Updated Successfully",
      userdata: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

// ------ To Refresh tokens to the client side -------
/**
 * @swagger
 * /user/api/v1/refresh-token:
 *   post:
 *     summary: Refreshes the authentication tokens.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully.
 *       400:
 *         description: An error occurred while refreshing tokens.
 */
const refreshToken = async (req, res) => {
  try {
    const userId = req.cred.credDecode._id;
    const userData = await User.findOne({ _id: userId });

    const accessToken = await generateAccessToken({ credDecode: userData });
    const refreshToken = await generateRefreshToken({ credDecode: userData });

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
/**
 * @swagger
 * /user/api/v1/logout:
 *   post:
 *     summary: Logs out the user and invalidates the token.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token to be invalidated.
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *       400:
 *         description: An error occurred while logging out.
 */
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
  userRegisterV4,
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
