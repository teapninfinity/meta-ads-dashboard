FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY backend ./
COPY frontend ../frontend

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
