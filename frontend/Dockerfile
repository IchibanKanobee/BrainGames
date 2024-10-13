# frontend/Dockerfile

# Use official Node image as base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the React application code
COPY . .

# Build the React application
RUN npm run build

# Expose port 3000 for React
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]

