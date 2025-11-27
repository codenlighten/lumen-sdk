// BuildProject.js
import { LumenBridge } from './LumenSDK.js';
import fs from 'fs';
import path from 'path';

/**
 * ProjectBuilder - A reusable class for building complete projects using Lumen Bridge AI agents
 * 
 * Workflow:
 * 1. PromptImprover - Refines user's project idea
 * 2. ProjectArchitect - Designs file structure and modules
 * 3. ChronosPlanner - Creates chronological build steps
 * 4. Execution - Uses Terminal & Code agents to generate files
 */
export class ProjectBuilder {
    constructor(config) {
        this.userId = config.userId;
        this.outputDir = config.outputDir || './generated-project';
        this.bridge = new LumenBridge({ userId: this.userId });
        this.agentsRegistered = false;
    }

    // --- Agent Prompts ---

    get PROMPT_IMPROVER_PROMPT() {
        return `
You are a Senior Product Manager and Technical Analyst.
Your job is to take a user's project idea and improve it with:
- Technical clarity
- Clear feature requirements
- Suggested tech stack
- Architectural considerations
- Potential challenges to address

Return a STRICT JSON object (no markdown) with this schema:
{
    "improvedPrompt": "string - the enhanced, detailed project description",
    "reasoning": "string - explanation of what was improved and why",
    "techStack": ["array of suggested technologies"],
    "coreFeatures": ["array of key features identified"],
    "considerations": ["array of technical considerations or challenges"]
}`;
    }

    get ARCHITECT_PROMPT() {
        return `
You are a Senior System Architect. 
Analyze the project idea and return a STRICT JSON object (no markdown) with this schema:
{
    "projectName": "string",
    "fileTree": ["array of file paths relative to project root"],
    "dependencies": {"packageName": "version"},
    "modules": [
        {
            "name": "moduleName",
            "path": "filePath",
            "inputs": ["input variables"],
            "outputs": ["return values"],
            "description": "Detailed logic description for code generation",
            "dependencies": ["libraries needed for this module"]
        }
    ]
}`;
    }

    get PLANNER_PROMPT() {
        return `
You are a Technical Project Manager.
Receive a system architecture JSON. Return a STRICT JSON array of strings.
Each string must be a chronological step to build the project.
Format steps clearly:
- Steps starting with "CREATE DIR:" for directory creation
- Steps starting with "INSTALL:" for package installation
- Steps starting with "GENERATE FILE:" for file creation with module name
- Steps starting with "CONFIG:" for configuration files

Start with environment setup, then installation, then creating files in dependency order.
`;
    }

    /**
     * Register all required AI agents
     */
    async registerAgents() {
        if (this.agentsRegistered) return;
        
        console.log("🤖 Registering AI Agents...");
        
        await this.bridge.registerAgent(
            "PromptImprover",
            "Refines and enhances user project descriptions",
            this.PROMPT_IMPROVER_PROMPT
        );
        
        await this.bridge.registerAgent(
            "ProjectArchitect", 
            "Defines file structures and module blackboxes", 
            this.ARCHITECT_PROMPT
        );
        
        await this.bridge.registerAgent(
            "ChronosPlanner", 
            "Converts architecture into linear build steps", 
            this.PLANNER_PROMPT
        );
        
        this.agentsRegistered = true;
        console.log("✅ All agents registered\n");
    }

    /**
     * Phase 0: Improve the user's prompt
     */
    async improvePrompt(userPrompt) {
        console.log("\n💡 Phase 0: Improving Project Prompt...");
        console.log(`Original: "${userPrompt.substring(0, 100)}..."\n`);
        
        const response = await this.bridge.invokeUserAgent("PromptImprover", {
            userPrompt: userPrompt
        });
        
        const improved = this._parseJSON(response.result.response, "PromptImprover");
        if (!improved) throw new Error("Failed to improve prompt");
        
        console.log(`\n✅ Prompt Improved!`);
        console.log(`📋 Reasoning: ${improved.reasoning}`);
        console.log(`🛠️  Tech Stack: ${improved.techStack.join(', ')}`);
        console.log(`⭐ Core Features: ${improved.coreFeatures.join(', ')}\n`);
        
        return improved;
    }

    /**
     * Phase 1: Architect the solution
     */
    async architectSolution(improvedPrompt) {
        console.log("🏗️  Phase 1: Architecting Solution...");
        
        const architectResponse = await this.bridge.invokeUserAgent("ProjectArchitect", {
            userPrompt: improvedPrompt
        });
        
        const architecture = this._parseJSON(architectResponse.result.response, "ProjectArchitect");
        if (!architecture) throw new Error("Failed to create architecture");
        
        console.log(`✅ Architecture Defined:`);
        console.log(`   📁 Files: ${architecture.fileTree.length}`);
        console.log(`   📦 Modules: ${architecture.modules.length}`);
        console.log(`   🔧 Dependencies: ${Object.keys(architecture.dependencies || {}).length}\n`);
        
        return architecture;
    }

    /**
     * Phase 2: Create build plan
     */
    async createBuildPlan(architecture) {
        console.log("📅 Phase 2: Creating Build Plan...");
        
        const plannerResponse = await this.bridge.invokeUserAgent("ChronosPlanner", {
            userPrompt: `Create a chronological build plan for this architecture:\n${JSON.stringify(architecture, null, 2)}`
        });
        
        const buildSteps = this._parseJSON(plannerResponse.result.response, "ChronosPlanner");
        if (!buildSteps) throw new Error("Failed to create build plan");
        
        console.log(`✅ Build Plan Created: ${buildSteps.length} steps\n`);
        
        return buildSteps;
    }

    /**
     * Phase 3: Execute the build plan
     */
    async executeBuildPlan(buildSteps, architecture) {
        console.log("🛠️  Phase 3: Executing Build Plan...\n");
        
        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
            console.log(`📁 Created output directory: ${this.outputDir}\n`);
        }
        
        for (const [index, step] of buildSteps.entries()) {
            console.log(`\n[${index + 1}/${buildSteps.length}] ${step}`);
            
            try {
                if (step.startsWith("CREATE DIR:")) {
                    await this._handleCreateDir(step);
                } else if (step.startsWith("INSTALL:")) {
                    await this._handleInstall(step);
                } else if (step.startsWith("GENERATE FILE:")) {
                    await this._handleGenerateFile(step, architecture);
                } else if (step.startsWith("CONFIG:")) {
                    await this._handleConfig(step, architecture);
                } else {
                    // Generic handling - try to match modules
                    await this._handleGenericStep(step, architecture);
                }
            } catch (error) {
                console.error(`   ❌ Error: ${error.message}`);
            }
        }
        
        console.log("\n✅ Project Build Complete!");
        console.log(`📂 Output: ${path.resolve(this.outputDir)}\n`);
    }

    /**
     * Helper: Parse JSON from agent response, handling markdown code blocks
     */
    _parseJSON(response, agentName) {
        try {
            // Remove markdown code blocks
            const cleanJson = response
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error(`❌ Failed to parse ${agentName} JSON:`, e.message);
            console.log("Raw Response:", response);
            return null;
        }
    }

    /**
     * Handle directory creation
     */
    async _handleCreateDir(step) {
        const dirPath = step.replace("CREATE DIR:", "").trim();
        const fullPath = path.join(this.outputDir, dirPath);
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`   ✅ Created: ${dirPath}`);
    }

    /**
     * Handle package installation
     */
    async _handleInstall(step) {
        const packages = step.replace("INSTALL:", "").trim();
        const termRes = await this.bridge.terminal(
            `Generate npm install command for: ${packages}`,
            "bash"
        );
        console.log(`   💻 ${termRes.result.terminalCommand}`);
        console.log(`   ⚠️  Risk: ${termRes.result.riskLevel}`);
        // Note: Not actually executing - just showing the command
    }

    /**
     * Handle file generation
     */
    async _handleGenerateFile(step, architecture) {
        const fileName = step.replace("GENERATE FILE:", "").trim();
        const matchingModule = architecture.modules.find(m => 
            fileName.includes(m.name) || fileName.includes(m.path)
        );
        
        if (matchingModule) {
            console.log(`   📝 Generating ${matchingModule.name}...`);
            
            const codeRes = await this.bridge.generateCode(
                `Generate complete production-ready code for:\n` +
                `Module: ${matchingModule.name}\n` +
                `Description: ${matchingModule.description}\n` +
                `Inputs: ${JSON.stringify(matchingModule.inputs)}\n` +
                `Outputs: ${JSON.stringify(matchingModule.outputs)}\n` +
                `Dependencies: ${JSON.stringify(matchingModule.dependencies)}`,
                "javascript",
                "nodejs"
            );
            
            const filePath = path.join(this.outputDir, matchingModule.path);
            const fileDir = path.dirname(filePath);
            
            if (!fs.existsSync(fileDir)) {
                fs.mkdirSync(fileDir, { recursive: true });
            }
            
            fs.writeFileSync(filePath, codeRes.result.code);
            console.log(`   ✅ Generated: ${matchingModule.path} (${codeRes.result.code.length} bytes)`);
        }
    }

    /**
     * Handle configuration files
     */
    async _handleConfig(step, architecture) {
        const configType = step.replace("CONFIG:", "").trim();
        
        if (configType.includes("package.json")) {
            const packageJson = {
                name: architecture.projectName.toLowerCase().replace(/\s+/g, '-'),
                version: "1.0.0",
                description: "Generated by Lumen Bridge Project Factory",
                main: "index.js",
                type: "module",
                scripts: {
                    start: "node index.js",
                    dev: "nodemon index.js"
                },
                dependencies: architecture.dependencies || {}
            };
            
            const filePath = path.join(this.outputDir, 'package.json');
            fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
            console.log(`   ✅ Created package.json`);
        }
    }

    /**
     * Handle generic steps by trying to match modules
     */
    async _handleGenericStep(step, architecture) {
        const matchingModule = architecture.modules.find(m => 
            step.toLowerCase().includes(m.name.toLowerCase()) || 
            step.toLowerCase().includes(m.path.toLowerCase())
        );
        
        if (matchingModule) {
            await this._handleGenerateFile(`GENERATE FILE: ${matchingModule.path}`, architecture);
        } else {
            console.log(`   ⏭️  Skipping generic step`);
        }
    }

    /**
     * Main build method - orchestrates the entire process
     */
    async build(userPrompt) {
        console.log(`🚀 Lumen Bridge Project Factory\n`);
        console.log(`📝 Project Idea: "${userPrompt.substring(0, 80)}..."\n`);
        
        try {
            // Register agents
            await this.registerAgents();
            
            // Phase 0: Improve prompt
            const improved = await this.improvePrompt(userPrompt);
            
            // Phase 1: Architecture
            const architecture = await this.architectSolution(improved.improvedPrompt);
            
            // Phase 2: Planning
            const buildSteps = await this.createBuildPlan(architecture);
            
            // Phase 3: Execution
            await this.executeBuildPlan(buildSteps, architecture);
            
            return {
                success: true,
                improved,
                architecture,
                buildSteps,
                outputDir: this.outputDir
            };
        } catch (error) {
            console.error(`\n❌ Build failed: ${error.message}`);
            throw error;
        }
    }
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
    const builder = new ProjectBuilder({
        userId: "user-dev-01", // Replace with your User ID
        outputDir: "./complex-ai-project"
    });
    
    const PROJECT_IDEA = `
I need a full-stack AI-powered legal document analysis platform that can process contracts, NDAs, and legal agreements. 

The system should:
- Accept PDF/DOCX uploads and extract text using OCR if needed
- Use AI (OpenAI GPT-4) to identify key clauses, obligations, risks, and deadlines
- Store documents in encrypted cloud storage (S3) with access control
- Generate risk scores and highlight problematic clauses in red/yellow/green
- Create a timeline of all contractual obligations and deadlines
- Send email/SMS reminders 7 days before deadlines
- Support multi-tenant architecture where law firms can have multiple clients
- Provide a clean dashboard showing portfolio overview with metrics
- Allow lawyers to add annotations and override AI suggestions
- Generate comparison reports between multiple versions of the same document
- Export summary reports to PDF with firm branding
- Implement OAuth2 authentication with role-based access (admin, lawyer, client)
- Track all document access for audit logs
- Integrate with Stripe for subscription billing (tiered pricing)
- Support real-time collaboration where multiple lawyers can review same document
- Mobile-responsive React frontend with TypeScript
- Implement WebSocket for real-time updates
- Use Redis for caching frequently accessed documents
- PostgreSQL for relational data (users, subscriptions, metadata)
- MongoDB for storing document analysis results
- Background job processing with Bull/Redis for heavy AI tasks
- Comprehensive test coverage with Jest
- Docker deployment with docker-compose
- CI/CD pipeline ready (GitHub Actions)
- Rate limiting to prevent API abuse
- GDPR-compliant data deletion
- Email templates with SendGrid
- Admin panel to manage users and view analytics

The frontend should have:
- Document upload with drag-and-drop
- Advanced search and filtering
- Dark mode support
- Data visualization charts for risk analysis
- Keyboard shortcuts for power users
- Infinite scroll for document lists

Make it production-ready with proper error handling, logging, and monitoring hooks.

Key Features:
- User identity based on BIP32 extended public keys (xpub)
- 1:1 encrypted messaging using ECIES (Elliptic Curve Integrated Encryption Scheme)
- Handle-based identity system (like @username@domain)
- Multi-device support with device-specific subkeys
- Voice messages (encrypted audio blobs)
- Optional BSV payment integration
- Message store-and-forward server
- WebSocket real-time delivery
- Key verification/fingerprints

Make it production-ready with proper error handling, logging, and monitoring hooks.
`;
    
    builder.build(PROJECT_IDEA)
        .then(result => {
            console.log("\n🎉 Build Summary:");
            console.log(`   Project: ${result.architecture.projectName}`);
            console.log(`   Files: ${result.architecture.fileTree.length}`);
            console.log(`   Modules: ${result.architecture.modules.length}`);
            console.log(`   Output: ${result.outputDir}`);
            console.log(`\n📋 Improved Prompt Summary:`);
            console.log(`   Tech Stack: ${result.improved.techStack.join(', ')}`);
            console.log(`   Features: ${result.improved.coreFeatures.length} identified`);
        })
        .catch(console.error);
}