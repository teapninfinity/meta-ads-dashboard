FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY ./backend/package*.json ./backend/

# Copy all files
COPY ./backend ./backend
COPY ./frontend ./frontend

# Install dependencies
WORKDIR /app/backend
RUN npm install

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
