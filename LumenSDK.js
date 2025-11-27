// LumenSDK.js

export class LumenBridge {
    constructor(config) {
        this.baseUrl = config.baseUrl || "https://lumenbridge.codenlighten.org";
        this.userId = config.userId; // Required for User Agents
        this.defaultHeaders = {
            "Content-Type": "application/json"
        };
    }

    async _request(endpoint, method, body) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method,
                headers: this.defaultHeaders,
                body: body ? JSON.stringify(body) : undefined
            });
            const data = await response.json();
            if (!data.success) throw new Error(`API Error: ${JSON.stringify(data)}`);
            return data;
        } catch (error) {
            console.error(`Error calling ${endpoint}:`, error.message);
            throw error;
        }
    }

    // --- System Agents ---

    async terminal(task, shell = 'bash') {
        return this._request('/api/agents/terminal', 'POST', {
            task,
            context: { shell }
        });
    }

    async generateCode(prompt, language, framework) {
        return this._request('/api/agents/code', 'POST', {
            prompt,
            context: { language, framework }
        });
    }

    async generateSchema(userPrompt) {
        return this._request('/api/agents/schema', 'POST', { userPrompt });
    }

    // --- User Agent Management ---

    async registerAgent(name, description, prompt, metadata = {}) {
        // Check if exists first (simple error handling logic)
        try {
            const existing = await this._request(`/api/agents/my-agents/${this.userId}/${name}`, 'GET');
            if (existing.success) {
                console.log(`Agent ${name} already exists. Updating...`);
                return this.updateAgent(name, { description, prompt, metadata });
            }
        } catch (e) {
            // If error is 404, we proceed to register
        }

        return this._request('/api/agents/register', 'POST', {
            userId: this.userId,
            name,
            description,
            prompt,
            metadata
        });
    }

    async updateAgent(name, updates) {
        return this._request('/api/agents/update', 'PUT', {
            userId: this.userId,
            agentName: name,
            updates
        });
    }

    async invokeUserAgent(agentName, context) {
        return this._request('/api/agents/invoke-user-agent', 'POST', {
            userId: this.userId,
            agentName,
            context
        });
    }

    async getMyAgents() {
        return this._request(`/api/agents/my-agents/${this.userId}`, 'GET');
    }

    async deleteAgent(agentName) {
        return this._request('/api/agents/delete', 'DELETE', {
            userId: this.userId,
            agentName
        });
    }
}