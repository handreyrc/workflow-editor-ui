# Build Stage
FROM node:22-alpine AS builder

# Install tini and set up app directory
RUN apk add --no-cache tini \
    && mkdir /app && chown node:node /app
WORKDIR /app

# Copy package files and install ALL dependencies (including dev)
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit \
    && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Set build-time arguments and environment variables
ARG VITE_BASE_URL_WORKFLOW_EXECUTION=http://localhost:4910
ARG VITE_BASE_URL_WORKFLOW_GENERATOR=http://localhost:4900
ARG VITE_BASE_URL_TOOLS_REGISTRY=http://localhost:4800
ARG VITE_BASE_URL_PROJECT=http://localhost:4700
ARG VITE_BASE_URL_CONFIGURATION=http://localhost:4500
ARG VITE_KEYCLOAK_CLIENT_ID=ui
ARG VITE_KEYCLOAK_URL=https://usw2.auth.ac/auth
ARG VITE_KEYCLOAK_REALM=genfusion-dev
ARG PORT=3000
ENV VITE_BASE_URL_WORKFLOW_EXECUTION=${VITE_BASE_URL_WORKFLOW_EXECUTION} \
    VITE_BASE_URL_WORKFLOW_GENERATOR=${VITE_BASE_URL_WORKFLOW_GENERATOR} \
    VITE_BASE_URL_TOOLS_REGISTRY=${VITE_BASE_URL_TOOLS_REGISTRY} \
    VITE_BASE_URL_PROJECT=${VITE_BASE_URL_PROJECT} \
    VITE_BASE_URL_CONFIGURATION=${VITE_BASE_URL_CONFIGURATION} \
    VITE_KEYCLOAK_CLIENT_ID=${VITE_KEYCLOAK_CLIENT_ID} \
    VITE_KEYCLOAK_URL=${VITE_KEYCLOAK_URL} \
    VITE_KEYCLOAK_REALM=${VITE_KEYCLOAK_REALM} \
    NODE_ENV=production \
    PORT=${PORT} \
    NODE_OPTIONS="--max-old-space-size=8192"

# Build the application
RUN npm run build

# Production Stage
FROM node:22-alpine AS runner

WORKDIR /app
RUN apk add --no-cache tini

# Copy the built app and package files from the builder stage
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --prefer-offline --no-audit \
    && npm cache clean --force

# Set runtime configurations
USER node
EXPOSE ${PORT}
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Healthcheck for the container
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:${PORT}/ || exit 1

# Start the app
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "build/index.js"]
