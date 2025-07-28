// js/components/shop.js
import { t, getCurrentLanguage } from '../data/translations.js';
import { DOM, Numbers } from '../utils/helpers.js';

export class Shop {
    constructor(game) {
        this.game = game;
        this.container = null;
        this.shopItems = [];
        this.refreshInterval = null;
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
        
        // Специальные предметы (всегда доступны)
        this.shopItems.push(
            { id: 'meat', icon: '🍖', price: 10, special: true },
            { id: 'bone', icon: '🦴', price: 7, special: true }
        );
        
        // Базовые элементы
        const basicElements = ['fire', 'water', 'earth', 'air', 'light', 'darkness'];
        basicElements.forEach(id => {
            this.shopItems.push({
                id,
                icon: this.getElementIcon(id),
                price: Numbers.random(5, 15),
                category: 'basic'
            });
        });
        
        // Случайные элементы по уровню игрока
        const availableElements = this.getAvailableElements();
        const randomElements = Numbers.shuffle(availableElements).slice(0, 8);
        
        randomElements.forEach(id => {
            this.shopItems.push({
                id,
                icon: this.getElementIcon(id),
                price: this.calculatePrice(id),
                category: this.getElementCategory(id)
            });
        });
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
        DOM.on(refreshButton, 'click', () => this.refresh());
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
        
        // Эффекты наведения
        itemEl.classList.add('hover-lift', 'hover-glow');
        
        return itemEl;
    }
    
    buyItem(item) {
        if (this.game.state.coins < item.price) {
            this.game.components.ui.showFloatingText(t('shop.not_enough_coins'), true);
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
    
    refresh() {
        this.generateShopItems();
        this.render();
        
        this.game.components.ui.showFloatingText('🔄 Товары обновлены!');
    }
    
    setupAutoRefresh() {
        // Автообновление каждый час
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, 3600000);
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