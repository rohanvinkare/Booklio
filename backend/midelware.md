# List of Middlewares Used in the Project

## 1️⃣ Application-Level Middleware
These middleware functions apply **globally** to all requests.

- `express.json()` → Parses incoming JSON payloads  
- `express.urlencoded({ extended: true })` → Parses URL-encoded bodies  
- `helmet()` → Secures the app by setting HTTP headers  
- `morgan()` → Logs incoming HTTP requests  
- `cors()` → Enables Cross-Origin Resource Sharing (CORS)  
- `swagger-ui-express` → Serves API documentation  

---

## 2️⃣ Router-Level Middleware
These middleware functions apply **to specific routes**.

- `authMiddleware` → Handles authentication and verifies user identity  
- `checkAbility(action, resource)` → CASL-based Role-Based Access Control (RBAC)  
- `rateLimiter` → Limits the number of requests (used in login routes)  

---

## 3️⃣ Built-in Middleware
These are **default Express.js middleware functions**.

- `express.json()` → Parses JSON payloads  
- `express.urlencoded({ extended: true })` → Parses URL-encoded bodies  

---

## 4️⃣ Third-Party Middleware
These are middleware functions **from external libraries**.

- `morgan()` → Logs incoming HTTP requests  
- `helmet()` → Secures the app by setting HTTP headers  
- `cors()` → Enables Cross-Origin Resource Sharing (CORS)  
- `swagger-ui-express` → Serves API documentation  
- `multer()` → Handles file uploads  
- `express-rate-limit` → Limits API request rates  
- `express-validator` → Validates and sanitizes user input  
- `casl-rbac` → Manages role-based access control  

---

## 5️⃣ Error-Handling Middleware
Handles errors and sends appropriate responses.

- `errorHandlerMiddleware` → Catches and processes all application errors  
