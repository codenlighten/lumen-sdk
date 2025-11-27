# 🌉 Lumen SDK & Project Factory

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Lumen Bridge](https://img.shields.io/badge/Powered%20by-Lumen%20Bridge-blue)](https://lumenbridge.codenlighten.org)

**Build entire production-ready applications from natural language descriptions using AI agents.**

The Lumen SDK provides a powerful project factory that transforms your ideas into fully-structured, deployable codebases through an intelligent multi-agent workflow.

---

## 🚀 What Is This?

This repository contains:

1. **LumenSDK.js** - A clean JavaScript SDK for interacting with [Lumen Bridge](https://lumenbridge.codenlighten.org), a self-aware agent platform
2. **ProjectBuilder** - An intelligent project factory that uses AI agents to architect, plan, and generate complete applications
3. **Example Projects** - Real, working applications generated entirely by AI agents

### The Magic

```javascript
const builder = new ProjectBuilder({
    userId: "your-user-id",
    outputDir: "./my-awesome-app"
});

await builder.build("Create a real-time chat app with end-to-end encryption using ECIES");
```

**That's it.** The system will:
- ✨ Improve and clarify your prompt
- 🏗️ Design the complete architecture
- 📋 Create a chronological build plan
- 💾 Generate production-ready code files
- 🔧 Set up dependencies and configuration

---

## 🎯 Features

### Intelligent Multi-Agent Workflow

```
Your Idea → PromptImprover → ProjectArchitect → ChronosPlanner → CodeGenerator → 📦 Complete Project
```

| Agent | Purpose |
|-------|---------|
| **PromptImprover** | Analyzes your idea, identifies core features, suggests tech stack, highlights challenges |
| **ProjectArchitect** | Designs file structure, defines modules, specifies dependencies, plans data flow |
| **ChronosPlanner** | Creates ordered build steps, handles dependencies, sequences file generation |
| **CodeGenerator** | Produces production-ready code with best practices, tests, and documentation |

### What Makes It Powerful

- 🧠 **Context-Aware**: Understands complex, multi-paragraph requirements
- 🏛️ **Architecture-First**: Plans before coding (files, modules, dependencies)
- 📝 **Production-Ready**: Generates real, working code with error handling
- 🧪 **Test-Included**: Unit tests generated alongside implementation
- 🔄 **Reusable**: One class, infinite projects
- 🎨 **Smart Patterns**: Follows best practices for each technology
- 📦 **Dependency Management**: Automatically identifies and lists required packages

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/codenlighten/lumen-sdk.git
cd lumen-sdk

# Install dependencies
npm install

# Add your Lumen Bridge user ID to BuildProject.js
```

### Prerequisites

- Node.js v20+ (for native fetch support)
- A Lumen Bridge account ([register here](https://lumenbridge.codenlighten.org))
- Your Lumen Bridge `userId`

---

## 🎮 Quick Start

### 1. Basic Usage

```javascript
import { ProjectBuilder } from './BuildProject.js';

const builder = new ProjectBuilder({
    userId: "user-dev-01",
    outputDir: "./my-project"
});

const projectIdea = `
Create a task management API with user authentication,
project workspaces, and real-time notifications.
`;

const result = await builder.build(projectIdea);

console.log(`Generated ${result.architecture.fileTree.length} files!`);
```

### 2. Run the Example

```bash
# Edit BuildProject.js to set your userId
# Then run:
npm run build
```

This will generate a complete project in the specified output directory.

---

## 🏗️ Example Projects

### 1. ECIES Chat Application

**Input**: "An end-to-end encrypted chat app using ECIES and Bitcoin SV extended keys"

**Generated**:
- 17 files across frontend/backend
- User identity with BIP32 xpub
- ECIES message encryption
- WebSocket real-time delivery
- Multi-device support
- Voice message architecture

📁 [`ecies-chat-app/`](./ecies-chat-app)

### 2. AI Legal Document Analysis Platform

**Input**: A complex, paragraph-length description with 30+ requirements

**Generated**:
- 29 files with TypeScript
- OpenAI GPT-4 integration
- Real-time collaboration (Socket.io)
- OAuth2 + JWT authentication
- Role-based access control
- Document upload with OCR
- Risk scoring visualization
- Multi-tenant architecture
- Stripe billing integration
- 509 lines of production code

📁 [`complex-ai-project/`](./complex-ai-project)

---

## 🔧 How It Works

### The Four-Phase Workflow

#### Phase 0: Prompt Improvement
```
Your idea → AI analysis → Enhanced technical specification
```

The **PromptImprover** agent:
- Identifies core features
- Suggests appropriate tech stack
- Highlights architectural considerations
- Clarifies ambiguous requirements

#### Phase 1: Architecture Design
```
Enhanced spec → System design → File structure + Modules
```

The **ProjectArchitect** agent:
- Designs complete file tree
- Defines module interfaces (inputs/outputs)
- Specifies dependencies
- Plans data flow

#### Phase 2: Build Planning
```
Architecture → Ordered steps → Executable plan
```

The **ChronosPlanner** agent:
- Creates chronological steps
- Handles dependency ordering
- Generates install commands
- Sequences file creation

#### Phase 3: Code Generation
```
Build plan → Code generation → Working files
```

The **CodeGenerator** executes:
- Creates directories
- Generates code files
- Writes configuration
- Sets up package.json

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    ProjectBuilder                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Prompt    │→ │  Project     │→ │  Chronos     │   │
│  │  Improver  │  │  Architect   │  │  Planner     │   │
│  └────────────┘  └──────────────┘  └──────────────┘   │
│         │                │                  │           │
│         └────────────────┴──────────────────┘           │
│                          ↓                               │
│                  ┌──────────────┐                       │
│                  │    Code      │                       │
│                  │  Generator   │                       │
│                  └──────────────┘                       │
│                          ↓                               │
└─────────────────────────┬────────────────────────────────┘
                          ↓
                   📦 Complete Project
```

---

## 🎨 Advanced Usage

### Custom Agent Configuration

```javascript
const builder = new ProjectBuilder({
    userId: "your-id",
    outputDir: "./output"
});

// Agents are registered automatically
// You can also register custom agents via LumenSDK
await builder.bridge.registerAgent(
    "MyCustomAgent",
    "Specialized for XYZ tasks",
    "Your custom prompt here..."
);
```

### Reusing the Builder

```javascript
const builder = new ProjectBuilder({ userId: "your-id" });

// Build multiple projects
await builder.build("Create a blog platform");
await builder.build("Create an e-commerce API");
await builder.build("Create a real-time dashboard");
```

### Accessing Build Results

```javascript
const result = await builder.build(projectIdea);

console.log(result.improved);        // Enhanced prompt details
console.log(result.architecture);    // File tree, modules, dependencies
console.log(result.buildSteps);      // Execution steps
console.log(result.outputDir);       // Where files were created
```

---

## 📚 LumenSDK Reference

### Core Methods

```javascript
import { LumenBridge } from './LumenSDK.js';

const bridge = new LumenBridge({
    userId: "your-user-id",
    baseUrl: "https://lumenbridge.codenlighten.org" // optional
});

// System Agents
await bridge.terminal(task, shell);
await bridge.generateCode(prompt, language, framework);
await bridge.generateSchema(userPrompt);

// User Agent Management
await bridge.registerAgent(name, description, prompt, metadata);
await bridge.updateAgent(name, updates);
await bridge.invokeUserAgent(agentName, context);
await bridge.getMyAgents();
await bridge.deleteAgent(agentName);
```

### Agent Responses

All agents return cryptographically signed responses with:
- ✍️ BSV-ECDSA-DER signatures
- 📊 LLM usage metrics (tokens, model, elapsed time)
- 🔐 Verifiable authenticity

---

## 🌟 Real-World Examples

### Example 1: Microservice API

```javascript
const result = await builder.build(`
Create a RESTful microservice for user management with:
- PostgreSQL database
- JWT authentication
- Role-based permissions
- Password reset via email
- Rate limiting
- Docker deployment
`);

// Generated: 15 files, Express API, complete auth system
```

### Example 2: React Dashboard

```javascript
const result = await builder.build(`
Build a React dashboard with:
- TypeScript
- Chart.js visualizations
- Real-time updates via WebSocket
- Dark mode
- Responsive design
- Redux state management
`);

// Generated: 23 files, complete React app with state management
```

### Example 3: Blockchain Integration

```javascript
const result = await builder.build(`
Create a Bitcoin SV wallet interface with:
- Key generation (BIP32/BIP39)
- Transaction building
- UTXO management
- BSV price tracking
- Transaction history
- QR code support
`);

// Generated: 18 files, crypto utilities, wallet logic
```

---

## 🔍 What Gets Generated?

### Typical Project Structure

```
your-project/
├── src/                     # Frontend source
│   ├── components/          # React components
│   ├── services/            # API clients
│   ├── utils/               # Helper functions
│   └── hooks/               # Custom React hooks
├── backend/                 # Backend source
│   ├── controllers/         # Request handlers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middleware/          # Express middleware
│   └── config/              # Configuration
├── public/                  # Static assets
├── tests/                   # Unit tests
├── package.json             # Dependencies
├── README.md                # Documentation
└── .env.example             # Environment template
```

### Code Quality

Generated code includes:
- ✅ Input validation
- ✅ Error handling
- ✅ Try/catch blocks
- ✅ JSDoc comments
- ✅ Type safety (when using TypeScript)
- ✅ Unit test scaffolding
- ✅ Best practices for chosen framework

---

## 🤖 Supported Technologies

### Backend
- Node.js / Express
- Python / Django / Flask
- MongoDB / PostgreSQL / MySQL
- Redis / Bull (job queues)
- WebSocket / Socket.io
- GraphQL / REST APIs

### Frontend
- React / TypeScript
- Vue.js / Angular
- Next.js / Vite
- Redux / Context API
- Tailwind CSS
- Chart.js / D3.js

### DevOps & Tools
- Docker / docker-compose
- GitHub Actions (CI/CD)
- Jest / Mocha (testing)
- ESLint / Prettier
- Nginx / Apache

### Integrations
- OpenAI API
- Stripe payments
- SendGrid emails
- AWS S3
- OAuth2 providers
- BSV blockchain

---

## 📖 Documentation

### Configuration Options

```javascript
new ProjectBuilder({
    userId: string,          // Required: Your Lumen Bridge user ID
    outputDir: string,       // Optional: Default "./generated-project"
})
```

### Environment Variables

Create a `.env` file:

```env
LUMEN_USER_ID=your-user-id
OPENAI_API_KEY=sk-...        # If using OpenAI features
```

---

## 🎯 Use Cases

### Perfect For:

- 🚀 **Rapid Prototyping**: Go from idea to working code in minutes
- 🏗️ **Learning**: See how complete applications are structured
- 💡 **Exploration**: Try different architectures without manual coding
- 📚 **Boilerplate**: Generate starter projects with best practices
- 🔬 **Experimentation**: Test architectural concepts quickly
- 📝 **Documentation**: Generate well-documented code examples

### Not Meant For:

- Production deployment without review
- Mission-critical systems without testing
- Replacing software engineering expertise
- Legal/medical/financial advice in generated code

---

## 🛠️ Troubleshooting

### Common Issues

**Error: "Agent not found"**
```javascript
// Solution: Agents are auto-registered on first build
// If error persists, try:
await builder.registerAgents();
```

**Error: "MODULE_NOT_FOUND"**
```bash
# Ensure Node.js v20+
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error: "Invalid user ID"**
```javascript
// Register at https://lumenbridge.codenlighten.org
// Get your userId from the dashboard
```

---

## 🤝 Contributing

Contributions welcome! This is an experimental project showcasing AI-powered code generation.

### Ways to Contribute:

1. 🐛 Report bugs or issues
2. 💡 Suggest new agent types
3. 📝 Improve documentation
4. 🎨 Share generated projects
5. 🔧 Enhance the SDK

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Lumen Bridge Platform**: Powering the intelligent agent system
- **OpenAI**: GPT-4 model for code generation
- **BSV Blockchain**: For cryptographic primitives and identity
- **SmartLedger**: For inspiration on verifiable systems

---

## 📬 Contact

**Author**: Gregory Ward (CodenLighten)

- 🌐 [Lumen Bridge Platform](https://lumenbridge.codenlighten.org)
- 💼 [GitHub](https://github.com/codenlighten)
- 📧 Contact via Lumen Bridge

---

## 🌟 Star History

If this project helps you build faster, give it a ⭐!

---

## 🔮 Roadmap

- [ ] Support for more languages (Python, Go, Rust)
- [ ] Visual architecture diagrams generation
- [ ] Interactive project customization
- [ ] One-click deployment integrations
- [ ] Version control integration
- [ ] Cost estimation for infrastructure
- [ ] Security audit agent
- [ ] Performance optimization suggestions
- [ ] API documentation generation
- [ ] Mobile app generation (React Native)

---

<div align="center">

**Built with ❤️ using AI Agents**

*Transform ideas into reality, one build at a time.*

[![Lumen Bridge](https://img.shields.io/badge/Try-Lumen%20Bridge-blue?style=for-the-badge)](https://lumenbridge.codenlighten.org)

</div>
