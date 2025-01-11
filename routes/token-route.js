const express = require("express");
const router = express();

router.use(express.json());
//------------------ To reset the password
const bodyParser = require("body-parser");

// to accept data from the form
router.use(bodyParser.json());
// to accept data from the URL
router.use(bodyParser.urlencoded({ extended: true }));

const { checkToken } = require("../controllers/token/token-controller.js")

//------------------------------------ Book Add And Delete
router.post("/token-check", checkToken)

module.exports = router;
