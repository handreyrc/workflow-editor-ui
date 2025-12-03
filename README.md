# Genfusion-UI

Genfusion-UI is a  platform for orchestrating workflows with artificial intelligence tools. It provides a user interface for managing projects, tools, and workflow executions. This repository contains the source code and deployment configurations for the Genfusion-UI application.

## Overview

This repository contains the source code and deployment configurations for Genfusion-UI, a SvelteKit-based application. It can be run locally or deployed to production using Docker and Kubernetes with Bitnami's Node.js Helm chart.

## Quick Start

### Clone the Repository

```bash
git clone https://github.com/genfusion-ai/genfusion-ui.git
cd genfusion-ui
```

### Install Dependencies

Ensure [Node.js LTS](https://nodejs.org/en/download/) is installed, then execute:

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root with the following:

```
VITE_BASE_URL_WORKFLOW_EXECUTION=http://localhost:4910
VITE_BASE_URL_WORKFLOW_GENERATOR=http://localhost:4900
VITE_BASE_URL_TOOLS_REGISTRY=http://localhost:4800
VITE_BASE_URL_PROJECT=http://localhost:4700
VITE_BASE_URL_CONFIGURATION=http://localhost:4500
VITE_KEYCLOAK_CLIENT_ID=ui
VITE_KEYCLOAK_URL=https://usw2.auth.ac/auth
VITE_KEYCLOAK_REALM=genfusion-dev
```

### Launch Development Server

   ```bash
   VITE_BASE_URL_WORKFLOW_EXECUTION=http://localhost:4910
   VITE_BASE_URL_WORKFLOW_GENERATOR= http://localhost:4900
   VITE_BASE_URL_TOOLS_REGISTRY= http://localhost:4800
   VITE_BASE_CONFIGURATION= http://localhost:4500
   VITE_KEYCLOAK_URL=https://host.docker.internal:8443
   VITE_KEYCLOAK_REALM=genfusion
   VITE_KEYCLOAK_CLIENT_ID=ui
   ```

5. Run the Docker container.

6. Run the development server and log in:

   Start the development server using the following command:

   ```bash
   npm run dev
   ```

   Once the server is running, open the app in your browser and log in using the following credentials:

  - **Email**: user1@genfusion.ai
  - **Password**: password

## Developing

To start the development server with the necessary configurations, run the following command:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser and log in using:

- **Email:** user1@genfusion.ai
- **Password:** password

## Development

Run the development server:

```bash
npm run dev
```

To auto-open the app in your browser, use:

```bash
npm run dev -- --open
```

For environments with TLS certificate issues, the dev script bypasses verification (`NODE_TLS_REJECT_UNAUTHORIZED=0`). See `package.json` for details.

### Type Checking

Synchronize SvelteKit config and check TypeScript:

```bash
npm run check
```

Continuous type checking in watch mode:

```bash
npm run check:watch
```

## Building

Generate a production build with Vite:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

Access the preview at `http://localhost:4173`.

## Deployment

### Docker

Build the Docker image:

```bash
docker build -t genfusion-ui:latest .
```

Run the container with environment variables:

```bash
docker run -d -p 3000:3000 \
  -e VITE_BASE_URL_WORKFLOW_EXECUTION=http://localhost:4910 \
  -e VITE_BASE_URL_WORKFLOW_GENERATOR=http://localhost:4900 \
  -e VITE_BASE_URL_TOOLS_REGISTRY=http://localhost:4800 \
  -e VITE_BASE_URL_PROJECT=http://localhost:4700 \
  -e VITE_BASE_URL_CONFIGURATION=http://localhost:4500 \
  -e VITE_KEYCLOAK_CLIENT_ID=ui \
  -e VITE_KEYCLOAK_URL=https://usw2.auth.ac/auth \
  -e VITE_KEYCLOAK_REALM=genfusion-dev \
  genfusion-ui:latest
```

Visit `http://localhost:3000` in your browser.

### Kubernetes with Bitnami Helm

Deploy using Bitnami's Node.js Helm chart:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install genfusion-ui bitnami/node \
  --set image.repository=localhost:5001/genfusion-ai/genfusion-ui,image.tag=latest,service.port=3000 \
  --set "env[0].name=VITE_BASE_URL_WORKFLOW_EXECUTION,env[0].value=http://localhost:8080" \
  --set "env[1].name=VITE_BASE_URL_WORKFLOW_GENERATOR,env[1].value=http://workflow-generator:8080" \
  --set "env[2].name=VITE_BASE_URL_TOOLS_REGISTRY,env[2].value=http://tools-registry:8080" \
  --set "env[3].name=VITE_BASE_URL_PROJECT,env[3].value=http://projects:8080" \
  --set "env[4].name=VITE_BASE_URL_CONFIGURATION,env[4].value=http://confighub:8080" \
  --set "env[5].name=VITE_KEYCLOAK_CLIENT_ID,env[5].value=ui" \
  --set "env[7].name=VITE_KEYCLOAK_URL,env[7].value=https://usw2.auth.ac/auth" \
  --set "env[8].name=VITE_KEYCLOAK_REALM,env[8].value=genfusion-dev"
```

Adjust environment variables as needed.

### Kubernetes with Config File

Instead of passing environment variables manually, you can create a **values.yaml** file and apply it using Helm.

#### 1️⃣ Create `values.yaml`
Create a `values.yaml` file with the following content:

```yaml
image:
  repository: localhost:5001/genfusion-ai/genfusion-ui
  tag: latest
service:
  port: 3000
env:
  - name: VITE_BASE_URL_WORKFLOW_EXECUTION
    value: http://localhost:8080
  - name: VITE_BASE_URL_WORKFLOW_GENERATOR
    value: http://workflow-generator:8080
  - name: VITE_BASE_URL_TOOLS_REGISTRY
    value: http://tools-registry:8080
  - name: VITE_BASE_URL_PROJECT
    value: http://projects:8080
  - name: VITE_BASE_URL_CONFIGURATION
    value: http://confighub:8080
  - name: VITE_KEYCLOAK_CLIENT_ID
    value: ui
  - name: VITE_KEYCLOAK_URL
    value: https://usw2.auth.ac/auth
  - name: VITE_KEYCLOAK_REALM
    value: genfusion-dev
```

#### 2️⃣ Apply the Configuration
Once the file is created, apply it using Helm:

```bash
helm install genfusion-ui bitnami/node -f values.yaml
```
## Project Structure

```plaintext
genfusion-ui/
├── docs/              # Detailed documentation
├── src/               # SvelteKit source code
├── static/            # Static assets
├── .dockerignore      # Docker exclusions
├── .env               # Environment variables (not in version control)
├── Dockerfile         # Docker configuration
├── README.md          # Project overview (this file)
└── package.json       # Dependencies and scripts
```
