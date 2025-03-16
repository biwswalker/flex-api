# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /usr/src/flex-api

# Copy only the package files for installation
COPY package.json package-lock.json ./
COPY ./patches ./patches ./

# Install dependencies using npm ci for cleaner installs
# RUN npm ci --unsafe-perm
RUN npm install --frozen-lockfile --unsafe-perm

# Copy the source code after dependencies are installed
COPY . .

# Build the application
RUN npx patch-package
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /usr/src/flex-api

# Copy only the necessary files from builder stage
COPY package.json package-lock.json ./
COPY --from=builder /usr/src/flex-api/node_modules /usr/src/flex-api/node_modules
COPY --from=builder /usr/src/flex-api/dist /usr/src/flex-api/dist

# Optional: Rebuild specific native modules if required (e.g. better-sqlite3)
RUN npm rebuild better-sqlite3

EXPOSE 4000
CMD ["/usr/src/flex-api/dist/server.js"]