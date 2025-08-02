// js/core/app.js
import { Game } from './game.js';
import { UI } from '../components/ui.js';
import { EventSystem } from './events.js';
import { DOM } from '../utils/helpers.js';
import { t, getCurrentLanguage, setLanguage, updatePageTranslations, initTranslations } from '../data/translations.js';
export class App {
    constructor() {
        this.game = null;
        this.ui = null;
        this.eventSystem = null;
        this.initialized = false;
        this.updateInterval = null;
        this.saveInterval = null;
        
        // Настройки приложения
        this.settings = {
            updateRate: 1000 / 60, // 60 FPS
            saveRate: 30000, // Автосохранение каждые 30 секунд
            theme: localStorage.getItem('theme') || 'light',
            language: localStorage.getItem('language') || 'en',
            autosave: localStorage.getItem('autosave') !== 'false',
            notifications: localStorage.getItem('notifications') !== 'false'
        };
    }
    
    async init() {
        try {
            console.log('🚀 Initializing Idle Game...');
            
            // Инициализация переводов
            await initTranslations();
            
            // Применение темы
            this.applyTheme();
            
            // Создание основных компонентов
            this.eventSystem = new EventSystem();
            this.game = new Game(this.eventSystem);
    
          // Инициализация игры сначала
          await this.game.init();
            
          // Затем создаем и инициализируем UI
          this.ui = new UI(this.game);
          this.game.components.ui = this.ui; // Устанавливаем UI в game
          await this.ui.init();
          
          // Загрузка сохранения
          this.loadGame();
          
          // Проверяем нужно ли показать модальное окно приветствия
          if (!this.game.state.playerName) {
              this.ui.showWelcomeModal();
          }
            
            // Обновление переводов
            updatePageTranslations();
            
            // Запуск игрового цикла
            this.startGameLoop();
            
            // Запуск автосохранения
            if (this.settings.autosave) {
                this.startAutoSave();
            }
            
            // Установка обработчиков
            this.setupGlobalEventListeners();
            
            // Скрытие загрузочного экрана
            this.hideLoadingScreen();
            
            this.initialized = true;
            console.log('✅ Game initialized successfully!');
            
            // Событие успешной инициализации
            this.eventSystem.emit('app:initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize game:', error);
            this.showError('Failed to initialize game. Please refresh the page.');
        }
    }
    
    startGameLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(() => {
            try {
                this.update();
            } catch (error) {
                console.error('Error in game loop:', error);
            }
        }, this.settings.updateRate);
        
        console.log(`🔄 Game loop started (${Math.round(1000 / this.settings.updateRate)} FPS)`);
    }
    
    update() {
        if (!this.initialized) return;
        
        const deltaTime = this.settings.updateRate / 1000;
        
        // Обновление игровой логики
        this.game.update(deltaTime);
        
        // Обновление UI (с ограничением частоты)
        if (Date.now() - (this.lastUIUpdate || 0) > 100) { // Обновление UI 10 раз в секунду
            this.ui.updateStats();
            this.lastUIUpdate = Date.now();
        }
    }
    
    startAutoSave() {
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
        }
        
        this.saveInterval = setInterval(() => {
            try {
                this.saveGame();
                if (this.settings.notifications) {
                    this.showNotification('Game auto-saved', 'success');
                }
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }, this.settings.saveRate);
        
        console.log(`💾 Auto-save enabled (every ${this.settings.saveRate / 1000}s)`);
    }
    
    saveGame() {
        try {
            const saveData = this.game.save();
            saveData.timestamp = Date.now();
            saveData.version = this.getGameVersion();
            
            localStorage.setItem('idle-game-save', JSON.stringify(saveData));
            this.eventSystem.emit('game:saved', saveData);
            
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }
    
    loadGame() {
        try {
            const saveData = localStorage.getItem('idle-game-save');
            if (!saveData) {
                console.log('No save data found, starting new game');
                return false;
            }
            
            const parsedData = JSON.parse(saveData);
            
            // Проверка версии сохранения
            if (parsedData.version && !this.isCompatibleVersion(parsedData.version)) {
                console.warn('Save data version mismatch, starting new game');
                return false;
            }
            
            // Загрузка данных в игру
            this.game.load(parsedData);
            this.eventSystem.emit('game:loaded', parsedData);
            
            console.log('✅ Game loaded successfully');
            return true;
            
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    }
    
    resetGame() {
        if (!confirm('Are you sure you want to reset your progress? This cannot be undone!')) {
            return false;
        }
        
        try {
            // Очистка сохранения
            localStorage.removeItem('idle-game-save');
            
            // Сброс игры
            this.game.reset();
            
            // Обновление UI
            this.ui.updateAllContent();
            
            // Уведомление
            this.showNotification('Game reset successfully', 'info');
            
            this.eventSystem.emit('game:reset');
            console.log('🔄 Game reset');
            
            return true;
        } catch (error) {
            console.error('Failed to reset game:', error);
            return false;
        }
    }
    
    applyTheme() {
        const theme = this.settings.theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Автоматическое определение темы
        if (theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const actualTheme = mediaQuery.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', actualTheme);
            
            // Слушатель изменения системной темы
            mediaQuery.addEventListener('change', (e) => {
                if (this.settings.theme === 'auto') {
                    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    changeTheme(theme) {
        this.settings.theme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme();
        this.eventSystem.emit('theme:changed', theme);
    }
    
    changeLanguage(language) {
        this.settings.language = language;
        localStorage.setItem('language', language);
        updatePageTranslations();
        this.ui.updateAllContent();
        this.eventSystem.emit('language:changed', language);
    }
    
    setupGlobalEventListeners() {
        // Обработка закрытия вкладки/окна
        window.addEventListener('beforeunload', (e) => {
            if (this.settings.autosave) {
                this.saveGame();
            }
        });
        
        // Обработка потери/получения фокуса
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onFocusLost();
            } else {
                this.onFocusGained();
            }
        });
        
        // Обработка ошибок
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.handleError(e.error);
        });
        
        // Обработка нехватки памяти
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.handleError(e.reason);
        });
        
        // Горячие клавиши
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    onFocusLost() {
        console.log('👁️ App lost focus');
        this.game.onFocusLost();
    }
    
    onFocusGained() {
        console.log('👁️ App gained focus');
        this.game.onFocusGained();
        
        // Обновление UI при возврате фокуса
        this.ui.updateAllContent();
    }
    
    handleKeyPress(e) {
        // Горячие клавиши
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    this.saveGame();
                    this.showNotification('Game saved manually', 'success');
                    break;
                case 'r':
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.resetGame();
                    }
                    break;
            }
        }
        
        // Переключение табов цифрами
        if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey) {
            const tabIds = ['game', 'shop', 'tree', 'leaderboard', 'settings'];
            const tabIndex = parseInt(e.key) - 1;
            if (tabIds[tabIndex]) {
                this.ui.switchTab(tabIds[tabIndex]);
            }
        }
        
        // ESC для закрытия модальных окон
        if (e.key === 'Escape') {
            this.ui.hideModal();
        }
        
        this.eventSystem.emit('keypress', e);
    }
    
    handleResize() {
        // Обработка изменения размера окна
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Адаптация интерфейса для мобильных устройств
        if (width < 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
        
        this.eventSystem.emit('window:resize', { width, height });
    }
    
    handleError(error) {
        // Обработка критических ошибок
        console.error('Application error:', error);
        
        // Показываем пользователю уведомление об ошибке
        this.showNotification('An error occurred. The game will try to recover.', 'error');
        
        // Попытка автосохранения перед возможным крашем
        try {
            this.saveGame();
        } catch (saveError) {
            console.error('Failed to save after error:', saveError);
        }
        
        this.eventSystem.emit('app:error', error);
    }
    
    showError(message) {
        const errorContainer = DOM.get('error-container') || this.createErrorContainer();
        errorContainer.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary">Reload Game</button>
            </div>
        `;
        errorContainer.style.display = 'flex';
    }
    
    createErrorContainer() {
        const container = DOM.create('div', 'error-container');
        container.id = 'error-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    hideLoadingScreen() {
        const loadingScreen = DOM.get('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        if (!this.settings.notifications) return;
        
        const notification = DOM.create('div', `notification notification-${type}`);
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Добавляем в контейнер уведомлений
        let container = DOM.get('notifications-container');
        if (!container) {
            container = DOM.create('div', 'notifications-container');
            container.id = 'notifications-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 300);
        }, duration);
        
        this.eventSystem.emit('notification:shown', { message, type, duration });
    }
    
    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }
    
    getGameVersion() {
        return '1.0.0'; // Версия игры
    }
    
    isCompatibleVersion(saveVersion) {
        // Простая проверка совместимости версий
        const currentVersion = this.getGameVersion();
        const [currentMajor] = currentVersion.split('.').map(Number);
        const [saveMajor] = saveVersion.split('.').map(Number);
        
        return currentMajor === saveMajor;
    }
    
    exportSave() {
        try {
            const saveData = this.game.save();
            saveData.exportTimestamp = Date.now();
            saveData.version = this.getGameVersion();
            
            const dataStr = JSON.stringify(saveData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = DOM.create('a');
            link.href = url;
            link.download = `idle-game-save-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            this.showNotification('Save exported successfully', 'success');
            this.eventSystem.emit('save:exported', saveData);
            
            return true;
        } catch (error) {
            console.error('Failed to export save:', error);
            this.showNotification('Failed to export save', 'error');
            return false;
        }
    }
    
    importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    // Валидация данных сохранения
                    if (!this.validateSaveData(saveData)) {
                        throw new Error('Invalid save data format');
                    }
                    
                    // Проверка совместимости версий
                    if (saveData.version && !this.isCompatibleVersion(saveData.version)) {
                        if (!confirm('This save is from a different version. Import anyway? (May cause issues)')) {
                            resolve(false);
                            return;
                        }
                    }
                    
                    // Загрузка данных
                    this.game.load(saveData);
                    this.ui.updateAllContent();
                    
                    this.showNotification('Save imported successfully', 'success');
                    this.eventSystem.emit('save:imported', saveData);
                    
                    resolve(true);
                } catch (error) {
                    console.error('Failed to import save:', error);
                    this.showNotification('Failed to import save: Invalid file', 'error');
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }
    
    validateSaveData(saveData) {
        // Базовая валидация структуры сохранения
        if (typeof saveData !== 'object') return false;
        if (!saveData.player) return false;
        if (typeof saveData.player.coins !== 'number') return false;
        if (typeof saveData.player.level !== 'number') return false;
        
        return true;
    }
    
    // API для управления настройками
    setSetting(key, value) {
        if (key in this.settings) {
            this.settings[key] = value;
            localStorage.setItem(key, value.toString());
            this.eventSystem.emit('setting:changed', { key, value });
            
            // Применение некоторых настроек немедленно
            switch (key) {
                case 'theme':
                    this.changeTheme(value);
                    break;
                case 'language':
                    this.changeLanguage(value);
                    break;
                case 'autosave':
                    if (value) {
                        this.startAutoSave();
                    } else if (this.saveInterval) {
                        clearInterval(this.saveInterval);
                        this.saveInterval = null;
                    }
                    break;
            }
        }
    }
    
    getSetting(key) {
        return this.settings[key];
    }
    
    // Методы для отладки
    getDebugInfo() {
        return {
            initialized: this.initialized,
            gameState: this.game ? this.game.getState() : null,
            settings: this.settings,
            performance: {
                updateRate: this.settings.updateRate,
                saveRate: this.settings.saveRate,
                lastUpdate: this.lastUIUpdate
            }
        };
    }
    
    // Очистка ресурсов при закрытии
    destroy() {
        console.log('🧹 Cleaning up application...');
        
        // Финальное сохранение
        if (this.settings.autosave) {
            this.saveGame();
        }
        
        // Очистка интервалов
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
        }
        
        // Очистка компонентов
        if (this.game) {
            this.game.destroy();
        }
        
        // Очистка событий
        if (this.eventSystem) {
            this.eventSystem.removeAllListeners();
        }
        
        this.initialized = false;
        console.log('✅ Application cleaned up');
    }
}

// Глобальная инициализация приложения
let app = null;

export function initApp() {
    if (app) {
        console.warn('App already initialized');
        return app;
    }
    
    app = new App();
    
    // Экспорт в глобальную область для отладки
    if (typeof window !== 'undefined') {
        window.IdleGame = {
            app,
            debug: () => app.getDebugInfo(),
            save: () => app.saveGame(),
            load: () => app.loadGame(),
            reset: () => app.resetGame(),
            export: () => app.exportSave()
        };
    }
    
    return app;
}

// Экспортируем функцию инициализации
export function initializeApp() {
    const gameApp = initApp();
    if (gameApp) {
        gameApp.init();
    }
}