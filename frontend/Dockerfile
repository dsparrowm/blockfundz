# Development Stage
FROM node:18.3.0-alpine3.15 AS dev

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose the port
EXPOSE 5173

# Run the application
CMD ["npm", "run", "dev"]



