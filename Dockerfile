# Build stage
FROM node:20-slim as builder

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Production stage
FROM gcr.io/distroless/nodejs22

# Copy from builder
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./

# Expose the port your app runs on
ENV PORT=3367
EXPOSE 3367

# Start the application
CMD ["server.js"]