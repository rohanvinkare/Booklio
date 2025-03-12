const Management = require("../../models/management/management-model");
const Blacklist = require("../../models/blacklist-model");
const MemberPasswordReset = require("../../models/management/password-reset-management-model");

//-------------- External Libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mailer = require("../../helpers/mail-helper");
const randomstring = require("randomstring");
const path = require("path");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Management
 *     description: Operations for management members including authentication and profile management
 */


const {
  deleteFile,
  deleteCloudSingle,
} = require("../../helpers/delete-file-helper");

// //----------------- for user registration
// const memberRegister = async (req, res) => {
//   try {
//     // Validating the req with express validator
//     const valErrors = validationResult(req);
//     if (!valErrors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         msg: "Errors",
//         error: valErrors.array(),
//       });
//     }

//     const { name, email, mobile, password, role } = req.body;

//     if (role === "admin") {
//       return res.status(400).json({
//         success: false,
//         msg: `You Cannot Create Admin!`,
//       });
//     }

//     // Check if the user already exists by email
//     const isExists = await Management.findOne({ email: email });
//     if (isExists) {
//       return res.status(400).json({
//         success: false,
//         msg: `Email : ${email} already registered!`,
//       });
//     }

//     // Hash the password before saving
//     const hashPassword = await bcrypt.hash(password, 10);

//     // Create a new user instance
//     const member = new Management({
//       name: name,
//       email: email,
//       mobile: mobile,
//       password: hashPassword,
//       // either image will come by cloud or by normal server method v1 or v2
//       image: req.image,
//       role: role,
//     });

//     // Save the user in the database
//     const memberData = await member.save();

//     const msg = `
//   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
//     <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
//       <h1 style="color: #fff; margin: 0; font-size: 24px;">Welcome to Booklio!</h1>
//     </div>
//     <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
//       <p style="font-size: 18px;">Hi ${memberData.name},</p>
//       <p style="font-size: 16px; line-height: 1.6;">
//         Welcome to the Booklio organization! We are excited to have you on board as a <strong>${memberData.role}</strong>.
//       </p>
//       <p style="font-size: 16px; line-height: 1.6;">
//         Here are your login credentials:
//       </p>
//       <ul style="font-size: 16px;">
//         <li><strong>Email:</strong> ${email}</li>
//         <li><strong>Password:</strong> ${password}</li>
//       </ul>
//       <p style="font-size: 16px; line-height: 1.6;">
//         Please remember to keep your credentials safe and do not share them with anyone.
//       </p>
//       <p style="font-size: 16px; line-height: 1.6;">
//         If you have any questions or need assistance, feel free to reach out to our support team.
//       </p>
//     </div>
//     <div style="background-color: #333; padding: 15px; text-align: center; color: #fff; font-size: 14px;">
//       <p>© 2024 Booklio. All rights reserved.</p>
//       <p><a href="https://booklio.com" style="color: #4CAF50; text-decoration: none;">Visit our website</a></p>
//     </div>
//   </div>
// `;

//     // Sending mail to the user
//     mailer.sendMail(email, "Mail Verification", msg);

//     // Return success response
//     return res.status(200).json({
//       success: true,
//       msg: `${email} registered Successfully as Member of Booklio.`,
//       memberData: memberData,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       msg: error.message || "An error occurred",
//     });
//   }
// };

//----------------- To send forgot Password link  to mail---------------


/**
 * @swagger
 * /management/api/v1/management/forgot-password:
 *   post:
 *     tags:
 *       - Management
 *     summary: Request password reset link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reset password link sent successfully
 *       400:
 *         description: Invalid email or validation error
 */

const forgotMemberPassword = async (req, res) => {
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

    const memberData = await Management.findOne({ email });

    if (!memberData) {
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
        <p style="font-size: 18px;">Dear ${memberData.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          We hope this message finds you well. As a valued member of the Booklio management team, we want to ensure your account remains secure.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          We received a request to reset your password. If you did not initiate this request, please disregard this email.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          To proceed with resetting your password, please click the link below:
        </p>
        <p style="text-align: center;">
          <a href="${process.env.FORGOT_URL}/api/v1/management/reset-password?token=${randomString}" 
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
    await MemberPasswordReset.deleteMany({ user_id: memberData._id });

    // Seating up the token for new password generation
    const passwordReset = new MemberPasswordReset({
      user_id: memberData._id,
      token: randomString,
    });

    await passwordReset.save();

    mailer.sendMail(memberData.email, "Reset Password", msg);

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
 * /management/api/v1/management/reset-password:
 *   get:
 *     tags:
 *       - Management
 *     summary: Display reset password page
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Reset password page rendered
 *       404:
 *         description: Invalid token or expired link
 *   post:
 *     tags:
 *       - Management
 *     summary: Update password with new one
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               password:
 *                 type: string
 *               c_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Passwords don't match or validation error
 */

const resetMemberPassword = async (req, res) => {
  try {
    if (req.query.token == undefined) {
      return res.render("404");
    }

    const resetData = await MemberPasswordReset.findOne({
      token: req.query.token,
    });

    if (!resetData) {
      return res.render("404");
    }

    return res.render("reset-password-member", { resetData });
  } catch (error) {
    return res.render("404");
  }
};

//------------- To set the new password in DB -----------
/**
 * @swagger
 * /management/api/v1/management/update-password:
 *   post:
 *     tags:
 *       - Management
 *     summary: Update member's password after reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID of the user resetting password
 *               password:
 *                 type: string
 *                 description: New password
 *               c_password:
 *                 type: string
 *                 description: Confirm new password
 *     responses:
 *       200:
 *         description: Password updated successfully, redirects to success page
 *       400:
 *         description: Passwords don't match
 *       404:
 *         description: User not found or reset token invalid
 */
const updateMemberPassword = async (req, res) => {
  try {
    const { user_id, password, c_password } = req.body;

    const resetData = await MemberPasswordReset.findOne({ user_id });

    if (password != c_password) {
      return res.render("reset-password", {
        resetData,
        error: "Confirm Password Not Matching!",
      });
    }

    const hashedPassword = await bcrypt.hash(c_password, 10);

    await Management.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    // deleting the entry from the passwordReset schema
    await MemberPasswordReset.deleteMany({
      user_id,
    });

    return res.redirect("/api/v1/management/reset-success");
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
  f;
};

/**
 * @swagger
 * /management/api/v1/management/member-login:
 *   post:
 *     tags:
 *       - Login
 *     summary: Login for management members
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */


const loginMember = async (req, res) => {
  try {
    const valErrors = validationResult(req);

    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        // msg: "Errors",
        error: valErrors.array(),
      });
    }

    const { email, password } = req.body;

    const memberData = await Management.findOne({ email });

    if (!memberData) {
      return res.status(401).json({
        success: false,
        msg: "Email And Password is Incorrect",
      });
    }

    const passwordMatch = await bcrypt.compare(password, memberData.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        msg: "Email And Password is Incorrect",
      });
    }

    // if (memberData.is_verified == 0) {
    //   return res.status(401).json({
    //     success: false,
    //     msg: "please verify your mail",
    //   });
    // }

    const accessToken = await generateAccessToken({ credDecode: memberData });
    const refreshToken = await generateRefreshToken({ credDecode: memberData });

    return res.status(200).json({
      success: true,
      msg: "Login Successfully",
      memberData: memberData,
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
 * /management/api/v1/management/member-profile:
 *   get:
 *     tags:
 *       - Management
 *     summary: Get member profile details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *       401:
 *         description: Unauthorized access
 */
const memberProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      msg: "Member Profile Data",
      data: req.cred.credDecode,
      //   data: req.cred.user,
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
 * /management/api/v1/management/update-member-profile:
 *   post:
 *     tags:
 *       - Management
 *     summary: Update member profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               mobile:
 *                 type: string
 *               image:
 *                 type: string
 *                 description: Base64 encoded image string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized access
 *       400:
 *         description: Invalid input or validation error
 */

const updateMemberProfile = async (req, res) => {
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

    const member_id = req.cred.credDecode._id;

    if (req.file !== undefined) {
      // Step 1: Set the new image URL/path
      data.image = req.image;

      // Step 2: Retrieve the existing user data to find the old image
      const oldUser = await Management.findOne({ _id: member_id });

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
    const memberData = await Management.findByIdAndUpdate(
      { _id: req.cred.credDecode._id },
      {
        $set: data,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Member Updated Successfully",
      memberData: memberData,
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
 * /management/api/v1/management/refresh-token:
 *   get:
 *     tags:
 *       - Management
 *     summary: Refresh access token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New tokens generated successfully
 *       401:
 *         description: Invalid or expired token
 */

const refreshToken = async (req, res) => {
  try {
    const memberId = req.cred.credDecode._id;
    const memberData = await Management.findOne({ _id: memberId });

    const accessToken = await generateAccessToken({ member: memberData });
    const refreshToken = await generateRefreshToken({ member: memberData });

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
 * /management/api/v1/management/logout-member:
 *   get:
 *     tags:
 *       - Management
 *     summary: Logout member
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized access
 *       400:
 *         description: Error during logout
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
  loginMember,
  memberProfile,
  forgotMemberPassword,
  resetMemberPassword,
  updateMemberPassword,
  updateMemberProfile,
  resetSuccess,
  refreshToken,
  logoutUser,
};
