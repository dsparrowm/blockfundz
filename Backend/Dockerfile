# Use Node.js LTS (Long Term Support) as base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application (if you're using TypeScript or need to build)
RUN npm run build

# Expose the port your app runs on
ENV PORT=3000
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]