const jwt = require("jsonwebtoken");

const checkToken = async (req, res) => {
    try {
        // Extract the token from headers, body, or query parameters
        const token = req.body.token || req.query.token || req.headers["authorization"];

        if (!token) {
            return res.status(400).json({
                success: false,
                msg: "Access token is required.",
            });
        }

        // Handle "Bearer" token prefix
        const bearer = token.startsWith("Bearer ") ? token.split(" ") : [null, token];
        const accessToken = bearer[1];

        if (!accessToken || accessToken.trim() === "") {
            return res.status(400).json({
                success: false,
                msg: "Invalid token format. Expected 'Bearer <token>'.",
            });
        }

        // Decode and verify the token
        const secretKey = process.env.ACCESS_TOKEN_SECRET || "your_secret_key";
        console.log("Using Secret Key:", secretKey);

        const decodedData = jwt.verify(accessToken, secretKey);

        return res.status(200).json({
            success: true,
            msg: "Token is valid.",
            data: decodedData,
        });
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(400).json({
            success: false,
            msg: error.message || "An error occurred in checkToken.",
        });
    }
};


module.exports = { checkToken };
