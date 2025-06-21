# 🔹 Use a minimal Node.js base image
FROM node:20-alpine

# 🔹 Set working directory inside container
WORKDIR /app

# 🔹 Install system packages required for native modules like bcrypt
RUN apk add --no-cache python3 make g++

# 🔹 Copy only package files first (leverage Docker layer caching)
COPY package*.json ./

# 🔹 Install dependencies (cache will work until package files change)
RUN npm install

# 🔹 Now copy the rest of the application code
COPY . .

# 🔹 Expose backend port
EXPOSE 3000

# 🔹 Default command to run the app
CMD ["npm", "start"]