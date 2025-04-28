# Use an official Node.js image if your backend is Node.js (adjust if it's different)
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other backend files
COPY . .

# Expose the port your app runs on (example 5000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
