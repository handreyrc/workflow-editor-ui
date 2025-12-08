# Genfusion-UI

Genfusion-UI is a  platform for orchestrating workflows with artificial intelligence tools. It provides a user interface for managing projects, tools, and workflow executions. This repository contains the source code and deployment configurations for the Genfusion-UI application.

## Overview

This repository contains the source code and deployment configurations for Genfusion-UI, a SvelteKit-based application. It can be run locally or deployed to production using Docker and Kubernetes with Bitnami's Node.js Helm chart.

## Quick Start

### Clone the Repository

```bash
git clone https://github.com/handreyrc/workflow-editor-ui.git
cd workflow-editor-ui
git checkout mocked-services
```

### Install Dependencies

Ensure [Node.js LTS](https://nodejs.org/en/download/) is installed, then execute:

```bash
npm install
```


### Run the development server and log in:

   Start the development server using the following command:

   ```bash
   npm run dev
   ```

   Once the server is running, open the app in your browser and log in using the following credentials:

  - **Email**: user1@genfusion.ai
  - **Password**: password

To auto-open the app in your browser, use:

```bash
npm run dev -- --open
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
