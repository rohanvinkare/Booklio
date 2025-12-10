const Management = require("../../../models/management/management-model");
const User = require("../../../models/user/user-model");
const Seller = require("../../../models/seller/seller-model");
const PayCut = require("../../../models/paycut/paycut-model")
const Blacklist = require("../../../models/blacklist-model");
const Book = require("../../../models/books/books-model");
const MemberPasswordReset = require("../../../models/management/password-reset-management-model");

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Operations available to administrators for managing users, sellers, and members
 */


//-------------- External Libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mailer = require("../../../helpers/mail-helper");
const randomstring = require("randomstring");
const path = require("path");

const {
  deleteFile,
  deleteCloudSingle,
} = require("../../../helpers/delete-file-helper");
const { stringify } = require("querystring");

/**
 * For creating the new member role in Management and sending the mail with Account credentials
 */
//----------------- for user registration

/**
 * @swagger
 * /admin/api/v1/management/member-register:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Register a new management member
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
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Member registered successfully
 *       400:
 *         description: Invalid input
 */

const memberRegister = async (req, res) => {
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

    const { name, email, mobile, password, role } = req.body;

    if (role === "admin") {
      return res.status(400).json({
        success: false,
        msg: `You Cannot Create Admin!`,
      });
    }

    // Check if the user already exists by email
    const user = await Management.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        success: false,
        msg: `Email : ${email} already registered!`,
      });
    }

    // Hash the password before saving
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const member = new Management({
      name: name,
      email: email,
      mobile: mobile,
      password: hashPassword,
      // either image will come by cloud or by normal server method v1 or v2
      image: req.image,
      role: role,
    });

    // Save the user in the database
    const memberData = await member.save();

    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Welcome to Booklio!</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Hi ${memberData.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Welcome to the Booklio organization! We are excited to have you on board as a <strong>${memberData.role}</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Here are your login credentials:
        </p>
        <ul style="font-size: 16px;">
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.6;">
          Please remember to keep your credentials safe and do not share them with anyone.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you have any questions or need assistance, feel free to reach out to our support team.
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
      msg: `${email} registered Successfully as Member of Booklio.`,
      memberData: memberData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

//-------------  Register Without the image 


/**
 * @swagger
 * /admin/api/v4/management/member-register:
 *   post:
 *     tags:
 *       - Admin
 *     summary: use this Register a new member without image
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
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member registered successfully
 */


const memberRegisterV4 = async (req, res) => {
  try {
    // Validating the req with express validator
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: valErrors.array(),
      });
    }

    const { name, email, mobile, password, role } = req.body;



    if (role === "admin") {
      return res.status(400).json({
        success: false,
        msg: `You Cannot Create Admin!`,
      });
    }

    // Check if the user already exists by email
    const user = await Management.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        success: false,
        msg: `Email : ${email} \nAlready registered!`,
      });
    }

    // Hash the password before saving
    const hashPassword = await bcrypt.hash(password, 10);


    const Role = role.toLowerCase()

    // Create a new user instance
    const member = new Management({
      name: name,
      email: email,
      mobile: mobile,
      password: hashPassword,
      // either image will come by cloud or by normal server method v1 or v2
      // image: req.image,
      role: Role,
    });

    // Save the user in the database
    const memberData = await member.save();

    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Welcome to Booklio!</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Hi ${memberData.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Welcome to the Booklio organization! We are excited to have you on board as a <strong>${memberData.role}</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Here are your login credentials:
        </p>
        <ul style="font-size: 16px;">
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.6;">
          Please remember to keep your credentials safe and do not share them with anyone.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you have any questions or need assistance, feel free to reach out to our support team.
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
      msg: `${email} registered Successfully as Member of Booklio.`,
      memberData: memberData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

/**
 * For updating the member role with email and sending the mail of updation details
 */
//---------------- For Updating the member Role

/**
 * @swagger
 * /admin/api/v1/update-member-role:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Update member role
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 */

const updateMemberRole = async (req, res) => {
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

    const { email, role } = req.body;

    if (role === "admin") {
      return res.status(400).json({
        success: false,
        msg: `You can't update Member to admin!`,
      });
    }

    // Check if the user already exists by email
    const isExists = await Management.findOne({ email: email });
    if (!isExists) {
      return res.status(400).json({
        success: false,
        msg: `Member Not Found!`,
      });
    }

    const memberData = await Management.findOneAndUpdate(
      {
        email: email,
      },
      {
        $set: {
          role: role,
        },
      }
    );

    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Role Update Notification</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Dear ${memberData.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          We are pleased to inform you that your role within the Booklio organization has been successfully updated to <strong>${role}</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Your contributions and dedication have been invaluable to our team, and we are excited to see how you will continue to impact our community in your new capacity.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you have any questions regarding your new role or if there is anything we can assist you with, please feel free to reach out to our support team at <a href="mailto:support@booklio.com" style="color: #4CAF50;">support@booklio.com</a>. We are here to help!
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for your continued commitment to Booklio. We look forward to your ongoing contributions and success in your new role.
        </p>
      </div>
      <div style="background-color: #333; padding: 15px; text-align: center; color: #fff; font-size: 14px;">
        <p>© 2024 Booklio. All rights reserved.</p>
        <p><a href="https://booklio.com" style="color: #4CAF50; text-decoration: none;">Visit our website</a></p>
      </div>
    </div>
    `;
    // Sending mail to the user
    mailer.sendMail(memberData.email, "Role Updation", msg);

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `Role Updated Successfully`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

/**
 * For deleting the Management member with memberId and sending the mail of Account Deletion
 */
//---------------- For deleting the user
/**
 * @swagger
 * /admin/api/v1/delete-member:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Delete a member
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member deleted successfully
 */


const deleteMember = async (req, res) => {
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

    const { memberId } = req.body;

    // Check if the user already exists by email
    const memberData = await Management.findOne({ memberId: memberId });
    if (!memberData) {
      return res.status(400).json({
        success: false,
        msg: `Member Not Found!`,
      });
    }

    await Management.findOneAndDelete({ memberId: memberId });

    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #f44336; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Account Deletion Notice</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Dear ${memberData.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          We regret to inform you that your Booklio account with the email ${memberData.email} has been deleted as per the request from our management team.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          As a valued member of our community, we would like to thank you for your contributions and support over the years. Your participation has been greatly appreciated.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you believe this action was taken in error or if you have any questions regarding this decision, please do not hesitate to reach out to our support team at support@booklio.com. We will be more than happy to assist you.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          We wish you all the best in your future endeavors and hope that you will continue to support the literary community in your own way.
        </p>
      </div>
      <div style="background-color: #333; padding: 15px; text-align: center; color: #fff; font-size: 14px;">
        <p>© 2024 Booklio. All rights reserved.</p>
        <p><a href="https://booklio.com" style="color: #4CAF50; text-decoration: none;">Visit our website</a></p>
      </div>
    </div>
`;
    // Sending mail to the user
    mailer.sendMail(memberData.email, "Account Deletion", msg);

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `Account Deleted Successfully a member of Booklio.`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

/**
 * For fetching member Data in Management
 * if memberId  in query Params present then will return the member specific data
 */
// Controller function to fetch member data

/**
 * @swagger
 * /admin/api/v1/get-member-data/{memberId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get member data
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *         required: false
 *         description: Member ID (optional)
 *     responses:
 *       200:
 *         description: Member data retrieved successfully
 */

const getMemberData = async (req, res) => {
  try {
    // Validate the request (using express-validator)
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation Errors",
        error: valErrors.array(),
      });
    }

    // Extract memberId from route parameters
    const { memberId } = req.params;

    let memberData;

    // If memberId is provided, fetch the specific member
    if (memberId) {
      memberData = await Management.find({ memberId: memberId });

      // If no member found with the given ID, return an error
      if (memberData.length === 0) {
        return res.status(404).json({
          success: false,
          msg: `Member with ID ${memberId} not found.`,
        });
      }

      // Return the specific member data
      return res.status(200).json({
        success: true,
        msg: `Member data for ID :- ${memberId}`,
        memberData: memberData,
      });
    } else {
      // If no memberId is provided, fetch all members
      memberData = await Management.find({});

      // Return all members
      return res.status(200).json({
        success: true,
        msg: `All members of Booklio.`,
        memberData: memberData,
      });
    }
  } catch (error) {
    // Handle any errors during the data fetching process
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

/**
 * For deleting the user with userId and sending the mail of User Account Deletion
 */
//---------------- For deleting the user
/**
 * @swagger
 * /admin/api/v1/delete-user:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
const deleteUser = async (req, res) => {
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

    const { userId } = req.body;

    // Check if the user already exists by email
    const userData = await User.findOne({ userId: userId });
    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: `User Not Found!`,
      });
    }

    await User.findOneAndDelete({ userId: userId });

    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #f44336; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Account Deletion Notice</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Hi ${userData.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          We are writing to inform you that your account with Booklio has been deleted as per the request from our management team.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you believe this action was taken in error or if you have any questions regarding this decision, please feel free to reach out to our support team for assistance.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for being a part of our community. We wish you all the best in your future endeavors.
        </p>
      </div>
      <div style="background-color: #333; padding: 15px; text-align: center; color: #fff; font-size: 14px;">
        <p>© 2024 Booklio. All rights reserved.</p>
        <p><a href="https://booklio.com" style="color: #4CAF50; text-decoration: none;">Visit our website</a></p>
      </div>
    </div>
`;
    // Sending mail to the user
    mailer.sendMail(userData.email, "Account Deletion", msg);

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `Account Deleted Successfully a user of Booklio.`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

/**
 * For fetching user Data
 * if userId  in query Params present then will return the user specific data
 */
// Controller function to fetch member data
/**
 * @swagger
 * /admin/api/v1/get-user-data/{userId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get user data
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: User ID (optional)
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 */
const getUserData = async (req, res) => {
  try {
    // Validate the request (using express-validator)
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation Errors",
        error: valErrors.array(),
      });
    }

    // Extract userId from route parameters
    const { userId } = req.params;

    let userData;

    // If userId is provided, fetch the specific
    if (userId) {
      userData = await User.find({ userId: userId });

      // If no user found with the given ID, return an error
      if (userData.length === 0) {
        return res.status(404).json({
          success: false,
          msg: `User with ID ${userId} not found.`,
        });
      }

      // Return the specific user data
      return res.status(200).json({
        success: true,
        msg: `User data for ID :- ${userId}`,
        userData: userData,
      });
    } else {
      // If no userId is provided, fetch all users
      userData = await User.find({});

      // Return all users
      return res.status(200).json({
        success: true,
        msg: `All Users of Booklio.`,
        userData: userData,
      });
    }
  } catch (error) {
    // Handle any errors during the data fetching process
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

/**
 * For deleting the seller with sellerId and sending the mail of seller Account Deletion
 */
//---------------- For deleting the seller
// const deleteSeller = async (req, res) => {
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

//     const { sellerId } = req.body;

//     // Check if the user already exists by email
//     const sellerData = await Seller.findOne({ sellerId: sellerId });
//     if (!sellerData) {
//       return res.status(400).json({
//         success: false,
//         msg: `Seller Not Found!`,
//       });
//     }

//     await Seller.findOneAndDelete({ sellerId: sellerId });

//     const msg = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
//       <div style="background-color: #f44336; padding: 20px; text-align: center;">
//         <h1 style="color: #fff; margin: 0; font-size: 24px;">Account Deletion Notice</h1>
//       </div>
//       <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
//         <p style="font-size: 18px;">Dear ${sellerData.name},</p>
//         <p style="font-size: 16px; line-height: 1.6;">
//           We regret to inform you that your Booklio account with the email ${sellerData.email} has been deleted as per the request from our management team.
//         </p>
//         <p style="font-size: 16px; line-height: 1.6;">
//           As a valued member of our community, we would like to thank you for your contributions and support over the years. Your participation has been greatly appreciated.
//         </p>
//         <p style="font-size: 16px; line-height: 1.6;">
//           If you believe this action was taken in error or if you have any questions regarding this decision, please do not hesitate to reach out to our support team at support@booklio.com. We will be more than happy to assist you.
//         </p>
//         <p style="font-size: 16px; line-height: 1.6;">
//           We wish you all the best in your future endeavors and hope that you will continue to support the literary community in your own way.
//         </p>
//       </div>
//       <div style="background-color: #333; padding: 15px; text-align: center; color: #fff; font-size: 14px;">
//         <p>© 2024 Booklio. All rights reserved.</p>
//         <p><a href="https://booklio.com" style="color: #4CAF50; text-decoration: none;">Visit our website</a></p>
//       </div>
//     </div>
// `;
//     // Sending mail to the user
//     mailer.sendMail(sellerData.email, "Account Deletion", msg);

//     // Return success response
//     return res.status(200).json({
//       success: true,
//       msg: `Account Deleted Successfully a Seller of Booklio.`,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       msg: error.message || "An error occurred",
//     });
//   }
// };

/**
 * @swagger
 * /admin/api/v1/delete-seller:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Delete a seller
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sellerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seller deleted successfully
 */

const deleteSeller = async (req, res) => {
  try {


    // Validating the req with express validator
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        error: valErrors.array(),
      });
    }


    const { sellerId } = req.body;

    // Check if the seller exists
    const sellerData = await Seller.findOne({ sellerId });


    if (!sellerData) {
      return res.status(400).json({
        success: false,
        msg: "Seller Not Found!",
      });
    }



    // Remove the seller's data from the Book schema
    await Book.updateMany(
      {},
      { $pull: { spCluster: { sellerId: sellerId } } } // Remove matching sellerId from spCluster
    );



    // Delete the seller
    await Seller.findOneAndDelete({ sellerId });



    // Email content
    const msg = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #f44336; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Account Deletion Notice</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; color: #333;">
        <p style="font-size: 18px;">Dear ${sellerData.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          We regret to inform you that your Booklio account with the email ${sellerData.email} has been deleted as per the request from our management team.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          As a valued member of our community, we would like to thank you for your contributions and support over the years. Your participation has been greatly appreciated.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you believe this action was taken in error or if you have any questions regarding this decision, please do not hesitate to reach out to our support team at support@booklio.com. We will be more than happy to assist you.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          We wish you all the best in your future endeavors and hope that you will continue to support the literary community in your own way.
        </p>
      </div>
      <div style="background-color: #333; padding: 15px; text-align: center; color: #fff; font-size: 14px;">
        <p>© 2024 Booklio. All rights reserved.</p>
        <p><a href="https://booklio.com" style="color: #4CAF50; text-decoration: none;">Visit our website</a></p>
      </div>
    </div>
    `;

    // Sending mail to the seller
    mailer.sendMail(sellerData.email, "Account Deletion", msg);

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `Account and associated book data deleted successfully for the seller of Booklio.`,
    });
  } catch (error) {
    console.error("Error in deleteSeller: ", error.message);
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred.",
    });
  }
};


/**
 * For fetching Seller Data
 * if sellerId  in query Params present then will return the seller specific data
 */

// Controller function to fetch member data

/**
 * @swagger
 * /admin/api/v1/get-seller-data/{sellerId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get seller data
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         schema:
 *           type: string
 *         required: false
 *         description: Seller ID (optional)
 *     responses:
 *       200:
 *         description: Seller data retrieved successfully
 */

const getSellerData = async (req, res) => {
  try {
    // Validate the request (using express-validator)
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation Errors",
        error: valErrors.array(),
      });
    }

    // Extract userId from route parameters
    const { sellerId } = req.params;

    let sellerData;

    // If userId is provided, fetch the specific
    if (sellerId) {
      sellerData = await Seller.findOne({ sellerId: sellerId });

      // If no member found with the given ID, return an error
      if (sellerData.length === 0) {
        return res.status(404).json({
          success: false,
          msg: `Seller with ID ${sellerId} not found.`,
        });
      }

      // Return the specific user data
      return res.status(200).json({
        success: true,
        msg: `Seller data for ID :- ${sellerId}`,
        sellerData: sellerData,
      });
    } else {
      // If no userId is provided, fetch all users
      sellerData = await Seller.find({});

      // Return all users
      return res.status(200).json({
        success: true,
        msg: `All Sellers of Booklio.`,
        sellerData: sellerData,
      });
    }
  } catch (error) {
    // Handle any errors during the data fetching process
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

/**
 * Batch call for all data of the folks
 */
// Controller function to fetch all data
/**
 * @swagger
 * /admin/api/v1/get-batch-data:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users, sellers and members data
 *     responses:
 *       200:
 *         description: All data retrieved successfully
 */
const getAllData = async (req, res) => {
  try {
    // Fetch data from all models in parallel using Promise.all
    const [users, sellers, management] = await Promise.all([
      User.find({}),
      Seller.find({}),
      Management.find({}),
    ]);

    // Send the response with all data combined
    return res.status(200).json({
     success: true,
      users,
      sellers,
      management,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Error fetching data", error });
  }
};

/**
 * Batch call for all data of the folks
 */
// Controller function to fetch all data
/**
 * @swagger
 * /admin/api/v1/paycut:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get paycut statistics
 *     responses:
 *       200:
 *         description: Paycut data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalPendingPayCut:
 *                   type: number
 *                 totalCanceledPayCut:
 *                   type: number
 *                 totalCompletedPayCut:
 *                   type: number
 */
const paycutFunc = async (req, res) => {
  try {
    // Perform aggregation to get pay cuts with lookup and totals
    const payCuts = await PayCut.aggregate([
      {
        // Lookup Order details
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "orderId",
          as: "orderDetails",
        },
      },
      {
        // Unwind the orderDetails array
        $unwind: {
          path: "$orderDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        // Lookup User details
        $lookup: {
          from: "users",
          localField: "orderDetails.userId",
          foreignField: "userId",
          as: "userDetails",
        },
      },
      {
        // Unwind the userDetails array
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        // Lookup Seller details
        $lookup: {
          from: "sellers",
          localField: "orderDetails.sellerId",
          foreignField: "sellerId",
          as: "sellerDetails",
        },
      },
      {
        // Unwind the sellerDetails array
        $unwind: {
          path: "$sellerDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        // Group pay cuts by status and calculate total for each status
        $group: {
          _id: "$status", // Group by status
          totalPayCut: { $sum: "$payCut" }, // Calculate total payCut for the group
          details: { $push: "$$ROOT" }, // Include all details in the group
        },
      },
      {
        // Sort results for better readability (optional)
        $sort: { _id: 1 },
      },
    ]);

    // Extract totals for each status
    const pendingPayCut = payCuts.find((entry) => entry._id === "pending");
    const canceledPayCut = payCuts.find((entry) => entry._id === "cancelled");
    const completedPayCut = payCuts.find((entry) => entry._id === "completed");


    // Return the response
    return res.status(200).json({
      success: true,
      msg: "Paycuts retrieved successfully",
      data: {
        totalPendingPayCut: pendingPayCut?.totalPayCut || 0,
        totalCanceledPayCut: canceledPayCut?.totalPayCut || 0,
        totalCompletedPayCut: completedPayCut?.totalPayCut || 0,
        payCuts: payCuts, // Optional: Include full details
      },
    });
  } catch (error) {
    console.error("Error retrieving paycuts:", error);
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while retrieving paycuts",
    });
  }
};




module.exports = {
  memberRegister,
  memberRegisterV4,
  deleteUser,
  deleteMember,
  deleteSeller,
  updateMemberRole,
  getMemberData,
  getUserData,
  getSellerData,
  getAllData,
  paycutFunc
};
