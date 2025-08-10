import { t } from '../data/translations.js';
import { DOM, Animation } from '../utils/helpers.js';
import { getElement, getElementName } from '../data/elements.js';
import { getCurrentLanguage } from '../data/translations.js';
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
                const element = getElement(this.slots[i]);
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

        // Hint area
        let hint = this.container.querySelector('#craftingHint');
        if (!hint) {
            hint = DOM.create('div', 'crafting-hint');
            hint.id = 'craftingHint';
            this.container.appendChild(hint);
        }
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
            // Возвращаем элемент в инвентарь при ручной очистке слота
            const elementId = this.slots[index];
            if (this.game.state.elements[elementId]) {
                this.game.state.elements[elementId].count++;
            }
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

        // Не проверяем склад, так как при выборе из инвентаря уже списали 1 шт.
        
        // Анимация крафта
        this.craftButton.disabled = true;
        this.craftButton.innerHTML = '<div class="loading"></div>';
        
        // Попытка крафта
        const success = this.game.craft(ingredients);
        
        if (success) {
            // Ингредиенты уже списаны при помещении в слоты. Просто очищаем слоты
            this.slots = [null, null, null, null];
            Animation.Effects.createParticles(
                this.container.offsetLeft + this.container.offsetWidth / 2,
                this.container.offsetTop + this.container.offsetHeight / 2,
                15,
                '#FFD700'
            );
            this.game.updateUI();
            const hint = this.container.querySelector('#craftingHint');
            if (hint) hint.textContent = t('crafting.success') || 'Успех!';
        } else {
            // На провал: возвращаем ингредиенты в инвентарь и очищаем слоты
            ingredients.forEach(ing => {
                if (this.game.state.elements[ing]) {
                    this.game.state.elements[ing].count++;
                }
            });
            this.slots = [null, null, null, null];
            this.game.updateUI();
            const names = ingredients.map(id => this.getElementName(id)).join(' + ');
            const hint = this.container.querySelector('#craftingHint');
            if (hint) hint.textContent = `Нет рецепта: ${names}`;
        }
        
        // Восстанавливаем кнопку
        setTimeout(() => {
            this.craftButton.innerHTML = t('crafting.mix_button');
            this.craftButton.disabled = false;
            this.render();
            this.game.updateUI();
        }, 1000);
    }
    
    getElementName(elementId) {
        return getElementName(elementId, getCurrentLanguage());
    }
}