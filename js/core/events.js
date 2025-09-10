export class EventSystem {
    constructor() {
        this.events = {};
        this.debug = false;
    }
    
    // Подписаться на событие
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        
        this.events[event].push(callback);
        
        if (this.debug) {
            console.log(`[EventSystem] Subscribed to: ${event}`);
        }
        
        // Возвращаем функцию отписки
        return () => this.off(event, callback);
    }
    
    // Отписаться от события
    off(event, callback) {
        if (!this.events[event]) return;
        
        this.events[event] = this.events[event].filter(cb => cb !== callback);
        
        if (this.debug) {
            console.log(`[EventSystem] Unsubscribed from: ${event}`);
        }
    }
    
    // Одноразовая подписка
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        
        return this.on(event, wrapper);
    }
    
    // Инициировать событие
    emit(event, data = null) {
        if (!this.events[event]) return;
        
        if (this.debug) {
            console.log(`[EventSystem] Emitting: ${event}`, data);
        }
        
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[EventSystem] Error in callback for ${event}:`, error);
            }
        });
    }
    
    // Удалить все обработчики события
    removeAllListeners(event = null) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
        
        if (this.debug) {
            console.log(`[EventSystem] Removed listeners for: ${event || 'all events'}`);
        }
    }
    
    // Получить количество обработчиков
    listenerCount(event) {
        return this.events[event] ? this.events[event].length : 0;
    }
    
    // Получить список всех событий
    eventNames() {
        return Object.keys(this.events);
    }
}

// Глобальная система событий для игры
export const gameEvents = new EventSystem();

// Предопределенные события игры
export const GAME_EVENTS = {
    // Игровые события
    GAME_INIT: 'game:init',
    GAME_START: 'game:start',
    GAME_PAUSE: 'game:pause',
    GAME_RESUME: 'game:resume',
    GAME_SAVE: 'game:save',
    GAME_LOAD: 'game:load',
    GAME_RESET: 'game:reset',
    
    // События игрока
    PLAYER_LEVEL_UP: 'player:levelUp',
    PLAYER_EXP_GAIN: 'player:expGain',
    PLAYER_COINS_CHANGE: 'player:coinsChange',
    PLAYER_NAME_SET: 'player:nameSet',
    
    // События элементов
    ELEMENT_DISCOVERED: 'element:discovered',
    ELEMENT_CRAFTED: 'element:crafted',
    ELEMENT_BOUGHT: 'element:bought',
    ELEMENT_USED: 'element:used',
    
    // События Dobby
    DOBBY_MOOD_CHANGE: 'dobby:moodChange',
    DOBBY_LOYALTY_CHANGE: 'dobby:loyaltyChange',
    DOBBY_TRUST_CHANGE: 'dobby:trustChange',
    DOBBY_MESSAGE: 'dobby:message',
    DOBBY_REQUEST_COMPLETE: 'dobby:requestComplete',
    DOBBY_TREAT_GIVEN: 'dobby:treatGiven',
    
    // События UI
    UI_TAB_CHANGE: 'ui:tabChange',
    UI_MODAL_OPEN: 'ui:modalOpen',
    UI_MODAL_CLOSE: 'ui:modalClose',
    UI_NOTIFICATION: 'ui:notification',
    UI_LANGUAGE_CHANGE: 'ui:languageChange',
    UI_THEME_CHANGE: 'ui:themeChange',
    
    // События крафтинга
    CRAFT_START: 'craft:start',
    CRAFT_SUCCESS: 'craft:success',
    CRAFT_FAIL: 'craft:fail',
    CRAFT_SLOT_ADD: 'craft:slotAdd',
    CRAFT_SLOT_REMOVE: 'craft:slotRemove',
    
    // События магазина
    SHOP_OPEN: 'shop:open',
    SHOP_PURCHASE: 'shop:purchase',
    SHOP_REFRESH: 'shop:refresh',
    
    // События достижений
    ACHIEVEMENT_UNLOCK: 'achievement:unlock',
    ACHIEVEMENT_PROGRESS: 'achievement:progress',
    
    // Системные события
    SYSTEM_ERROR: 'system:error',
    SYSTEM_WARNING: 'system:warning',
    SYSTEM_INFO: 'system:info'
};

// Вспомогательные функции для работы с событиями
export const EventHelpers = {
    // Создать событие с данными
    createEvent(type, detail) {
        return {
            type,
            detail,
            timestamp: Date.now()
        };
    },
    
    // Логирование событий
    logEvent(event, data) {
        console.log(`[Event] ${event}`, data);
    },
    
    // Дебаунс для событий
    debounceEvent(callback, delay = 300) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => callback.apply(this, args), delay);
        };
    },
    
    // Throttle для событий
    throttleEvent(callback, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                callback.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};
