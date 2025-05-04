const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Booklio API",
            version: "1.0.0",
            description: "API documentation for the Booklio book website",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Base URL of the application",
            },
            {
                url: "https://booklio.onrender.com",
                description: "Render server (IP address)",
            },
            {
                url: "http://13.203.251.217:3000",
                description: "Production server (IP address)",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ["./controllers/*/*.js", "./controllers/*/*/*.js"], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
