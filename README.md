# AbstractGo

![AbstractGo](./assets/abstractgo.logo.010.png)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![Python](https://img.shields.io/badge/python-%3E%3D3.11.0-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![Next.js](https://img.shields.io/badge/nextjs-14.2.14-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

AbstractGo is an AI/ML solution for medical investigation classification based on title and abstracts.

## TL;DR

- Project summary webpage: [AbstractGo Summary](https://raw.githack.com/tomkat-cr/abstractgo/main/documentation/abstractgo.final.report.html)
- Check the [Executive Summary](./documentation/FINAL-REPORT.md#1--executive-summary) for more details.
- Check the [Final Report](./documentation/FINAL-REPORT.md) for more details.
- Live website: [https://abstractgo.aclics.com](https://abstractgo.aclics.com)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Development Mode](#development-mode)
  - [Web UI / Dashboard](#web-ui--dashboard)
  - [MCP Server Usage](#mcp-server-usage)
  - [Dashboard Screenshots](#dashboard-screenshots)
  - [Other Development Mode Commands](#other-development-mode-commands)
  - [Production Mode](#production-mode)
  - [Available Make Commands](#available-make-commands)
- [API Endpoints](#api-endpoints)
- [Secure Server Configuration](#secure-server-configuration)
- [Resources Links](#resources-links)
- [Project Diagrams](#project-diagrams)
- [Project Structure](#project-structure)
- [The Origin of AbstractGo](#the-origin-of-abstractgo)
- [Tools and Services](#tools-and-services)
- [Future Features](#future-features)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

## Description

AbstractGo is an intelligent AI/ML system designed to classify biomedical literature using only article titles and abstracts as input.

The system features streamlined API and MCP backends that serves a sophisticated **text-classification** [ML model](https://huggingface.co/Hiver77/MDT), built on [BioBERT](https://huggingface.co/dmis-lab/biobert-v1.1) with LoRA fine-tuning. We called it [MDT](https://huggingface.co/Hiver77/MDT) (our name [Melo-Dramatics Team](#credits) shortcode) and it's available on [Hugging Face](https://huggingface.co).

Complementing the backend is a modern [Dashboard](#dashboard-screenshots) that provides comprehensive insights through model performance metrics, confusion matrices, category distributions, and an interactive demo playground.

The solution specializes in multi-label classification across four critical medical domains:
* Cardiovascular
* Neurological
* Hepatorenal
* Oncological

The ML model gives a score for each of the four categories for a given input title+abstract.

## Features

- **Model-powered classification**: API and MCP server that scores input title+abstract with a [Transformers Hugging Face model](https://huggingface.co/Hiver77/MDT) (`text-classification`) based on [BioBERT](https://huggingface.co/dmis-lab/biobert-v1.1).
- **Interactive dashboard**: UI with metrics, confusion matrix, category distributions, performance trends, and a demo component to interact with the model and API.
- **MCP server**: MCP-compliant server based on FastAPI that serves the model and the dashboard with the same resources and tools as the API. For instructions to use it, see the [MCP Server README](./mcp-server/README.md).
- **PDF upload**: API and MCP server has the ability to score input PDF with a [OpenAI API](https://platform.openai.com/docs/api-reference/files) to extract the title and abstract.
- **Vercel V0 Chat**: [V0 Chat](https://v0.app/chat/abstract-go-rrzvfQyOCKc) with the UI vibe coding development. Visit this [url](https://v0.app/chat/abstract-go-rrzvfQyOCKc) to try it out.
- **Model Training Analysis**: in this [README](./notebooks/README-ML.md) file there's the complete model training analysis and the [notebook](./notebooks/AbstractGo_Final_Training_Model.ipynb) has the off-line training steps. The model training datasets are in the [/data/raw](./data/raw) directory.
- **Jupiter and Google Colab Notebooks**: [notebooks](./notebooks) directory with the model training Jupiter notebook. Visit this [Google Colab notebook url](https://colab.research.google.com/drive/1BU1rwp86fsX2hpAha2WIvcIZGoHq3EnU#scrollTo=6WaQOLd5Hswh) to check the live step-by-step instructions we run to train the model.
- **Batch Classification**: [data-scripts/Test_model.py](./data-scripts/Test_model.py) script to batch-classify medical articles from a [CSV file](./data/raw/test.csv).
- **Containerized deployment**: `deploy/docker-compose.yml` with Nginx serving the client and reverse-proxying to the API, and production-ready for servers with containerized deployment.
- **Monorepo workflow**: Root `Makefile` orchestrates client and server tasks; npm workspaces for script aggregation.

## Technologies

### Backend
- **Python** (≥3.11)
- **FastAPI** (0.116.x)
- **Transformers** (4.55.x) with a BioBERT tokenizer
- **Uvicorn** (ASGI server)
- **Poetry** (dependency and environment management)
- **OpenAI API or AI/ML API** (to use the the PDF upload feature)

### MCP Server
- **MCP** (1.13.x)
- **FastAPI** (0.116.x)
- **Transformers** (4.55.x) with a BioBERT tokenizer
- **Poetry** (dependency and environment management)
- **OpenAI API or AI/ML API** (to use the the PDF upload feature)

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

- [Docker](https://docs.docker.com/engine/install/) to run the server with containers
- [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) (better) or [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (version 18.0.0 or higher)
- [Poetry](https://python-poetry.org/docs/#installation) (to manage the dependencies).
- [Python](https://www.python.org/downloads/) (version > 3.11.0, < 3.14) if you plan to run the server locally without containers
- [Git](https://git-scm.com/downloads) (to clone the repository)
- Make: [Mac](https://formulae.brew.sh/formula/make) | [Windows](https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows) | [Linux](https://askubuntu.com/questions/161104/how-do-i-install-make) to run the automated commands
- [OpenAI API key](https://platform.openai.com/account/api-keys) or [AI/ML API API key](https://aimlapi.com/) to use the the PDF upload feature and other LLM integrations

NOTES:
- After install poetry, run `poetry self add poetry-plugin-export` to install its dependencies.

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tomkat-cr//abstractgo.git
cd abstractgo
```

2. **Install all dependencies (server and client)**
```bash
make install
```

3. **Set up environment variables and other files**

Create `.env` files in the client and server directories by running the following command:

```bash
make init-app-environment
```

This will create the `.env` files in the client and server directories with the default values.

Then you can edit the `.env` files to your needs.

**Client `.env`:**

```bash
nano client/.env
```

```env
NEXT_PUBLIC_APP_DOMAIN_NAME=localhost
NEXT_PUBLIC_API_BASE_URL=http://${NEXT_PUBLIC_APP_DOMAIN_NAME}:8000
NEXT_PUBLIC_DEBUG=0
```

**Server `.env`:**

```bash
nano server/.env
```

```env
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
nano mcp-server/.env
```

```env
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

**Deploy `docker-compose.yml`:**

```bash
nano deploy/docker-compose.yml # edit the ports and other configuration
```

**Deploy `nginx.conf`:**

```bash
nano deploy/nginx.conf # edit the ports and other configuration
```

4. **Generate SSL certificates**
This step is mandatory, even if you are not using or planning to use the [Secure HTTPS server configuration](#secure-server-configuration).
```bash
make ssl-certs-creation
```

## Usage

### Development Mode

* With Docker containers running the full stack

**Start client and servers simultaneously:**
```bash
make run
```

## Web UI / Dashboard

![AbstractGo Banner](./assets//abstractgo.banner.010.jpeg)

- Load your preferred web browser
- Go to [http://localhost:3000](http://localhost:3000)

## MCP Server Usage

![AbstractGo MCP Server Banner](./mcp-server/assets/abstractgo.mcp.server.banner.010.jpeg)

The **MCP server** serves the ML model and the dashboard with the same resources and tools as the API.

For instructions to run the MCP Server and configure the MCP clients, see the [MCP README](./mcp-server/README.md).

You can use the MCP Inspector to test the server.

```bash
cd mcp-server
make run-mcp-inspector
```

## Dashboard Screenshots

### Classification Text

![AbstractGo Dashboard - Classification Text](./assets/screenshots/AbstracGo.Screenshot.UI.Classification.Text.010.png)

![AbstractGo Dashboard - Classification Text](./assets/screenshots/AbstracGo.Screenshot.UI.Classification.Text.020.png)

![AbstractGo Dashboard - Classification Text](./assets/screenshots/AbstracGo.Screenshot.UI.Classification.Text.030.png)

### Classification PDF

![AbstractGo Dashboard - Classification PDF](./assets/screenshots/AbstracGo.Screenshot.UI.Classification.Pdf.010.png)

![AbstractGo Dashboard - Classification PDF](./assets/screenshots/AbstracGo.Screenshot.UI.Classification.Pdf.020.png)

![AbstractGo Dashboard - Classification PDF](./assets/screenshots/AbstracGo.Screenshot.UI.Classification.Pdf.030.png)

### Metrics Overview

![AbstractGo Dashboard - Dashboard Metrics](./assets/screenshots/AbstracGo.Screenshot.UI.Overview.010.png)

![AbstractGo Dashboard - Dashboard Metrics](./assets/screenshots/AbstracGo.Screenshot.UI.Overview.020.png)

![AbstractGo Dashboard - Dashboard Metrics](./assets/screenshots/AbstracGo.Screenshot.UI.Overview.030.png)

![AbstractGo Dashboard - Dashboard Metrics](./assets/screenshots/AbstracGo.Screenshot.UI.Overview.040.png)

### Data Export

![AbstractGo Dashboard - Data Export](./assets/screenshots/AbstracGo.Screenshot.UI.Export.010.png)

## Other Development Mode commands

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

**Prepare the server**

You need to install the [pre-requisites](#prerequisites) and the [environment variables](#installation).

To install Docker and set a global Nginx Proxy, you can check the [GenericSuite Gitops](https://github.com/tomkat-cr/genericsuite-gitops) repository that has a solution for this.

**Build and run the complete stack:**
```bash
make install
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

  - Example with the API directly (port 8000):
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "title": "A randomized trial of beta-blockers in heart failure",
    "abstract": "This study evaluates the efficacy of beta-blockers..."
  }' \
  http://localhost:8000/predict
```
  - Example via Nginx proxy (port 3000):
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
  - You can have the complete endpoint documentation with the Swagger UI at [http://localhost:8000/docs](http://localhost:8000/docs).

  - To test all endpoints (curl tests):
```bash
cd server
make curl_tests # unstructures output
# or
make curl_tests_jq # structured output with jq
# or directly
JQ=0 sh ./test/curl_tests.sh
```

Notes:
- The server concatenates `title + " " + abstract` and runs a Transformers `AutoModelForSequenceClassification.from_pretrained` using the model on [Hugging Face](https://huggingface.co/Hiver77/MDT). It can also use a local model placed under [./saved_models](./saved_models).
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

## Resources Links 

- [V0 Chat](https://v0.app/chat/abstract-go-rrzvfQyOCKc)
- [Google Colab Notebook for Model Training](https://colab.research.google.com/drive/1BU1rwp86fsX2hpAha2WIvcIZGoHq3EnU#scrollTo=6WaQOLd5Hswh)
- [Our ML Model hosted in Hugging Face](https://huggingface.co/Hiver77/MDT)
- [Example document](./server/test/assets/reflection-paper-regulatory-requirements-development-medicinal-products-primary-biliary-cholangitis-pbc-primary-sclerosing-cholangitis-psc_en.pdf) to [test](./server/test/curl_tests.sh) the PDF upload and classification

## Project Diagrams

### Enhanced System Flow

This diagram illustrates the complete data flow through our system, from user input to results display:

```mermaid
flowchart LR
    A[Client Input] --> B[Text Preprocessing]
    B --> C[Feature Extraction]
    C --> D[Model Prediction]
    D --> E[Category Classification]
    E --> F[Results Display]
    F --> G[Dashboard Analytics]
    
    H[Training Data] --> I[Model Training]
    I --> J[Model Validation]
    J --> K[Model Deployment]
    K --> D
```

### Complete System Architecture

This diagram shows the full technical architecture with all layers and components:

```mermaid
graph TB
    subgraph "Frontend Layer"
        M[MCP Client]
        A[Next.js Client]
        B[React Components]
        C[UI Components]
    end
    
    subgraph "API Layer"
        D[FastAPI Server]
        E[MCP Server]
        F[Authentication]
    end
    
    subgraph "ML Layer"
        G[Hugging Face Model]
        H[Custom Training Pipeline]
        I[Model Registry]
    end
    
    subgraph "Data Layer"
        J[Training Data]
        K[Processed Features]
        L[Model Artifacts]
    end
    
    A --> D
    M --> E
    E --> F
    D --> G
    E --> G
    G --> H
    H --> I
    I --> L
```

### Technology Stack Flow Diagram

The basic interaction flow between components:

```mermaid
flowchart
    A[Web Client] --> B[Server]
    C[MCP Client] --> D[MCP Server]
   
    B --> E[Hugging Face Model]
    D --> E[Hugging Face Model]

    E --> F[Model]
    F --> G[API or MCP Server]
    G --> H[Client or MCP Client]
    H --> I[Dashboard]
```

### Docker Deployment Architecture

Containerized deployment structure:

```mermaid
flowchart
    A[Client + API -> Port 3000]  --> Nginx
    B[Server -> Port 8000] --> Uvicorn
    C[MCP Server -> Port 8000] --> FastMCP
```

## Project Structure

```
abstractgo/
├── README.md
├── LICENSE
├── package.json              # Workspace manager (npm workspaces)
├── .env.example
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
├── deploy/                   # Deployment configuration
│   ├── docker-compose.yml
│   └── nginx.conf
├── mcp-server/               # MCP Server (Python + FastMCP)
│   ├── .env.example
│   ├── Makefile
│   ├── package.json
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── mcp_server.py
│   └── run_mcp_server.sh
└── server/                   # Backend (Python + FastAPI)
   ├── .env.example
   ├── Makefile
   ├── package.json
   ├── pyproject.toml
   ├── requirements.txt
   └── api/
       ├── __init__.py
       └── main.py
```

## The Origin of AbstractGo

![Challenge Banner](./assets/techsphere.colombia.challenge.banner.png)

This project is a solution to the [AI Biomedical Classification Challenge](https://techspherecolombia.com/ai-data-challenge/) hackathon organized by [TechSphere Colombia](https://techspherecolombia.com/) in Aug 2025.

### The Challenge Goal

Build an Artificial Intelligence solution to support the classification of medical literature.

The goal will be to implement a system capable of assigning medical articles to one or more medical domains, using only the title and abstract as input. You can use traditional machine learning, language models, workflows with AI agents, or a hybrid approach, as long as you justify your choice and demonstrate its effectiveness.

### Dataset

There's a dataset available for training and testing your model. It contains 3,565 records from NCBI, BC5CDR, and synthetic data.

File: [challenge_data-18-ago.csv](https://techspherecolombia.com/wp-content/uploads/2025/08/challenge_data-18-ago.csv)<br>

### Dataset Structure

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

## Tools and Services

Please check the [Tools and Services](./documentation/FINAL-REPORT.md#tools-and-services) section of the Final Report for more details.

## Future Features

Please check the [Future Features](./documentation/FINAL-REPORT.md#future-features) section of the Final Report for more details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
6. Create an [issue](https://github.com/tomkat-cr//abstractgo/issues) to discuss changes, request features, report bugs, etc.

Please make sure to update tests as appropriate and follow the existing code style.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Credits

This project is developed and maintained by [Iver Johan Incapie](https://github.com/Hiver77), [Alejandro Arroyave Perez](https://github.com/Alejo5600) and [Carlos J. Ramirez](https://github.com/tomkat-cr). For more information or to contribute to the project, visit [AbstractGo](https://github.com/tomkat-cr/abstractgo).

<div style="text-align: center;">
    <img src="./assets/abstracgo.creators.team.png" alt="Original Team" style="width: 100%; max-width: 600px; height: auto;">
    <p style="margin-top: 10px;">The Melo-Dramatics Data Team</p>
</div>

---

[AbstractGo](https://github.com/tomkat-cr/abstractgo) 🎨✨  
*An AI/ML solution for medical investigation classification based on title and abstracts.*
