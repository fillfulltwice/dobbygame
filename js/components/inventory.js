import { getElement, getElementName } from '../data/elements.js';
import { getCurrentLanguage } from '../data/translations.js';
import { DOM, Animation } from '../utils/helpers.js';

export class Inventory {
    constructor(game) {
        this.game = game;
        this.container = null;
        this.selectedElement = null;
        this.tooltip = null;
    }
    
    async init() {
        this.container = DOM.get('inventory');
        if (!this.container) {
            console.error('Inventory container not found');
            return;
        }
        
        this.render();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Фильтр по категориям
        const filterButtons = document.querySelectorAll('.inventory-filter');
        filterButtons.forEach(btn => {
            DOM.on(btn, 'click', () => {
                const category = btn.dataset.category;
                this.filterByCategory(category);
            });
        });
        
        // Поиск элементов
        const searchInput = DOM.get('inventorySearch');
        if (searchInput) {
            DOM.on(searchInput, 'input', (e) => {
                this.searchElements(e.target.value);
            });
        }
    }
    
    render() {
        if (!this.container) return;
        
        DOM.clear(this.container);
        
        const elements = this.game.state.elements;
        const lang = getCurrentLanguage();
        
        // Сортируем элементы по категориям и количеству
        const sortedElements = Object.entries(elements)
            .filter(([id, data]) => data.discovered && data.count > 0)
            .sort((a, b) => {
                // Сначала по категории
                const elementA = getElement(a[0]);
                const elementB = getElement(b[0]);
                if (elementA && elementB && elementA.category !== elementB.category) {
                    return (elementA.category || '').localeCompare(elementB.category || '');
                }
                // Затем по количеству
                return b[1].count - a[1].count;
            });
        
        // Создаем элементы инвентаря
        sortedElements.forEach(([id, data]) => {
            const element = getElement(id);
            if (!element) return;
            
            const item = this.createInventoryItem(id, element, data);
            this.container.appendChild(item);
        });
        
        // Если инвентарь пуст
        if (sortedElements.length === 0) {
            const emptyMessage = DOM.create('div', 'inventory-empty');
            emptyMessage.textContent = lang === 'ru' 
                ? 'Инвентарь пуст. Попроси Dobby подсказать рецепт или дай ему лакомство.'
                : 'Inventory is empty. Ask Dobby for a recipe hint or give him a treat.';
            this.container.appendChild(emptyMessage);
        }
    }
    
    createInventoryItem(id, element, data) {
        const lang = getCurrentLanguage();
        const item = DOM.create('div', 'element-item');
        item.dataset.elementId = id;
        item.dataset.category = element.category || 'other';
        const displayName = getElementName(id, lang);
        const descr = (element.description && (element.description[lang] || element.description.en)) || '';
        item.title = `${element.icon || ''} ${displayName}${descr ? ' — ' + descr : ''}`.trim();
        
        // Иконка
        const icon = DOM.create('div', 'element-icon', element.icon);
        item.appendChild(icon);
        
        // Название
        const name = DOM.create('div', 'element-name');
        name.textContent = displayName;
        item.appendChild(name);
        
        // Количество
        const count = DOM.create('div', 'element-count');
        count.textContent = data.count;
        item.appendChild(count);
        
        // Обработчик клика
        DOM.on(item, 'click', () => this.selectElement(id));

        // Custom tooltip for reliable hover label
        const content = `${element.icon || ''} ${displayName}${descr ? ' — ' + descr : ''}`.trim();
        DOM.on(item, 'mouseenter', (e) => this.showTooltip(content, e));
        DOM.on(item, 'mousemove', (e) => this.moveTooltip(e));
        DOM.on(item, 'mouseleave', () => this.hideTooltip());
        
        // Анимация появления
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, 10);
        
        return item;
    }

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
    
    selectElement(elementId) {
        const element = this.game.state.elements[elementId];
        if (!element || element.count <= 0) return;
        
        // Добавляем в слот крафта, списывая 1 из инвентаря при успехе
        const added = this.game.components.crafting.addToSlot(elementId);
        if (added) {
            if (this.game.state.elements[elementId] && this.game.state.elements[elementId].count > 0) {
                this.game.state.elements[elementId].count--;
                this.updateElementCount(elementId);
            }
            // Визуальная анимация выбора
            const item = this.container.querySelector(`[data-element-id="${elementId}"]`);
            if (item) Animation.Effects.shake(item, 200, 3);
            this.playSound('select');
        }
    }
    
    updateElementCount(elementId) {
        const item = this.container.querySelector(`[data-element-id="${elementId}"]`);
        if (!item) return;
        
        const element = this.game.state.elements[elementId];
        const countEl = item.querySelector('.element-count');
        
        if (element.count > 0) {
            // Обновляем количество
            if (countEl) {
                const oldCount = parseInt(countEl.textContent);
                Animation.animateNumber(countEl, oldCount, element.count, 300);
            }
        } else {
            // Удаляем элемент из инвентаря
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.5)';
            setTimeout(() => item.remove(), 300);
        }
    }
    
    addElement(elementId, count = 1) {
        const element = this.game.state.elements[elementId];
        if (!element) return;
        
        const wasEmpty = element.count === 0;
        element.count += count;
        
        if (wasEmpty && element.discovered) {
            // Добавляем новый элемент в инвентарь
            this.render();
        } else {
            // Обновляем количество
            this.updateElementCount(elementId);
        }
    }
    
    filterByCategory(category) {
        const items = this.container.querySelectorAll('.element-item');
        
        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'flex';
                Animation.fadeIn(item, 200);
            } else {
                Animation.fadeOut(item, 200);
            }
        });
        
        // Обновляем активную кнопку фильтра
        document.querySelectorAll('.inventory-filter').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
    }
    
    searchElements(query) {
        const items = this.container.querySelectorAll('.element-item');
        const lang = getCurrentLanguage();
        query = query.toLowerCase();
        
        items.forEach(item => {
            const elementId = item.dataset.elementId;
            const name = getElementName(elementId, lang).toLowerCase();
            
            if (name.includes(query) || elementId.includes(query)) {
                item.style.display = 'flex';
                Animation.fadeIn(item, 200);
            } else {
                Animation.fadeOut(item, 200);
            }
        });
    }
    
    getTotalItems() {
        return Object.values(this.game.state.elements)
            .reduce((sum, el) => sum + (el.count || 0), 0);
    }
    
    getDiscoveredCount() {
        return Object.values(this.game.state.elements)
            .filter(el => el.discovered).length;
    }
    
    playSound(type) {
        if (this.game.state.settings.sound) {
        }
    }
    
    // Экспорт инвентаря в текст
    exportToText() {
        const lang = getCurrentLanguage();
        let text = lang === 'ru' ? 'Мой инвентарь:\n\n' : 'My inventory:\n\n';
        
        Object.entries(this.game.state.elements)
            .filter(([id, data]) => data.discovered && data.count > 0)
            .forEach(([id, data]) => {
                const element = getElement(id);
                const name = getElementName(id, lang);
                text += `${element.icon} ${name}: ${data.count}\n`;
            });
        
        return text;
    }
}
