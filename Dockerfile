# Use official Node.js image
FROM node:22-slim

# Set working directory inside the container
WORKDIR /app

# Copy only necessary files
COPY package*.json ./
COPY server ./server

# Install dependencies (assumes server has its own package.json)
WORKDIR /app/server
RUN npm install

# Expose server port
EXPOSE 5500

# Start the server
CMD ["npm", "start"]
