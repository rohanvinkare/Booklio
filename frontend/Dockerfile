# Step 1: Build Vite app
FROM node:20 AS build

WORKDIR /app

# Set the environment variable to increase the memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Step 2: Serve using nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
