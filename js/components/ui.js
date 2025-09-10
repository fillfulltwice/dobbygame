import { t, setLanguage, updatePageTranslations, getCurrentLanguage } from '../data/translations.js';
import { DOM, Animation, Numbers } from '../utils/helpers.js';
import { getElement, getElementName } from '../data/elements.js';
import { getAllRecipes } from '../data/recipes.js';

export class UI {
    constructor(game) {
        this.game = game;
        this.currentTab = 'game';
        this.modals = {};
    }
    
    async init() {
        this.renderSimplifiedLayout();
        this.initStats();
        this.initModals();
        this.initLanguageSwitcher();
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
        this.updateStats();
        setTimeout(async () => {
            await this.game.initComponents();
        }, 100);
    }
    
    initTabs() {
    }
    
    createTabContent() {
    }

    renderSimplifiedLayout() {
        const gameTab = DOM.get('gameTab');
        if (!gameTab) return;
        gameTab.classList.add('active');
        gameTab.innerHTML = `
            <div class="panel" id="inventory-panel">
                <h3 class="panel-title">${t('panels.inventory')}</h3>
                <div class="inventory-filters">
                    <button class="inventory-filter active" data-category="all">Все</button>
                    <button class="inventory-filter" data-category="basic">Базовые</button>
                    <button class="inventory-filter" data-category="craftable">Созданные</button>
                </div>
                <input type="text" id="inventorySearch" class="inventory-search" placeholder="Поиск элементов...">
                <div id="inventory" class="inventory-grid"></div>
            </div>

            <div class="panel" id="dobby-panel">
                <h3 class="panel-title">${t('panels.dobby')}</h3>
                <div id="dobby" class="dobby-container"></div>
                <div class="flex gap-sm mt-sm">
                  <button id="openShopBtn" class="btn btn-primary">🏪 Открыть магазин</button>
                  <button id="openTreeBtn" class="btn">🌳 Древо крафта</button>
                </div>
            </div>

            <div class="panel" id="crafting-panel">
                <h3 class="panel-title">${t('panels.crafting')}</h3>
                <div id="crafting"></div>
            </div>
        `;
    }
    
    switchTab(tabId) {
        this.currentTab = 'game';
    }
    
    updateTabContent(tabId) {
        // Always update core panels
        this.updateInventory();
        if (this.game.components.crafting) this.game.components.crafting.render();
        if (this.game.components.dobby) this.game.components.dobby.render();
    }
    
    initStats() {
        const statsContainer = DOM.get('statsBar');
        if (!statsContainer) return; // keep optional in simplified UI
        
        // Очищаем и заполняем контейнер статистики
        DOM.clear(statsContainer);
        
        const stats = [
            { key: 'stats.level', id: 'level-display', value: this.game.state.level },
            { key: 'stats.exp', id: 'exp-display', value: `${this.game.state.exp}/${this.game.state.expToNext}` },
            { key: 'stats.coins', id: 'coins-display', value: this.game.state.coins },
            { key: 'stats.elements', id: 'elements-display', value: this.game.state.getDiscoveredElementsCount() },
            { key: 'stats.meat', id: 'meat-display', value: this.game.state.meat },
            { key: 'stats.bones', id: 'bones-display', value: this.game.state.bones }
        ];
        
        stats.forEach(stat => {
            const statItem = DOM.create('div', 'stat-item');
            statItem.innerHTML = `
                <span class="stat-label">${t(stat.key)}</span>
                <span class="stat-value" id="${stat.id}">${stat.value}</span>
            `;
            statsContainer.appendChild(statItem);
        });
    }
    
    updateStats() {
        const state = this.game.state;
        
        DOM.text('level-display', state.level);
        DOM.text('exp-display', `${state.exp}/${state.expToNext}`);
        DOM.text('coins-display', state.coins);
        DOM.text('elements-display', state.getDiscoveredElementsCount());
        DOM.text('meat-display', state.meat);
        DOM.text('bones-display', state.bones);
    }
    
    updateInventory() {
        if (this.game.components.inventory) {
            this.game.components.inventory.render();
        }
    }
   
    updateProduction() {
        const productionContainer = DOM.get('production');
        if (productionContainer) {
            productionContainer.innerHTML = '<p>Система производства в разработке</p>';
        }
    }
    
    updateResources() {
        const resourcesContainer = DOM.get('resources');
        if (resourcesContainer) {
            resourcesContainer.innerHTML = '<p>Система ресурсов в разработке</p>';
        }
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

    showShopModal() {
        const containerId = 'shop';
        const body = `<div class="panel" id="${containerId}">
           <h3 class="panel-title">🏪 Магазин</h3>
           <div class="shop-container"></div>
        </div>`;
        this.showModal('🏪 Магазин', body);
        if (this.game.components.shop) {
            this.game.components.shop.init();
        }
    }

    showTreeModal() {
        // Генерируем узлы по всем результатам из рецептов (поддержка форматов: объект или массив)
        const lang = getCurrentLanguage();
        const recipes = getAllRecipes();
        let nodes = [];
        if (Array.isArray(recipes)) {
            nodes = Array.from(new Set(recipes.map(r => r.result)));
        } else if (recipes && typeof recipes === 'object') {
            // Merge all categories if present
            Object.values(recipes).forEach(group => {
                if (group && typeof group === 'object') {
                    nodes.push(...Object.keys(group));
                }
            });
            nodes = Array.from(new Set(nodes));
        }
        const discovered = this.game.state.elements || {};
        const nodeHtml = nodes.map(id => {
            const have = discovered[id]?.discovered;
            const title = getElementName(id, lang);
            const cls = have ? 'skill-node' : 'skill-node locked';
            const icon = (getElement(id)?.icon) || '❓';
            return `<div class="${cls}" data-eid="${id}" title="${title}">${icon}</div>`;
        }).join('');
        const tree = `<div class="skill-tree" id="craftTreeAll" style="display:flex;flex-wrap:wrap;gap:10px;max-height:60vh;overflow:auto;">${nodeHtml}</div>`;
        this.showModal('🌳 Древо крафта (все рецепты)', tree);

        // Подсказки с названием (как в инвентаре)
        const container = this.modals.content.querySelector('#craftTreeAll');
        if (container) {
            const tipText = (id) => `${getElement(id)?.icon || ''} ${getElementName(id, lang)}`.trim();
            container.querySelectorAll('.skill-node').forEach(node => {
                const id = node.getAttribute('data-eid');
                const text = tipText(id);
                node.title = text;
                node.addEventListener('mouseenter', (e) => this.showTooltip(text, e));
                node.addEventListener('mousemove', (e) => this.moveTooltip(e));
                node.addEventListener('mouseleave', () => this.hideTooltip());
            });
        }
    }

    // --- Tooltip helpers (shared) ---
    ensureTooltip() {
        if (this.tooltip) return this.tooltip;
        this.tooltip = DOM.create('div', 'game-tooltip');
        document.body.appendChild(this.tooltip);
        return this.tooltip;
    }

    showTooltip(text, e) {
        const tip = this.ensureTooltip();
        tip.textContent = text;
        tip.style.display = 'block';
        this.positionTooltip(e);
    }

    moveTooltip(e) {
        if (!this.tooltip) return;
        this.positionTooltip(e);
    }

    positionTooltip(e) {
        const tip = this.tooltip;
        if (!tip) return;
        const offset = 12;
        let x = e.clientX + offset;
        let y = e.clientY + offset;
        const rect = tip.getBoundingClientRect();
        if (x + rect.width > window.innerWidth) x = e.clientX - rect.width - offset;
        if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - offset;
        tip.style.left = x + 'px';
        tip.style.top = y + 'px';
    }

    hideTooltip() {
        if (this.tooltip) this.tooltip.style.display = 'none';
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
        
        // Обработчики для настроек
        const openShop = DOM.get('openShopBtn');
        if (openShop) DOM.on(openShop, 'click', () => this.showShopModal());
        const openTree = DOM.get('openTreeBtn');
        if (openTree) DOM.on(openTree, 'click', () => this.showTreeModal());
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
        this.updateTabContent('game');
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
        this.renderSimplifiedLayout();
        this.initStats();
        this.updateAllContent();
    }
}
