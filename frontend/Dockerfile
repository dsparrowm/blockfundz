# Development Stage
FROM node:18.3.0-alpine3.15 AS dev

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY frontend/package.json ./

# Install the dependencies
RUN npm install

# Copy the source code
COPY frontend/ .

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]


# Production Stage