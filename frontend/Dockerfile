FROM node:20.9.0-alpine3.18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port 5173 for Vite
EXPOSE 5173

# Start the app in development mode
CMD ["npm", "run", "dev", "--", "--host"]