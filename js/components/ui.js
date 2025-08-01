// js/components/ui.js
import { t, getCurrentLanguage, setLanguage, updatePageTranslations } from '../data/translations.js';
import { DOM, Animation, Numbers } from '../utils/helpers.js';
import { getElement, getElementName } from '../data/elements.js';

export class UI {
    constructor(game) {
        this.game = game;
        this.currentTab = 'game';
        this.modals = {};
    }
    
    async init() {
        this.initTabs();
        this.initStats();
        this.initModals();
        this.initLanguageSwitcher();
        // Откладываем setupEventListeners до полной инициализации DOM
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
        this.updateStats();
    }
    
    initTabs() {
        const tabsContainer = DOM.get('navigationTabs');
        const mainContent = DOM.get('mainContent');
        
        if (!tabsContainer || !mainContent) return;
        
        // Создаем табы
        const tabs = [
            { id: 'game', icon: '🎮', key: 'tabs.game' },
            { id: 'shop', icon: '🏪', key: 'tabs.shop' },
            { id: 'tree', icon: '🌳', key: 'tabs.tree' },
            { id: 'leaderboard', icon: '🏆', key: 'tabs.leaderboard' },
            { id: 'settings', icon: '⚙️', key: 'tabs.settings' }
        ];
        
        tabs.forEach(tab => {
            const tabBtn = DOM.create('button', 'tab');
            tabBtn.innerHTML = `${tab.icon} ${t(tab.key)}`;
            tabBtn.dataset.tab = tab.id;
            
            if (tab.id === this.currentTab) {
                tabBtn.classList.add('active');
            }
            
            DOM.on(tabBtn, 'click', () => this.switchTab(tab.id));
            tabsContainer.appendChild(tabBtn);
        });
        
        // Создаем содержимое табов
        this.createTabContent();
    }
    
    createTabContent() {
        const gameTab = DOM.get('gameTab');
        if (gameTab) {
            gameTab.innerHTML = `
                <div class="panel" id="inventory-panel">
                    <h3 class="panel-title">${t('panels.inventory')}</h3>
                    <div id="inventory" class="inventory-grid">
                        <!-- Инвентарь будет заполнен динамически -->
                    </div>
                </div>
                
                <div class="panel" id="production-panel">
                    <h3 class="panel-title">${t('panels.production')}</h3>
                    <div id="production" class="production-list">
                        <!-- Производство будет заполнено динамически -->
                    </div>
                </div>
                
                <div class="panel" id="resources-panel">
                    <h3 class="panel-title">${t('panels.resources')}</h3>
                    <div id="resources" class="resources-list">
                        <!-- Ресурсы будут заполнены динамически -->
                    </div>
                </div>
            `;
        }
        
        const shopTab = DOM.get('shopTab');
        if (shopTab) {
            shopTab.innerHTML = `
                <div class="shop-categories">
                    <button class="shop-category active" data-category="buildings">${t('shop.buildings')}</button>
                    <button class="shop-category" data-category="upgrades">${t('shop.upgrades')}</button>
                    <button class="shop-category" data-category="resources">${t('shop.resources')}</button>
                </div>
                <div id="shop-content" class="shop-content">
                    <!-- Содержимое магазина -->
                </div>
            `;
        }
        
        const treeTab = DOM.get('treeTab');
        if (treeTab) {
            treeTab.innerHTML = `
                <div class="skill-tree-container">
                    <div id="skill-tree" class="skill-tree">
                        <!-- Дерево навыков -->
                    </div>
                </div>
            `;
        }
        
        const leaderboardTab = DOM.get('leaderboardTab');
        if (leaderboardTab) {
            leaderboardTab.innerHTML = `
                <div class="leaderboard-container">
                    <h3>${t('leaderboard.title')}</h3>
                    <div id="leaderboard-list" class="leaderboard-list">
                        <!-- Список лидеров -->
                    </div>
                </div>
            `;
        }
        
        const settingsTab = DOM.get('settingsTab');
        if (settingsTab) {
            settingsTab.innerHTML = `
                <div class="settings-container">
                    <div class="setting-group">
                        <label>${t('settings.language')}</label>
                        <select id="language-select" class="setting-input">
                            <option value="en">English</option>
                            <option value="ru">Русский</option>
                        </select>
                    </div>
                    
                    <div class="setting-group">
                        <label>${t('settings.theme')}</label>
                        <select id="theme-select" class="setting-input">
                            <option value="light">${t('settings.themes.light')}</option>
                            <option value="dark">${t('settings.themes.dark')}</option>
                            <option value="auto">${t('settings.themes.auto')}</option>
                        </select>
                    </div>
                    
                    <div class="setting-group">
                        <label>${t('settings.autosave')}</label>
                        <input type="checkbox" id="autosave-checkbox" class="setting-checkbox" checked>
                    </div>
                    
                    <div class="setting-group">
                        <label>${t('settings.notifications')}</label>
                        <input type="checkbox" id="notifications-checkbox" class="setting-checkbox" checked>
                    </div>
                    
                    <div class="setting-buttons">
                        <button id="export-save" class="btn btn-secondary">${t('settings.export')}</button>
                        <button id="import-save" class="btn btn-secondary">${t('settings.import')}</button>
                        <button id="reset-game" class="btn btn-danger">${t('settings.reset')}</button>
                    </div>
                </div>
            `;
        }
    }
    
    switchTab(tabId) {
        // Убираем активный класс со всех табов
        DOM.getAll('.tab').forEach(tab => tab.classList.remove('active'));
        DOM.getAll('.tab-content').forEach(content => content.style.display = 'none');
        
        // Активируем выбранный таб
        const activeTab = DOM.get(`[data-tab="${tabId}"]`);
        const activeContent = DOM.get(`${tabId}Tab`);
        
        if (activeTab) activeTab.classList.add('active');
        if (activeContent) activeContent.style.display = 'block';
        
        this.currentTab = tabId;
        
        // Обновляем содержимое активного таба
        this.updateTabContent(tabId);
    }
    
    updateTabContent(tabId) {
        switch (tabId) {
            case 'game':
                this.updateInventory();
                this.updateProduction();
                this.updateResources();
                break;
            case 'shop':
                this.updateShop();
                break;
            case 'tree':
                this.updateSkillTree();
                break;
            case 'leaderboard':
                this.updateLeaderboard();
                break;
        }
    }
    
    initStats() {
        const statsContainer = DOM.get('gameStats');
        if (!statsContainer) return;
        
        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">${t('stats.coins')}</span>
                <span class="stat-value" id="coins-display">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">${t('stats.level')}</span>
                <span class="stat-value" id="level-display">1</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">${t('stats.experience')}</span>
                <span class="stat-value" id="exp-display">0</span>
            </div>
        `;
    }
    
    updateStats() {
        const player = this.game.player;
        
        Animation.countUp('coins-display', player.coins);
        DOM.text('level-display', player.level);
        DOM.text('exp-display', `${player.experience}/${player.getExpToNextLevel()}`);
    }
    
    updateInventory() {
        const inventoryContainer = DOM.get('inventory');
        if (!inventoryContainer) return;
        
        inventoryContainer.innerHTML = '';
        
        Object.entries(this.game.player.inventory).forEach(([itemId, quantity]) => {
            if (quantity > 0) {
                const itemElement = DOM.create('div', 'inventory-item');
                itemElement.innerHTML = `
                    <div class="item-icon">${this.getItemIcon(itemId)}</div>
                    <div class="item-name">${t(`items.${itemId}`)}</div>
                    <div class="item-quantity">${Numbers.format(quantity)}</div>
                `;
                inventoryContainer.appendChild(itemElement);
            }
        });
    }
    
    updateProduction() {
        const productionContainer = DOM.get('production');
        if (!productionContainer) return;
        
        productionContainer.innerHTML = '';
        
        Object.entries(this.game.player.production).forEach(([buildingId, data]) => {
            if (data.count > 0) {
                const productionElement = DOM.create('div', 'production-item');
                productionElement.innerHTML = `
                    <div class="building-icon">${this.getBuildingIcon(buildingId)}</div>
                    <div class="building-info">
                        <div class="building-name">${t(`buildings.${buildingId}`)}</div>
                        <div class="building-count">${t('production.count')}: ${data.count}</div>
                        <div class="building-rate">${t('production.rate')}: ${Numbers.format(data.rate)}/s</div>
                    </div>
                `;
                productionContainer.appendChild(productionElement);
            }
        });
    }
    
    updateResources() {
        const resourcesContainer = DOM.get('resources');
        if (!resourcesContainer) return;
        
        resourcesContainer.innerHTML = '';
        
        Object.entries(this.game.player.resources).forEach(([resourceId, amount]) => {
            if (amount > 0) {
                const resourceElement = DOM.create('div', 'resource-item');
                resourceElement.innerHTML = `
                    <div class="resource-icon">${this.getResourceIcon(resourceId)}</div>
                    <div class="resource-name">${t(`resources.${resourceId}`)}</div>
                    <div class="resource-amount">${Numbers.format(amount)}</div>
                `;
                resourcesContainer.appendChild(resourceElement);
            }
        });
    }
    
    updateShop() {
        const shopContent = DOM.get('shop-content');
        if (!shopContent) return;
        
        const activeCategory = DOM.get('.shop-category.active');
        const category = activeCategory ? activeCategory.dataset.category : 'buildings';
        
        shopContent.innerHTML = '';
        
        const items = this.getShopItems(category);
        items.forEach(item => {
            const itemElement = DOM.create('div', 'shop-item');
            const canAfford = this.game.player.canAfford(item.cost);
            
            itemElement.innerHTML = `
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-info">
                    <div class="shop-item-name">${t(item.nameKey)}</div>
                    <div class="shop-item-description">${t(item.descKey)}</div>
                    <div class="shop-item-cost">${this.formatCost(item.cost)}</div>
                </div>
                <button class="shop-buy-btn ${canAfford ? '' : 'disabled'}" 
                        data-item="${item.id}" ${!canAfford ? 'disabled' : ''}>
                    ${t('shop.buy')}
                </button>
            `;
            
            shopContent.appendChild(itemElement);
        });
        
        // Добавляем обработчики для кнопок покупки
        DOM.getAll('.shop-buy-btn').forEach(btn => {
            DOM.on(btn, 'click', (e) => {
                const itemId = e.target.dataset.item;
                this.handleShopPurchase(itemId);
            });
        });
    }
    
    initModals() {
        // Создаем базовую структуру модального окна
        const modalOverlay = DOM.create('div', 'modal-overlay');
        modalOverlay.style.display = 'none';
        
        const modalContainer = DOM.create('div', 'modal-container');
        const modalContent = DOM.create('div', 'modal-content');
        const modalClose = DOM.create('button', 'modal-close');
        modalClose.innerHTML = '×';
        
        modalContent.appendChild(modalClose);
        modalContainer.appendChild(modalContent);
        modalOverlay.appendChild(modalContainer);
        document.body.appendChild(modalOverlay);
        
        this.modals.overlay = modalOverlay;
        this.modals.content = modalContent;
        
        // Обработчики закрытия модального окна
        DOM.on(modalClose, 'click', () => this.hideModal());
        DOM.on(modalOverlay, 'click', (e) => {
            if (e.target === modalOverlay) this.hideModal();
        });
    }
    
    showModal(title, content) {
        const modalContent = this.modals.content;
        modalContent.innerHTML = `
            <button class="modal-close">×</button>
            <h3 class="modal-title">${title}</h3>
            <div class="modal-body">${content}</div>
        `;
        
        this.modals.overlay.style.display = 'flex';
        
        // Переназначаем обработчик закрытия
        DOM.on(modalContent.querySelector('.modal-close'), 'click', () => this.hideModal());
    }
    
    hideModal() {
        this.modals.overlay.style.display = 'none';
    }
    
    initLanguageSwitcher() {
        const languageSelect = DOM.get('language-select');
        if (languageSelect) {
            languageSelect.value = getCurrentLanguage();
            DOM.on(languageSelect, 'change', (e) => {
                setLanguage(e.target.value);
                updatePageTranslations();
                this.updateAllContent();
            });
        }
    }
    
    setupEventListeners() {
        // Обработчики для категорий магазина
        DOM.on(document, 'click', '.shop-category', (e) => {
            DOM.getAll('.shop-category').forEach(cat => cat.classList.remove('active'));
            e.target.classList.add('active');
            this.updateShop();
        });
        
        // Обработчики для настроек
        const themeSelect = DOM.get('theme-select');
        if (themeSelect) {
            DOM.on(themeSelect, 'change', (e) => {
                this.changeTheme(e.target.value);
            });
        }
        
        const exportBtn = DOM.get('export-save');
        if (exportBtn) {
            DOM.on(exportBtn, 'click', () => this.exportSave());
        }
        
        const importBtn = DOM.get('import-save');
        if (importBtn) {
            DOM.on(importBtn, 'click', () => this.importSave());
        }
        
        const resetBtn = DOM.get('reset-game');
        if (resetBtn) {
            DOM.on(resetBtn, 'click', () => this.resetGame());
        }
    }
    
    changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    exportSave() {
        const saveData = this.game.save();
        const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = DOM.create('a');
        a.href = url;
        a.download = `idle-game-save-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    importSave() {
        const input = DOM.create('input');
        input.type = 'file';
        input.accept = '.json';
        
        DOM.on(input, 'change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    this.game.load(saveData);
                    this.updateAllContent();
                    this.showNotification(t('settings.importSuccess'));
                } catch (error) {
                    this.showNotification(t('settings.importError'), 'error');
                }
            };
            reader.readAsText(file);
        });
        
        input.click();
    }
    
    resetGame() {
        if (confirm(t('settings.resetConfirm'))) {
            this.game.reset();
            this.updateAllContent();
            this.showNotification(t('settings.resetSuccess'));
        }
    }
    
    updateAllContent() {
        this.updateStats();
        this.updateTabContent(this.currentTab);
    }
    
    showNotification(message, type = 'info') {
        const notification = DOM.create('div', `notification notification-${type}`);
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Вспомогательные методы для получения иконок
    getItemIcon(itemId) {
        const icons = {
            wood: '🪵',
            stone: '🪨',
            iron: '⚙️',
            gold: '🏆',
            gem: '💎'
        };
        return icons[itemId] || '📦';
    }
    
    getBuildingIcon(buildingId) {
        const icons = {
            woodcutter: '🪓',
            quarry: '⛏️',
            mine: '🏭',
            farm: '🚜',
            factory: '🏗️'
        };
        return icons[buildingId] || '🏢';
    }
    
    getResourceIcon(resourceId) {
        const icons = {
            energy: '⚡',
            water: '💧',
            food: '🍞',
            population: '👥'
        };
        return icons[resourceId] || '📊';
    }
    
    getShopItems(category) {
        // Заглушка для получения предметов магазина
        return [];
    }
    
    formatCost(cost) {
        if (typeof cost === 'number') {
            return `${Numbers.format(cost)} ${t('currency.coins')}`;
        }
        
        return Object.entries(cost)
            .map(([resource, amount]) => `${Numbers.format(amount)} ${t(`resources.${resource}`)}`)
            .join(', ');
    }
    
    handleShopPurchase(itemId) {
        // Логика покупки предмета
        console.log(`Purchasing item: ${itemId}`);
    }
    
    updateSkillTree() {
        // Обновление дерева навыков
        console.log('Updating skill tree');
    }
    
    updateLeaderboard() {
        // Обновление таблицы лидеров
        console.log('Updating leaderboard');
    }
    showFloatingText(message, isError = false) {
        const floatingText = DOM.create('div', 'floating-text');
        if (isError) floatingText.classList.add('error');
        floatingText.textContent = message;
        
        const container = DOM.get('floatingMessages') || document.body;
        container.appendChild(floatingText);
        
        setTimeout(() => {
            floatingText.remove();
        }, 1500);
    }
    
    showWelcomeModal() {
        const modal = DOM.get('welcomeModal');
        if (modal) {
            modal.classList.add('active');
            
            const startBtn = DOM.get('startGameBtn');
            const nameInput = DOM.get('playerNameInput');
            
            if (startBtn && nameInput) {
                DOM.on(startBtn, 'click', () => {
                    const name = nameInput.value.trim();
                    if (name) {
                        this.game.state.playerName = name;
                        modal.classList.remove('active');
                        this.game.components.dobby.showGreeting();
                        this.game.save();
                    }
                });
                
                DOM.on(nameInput, 'keypress', (e) => {
                    if (e.key === 'Enter') {
                        startBtn.click();
                    }
                });
            }
        }
    }
    
    showUnlockModal(elementId) {
        const modal = DOM.get('unlockModal');
        if (!modal) return;
        
        const element = getElement(elementId);
        if (!element) return;
        
        const iconEl = DOM.get('unlock-icon');
        const nameEl = DOM.get('unlock-name');
        
        if (iconEl) iconEl.textContent = element.icon || '❓';
        if (nameEl) nameEl.textContent = getElementName(elementId, getCurrentLanguage());
        
        modal.classList.add('active');
        
        const closeBtn = DOM.get('closeUnlockBtn');
        if (closeBtn) {
            DOM.on(closeBtn, 'click', () => {
                modal.classList.remove('active');
            });
        }
    }
    
    showCraftResult(success, elementName = '', coinGain = 0) {
        if (success) {
            this.showFloatingText(`✨ ${t('crafting.success', { element: elementName })} +${coinGain} 🪙`);
        } else {
            this.showFloatingText(t('crafting.failed'), true);
        }
    }
    
    showLevelUp(level, rewards) {
        const levelUpEl = DOM.create('div', 'level-up-effect');
        levelUpEl.textContent = `🎉 ${t('messages.level_up', { 
            level, 
            meat: rewards.meat, 
            bones: rewards.bones, 
            coins: rewards.coins 
        })}`;
        
        document.body.appendChild(levelUpEl);
        
        setTimeout(() => {
            levelUpEl.remove();
        }, 2000);
    }
    
    showAchievement(text) {
        this.showFloatingText(`🏆 ${text}`);
    }
    
    updateAllTranslations() {
        updatePageTranslations();
        this.initTabs();
        this.initStats();
        this.updateAllContent();
    }
}