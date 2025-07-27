// js/core/config.js

export const CONFIG = {
    // Начальные значения
    INITIAL_STATE: {
        level: 1,
        exp: 0,
        expToNext: 100,
        coins: 50,
        meat: 3,
        bones: 5,
        loyalty: 50,
        trust: 0,
        conversationCount: 0,
        dobbyMood: 'neutral'
    },
    
    // Начальные элементы
    STARTING_ELEMENTS: {
        'fire': { count: 2, discovered: true },
        'water': { count: 2, discovered: true },
        'earth': { count: 2, discovered: true },
        'air': { count: 2, discovered: true },
        'light': { count: 1, discovered: true },
        'darkness': { count: 1, discovered: true }
    },
    
    // Игровой баланс
    BALANCE: {
        // Опыт
        EXP_PER_CRAFT: 10,
        EXP_PER_DISCOVERY: 50,
        EXP_MULTIPLIER_PER_LEVEL: 1.5,
        
        // Монеты
        COINS_PER_CRAFT: 5,
        COINS_PER_DISCOVERY: 20,
        COINS_PER_LEVEL: 15,
        
        // Dobby
        LOYALTY_PER_MEAT: 15,
        LOYALTY_PER_BONE: 10,
        TRUST_PER_MEAT: 5,
        TRUST_PER_BONE: 3,
        TRUST_PER_CONVERSATION: 2,
        LOYALTY_DECAY_PER_CRAFT: 1,
        
        // Ежедневный бонус
        DAILY_BONUS: {
            coins: 50,
            meat: 2,
            bones: 3
        }
    },
    
    // API настройки
    API: {
        FIREWORKS_URL: 'https://api.fireworks.ai/inference/v1/chat/completions',
        MODEL: 'accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new',
        MAX_TOKENS: 200,
        TEMPERATURE: 0.9
    },
    
    // UI настройки
    UI: {
        AUTO_SAVE_INTERVAL: 30000, // 30 секунд
        FLOATING_TEXT_DURATION: 1500,
        ANIMATION_DURATION: 300,
        MAX_INVENTORY_HEIGHT: 400,
        CRAFTING_SLOTS: 4,
        SHOP_COLUMNS: 4,
        INVENTORY_COLUMNS: 4
    },
    
    // Dobby настройки
    DOBBY: {
        // Уровни доверия для подсказок
        TRUST_LEVELS: {
            NONE: 0,
            LOW: 30,
            MEDIUM: 60,
            HIGH: 80
        },
        
        // Запросы Dobby
        REQUESTS: [
            {
                text: { 
                    ru: 'Принеси мне 2 Огня, и я расскажу секрет Пара!',
                    en: 'Bring me 2 Fire, and I\'ll tell you the secret of Steam!'
                },
                need: { fire: 2 },
                reward: 'steam_hint'
            },
            {
                text: { 
                    ru: 'Мне нужны 3 Воды для купания! Дашь - расскажу про Лёд!',
                    en: 'I need 3 Water for bathing! Give them and I\'ll tell you about Ice!'
                },
                need: { water: 3 },
                reward: 'ice_hint'
            },
            {
                text: { 
                    ru: 'Хочу Смех! Принеси, и узнаешь про Золото!',
                    en: 'I want Laughter! Bring it, and you\'ll learn about Gold!'
                },
                need: { laugh: 1 },
                reward: 'gold_hint'
            },
            {
                text: { 
                    ru: 'Дай мне Яйцо, расскажу про драконов!',
                    en: 'Give me an Egg, I\'ll tell you about dragons!'
                },
                need: { egg: 1 },
                reward: 'dragon_hint'
            }
        ],
        
        // Награды за выполнение запросов
        REQUEST_REWARDS: {
            trust: 15,
            loyalty: 10
        }
    },
    
    // Достижения
    ACHIEVEMENTS: {
        DISCOVERY_MILESTONES: [10, 25, 50, 75, 100],
        LEVEL_MILESTONES: [5, 10, 20, 30, 50],
        CRAFT_MILESTONES: [50, 100, 250, 500, 1000]
    },
    
    // Лидерборд
    LEADERBOARD: {
        MAX_ENTRIES: 100,
        UPDATE_INTERVAL: 60000, // 1 минута
        
        // Титулы по уровням
        TITLES: {
            1: { ru: 'Начинающий Алхимик', en: 'Beginner Alchemist' },
            5: { ru: 'Друг Dobby', en: 'Dobby\'s Friend' },
            10: { ru: 'Безумный Учёный', en: 'Mad Scientist' },
            15: { ru: 'Укротитель Стихий', en: 'Element Tamer' },
            20: { ru: 'Мастер Хаоса', en: 'Chaos Master' },
            25: { ru: 'Повелитель Абсурда', en: 'Lord of Absurdity' },
            30: { ru: 'Архимаг Безумия', en: 'Archmage of Madness' },
            40: { ru: 'Создатель Миров', en: 'World Creator' },
            50: { ru: 'Божество Алхимии', en: 'Alchemy Deity' }
        }
    },
    
    // Магазин
    SHOP: {
        REFRESH_INTERVAL: 3600000, // 1 час
        
        // Специальные предметы
        SPECIAL_ITEMS: [
            { id: 'meat', price: 10, icon: '🍖' },
            { id: 'bone', price: 7, icon: '🦴' }
        ],
        
        // Множитель цен по редкости
        PRICE_MULTIPLIERS: {
            basic: 1,
            absurd: 2,
            materials: 1.5,
            creatures: 3,
            legendary: 5,
            magic: 4,
            technology: 3.5,
            cosmic: 10
        }
    },
    
    // Система крафта
    CRAFTING: {
        MIN_INGREDIENTS: 2,
        MAX_INGREDIENTS: 4,
        
        // Шанс на бонусный элемент при крафте
        BONUS_CHANCE: 0.1,
        
        // Множитель опыта за сложные рецепты
        COMPLEXITY_MULTIPLIERS: {
            2: 1,    // 2 ингредиента
            3: 1.5,  // 3 ингредиента
            4: 2     // 4 ингредиента
        }
    },
    
    // Настройки сохранения
    STORAGE: {
        PREFIX: 'dobby_alchemy_',
        ENCRYPTION_KEY: 'D0bby_L0v3s_Ch40s!', // Простое шифрование
        
        KEYS: {
            SAVE_DATA: 'save_data',
            SETTINGS: 'settings',
            API_KEY: 'api_key',
            PLAYER_NAME: 'player_name',
            LAST_DAILY_BONUS: 'last_daily_bonus',
            LEADERBOARD: 'leaderboard',
            LANGUAGE: 'language'
        }
    },
    
    // Дебаг режим
    DEBUG: {
        ENABLED: false,
        SHOW_ALL_RECIPES: false,
        UNLIMITED_RESOURCES: false,
        INSTANT_CRAFT: false,
        LOG_API_CALLS: true
    }
};

// Функция для получения настройки
export function getConfig(path) {
    const keys = path.split('.');
    let value = CONFIG;
    
    for (const key of keys) {
        if (value && value[key] !== undefined) {
            value = value[key];
        } else {
            console.warn(`Config key not found: ${path}`);
            return null;
        }
    }
    
    return value;
}

// Функция для изменения настройки (только для дебага)
export function setConfig(path, newValue) {
    if (!CONFIG.DEBUG.ENABLED) {
        console.warn('Debug mode is disabled');
        return;
    }
    
    const keys = path.split('.');
    let obj = CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) {
            obj[keys[i]] = {};
        }
        obj = obj[keys[i]];
    }
    
    obj[keys[keys.length - 1]] = newValue;
    console.log(`Config updated: ${path} = ${newValue}`);
}