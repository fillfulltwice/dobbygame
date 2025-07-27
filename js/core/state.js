// js/core/state.js
import { CONFIG } from './config.js';

export class GameState {
    constructor() {
        this.reset();
    }
    
    reset() {
        // Игрок
        this.playerName = null;
        
        // Статистика
        this.level = CONFIG.INITIAL_STATE.level;
        this.exp = CONFIG.INITIAL_STATE.exp;
        this.expToNext = CONFIG.INITIAL_STATE.expToNext;
        this.coins = CONFIG.INITIAL_STATE.coins;
        this.meat = CONFIG.INITIAL_STATE.meat;
        this.bones = CONFIG.INITIAL_STATE.bones;
        
        // Dobby
        this.loyalty = CONFIG.INITIAL_STATE.loyalty;
        this.trust = CONFIG.INITIAL_STATE.trust;
        this.conversationCount = CONFIG.INITIAL_STATE.conversationCount;
        this.dobbyMood = CONFIG.INITIAL_STATE.dobbyMood;
        this.currentRequest = null;
        this.completedRequests = [];
        
        // Элементы
        this.elements = {};
        Object.entries(CONFIG.STARTING_ELEMENTS).forEach(([id, data]) => {
            this.elements[id] = { ...data };
        });
        
        // Крафтинг
        this.craftingSlots = [null, null, null, null];
        this.totalCrafts = 0;
        this.successfulCrafts = 0;
        
        // Достижения
        this.achievements = {};
        
        // API
        this.apiKey = null;
        
        // Настройки
        this.settings = {
            language: 'ru',
            sound: true,
            animations: true,
            autoSave: true
        };
        
        // Статистика
        this.stats = {
            timePlayed: 0,
            elementsDiscovered: 0,
            totalCrafts: 0,
            failedCrafts: 0,
            coinsSpent: 0,
            coinsEarned: 0,
            dobbyConversations: 0,
            treatsGiven: 0
        };
        
        // Временные данные
        this.isAsking = false;
        this.lastSaveTime = Date.now();
        this.sessionStartTime = Date.now();
    }
    
    // Получить данные для сохранения
    getSaveData() {
        return {
            version: '1.0.0',
            timestamp: Date.now(),
            
            // Основные данные
            playerName: this.playerName,
            level: this.level,
            exp: this.exp,
            expToNext: this.expToNext,
            coins: this.coins,
            meat: this.meat,
            bones: this.bones,
            
            // Dobby
            dobby: {
                loyalty: this.loyalty,
                trust: this.trust,
                conversationCount: this.conversationCount,
                dobbyMood: this.dobbyMood,
                completedRequests: this.completedRequests
            },
            
            // Элементы
            elements: this.elements,
            
            // Достижения и статистика
            achievements: this.achievements,
            stats: {
                ...this.stats,
                timePlayed: this.stats.timePlayed + (Date.now() - this.sessionStartTime)
            },
            
            // Настройки
            settings: this.settings
        };
    }
    
    // Загрузить данные из сохранения
    loadFromSave(saveData) {
        if (!saveData || !saveData.version) {
            console.error('Invalid save data');
            return false;
        }
        
        try {
            // Основные данные
            this.playerName = saveData.playerName;
            this.level = saveData.level || 1;
            this.exp = saveData.exp || 0;
            this.expToNext = saveData.expToNext || 100;
            this.coins = saveData.coins || 0;
            this.meat = saveData.meat || 0;
            this.bones = saveData.bones || 0;
            
            // Dobby
            if (saveData.dobby) {
                this.loyalty = saveData.dobby.loyalty || 50;
                this.trust = saveData.dobby.trust || 0;
                this.conversationCount = saveData.dobby.conversationCount || 0;
                this.dobbyMood = saveData.dobby.dobbyMood || 'neutral';
                this.completedRequests = saveData.dobby.completedRequests || [];
            }
            
            // Элементы
            this.elements = saveData.elements || {};
            
            // Проверяем, что есть хотя бы начальные элементы
            let hasStartingElements = false;
            Object.keys(CONFIG.STARTING_ELEMENTS).forEach(id => {
                if (this.elements[id] && this.elements[id].count > 0) {
                    hasStartingElements = true;
                }
            });
            
            if (!hasStartingElements) {
                Object.entries(CONFIG.STARTING_ELEMENTS).forEach(([id, data]) => {
                    this.elements[id] = { ...data };
                });
            }
            
            // Достижения и статистика
            this.achievements = saveData.achievements || {};
            this.stats = saveData.stats || this.stats;
            
            // Настройки
            if (saveData.settings) {
                this.settings = { ...this.settings, ...saveData.settings };
            }
            
            console.log('Game loaded successfully');
            return true;
            
        } catch (error) {
            console.error('Error loading save data:', error);
            return false;
        }
    }
    
    // Проверка валидности состояния
    validate() {
        // Проверяем основные значения
        if (this.level < 1) this.level = 1;
        if (this.exp < 0) this.exp = 0;
        if (this.coins < 0) this.coins = 0;
        if (this.meat < 0) this.meat = 0;
        if (this.bones < 0) this.bones = 0;
        
        // Проверяем Dobby
        if (this.loyalty < 0) this.loyalty = 0;
        if (this.loyalty > 100) this.loyalty = 100;
        if (this.trust < 0) this.trust = 0;
        if (this.trust > 100) this.trust = 100;
        
        // Проверяем элементы
        Object.entries(this.elements).forEach(([id, element]) => {
            if (element.count < 0) element.count = 0;
        });
        
        return true;
    }
    
    // Обновить статистику
    updateStats(key, value = 1) {
        if (this.stats[key] !== undefined) {
            this.stats[key] += value;
        }
    }
    
    // Проверить достижение
    hasAchievement(id) {
        return this.achievements[id] === true;
    }
    
    // Получить достижение
    unlockAchievement(id) {
        if (!this.achievements[id]) {
            this.achievements[id] = true;
            return true;
        }
        return false;
    }
    
    // Получить количество открытых элементов
    getDiscoveredElementsCount() {
        return Object.values(this.elements).filter(e => e.discovered).length;
    }
    
    // Получить общее количество элементов
    getTotalElementsCount() {
        return Object.values(this.elements).reduce((sum, e) => sum + (e.count || 0), 0);
    }
    
    // Может ли купить предмет
    canAfford(price) {
        return this.coins >= price;
    }
    
    // Есть ли элемент
    hasElement(id, count = 1) {
        return this.elements[id] && this.elements[id].count >= count;
    }
    
    // Добавить элемент
    addElement(id, count = 1) {
        if (!this.elements[id]) {
            this.elements[id] = { count: 0, discovered: false };
        }
        
        this.elements[id].count += count;
        
        if (!this.elements[id].discovered) {
            this.elements[id].discovered = true;
            this.updateStats('elementsDiscovered');
            return true; // Новое открытие
        }
        
        return false;
    }
    
    // Удалить элемент
    removeElement(id, count = 1) {
        if (this.hasElement(id, count)) {
            this.elements[id].count -= count;
            return true;
        }
        return false;
    }
    
    // Получить уровень отношений с Dobby
    getDobbyRelationshipLevel() {
        const combined = (this.loyalty + this.trust) / 2;
        
        if (combined >= 80) return 'best_friends';
        if (combined >= 60) return 'good_friends';
        if (combined >= 40) return 'friends';
        if (combined >= 20) return 'acquaintances';
        return 'strangers';
    }
    
    // Получить множитель опыта
    getExpMultiplier() {
        let multiplier = 1;
        
        // Бонус за уровень отношений с Dobby
        const relationship = this.getDobbyRelationshipLevel();
        if (relationship === 'best_friends') multiplier *= 1.5;
        else if (relationship === 'good_friends') multiplier *= 1.3;
        else if (relationship === 'friends') multiplier *= 1.1;
        
        // Бонус за достижения
        if (this.hasAchievement('discovered_50')) multiplier *= 1.2;
        if (this.hasAchievement('discovered_100')) multiplier *= 1.5;
        
        return multiplier;
    }
}