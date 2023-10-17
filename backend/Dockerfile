# backend/Dockerfile

# Use Node.js as base image
FROM node:20

# Install shared dependencies
WORKDIR /src/shared
COPY shared/package*.json .
RUN npm install

# Install main dependencies
WORKDIR /src/app
COPY backend/package*.json ./
RUN npm install

# Copy the rest of the application code
COPY backend .
COPY shared /src/shared


# Expose port 3001 for the socket.io server
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
