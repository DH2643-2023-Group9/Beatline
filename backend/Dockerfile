# backend/Dockerfile

# Use Node.js as base image
FROM node:20

# Set the working directory in Docker
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY ./backend/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY ./backend .
COPY shared /usr/src/shared


# Expose port 3001 for the socket.io server
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
