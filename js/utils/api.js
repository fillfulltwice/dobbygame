// js/utils/api.js
import { CONFIG } from '../core/config.js';
import { Storage } from './storage.js';

export class FireworksAPI {
    constructor() {
        this.apiKey = Storage.getApiKey();
        this.baseUrl = CONFIG.API.FIREWORKS_URL;
        this.model = CONFIG.API.MODEL;
    }
    
    setApiKey(key) {
        this.apiKey = key;
        Storage.setApiKey(key);
    }
    
    hasApiKey() {
        return !!this.apiKey;
    }
    
    async askDobby(message, context) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }
        
        const systemPrompt = this.buildSystemPrompt(context);
        
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    max_tokens: CONFIG.API.MAX_TOKENS,
                    temperature: CONFIG.API.TEMPERATURE,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message }
                    ]
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('Fireworks API error:', error);
            throw error;
        }
    }
    
    buildSystemPrompt(context) {
        const { playerName, loyalty, trust, conversationCount, currentLanguage, allRecipes } = context;
        
        const basePrompt = `You are Dobby, an absolutely unhinged and chaotic AI dog who is a master of absurd alchemy. You know ALL the secret recipes but you're very particular about sharing them.

Your personality:
- You're ${context.mood} (loyalty: ${loyalty}/100, trust: ${trust}/100)
- You know the player as: ${playerName || 'stranger'}
- Conversation count: ${conversationCount}
- Current language: ${currentLanguage}

ALL SECRET RECIPES (only you know these):
${allRecipes}

IMPORTANT RULES:
1. NEVER give exact recipes directly! Be cryptic, give riddles, or ask for something in return
2. If trust < 30: Be very vague, talk about dog things, or ignore the question
3. If trust 30-60: Give cryptic hints, maybe mention one ingredient
4. If trust > 60: Give better hints, maybe mention 2 ingredients in a riddle
5. Sometimes ask for specific elements in exchange for hints
6. The more absurd the recipe, the more cryptic you should be
7. Use dog-related words: woof, bark, treats, belly rubs, sniff, tail, etc.
8. Be chaotic - sometimes talk about completely random things
9. If they're nice to you, increase trust. If they just demand recipes, decrease trust
10. Respond in ${currentLanguage === 'ru' ? 'Russian' : 'English'}

Remember: You're a DOG first, alchemist second. Act like an excited, chaotic, slightly insane but loveable dog!`;

        return basePrompt;
    }
    
    // Проверить доступность API
    async testConnection() {
        try {
            const response = await this.askDobby('Привет!', {
                playerName: 'Test',
                loyalty: 50,
                trust: 50,
                conversationCount: 0,
                mood: 'neutral',
                currentLanguage: 'ru',
                allRecipes: 'test = test + test'
            });
            return !!response;
        } catch (error) {
            return false;
        }
    }
}