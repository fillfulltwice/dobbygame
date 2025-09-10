import { t, getCurrentLanguage } from '../data/translations.js';
import { DOM, Animation } from '../utils/helpers.js';
import { FireworksAPI } from '../utils/api.js';
import { getRecipeHint } from '../data/recipes.js';

export class Dobby {
    constructor(game) {
        this.game = game;
        this.container = null;
        this.chatInput = null;
        this.chatResponse = null;
        this.avatar = null;
        this.api = new FireworksAPI();
        this.isThinking = false;
    }
    
    async init() {
        this.container = DOM.get('dobby');
        if (!this.container) return;
        
        this.render();
        this.showGreeting();
    }
    
    render() {
        if (!this.container) return; // 🛡️ Защита от вызова до инициализации
        
        DOM.clear(this.container);    
        
        // Аватар Dobby
        this.avatar = DOM.create('div', 'dobby-avatar');
        this.avatar.innerHTML = '<img src="assets/dobby-wizard.png" alt="Dobby" class="dobby-avatar-img"/>';
        this.container.appendChild(this.avatar);
        
        // Индикатор настроения
        const mood = DOM.create('div', 'dobby-mood');
        mood.innerHTML = this.getMoodIcon();
        this.container.appendChild(mood);
        
        // Полосы лояльности и доверия (kept minimal)
        this.renderBars();
        
        // Чат
        this.renderChat();
        
        // Кнопки лакомств
        this.renderTreatButtons();
        
        // Упрощение: опционально показывать текущий запрос
        this.renderCurrentRequest();
    }
    
    setupEventListeners() {

    }

    renderBars() {
        const barsContainer = DOM.create('div', 'dobby-bars');
        
        // Лояльность
        const loyaltyBar = DOM.create('div', 'loyalty-bar');
        loyaltyBar.innerHTML = `
            <div class="bar-label">${t('dobby.loyalty')}: ${this.game.state.loyalty}%</div>
            <div class="bar-bg">
                <div class="bar-fill" style="width: ${this.game.state.loyalty}%"></div>
            </div>
        `;
        
        // Доверие
        const trustBar = DOM.create('div', 'trust-bar');
        trustBar.innerHTML = `
            <div class="bar-label">${t('dobby.trust')}: ${this.game.state.trust}%</div>
            <div class="bar-bg">
                <div class="bar-fill" style="width: ${this.game.state.trust}%"></div>
            </div>
        `;
        
        barsContainer.appendChild(loyaltyBar);
        barsContainer.appendChild(trustBar);
        this.container.appendChild(barsContainer);
    }
    
    renderChat() {
        const chatContainer = DOM.create('div', 'chat-container');

        // API key banner if missing
        if (!this.api.hasApiKey()) {
            const apiBanner = DOM.create('div', 'api-key-banner');
            apiBanner.innerHTML = `
                <div class="api-key-title">🔑 ${t('messages.api_key_required') || 'Требуется API ключ Fireworks'}</div>
                <div class="api-key-row">
                    <input type="password" id="apiKeyInput" class="api-key-input" placeholder="Fireworks API Key">
                    <button class="btn btn-primary api-key-save">${t('common.save') || 'Сохранить'}</button>
                </div>
                <div class="api-key-hint">${t('messages.api_key_hint') || 'Ключ хранится локально в браузере. Можно пропустить, я буду давать локальные подсказки.'}</div>
            `;
            const saveBtn = apiBanner.querySelector('.api-key-save');
            const keyInput = apiBanner.querySelector('#apiKeyInput');
            if (saveBtn && keyInput) {
                DOM.on(saveBtn, 'click', () => {
                    const key = keyInput.value.trim();
                    if (key) {
                        this.api.setApiKey(key);
                        apiBanner.remove();
                        this.showMessage(t('messages.api_key_saved') || 'API ключ сохранён!');
                    }
                });
                DOM.on(keyInput, 'keypress', (e) => {
                    if (e.key === 'Enter') saveBtn.click();
                });
            }
            chatContainer.appendChild(apiBanner);
        }
        
        // Поле ввода
        this.chatInput = DOM.create('input', 'chat-input');
        this.chatInput.type = 'text';
        this.chatInput.placeholder = t('dobby.chat_placeholder');
        
        // Кнопка отправки
        const chatButton = DOM.create('button', 'btn btn-primary chat-button');
        chatButton.innerHTML = t('dobby.chat_button');
        DOM.on(chatButton, 'click', () => this.sendMessage());
        
        // Область ответа
        this.chatResponse = DOM.create('div', 'chat-response');
        this.chatResponse.innerHTML = t('dobby.greetings.first_time');
        
        chatContainer.appendChild(this.chatInput);
        chatContainer.appendChild(chatButton);
        chatContainer.appendChild(this.chatResponse);
        this.container.appendChild(chatContainer);
        
        // Enter для отправки
        DOM.on(this.chatInput, 'keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }
    
    renderTreatButtons() {
        const treatContainer = DOM.create('div', 'treat-buttons flex gap-sm mt-md');
        
        const meatButton = DOM.create('button', 'btn btn-success');
        meatButton.innerHTML = `${t('dobby.give_meat')} (${this.game.state.meat})`;
        meatButton.disabled = this.game.state.meat <= 0;
        DOM.on(meatButton, 'click', () => this.game.giveTreat('meat'));
        
        const boneButton = DOM.create('button', 'btn btn-success');
        boneButton.innerHTML = `${t('dobby.give_bone')} (${this.game.state.bones})`;
        boneButton.disabled = this.game.state.bones <= 0;
        DOM.on(boneButton, 'click', () => this.game.giveTreat('bone'));
        
        treatContainer.appendChild(meatButton);
        treatContainer.appendChild(boneButton);
        this.container.appendChild(treatContainer);
    }
    
    renderCurrentRequest() {
        if (!this.game.state.currentRequest) return;
        
        const requestContainer = DOM.create('div', 'dobby-request mt-md');
        const request = this.game.state.currentRequest;
        
        requestContainer.innerHTML = `
            <div class="request-text">${request.text[getCurrentLanguage()]}</div>
            <button class="btn btn-primary dobby-request-button">${t('dobby.complete_request')}</button>
        `;
        
        const button = requestContainer.querySelector('.dobby-request-button');
        DOM.on(button, 'click', () => this.completeRequest());
        
        this.container.appendChild(requestContainer);
    }
    
    async sendMessage() {
        if (this.isThinking || !this.chatInput.value.trim()) return;
        
        const message = this.chatInput.value.trim();
        this.chatInput.value = '';
        
        const haveApi = this.api.hasApiKey();
        
        this.isThinking = true;
        this.chatResponse.innerHTML = t('dobby.thinking');
        this.avatar.classList.add('thinking');
        
        try {
            const context = {
                playerName: this.game.state.playerName,
                loyalty: this.game.state.loyalty,
                trust: this.game.state.trust,
                conversationCount: this.game.state.conversationCount,
                mood: this.game.state.dobbyMood,
                currentLanguage: getCurrentLanguage(),
                allRecipes: this.getAllRecipesString()
            };

            let responseText = '';
            if (haveApi) {
                responseText = await this.api.askDobby(message, context);
            } else {
                responseText = this.generateLocalResponse(message, context);
            }

            // Обновляем статистику
            this.game.state.conversationCount++;
            this.game.state.trust = Math.min(100, this.game.state.trust + 2);

            this.showMessage(responseText);
            this.updateMood();
        } catch (error) {
            console.error('Dobby API error:', error);
            this.showMessage(t('messages.api_error'));
        }
        
        this.isThinking = false;
        this.avatar.classList.remove('thinking');
        this.game.updateUI();
    }

    generateLocalResponse(message, context) {
        const lang = context.currentLanguage;
        const lower = message.toLowerCase();
        // Try to hint a recipe if user mentions an element name
        const maybeElement = lower.match(/[a-z_]+|[а-яё_]+/i)?.[0];
        if (maybeElement) {
            const hint = getRecipeHint(maybeElement, context.trust);
            if (hint) {
                return lang === 'ru'
                    ? `Гав-гав! Без ключа API я шёпну загадку: ${hint.ru}`
                    : `Woof! No API key, but here's a riddle: ${hint.en}`;
            }
        }
        return lang === 'ru'
            ? 'Гав! Дай мне 🍖 или спроси о рецептах. (Совет: можно ввести API ключ позже, я всё равно буду подсказывать!)'
            : 'Woof! Give me a 🍖 or ask about recipes. (Tip: you can add an API key later, I will still hint!)';
    }
    
    showMessage(message) {
        this.chatResponse.innerHTML = message;
        Animation.fadeIn(this.chatResponse, 300);
    }
    
    showGreeting() {
        if (this.game.state.playerName) {
            if (this.game.state.conversationCount === 0) {
                this.showMessage(t('dobby.greetings.new_player', { name: this.game.state.playerName }));
            } else {
                this.showMessage(t('dobby.greetings.returning', { name: this.game.state.playerName }));
            }
        } else {
            this.showMessage(t('dobby.greetings.first_time'));
        }
    }
    
    updateMood() {
        const combined = (this.game.state.loyalty + this.game.state.trust) / 2;
        
        if (combined >= 80) {
            this.game.state.dobbyMood = 'loving';
        } else if (combined >= 60) {
            this.game.state.dobbyMood = 'happy';
        } else if (combined <= 20) {
            this.game.state.dobbyMood = 'angry';
        } else {
            this.game.state.dobbyMood = 'neutral';
        }
        
        // 🛡️ ПРОВЕРЯЕМ что контейнер инициализирован
        if (!this.container) return;
        
        const mood = this.container.querySelector('.dobby-mood');
        if (mood) {
            mood.innerHTML = this.getMoodIcon();
            mood.className = `dobby-mood ${this.game.state.dobbyMood}`;
        }
        
        if (this.avatar) {
            this.avatar.className = `dobby-avatar ${this.game.state.dobbyMood}`;
        }
    }
    
    getMoodIcon() {
        switch (this.game.state.dobbyMood) {
            case 'happy': return '😊';
            case 'loving': return '🥰';
            case 'angry': return '😠';
            default: return '😐';
        }
    }
    
    completeRequest() {
        const request = this.game.state.currentRequest;
        if (!request) return;
        
        // Проверяем наличие нужных элементов
        let canComplete = true;
        Object.entries(request.need).forEach(([elementId, count]) => {
            if (!this.game.state.hasElement(elementId, count)) {
                canComplete = false;
            }
        });
        
        if (!canComplete) {
            this.game.components.ui.showFloatingText('У тебя нет нужных элементов!', true);
            return;
        }
        
        // Забираем элементы
        Object.entries(request.need).forEach(([elementId, count]) => {
            this.game.state.removeElement(elementId, count);
        });
        
        // Даём награду
        this.game.state.trust += 15;
        this.game.state.loyalty += 10;
        
        // Показываем подсказку
        this.showHint(request.reward);
        
        // Убираем запрос
        this.game.state.currentRequest = null;
        this.game.state.completedRequests.push(request.reward);
        
        this.game.updateUI();
    }
    
    showHint(hintType) {
        const hints = {
            steam_hint: 'Огонь + Вода = Пар! Горячая вода превращается в пар!',
            ice_hint: 'Вода + Холод = Лёд! Или попробуй Воду + Воздух!',
            gold_hint: 'Солнце + Камень = Золото! Солнечный свет превращает камни в золото!',
            dragon_hint: 'Огонь + Яйцо = Дракон! Огненное яйцо рождает дракона!'
        };
        
        const hint = hints[hintType] || 'Dobby забыл, что хотел сказать...';
        this.showMessage(`🎁 Секрет от Dobby: ${hint}`);
    }
    
    getAllRecipesString() {
        return `
        fire + water = steam
        water + air = ice
        earth + water = mud
        fire + earth = lava
        air + water = cloud
        fire + air = lightning
        `;
    }
}
