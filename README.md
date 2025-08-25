# Abstractgo

![AbstractGo](./assets/abstractgo.logo.010.png)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![Python](https://img.shields.io/badge/python-%3E%3D3.11.0-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![Next.js](https://img.shields.io/badge/nextjs-14.2.14-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

AbstractGo is an AI/ML solution for medical investigation classification based on title and abstracts.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
  - [Available Make Commands](#available-make-commands)
- [API Endpoints](#api-endpoints)
- [Secure Server Configuration](#secure-server-configuration)
- [Project Structure](#project-structure)
- [License](#license)
- [Contributing](#contributing)
- [Credits](#credits)

## Description

AbstractGo is an AI/ML system that classifies biomedical literature using only the article title and abstract. It exposes a minimal FastAPI backend that serves a text-classification model (BioBERT with LoRA fine-tuning placed under `saved_models/biobert-lora/`) and a modern Next.js dashboard that showcases model performance, confusion matrices, category distributions, and a demo playground. The solution targets multi-label assignment across four domains: Cardiovascular, Neurological, Hepatorenal, and Oncological.

## Features

- **Model-powered classification**: API and MCP server that scores input title+abstract with a Transformers Hugging Face model (`text-classification`) based on BioBERT.
- **Interactive dashboard**: UI with metrics, confusion matrix, category distributions, performance trends, and a demo component to interact with the model and API.
- **MCP server**: MCP-compliant server based on FastAPI that serves the model and the dashboard with the same resources and tools as the API. For instructions to use it, see the [MCP Server README](./mcp-server/README.md).
- **Vercel V0 Chat**: [V0 Chat](https://v0.app/chat/abstract-go-rrzvfQyOCKc) with the UI vibe coding development. Visit this [url](https://v0.app/chat/abstract-go-rrzvfQyOCKc) to try it out.
- **Google Colab Notebooks**: [notebooks/](./notebooks/) with the model training notebooks. Visit this [url](https://colab.research.google.com/drive/1BU1rwp86fsX2hpAha2WIvcIZGoHq3EnU#scrollTo=6WaQOLd5Hswh) to try it out.
- **Containerized deployment**: `deploy/docker-compose.yml` with Nginx serving the client and reverse-proxying to the API.

- **Monorepo workflow**: Root `Makefile` orchestrates client and server tasks; npm workspaces for script aggregation.


## Technologies

### Backend
- **Python** (≥3.11)
- **FastAPI** (0.116.x)
- **Transformers** (4.55.x) with a BioBERT tokenizer
- **Uvicorn** (ASGI server)
- **Poetry** (dependency and environment management)

### MCP Server
- **MCP** (1.13.x)
- **FastAPI** (0.116.x)
- **Transformers** (4.55.x) with a BioBERT tokenizer
- **Poetry** (dependency and environment management)

### Frontend
- **React** (18)
- **Next.js** (14)
- **Tailwind CSS** (4)
- **shadcn/ui & Radix UI** (components)
- **Recharts** (visualizations)

### Development Tools
- **Docker + Nginx** (containerized deploy and reverse proxy)
- **Make** (task runner in root, `client/`, and `server/`)
- **npm workspaces** (aggregate scripts across packages)

## Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- [Docker](https://docs.docker.com/engine/install/) (to run the server locally)
- [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) (better) or [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (version 18.0.0 or higher)
- [Python](https://www.python.org/downloads/) (version 3.11.0 or higher)
- [Git](https://git-scm.com/downloads) (to clone the repository)
- Make: [Mac](https://formulae.brew.sh/formula/make) | [Windows](https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows) | [Linux](https://askubuntu.com/questions/161104/how-do-i-install-make) (to run the Makefile)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/otobonh/abstractgo.git
cd abstractgo
```

2. **Install all dependencies (server and client)**
```bash
make install
```

3. **Set up environment variables**

Create `.env` files in the client and server directories:

**Client `.env`:**
```bash
NEXT_PUBLIC_APP_DOMAIN_NAME=localhost
NEXT_PUBLIC_API_BASE_URL=http://${NEXT_PUBLIC_APP_DOMAIN_NAME}:8000
NEXT_PUBLIC_DEBUG=0
```

**Server `.env`:**
```bash
SERVER_DEBUG=0
PORT=8000
APP_DOMAIN_NAME=localhost
CORS_ORIGIN=http://${APP_DOMAIN_NAME}
LLM_PROVIDER="openai"
LLM_MODEL="gpt-5-nano"
OPENAI_API_KEY=sk-proj-1234567890
```

**MCPServer `.env`:**
```bash
SERVER_DEBUG=0
PORT=8000
APP_DOMAIN_NAME=localhost
CORS_ORIGIN=http://${APP_DOMAIN_NAME}
LLM_PROVIDER="openai"
LLM_MODEL="gpt-5-nano"
OPENAI_API_KEY=sk-proj-1234567890
AG_API_KEY=ag-api-key-123... # Set an API key to restrict the MCP server use
MCP_INSPECTOR=0 # Set to 1 to use the MCP Inspector
```

4. **Generate SSL certificates**
```bash
make ssl-certs-creation
```

## Usage

### Development Mode

* With Docker

**Start client and server simultaneously:**
```bash
make run
```

<br>

![AbstractGo Banner](./assets//abstractgo.banner.010.jpeg)

**Enter the Web UI**

- Load your preferred web browser
- Go to [http://localhost:3000](http://localhost:3000)

<br>

![AbstractGo MCP Server Banner](./mcp-server/assets/abstractgo.mcp.server.banner.010.jpeg)

**Use the MCP server**

For more information about the MCP server and how to use it, see the [MCP Server README](./mcp-server/README.md).

### Other Development Mode commands

* With Docker

**Restart services:**
```bash
make restart
```

**Stop services:**
```bash
make down
```

* With Next.js and Python

**Start both client and server simultaneously:**
```bash
npm run dev
```

**Or start them separately:**

**Start the server:**
```bash
cd server
make dev
```

**Start the client (in a new terminal):**
```bash
cd client
make dev
```

**Start the MCP server (in a new terminal):**
```bash
cd mcp-server
make run
```

### Production Mode

**Build the client:**
```bash
make run
```

### Available Make Commands

**Root commands:**
```bash
make run                # Run in development mode
make up                 # Run in production mode
make down               # Stop services
make restart            # Restart services (docker-compose restart)
make hard-restart       # Restart services from scratch
make logs               # Show logs
make logs-f             # Follow logs
make clean-docker       # Clean docker
make status             # Show Docker services status
make install            # Install dependencies for all projects (server and client)
make build              # Build the client
make start              # Start the server
make dev                # Start the client
make clean              # Clean dependencies for all projects (server and client)
make list-scripts       # List available scripts
make ssl-certs-creation # Create SSL certificates
```

**Server commands:**
```bash
cd server
make install     # Install dependencies
make run         # Run in development mode
make dev         # Alias for run
make start       # Run in production mode
make clean       # Clean node_modules and package-lock.json
make reinstall   # Clean and reinstall dependencies
make help        # Show available commands
```

**Client commands:**
```bash
cd client
make install       # Install dependencies
make build         # Build for production
make run           # Run in development mode
make dev           # Alias for run
make preview       # Preview production build
make clean         # Clean node_modules, package-lock.json, and dist
make reinstall     # Clean and reinstall dependencies
make build-preview # Build and preview production version
make help          # Show available commands
```

### API Endpoints

Base URL depends on how you run the stack:

- **Direct FastAPI (dev)**: `http://localhost:8000`
- **Through Nginx (docker-compose)**: `http://localhost:3000/api`

Endpoints:

- **GET /** or **GET /api/** (health/root)
  - Response: `{ "message": "Welcome to the Biomedical Classifier API" }`

- **POST /predict** or **POST /api/predict**

  - Body (JSON):
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "title": "A randomized trial of beta-blockers in heart failure",
    "abstract": "This study evaluates the efficacy of beta-blockers..."
  }' \
  http://localhost:8000/predict
```
  - Example via Nginx proxy:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "title": "A randomized trial of beta-blockers in heart failure",
    "abstract": "This study evaluates the efficacy of beta-blockers..."
  }' \
  http://localhost:3000/api/predict
```
  - Response (array):
```json
[
  { "label": "Cardiovascular", "score": 0.95 },
  { "label": "Neurological", "score": 0.02 },
  { "label": "Hepatorenal", "score": 0.01 },
  { "label": "Oncological", "score": 0.02 }
]
```

Notes:
- The server concatenates `title + " " + abstract` and runs a Transformers `pipeline("text-classification", return_all_scores=true)` using the model under `saved_models/biobert-lora/`.
- If the model is missing or fails to load, the API returns `500 Model not loaded`.


### Secure Server Configuration

Configure your local server to use SSL so you can test payment features, since some payment APIs and JavaScript features (for example `crypto`) require a secure server.

You can use the `make ssl-certs-creation` script to create SSL certificates in the `server/ssl` directory.

Add an entry to your `/etc/hosts` file with the following content:

```bash
sudo nano /etc/hosts
```

Add the following line:

```
127.0.0.1 abstractgo.dev
```

Then set the following variables in the client and server `.env` files:

In `client/.env`:
```env
NEXT_PUBLIC_APP_DOMAIN_NAME=abstractgo.dev
NEXT_PUBLIC_API_BASE_URL=https://${NEXT_PUBLIC_APP_DOMAIN_NAME}
```

In `server/.env`:
```env
APP_DOMAIN_NAME=abstractgo.dev
CORS_ORIGIN=https://${APP_DOMAIN_NAME}
```

## Links to Notebooks and other resources

- [V0 Chat](https://v0.app/chat/abstract-go-rrzvfQyOCKc)
- [Model Training Notebook](https://colab.research.google.com/drive/1BU1rwp86fsX2hpAha2WIvcIZGoHq3EnU#scrollTo=6WaQOLd5Hswh)

## Project Structure

```
abstractgo/
├── README.md
├── LICENSE
├── package.json              # Workspace manager (npm workspaces)
├── .env.example
├── server/                   # Backend (Python + FastAPI)
│   ├── .env.example
│   ├── Makefile
│   ├── package.json
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── api/
│       ├── __init__.py
│       └── main.py
├── client/                   # Frontend (React + Next.js)
│   ├── .env.example
│   ├── .gitignore
│   ├── components.json
│   ├── Makefile
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── run-client.sh
│   ├── tsconfig.json
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── public/
│   └── styles/
└── deploy/                   # Deployment configuration
    ├── docker-compose.yml
    └── nginx.conf
```

## The Challenge

![Challenge Banner](./assets/techsphere.colombia.challenge.banner.png)

This project is a solution to the [AI Biomedical Classification Challenge](https://techspherecolombia.com/ai-data-challenge/) hackathon organized by [TechSphere Colombia](https://techspherecolombia.com/) in Aug 2025.

### Challenge Goal

Build an Artificial Intelligence solution to support the classification of medical literature.

The goal will be to implement a system capable of assigning medical articles to one or more medical domains, using only the title and abstract as input. You can use traditional machine learning, language models, workflows with AI agents, or a hybrid approach, as long as you justify your choice and demonstrate its effectiveness.

### Dataset

There's a dataset available for training and testing your model. It contains 3,565 records from NCBI, BC5CDR, and synthetic data.

File: [challenge_data-18-ago.csv](https://techspherecolombia.com/wp-content/uploads/2025/08/challenge_data-18-ago.csv)<br>

## Dataset Structure

* `title`
Title of the medical article
Main text for content analysis

* `abstract`
Scientific summary of the article
Source rich in specialized medical terminology

* `group`
Medical category(ies) or group to which the article belongs
Target variable to predict with your model

### Use Case
Given a medical article, your system must correctly classify whether it belongs to one or more of the following groups:

- Cardiovascular
- Neurological
- Hepatorenal
- Oncological

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

## Credits

This project is developed and maintained by [Carlos J. Ramirez](https://github.com/tomkat-cr), [Iver Johan Incapie](https://github.com/Hiver77) and [Alejandro Arroyave Perez](https://github.com/Alejo5600). For more information or to contribute to the project, visit [AbstractGo](https://github.com/tomkat-cr/abstractgo).

---

**AbstractGo** 🎨✨  
*An AI/ML solution for medical investigation classification based on title and abstracts.*
