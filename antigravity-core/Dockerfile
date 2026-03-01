# Multi-stage build for Nest.js optimization
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* tsconfig*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client and build NestJS
RUN npx prisma generate
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Use npm ci --omit=dev to only install production packages
RUN npm ci --omit=dev && npx prisma generate

# Copy the built artifacts from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "start:prod"]
