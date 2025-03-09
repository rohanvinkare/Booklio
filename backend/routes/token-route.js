const express = require("express");
const router = express();

const { checkToken } = require("../controllers/token/token-controller.js")

//------------------------------------ Book Add And Delete
router.post("/token-check", checkToken)

module.exports = router;
