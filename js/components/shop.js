import { t, getCurrentLanguage } from '../data/translations.js';
import { DOM, Numbers } from '../utils/helpers.js';
import { getElement, getElementName } from '../data/elements.js';

export class Shop {
    constructor(game) {
        this.game = game;
        this.container = null;
        this.shopItems = [];
        this.refreshInterval = null;
        this.tooltip = null;
    }
    
    async init() {
        this.container = DOM.get('shop');
        if (!this.container) return;
        
        this.generateShopItems();
        this.render();
        this.setupAutoRefresh();
    }
    
    generateShopItems() {
        this.shopItems = [];
        const level = this.game.state.level;
        // Всегда доступны (простые)
        const always = [
            { id: 'fire', price: 5 },
            { id: 'water', price: 5 },
            { id: 'earth', price: 5 },
            { id: 'air', price: 5 },
            { id: 'stone', price: 8 },
            { id: 'book', price: 12 },
            { id: 'meat', price: 10 },
            { id: 'bone', price: 7 }
        ];
        always.forEach(({id, price}) => this.shopItems.push({ id, icon: this.getElementIcon(id), price }));

        // Продвинутые (уровень 10+)
        // остальные категории убраны по новой экономике

        // Редкие (уровень 20+)
        // rare removed

        // Пакеты стартовых элементов
        this.shopItems.push({ id: 'starter_pack_small', icon: '🎁', price: 25, bundle: { fire:1, water:1, earth:1, air:1 } });
        this.shopItems.push({ id: 'starter_pack_big', icon: '🎁', price: 60, bundle: { fire:2, water:2, earth:2, air:2, egg:1, book:1 } });
    }
    
    getAvailableElements() {
        // Элементы доступные по уровню
        const level = this.game.state.level;
        let available = ['steam', 'ice', 'mud', 'lava', 'cloud', 'lightning'];
        
        if (level >= 5) available.push('metal', 'wood', 'stone', 'glass');
        if (level >= 10) available.push('plant', 'tree', 'fish', 'bird');
        if (level >= 15) available.push('human', 'cat', 'dog', 'sword');
        if (level >= 20) available.push('magic', 'spell', 'potion', 'crystal');
        
        return available;
    }
    
    calculatePrice(elementId) {
        const basePrice = 15;
        const category = this.getElementCategory(elementId);
        
        const multipliers = {
            basic: 1,
            materials: 1.5,
            creatures: 2,
            magic: 3,
            legendary: 5
        };
        
        return Math.floor(basePrice * (multipliers[category] || 1) * Numbers.random(0.8, 1.2));
    }
    
    render() {
        if (!this.container) return;
        
        DOM.clear(this.container);
        
        // Заголовок
        const header = DOM.create('div', 'shop-header');
        header.innerHTML = `
            <h3>${t('panels.shop_title')}</h3>
            <div class="shop-coins">${t('panels.your_coins')} ${this.game.state.coins} 🪙</div>
        `;
        this.container.appendChild(header);
        
        // Сетка товаров
        const grid = DOM.create('div', 'shop-grid');
        
        this.shopItems.forEach(item => {
            const itemEl = this.createShopItem(item);
            grid.appendChild(itemEl);
        });
        
        this.container.appendChild(grid);
        
        // Кнопка обновления
        const refreshButton = DOM.create('button', 'btn btn-primary mt-md');
        refreshButton.innerHTML = '🔄 Обновить товары (Бесплатно)';
        DOM.on(refreshButton, 'click', (e) => { e.stopPropagation(); this.refresh(); });
        this.container.appendChild(refreshButton);
    }
    
    createShopItem(item) {
        const itemEl = DOM.create('div', 'shop-item');
        itemEl.dataset.itemId = item.id;
        
        // Иконка
        const icon = DOM.create('div', 'element-icon');
        icon.innerHTML = item.icon;
        itemEl.appendChild(icon);
        
        // Название
        const name = DOM.create('div', 'element-name');
        name.textContent = this.getItemName(item);
        itemEl.appendChild(name);
        
        // Цена
        const price = DOM.create('div', 'shop-price');
        price.innerHTML = `${item.price} 🪙`;
        itemEl.appendChild(price);
        
        // Кнопка покупки
        const buyButton = DOM.create('button', 'btn btn-success buy-button');
        buyButton.innerHTML = t('shop.buy_button');
        buyButton.disabled = this.game.state.coins < item.price;
        
        DOM.on(buyButton, 'click', (e) => {
            e.stopPropagation();
            this.buyItem(item);
        });
        
        itemEl.appendChild(buyButton);

        // Покупка по клику на карточку товара тоже
        DOM.on(itemEl, 'click', () => this.buyItem(item));

        // Всплывающая подсказка с названием (как в инвентаре)
        const lang = getCurrentLanguage();
        const displayName = this.getItemName(item);
        const element = getElement(item.id);
        const descr = (element && element.description && (element.description[lang] || element.description.en)) || '';
        const tooltipText = `${element?.icon || ''} ${displayName}${descr ? ' — ' + descr : ''}`.trim();
        itemEl.title = tooltipText; // нативный title
        DOM.on(itemEl, 'mouseenter', (e) => this.showTooltip(tooltipText, e));
        DOM.on(itemEl, 'mousemove', (e) => this.moveTooltip(e));
        DOM.on(itemEl, 'mouseleave', () => this.hideTooltip());
        
        // Эффекты наведения
        itemEl.classList.add('hover-lift', 'hover-glow');
        
        return itemEl;
    }
    
    buyItem(item) {
        if (this.game.state.coins < item.price) {
            this.game.components.ui.showFloatingText(t('shop.not_enough_coins'), true);
            return;
        }
        
        // Bundle support
        if (item.bundle) {
            if (!this.game.state.canAfford(item.price)) return;
            this.game.state.coins -= item.price;
            Object.entries(item.bundle).forEach(([id, count]) => {
                if (!this.game.state.elements[id]) this.game.state.elements[id] = { count: 0, discovered: false };
                this.game.state.elements[id].count += count;
                if (!this.game.state.elements[id].discovered) this.game.state.elements[id].discovered = true;
            });
            this.game.updateUI();
            this.game.components.ui.showFloatingText('🎁 Пакет куплен!');
            return;
        }

        const success = this.game.buyItem(item.id, item.price);
        
        if (success) {
            // Анимация покупки
            const itemEl = this.container.querySelector(`[data-item-id="${item.id}"]`);
            if (itemEl) {
                itemEl.classList.add('success-pulse');
                setTimeout(() => itemEl.classList.remove('success-pulse'), 500);
            }
            
            // Обновляем отображение
            this.render();
        }
    }

    // --- Tooltip helpers (copy of inventory style) ---
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
    
    refresh() {
        // Полное обновление ассортимента (новый набор товаров)
        this.shopItems = [];
        this.generateShopItems();
        this.render();
        this.game.components.ui.showFloatingText('🔄 Товары обновлены!');
    }
    
    setupAutoRefresh() {
        // Автообновление каждые 30 минут
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, 1800000);
    }
    
    getItemName(item) {
        if (item.special) {
            if (item.id === 'meat') return t('stats.meat');
            if (item.id === 'bone') return t('stats.bones');
        }
        
        return this.getElementName(item.id);
    }
    
    getElementName(elementId) {
        // Базовые переводы элементов
        const names = {
            ru: {
                fire: 'Огонь', water: 'Вода', earth: 'Земля', air: 'Воздух',
                light: 'Свет', darkness: 'Тьма', steam: 'Пар', ice: 'Лёд',
                mud: 'Грязь', lava: 'Лава', cloud: 'Облако', lightning: 'Молния',
                metal: 'Металл', wood: 'Дерево', stone: 'Камень', glass: 'Стекло',
                plant: 'Растение', tree: 'Дерево', fish: 'Рыба', bird: 'Птица',
                human: 'Человек', cat: 'Кот', dog: 'Собака', sword: 'Меч'
            },
            en: {
                fire: 'Fire', water: 'Water', earth: 'Earth', air: 'Air',
                light: 'Light', darkness: 'Darkness', steam: 'Steam', ice: 'Ice',
                mud: 'Mud', lava: 'Lava', cloud: 'Cloud', lightning: 'Lightning',
                metal: 'Metal', wood: 'Wood', stone: 'Stone', glass: 'Glass',
                plant: 'Plant', tree: 'Tree', fish: 'Fish', bird: 'Bird',
                human: 'Human', cat: 'Cat', dog: 'Dog', sword: 'Sword'
            }
        };
        
        const lang = getCurrentLanguage();
        return names[lang]?.[elementId] || elementId;
    }
    
    getElementIcon(elementId) {
        const icons = {
            fire: '🔥', water: '💧', earth: '🌍', air: '💨',
            light: '☀️', darkness: '🌚', steam: '💨', ice: '🧊',
            mud: '🟤', lava: '🌋', cloud: '☁️', lightning: '⚡',
            metal: '🔩', wood: '🪵', stone: '🪨', glass: '🔍',
            plant: '🌱', tree: '🌳', fish: '🐟', bird: '🐦',
            human: '👤', cat: '🐱', dog: '🐶', sword: '⚔️'
        };
        
        return icons[elementId] || '❓';
    }
    
    getElementCategory(elementId) {
        const categories = {
            fire: 'basic', water: 'basic', earth: 'basic', air: 'basic',
            light: 'basic', darkness: 'basic', steam: 'basic', ice: 'basic',
            metal: 'materials', wood: 'materials', stone: 'materials', glass: 'materials',
            plant: 'creatures', tree: 'creatures', fish: 'creatures', bird: 'creatures',
            human: 'creatures', cat: 'creatures', dog: 'creatures',
            sword: 'magic'
        };
        
        return categories[elementId] || 'basic';
    }
    
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}