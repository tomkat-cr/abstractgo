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

AbstractGo is an AI/ML solution for medical investigation classification based on title and abstracts... ????

## Features

????

## Technologies

### Backend
- **Python** (≥3.11.0) - Runtime environment
- **FastAPI** (0.104.1) - Web framework
- **Socket.IO** (4.7.5) - Real-time communication ???

### Frontend
- **React** (18.2.0) - UI framework
- **Next.js** (14.2.14) - Build tool and dev server
- **Socket.IO Client** (4.7.5) - Real-time client ???

### Development Tools
- **Concurrently** (8.2.2) - Run multiple commands
- **Make** - Build automation

## Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- **Docker** (to run the server locally)
- **Node.js** (version 18.0.0 or higher)
- **Python** (version 3.11.0 or higher)
- **Git** (to clone the repository)
- **Make** (to run the Makefile)

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
SERVER_DEBUG=1
PORT=8000
APP_DOMAIN_NAME=localhost
CORS_ORIGIN=http://${APP_DOMAIN_NAME}
APP_NAME="AbstractGo"
ORG_NAME="Melo-Dramatic Data Team"
ADMIN_USERNAME=username
ADMIN_PASSWORD=password
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

**Start the client (in another terminal):**
```bash
cd client
make dev
```

### Production Mode

**Build the client:**
```bash
cd client
make build
```

**Start the server:**
```bash
cd server
make start
```

**Enter the system**

- Load your preferred web browser
- Go to [http://localhost:3000](http://localhost:3000)


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

????


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
│       └── main.py         # Main server file
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

Your goal is to build an Artificial Intelligence solution to support the classification of medical literature.

Your objective will be to implement a system capable of assigning medical articles to one or more medical domains, using only the title and abstract as input. You can use traditional machine learning, language models, workflows with AI agents, or a hybrid approach, as long as you justify your choice and demonstrate its effectiveness.

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
