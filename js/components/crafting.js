// js/components/crafting.js
import { t } from '../data/translations.js';
import { DOM, Animation } from '../utils/helpers.js';

export class Crafting {
    constructor(game) {
        this.game = game;
        this.container = null;
        this.slots = [null, null, null, null];
        this.craftButton = null;
    }
    
    async init() {
        this.container = DOM.get('crafting');
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        if (!this.container) return;
        
        DOM.clear(this.container);
        
        // Слоты для крафта
        const slotsContainer = DOM.create('div', 'crafting-slots');
        
        for (let i = 0; i < 4; i++) {
            const slot = DOM.create('div', 'craft-slot');
            slot.dataset.slotIndex = i;
            
            if (this.slots[i]) {
                const element = this.game.elements[this.slots[i]];
                if (element) {
                    slot.innerHTML = `
                        <div class="element-icon">${element.icon}</div>
                        <div class="element-name">${this.getElementName(this.slots[i])}</div>
                    `;
                    slot.classList.add('filled');
                }
            } else {
                slot.innerHTML = '<div class="slot-hint">+</div>';
            }
            
            DOM.on(slot, 'click', () => this.clearSlot(i));
            slotsContainer.appendChild(slot);
        }
        
        this.container.appendChild(slotsContainer);
        
        // Кнопка крафта
        this.craftButton = DOM.create('button', 'btn btn-primary craft-button');
        this.craftButton.innerHTML = t('crafting.mix_button');
        this.craftButton.disabled = this.getFilledSlots().length < 2;
        
        DOM.on(this.craftButton, 'click', () => this.craft());
        this.container.appendChild(this.craftButton);
    }
    
    setupEventListeners() {
        // Обработчики уже в render()
    }
    
    addToSlot(elementId) {
        const emptySlot = this.slots.findIndex(slot => slot === null);
        if (emptySlot === -1) return false;
        
        this.slots[emptySlot] = elementId;
        this.render();
        return true;
    }
    
    clearSlot(index) {
        if (this.slots[index]) {
            // Возвращаем элемент в инвентарь
            const elementId = this.slots[index];
            this.game.state.addElement(elementId, 1);
            
            this.slots[index] = null;
            this.render();
            this.game.updateUI();
        }
    }
    
    getFilledSlots() {
        return this.slots.filter(slot => slot !== null);
    }
    
    async craft() {
        const ingredients = this.getFilledSlots();
        
        if (ingredients.length < 2) {
            this.game.components.ui.showFloatingText(t('crafting.min_elements'), true);
            return;
        }
        
        // Анимация крафта
        this.craftButton.disabled = true;
        this.craftButton.innerHTML = '<div class="loading"></div>';
        
        // Попытка крафта
        const success = this.game.craft(ingredients);
        
        if (success) {
            // Очищаем слоты
            this.slots = [null, null, null, null];
            
            // Эффект успеха
            Animation.Effects.createParticles(
                this.container.offsetLeft + this.container.offsetWidth / 2,
                this.container.offsetTop + this.container.offsetHeight / 2,
                15,
                '#FFD700'
            );
        }
        
        // Восстанавливаем кнопку
        setTimeout(() => {
            this.craftButton.innerHTML = t('crafting.mix_button');
            this.craftButton.disabled = false;
            this.render();
        }, 1000);
    }
    
    getElementName(elementId) {
        return this.game.getElementName ? this.game.getElementName(elementId) : elementId;
    }
}