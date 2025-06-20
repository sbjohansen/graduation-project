# Cybersecurity Incident Management Training Platform

A comprehensive training platform that teaches cybersecurity incident response through immersive AI-powered simulations with Slack bots. Users learn to manage real-world cybersecurity incidents by interacting with intelligent bots representing different team roles in dedicated Slack channels.

## Overview

This platform simulates realistic cybersecurity incident scenarios where users act as **Incident Managers** coordinating response efforts with an AI-powered team. The system creates dedicated Slack channels for each training session and deploys intelligent bots that represent different roles in a cybersecurity response team.

### Key Features

- **Immersive Slack Integration**: Training happens in real Slack channels with AI bots
- **Role-Based Team Simulation**: Each bot represents a specific team member (Security Analyst, Network Engineer, CEO, etc.)
- **Realistic Incident Scenarios**: Multiple difficulty levels from phishing investigations to complex data breaches
- **Progressive Learning**: Users develop incident management skills through guided scenarios
- **Real-time Decision Making**: Bots respond dynamically based on user commands and decisions

## Architecture

The platform consists of three main components:

### 🎯 Frontend (React + TypeScript)
- **Technology**: React 18, TypeScript, Vite, TailwindCSS
- **Features**: User authentication, drill selection, progress tracking, modern responsive UI
- **Location**: `./frontend/`

### 🖥️ Backend (Node.js + Express)
- **Technology**: Node.js, Express, TypeScript, Prisma ORM, SQLite
- **Features**: User management, simulation orchestration, Slack bot coordination, LLM integration
- **Location**: `./backend/`

### 🤖 Slack Bot System
- **Multiple AI Bots**: Each representing different incident response team roles
- **Intelligent Responses**: Powered by OpenAI GPT models for realistic interactions
- **Channel Management**: Automatic creation and management of training channels

## Bot Team Members

The platform includes several specialized bots that users interact with during incident response training:

- **Pete (CEO)**: Provides business context and high-level decision making
- **Hanna (Customer Care)**: Reports customer impact and handles communication
- **John (Security Analyst)**: Performs deep log analysis and threat investigation
- **Mike (Security Engineer)**: Manages security tools and implements mitigations
- **Peter (Network Engineer)**: Handles network analysis and infrastructure issues
- **Lazar (Software Engineer)**: Investigates application-level issues and code vulnerabilities
- **CS-Bot (System)**: Facilitates drills and provides narrative guidance

## Training Scenarios

### Available Drills

1. **Suspicious Email Reports** (Easy)
   - Learn to investigate phishing attempts
   - Practice email analysis and threat containment
   - Duration: ~30 minutes

2. **Pete's Big Day** (Medium)
   - Respond to DDoS attacks during product launches
   - Coordinate traffic analysis and mitigation strategies
   - Duration: ~45 minutes

3. **Data Leak Investigation** (Hard)
   - Handle complex insider threat scenarios
   - Navigate deceptive behavior and access control issues
   - Duration: ~60 minutes

## Getting Started

### Prerequisites

Before starting, ensure you have the following software installed on your system:

#### Required Software

1. **Node.js (v18 or higher)**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`
   - Recommended: Use Node.js v18 LTS or higher

2. **Git (optional but recommended)**
   - Download from: https://git-scm.com/
   - Used for version control and potential updates

#### Installation Instructions for Prerequisites

**Windows:**
```powershell
# Using winget (Windows Package Manager)
winget install OpenJS.NodeJS

# Or download installer from nodejs.org
```

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download installer from nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Additional Requirements

- **Slack workspace** with bot creation permissions (for full functionality)
- **OpenAI API access** (API key will be provided in the environment configuration)

### Installation & Setup

> **Note**: This project is provided as a ZIP file with pre-configured environment variables and API keys for immediate testing and evaluation purposes. You don't need to set up Slack bots or OpenAI API keys manually.

1. **Extract the project**
   ```powershell
   # Extract the ZIP file to your desired location
   # Navigate to the extracted folder
   cd graduation-project
   ```

2. **Verify Node.js installation**
   ```powershell
   node --version
   npm --version
   ```
   Ensure you have Node.js v18 or higher installed.

3. **Install all dependencies and set up the database**
   ```powershell
   npm run setup
   ```
   
   This comprehensive setup command will:
   - Install root-level dependencies (concurrently for process management)
   - Install frontend dependencies (React, TypeScript, Vite, TailwindCSS, etc.)
   - Install backend dependencies (Express, Prisma, Slack SDK, OpenAI, etc.)
   - Install Prisma CLI globally if needed
   - Generate Prisma client
   - Set up SQLite database
   - Run initial database migrations
   - Create necessary database tables

   **What gets installed:**
   - **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Radix UI components
   - **Backend**: Express.js, Prisma ORM, Slack Bolt SDK, OpenAI API client
   - **Database**: SQLite with Prisma migrations
   - **Development tools**: TypeScript compiler, ESLint, Prettier

4. **Environment variables (pre-configured)**
   
   The project comes with a pre-configured `.env` file in the `backend` directory containing:
   - Database connection string
   - JWT secrets for authentication
   - OpenAI API key and model configuration
   - Slack bot tokens and credentials
   - All necessary API endpoints and configurations

   **No manual configuration required** - everything is ready to run!

5. **Start the application**
   ```powershell
   # Development mode (recommended for testing)
   npm run dev
   
   # Or production mode
   npm start
   ```

   This will start all services concurrently:
   - **Frontend**: http://localhost:5173 (React development server)
   - **Backend API**: http://localhost:3000 (Express server)
   - **Slack bot services**: Multiple bots ready for interaction

6. **Verify the setup**
   
   Open your browser and navigate to http://localhost:5173 to access the platform. You should see the login/registration page.

### Alternative Commands

```powershell
# Install dependencies only (without database setup)
npm run install-all

# Build for production
npm run build

# Start individual services (for debugging)
cd frontend
npm run dev    # Frontend only

cd backend
npm run dev    # Backend only
```

### Troubleshooting Setup

If you encounter issues during setup:

1. **Node.js version issues**:
   ```powershell
   node --version  # Should show v18.x.x or higher
   ```

2. **Permission errors on Windows**:
   ```powershell
   # Run PowerShell as Administrator if needed
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Database setup issues**:
   ```powershell
   cd backend
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Dependencies installation problems**:
   ```powershell
   # Clear npm cache and reinstall
   npm cache clean --force
   npm run setup
   ```   ```env
   # Example of the pre-configured environment variables
   # (actual values are already set in the provided .env file)
   
   # Database
   DATABASE_URL="file:./prisma/dev.db"
   
   # Authentication
   JWT_SECRET=your-jwt-secret-key
   
   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-openai-api-key
   OPENAI_MODEL=gpt-4-1106-preview
   
   # CS-Bot Configuration (Main bot - Required)
   CS_BOT_TOKEN=xoxb-your-bot-token
   CS_BOT_SIGNING_SECRET=your-signing-secret
   CS_BOT_APP_TOKEN=xapp-your-app-token
   
   # Character Bots (All pre-configured)
   PETE_BOT_TOKEN=xoxb-pete-token
   JOHN_BOT_TOKEN=xoxb-john-token
   MIKE_BOT_TOKEN=xoxb-mike-token
   PETER_BOT_TOKEN=xoxb-peter-token
   HANNA_BOT_TOKEN=xoxb-hanna-token
   LAZAR_BOT_TOKEN=xoxb-lazar-token
   # ... and their corresponding signing secrets and app tokens
   ```

4. **Set up Slack bots (Pre-configured)**
   
   > **Important**: All Slack bots are already configured and ready to use. The environment file includes all necessary tokens and credentials for the following bots:
   
   **Available Bots** (all pre-configured):
   - **CS-Bot**: Main system bot for drill facilitation
   - **Pete**: CEO character bot
   - **Hanna**: Customer Care character bot  
   - **John**: Security Analyst character bot
   - **Mike**: Security Engineer character bot
   - **Peter**: Network Engineer character bot
   - **Lazar**: Software Engineer character bot

   **Required OAuth Scopes** (already configured):
   - `channels:read`, `channels:manage`
   - `groups:read`, `groups:write`
   - `chat:write`
   - `users:read`, `users:read.email`
   
   **Event Subscriptions** (already configured):
   - `message.channels`, `message.groups`

   If you want to create your own Slack workspace and bots for testing:
   1. Create Slack apps at https://api.slack.com/apps
   2. Configure the OAuth scopes and event subscriptions listed above
   3. Update the `.env` file with your own bot tokens

5. **Start the application**
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Or production mode
   npm start
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Slack bot services

### Alternative Commands

```bash
# Install dependencies only
npm run install-all

# Build for production
npm run build

# Start individual services
cd frontend && npm run dev    # Frontend only
cd backend && npm run dev     # Backend only
```

## Bot Configuration Debugging

The project includes tools to verify Slack bot configuration:

```powershell
cd backend
npm run debug:bots
```

Or use the shell script (if you have Git Bash or WSL):
```bash
cd backend
./debug-bots.sh
```

This will check all bot tokens and provide setup guidance. Since the project comes pre-configured, all bots should show as properly configured.

## Quick Start Guide

### For Immediate Testing

1. **Extract the ZIP file** to your preferred location
2. **Open PowerShell/Terminal** in the project directory
3. **Install Node.js** (v18+) if not already installed
4. **Run the setup**: `npm run setup`
5. **Start the application**: `npm run dev`
6. **Access the platform**: http://localhost:5173
7. **Create an account** and start training!

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: At least 500MB free space for dependencies
- **Network**: Internet connection required for API calls and Slack integration

## Usage

1. **Register/Login**: Create an account or sign in to the platform
2. **Select a Drill**: Choose from available cybersecurity scenarios
3. **Join Slack Channels**: The system creates dedicated channels for your training session
4. **Lead the Response**: Act as Incident Manager and coordinate with AI team members
5. **Learn & Improve**: Receive feedback and build incident response skills

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- TailwindCSS for styling
- Radix UI components
- React Router for navigation
- Axios for API communication

### Backend
- Node.js with Express
- TypeScript for type safety
- Prisma ORM with SQLite
- JWT authentication
- Slack Bolt framework
- OpenAI API integration

### Infrastructure
- SQLite database (development)
- RESTful API design
- Real-time Slack integration
- Concurrent process management

## Development

### Project Structure
```
graduation-project/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript definitions
├── backend/           # Node.js backend
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── middleware/    # Authentication & validation
│   │   ├── routes/        # API routes
│   │   ├── slack/         # Slack bot implementation
│   │   │   ├── config/    # Bot configurations
│   │   │   ├── scenarios/ # Training scenarios
│   │   │   └── services/  # Bot logic & LLM integration
│   │   └── lib/          # Database & utilities
│   └── prisma/        # Database schema & migrations
└── package.json       # Root package with orchestration scripts
```

### Adding New Scenarios

1. Create scenario JSON file in `backend/src/slack/scenarios/`
2. Define bot behaviors and interactions
3. Update frontend drill data
4. Test with debug tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with bot interactions
5. Submit a pull request

## License

This project is developed as part of a graduation project for cybersecurity education.

---

**Note**: This platform is designed for educational purposes to teach cybersecurity incident response skills in a safe, simulated environment.
