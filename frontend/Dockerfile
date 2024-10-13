# frontend/Dockerfile

# Use official Node image as base
FROM node:14

# Set working directory
WORKDIR /frontend

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Install Packages
RUN npm install react-bootstrap bootstrap
RUN npm install react-router-dom

# Copy the rest of the React application code
COPY . .

# Build the React application
RUN npm run build

# Expose port 3001 for React
EXPOSE 3001

# Start the React development server
CMD ["npm", "start"]

