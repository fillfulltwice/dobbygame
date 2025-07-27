// js/utils/storage.js
import { CONFIG } from '../core/config.js';

export class Storage {
    static prefix = CONFIG.STORAGE.PREFIX;
    static keys = CONFIG.STORAGE.KEYS;
    
    // Основные методы
    static get(key) {
        try {
            const data = localStorage.getItem(this.prefix + key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    }
    
    static set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    }
    
    static remove(key) {
        localStorage.removeItem(this.prefix + key);
    }
    
    static clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
    
    // Специализированные методы
    static save(gameData) {
        return this.set(this.keys.SAVE_DATA, gameData);
    }
    
    static load() {
        return this.get(this.keys.SAVE_DATA);
    }
    
    static getSettings() {
        return this.get(this.keys.SETTINGS) || {
            language: 'ru',
            sound: true,
            animations: true,
            autoSave: true
        };
    }
    
    static setSettings(settings) {
        return this.set(this.keys.SETTINGS, settings);
    }
    
    static getApiKey() {
        const encrypted = this.get(this.keys.API_KEY);
        if (encrypted) {
            return this.decrypt(encrypted);
        }
        return null;
    }
    
    static setApiKey(key) {
        if (key) {
            const encrypted = this.encrypt(key);
            return this.set(this.keys.API_KEY, encrypted);
        }
        return false;
    }
    
    static getPlayerName() {
        return this.get(this.keys.PLAYER_NAME);
    }
    
    static setPlayerName(name) {
        return this.set(this.keys.PLAYER_NAME, name);
    }
    
    static getLeaderboard() {
        return this.get(this.keys.LEADERBOARD) || [];
    }
    
    static setLeaderboard(leaderboard) {
        return this.set(this.keys.LEADERBOARD, leaderboard);
    }
    
    // Простое шифрование (не для продакшена!)
    static encrypt(text) {
        const key = CONFIG.STORAGE.ENCRYPTION_KEY;
        let encrypted = '';
        for (let i = 0; i < text.length; i++) {
            encrypted += String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return btoa(encrypted);
    }
    
    static decrypt(encrypted) {
        const key = CONFIG.STORAGE.ENCRYPTION_KEY;
        const text = atob(encrypted);
        let decrypted = '';
        for (let i = 0; i < text.length; i++) {
            decrypted += String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return decrypted;
    }
    
    // Проверка доступности localStorage
    static isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // Экспорт/импорт данных
    static exportData() {
        const data = {
            version: '1.0.0',
            timestamp: Date.now(),
            save: this.load(),
            settings: this.getSettings(),
            playerName: this.getPlayerName(),
            leaderboard: this.getLeaderboard()
        };
        
        return btoa(JSON.stringify(data));
    }
    
    static importData(encodedData) {
        try {
            const data = JSON.parse(atob(encodedData));
            
            if (data.save) this.save(data.save);
            if (data.settings) this.setSettings(data.settings);
            if (data.playerName) this.setPlayerName(data.playerName);
            if (data.leaderboard) this.setLeaderboard(data.leaderboard);
            
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }
    
    // Статистика использования
    static getStorageSize() {
        let size = 0;
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                size += localStorage.getItem(key).length;
            }
        });
        return size;
    }
}