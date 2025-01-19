# Use the Node.js LTS version as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the entire application code into the container
COPY . .

# Expose the port your app runs on (default: 3000 as per "start" script)
EXPOSE 3000

# Define the command to start the application
CMD ["node", "index.js"]

