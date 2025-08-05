// js/core/game.js
import { GameState } from './state.js';
import { getAllRecipes, findRecipe } from '../data/recipes.js';
import { getAllElements, getElement, getElementName } from '../data/elements.js';
import { t, setLanguage, getCurrentLanguage } from '../data/translations.js';
import { Inventory } from '../components/inventory.js';
import { Crafting } from '../components/crafting.js';
import { Shop } from '../components/shop.js';
import { Dobby } from '../components/dobby.js';
import { UI } from '../components/ui.js';
import { Storage } from '../utils/storage.js';

export class Game {
    constructor() {
        this.state = new GameState();
        this.components = {
            inventory: new Inventory(this),
            crafting: new Crafting(this),
            shop: new Shop(this),
            dobby: new Dobby(this),
            ui: null // Will be set by app.js
        };
        
        this.isInitialized = false;
        // Добавь эти строки после строки 23
        this.player = {
            inventory: {},
            production: {},
            resources: {},
            canAfford: (cost) => this.state.canAfford(cost)
        };
    }
    
    
    
    async init() {
        if (this.isInitialized) return;
        
        // Load saved data
        const savedData = Storage.load();
        if (savedData) {
            this.state.loadFromSave(savedData);
        }
        
        
        // Set up auto-save
        this.setupAutoSave(); 
        
        this.isInitialized = true;
        console.log('Game initialized successfully');
        this.isInitialized = true;
        console.log('Game initialized successfully');
    }
    
    // New method to initialize components when DOM is ready
    async initComponents() {
        await this.components.inventory.init();
        await this.components.crafting.init();
        await this.components.shop.init();
        await this.components.dobby.init();
    }
    
    
    
    setupAutoSave() {
        setInterval(() => {
            this.save();
        }, 30000); // Auto-save every 30 seconds
        
        // Save on window close
        window.addEventListener('beforeunload', () => {
            this.save();
        });
    }
    
    checkDailyBonus() {
        const lastBonus = Storage.get('lastDailyBonus');
        const today = new Date().toDateString();
        
        if (lastBonus !== today) {
            this.state.coins += 50;
            this.state.meat += 2;
            this.state.bones += 3;
            
            // Проверяем, что UI инициализирован
            if (this.components.ui && this.components.ui.showFloatingText) {
                this.components.ui.showFloatingText(t('messages.daily_bonus'));
            }
            Storage.set('lastDailyBonus', today);
            this.updateUI();
        }
    
    }
    
    updateUI() {
        if (this.components.ui && this.components.ui.updateStats) {
            this.components.ui.updateStats();
        }
        if (this.components.inventory && this.components.inventory.render) {
            this.components.inventory.render();
        }
        if (this.components.shop && this.components.shop.render) {
            this.components.shop.render();
        }
        if (this.components.dobby && this.components.dobby.updateMood) {
            this.components.dobby.updateMood();
        }
    }
    
    craft(ingredients) {
        const result = findRecipe(ingredients);
        
        if (result) {
            // Successful craft
            const element = getElement(result);
            if (!element) {
                console.error(`Element ${result} not found!`);
                return false;
            }
            
            // Add element to inventory
            if (!this.state.elements[result]) {
                this.state.elements[result] = {
                    count: 0,
                    discovered: false
                };
            }
            
            this.state.elements[result].count++;
            
            let expGain = 10;
            let coinGain = 5;
            
            // First time discovery bonus
            if (!this.state.elements[result].discovered) {
                this.state.elements[result].discovered = true;
                this.components.ui.showUnlockModal(result);
                expGain = 50;
                coinGain = 20;
                
                // Achievement check
                this.checkAchievements();
            }
            
            // Give rewards
            this.gainExp(expGain);
            this.state.coins += coinGain;
            
            // Remove used ingredients
            ingredients.forEach(ing => {
                if (this.state.elements[ing]) {
                    this.state.elements[ing].count--;
                }
            });
            
            // Show success message
            const elementName = getElementName(result, getCurrentLanguage());
            this.components.ui.showCraftResult(true, elementName, coinGain);
            
            this.updateUI();
            return true;
            
        } else {
            // Failed craft
            this.components.ui.showCraftResult(false);
            
            // Return ingredients
            ingredients.forEach(ing => {
                if (this.state.elements[ing]) {
                    this.state.elements[ing].count++;
                }
            });
            
            return false;
        }
    }
    
    gainExp(amount) {
        this.state.exp += amount;
        
        // Check for level up
        while (this.state.exp >= this.state.expToNext) {
            this.state.exp -= this.state.expToNext;
            this.levelUp();
        }
        
        this.updateUI();
    }
    
    levelUp() {
        this.state.level++;
        this.state.expToNext = 100 * this.state.level;
        
        // Level rewards
        const meatReward = Math.floor(this.state.level / 3) + 1;
        const boneReward = Math.floor(this.state.level / 2) + 2;
        const coinReward = this.state.level * 15;
        
        this.state.meat += meatReward;
        this.state.bones += boneReward;
        this.state.coins += coinReward;
        
        // Show level up effect
        this.components.ui.showLevelUp(this.state.level, {
            meat: meatReward,
            bones: boneReward,
            coins: coinReward
        });
        
        // Update leaderboard
        this.updateLeaderboard();
    }
    
    buyItem(itemId, price) {
        if (this.state.coins < price) {
            this.components.ui.showFloatingText(t('shop.not_enough_coins'), true);
            return false;
        }
        
        this.state.coins -= price;
        
        // Special items
        if (itemId === 'meat') {
            this.state.meat++;
        } else if (itemId === 'bone') {
            this.state.bones++;
        } else {
            // Regular element
            if (!this.state.elements[itemId]) {
                this.state.elements[itemId] = {
                    count: 0,
                    discovered: false
                };
            }
            
            if (!this.state.elements[itemId].discovered) {
                this.state.elements[itemId].discovered = true;
                this.checkAchievements();
            }
            
            this.state.elements[itemId].count++;
        }
        
        const itemName = itemId === 'meat' ? '🍖 ' + t('stats.meat') : 
                        itemId === 'bone' ? '🦴 ' + t('stats.bones') :
                        getElementName(itemId, getCurrentLanguage());
        
        this.components.ui.showFloatingText(t('shop.purchased', { item: itemName }));
        this.updateUI();
        return true;
    }
    
    giveTreat(type) {
        if (type === 'meat' && this.state.meat > 0) {
            this.state.meat--;
            this.state.loyalty = Math.min(100, this.state.loyalty + 15);
            this.state.trust = Math.min(100, this.state.trust + 5);
            
            this.components.ui.showFloatingText(
                t('messages.loyalty_gained', { amount: 15 }) + ' ' +
                t('messages.trust_gained', { amount: 5 })
            );
            
            this.components.dobby.showMessage(t('dobby.moods.happy'));
            
        } else if (type === 'bone' && this.state.bones > 0) {
            this.state.bones--;
            this.state.loyalty = Math.min(100, this.state.loyalty + 10);
            this.state.trust = Math.min(100, this.state.trust + 3);
            
            this.components.ui.showFloatingText(
                t('messages.loyalty_gained', { amount: 10 }) + ' ' +
                t('messages.trust_gained', { amount: 3 })
            );
            
            this.components.dobby.showMessage(t('dobby.moods.happy'));
            
        } else {
            this.components.ui.showFloatingText(t('shop.not_enough_coins'), true);
        }
        
        this.updateUI();
    }
    
    checkAchievements() {
        const discovered = Object.values(this.state.elements).filter(e => e.discovered).length;
        const total = Object.keys(getAllElements()).length;
        
        // Check for discovery milestones
        const milestones = [10, 25, 50, 75, 100];
        milestones.forEach(milestone => {
            if (discovered >= milestone && !this.state.achievements[`discovered_${milestone}`]) {
                this.state.achievements[`discovered_${milestone}`] = true;
                this.components.ui.showAchievement(`Открыто ${milestone} элементов!`);
                
                // Bonus rewards
                this.state.coins += milestone * 10;
                this.gainExp(milestone * 5);
            }
        });
    }
    
    updateLeaderboard() {
        // This would normally connect to a server
        // For now, just update local leaderboard
        const leaderboard = Storage.get('leaderboard') || [];
        
        const playerEntry = {
            name: this.state.playerName,
            level: this.state.level,
            elements: Object.values(this.state.elements).filter(e => e.discovered).length,
            timestamp: Date.now()
        };
        
        // Update or add player entry
        const existingIndex = leaderboard.findIndex(e => e.name === this.state.playerName);
        if (existingIndex >= 0) {
            leaderboard[existingIndex] = playerEntry;
        } else {
            leaderboard.push(playerEntry);
        }
        
        // Sort by level
        leaderboard.sort((a, b) => b.level - a.level);
        
        // Keep top 100
        leaderboard.splice(100);
        
        Storage.set('leaderboard', leaderboard);
    }
    
    resetProgress() {
        if (confirm('Вы уверены? Весь прогресс будет потерян!')) {
            Storage.clear();
            location.reload();
        }
    }
    
    changeLanguage(lang) {
        setLanguage(lang);
        this.updateUI();
        this.components.ui.updateAllTranslations();
    }
// Добавь эти методы после строки 299 (после метода changeLanguage)

update(deltaTime) {
    // Пустой метод, но нужен для game loop
}

onFocusLost() {
    // Вызывается когда игра теряет фокус
}

onFocusGained() {
    // Вызывается когда игра получает фокус
}

load(saveData) {
    if (saveData && saveData.player) {
        this.state.loadFromSave(saveData.player);
        return true;
    }
    return false;
}

save() {
    return {
        player: this.state.getSaveData()
    };
}

reset() {
    this.state.reset();
    this.updateUI();
}

destroy() {
    if (this.components.shop) {
        this.components.shop.destroy();
    }
}

getState() {
    return this.state;
}
}