// js/data/translations.js
export const TRANSLATIONS = {
    ru: {
        game: {
            title: '🐕 Dobby\'s Absurd Alchemy',
            subtitle: 'Создавай невозможное с помощью безумного AI-алхимика!',
            powered_by: 'На базе Sentient AI: dobby-unhinged-llama-3-3-70b'
        },
        
        stats: {
            level: '🎭 Уровень',
            exp: '⭐ Опыт',
            coins: '🪙 Монеты',
            elements: '🔮 Элементы',
            meat: '🍖 Мясо',
            bones: '🦴 Кости'
        },
        
        tabs: {
            game: '🎮 Игра',
            shop: '🏪 Dobby Shop',
            tree: '🌳 Древо элементов',
            leaderboard: '🏆 Лидерборд',
            settings: '⚙️ Настройки'
        },
        
        panels: {
            inventory: '📦 Инвентарь',
            dobby: '🐕 Dobby AI Assistant',
            crafting: '🔨 Мастерская абсурда',
            shop_title: '🏪 Dobby Shop - Магазин безумия',
            your_coins: 'Твои монеты:'
        },
        
        dobby: {
            loyalty: 'Лояльность',
            trust: 'Доверие',
            chat_placeholder: 'Поговори с Dobby... (Enter для отправки)',
            chat_button: '💬 Сказать Dobby',
            give_meat: '🍖 Дать мясо',
            give_bone: '🦴 Дать кость',
            thinking: 'Dobby думает...',
            sniffing: 'Dobby обнюхивает твои слова...',
            complete_request: 'Выполнить',
            
            greetings: {
                new_player: 'Гав! Привет, {name}! Я Dobby - самый безумный алхимик-пёс во вселенной! 🐕\n\nЯ знаю рецепты таких вещей, от которых у обычных алхимиков голова кругом пойдёт! Но сначала мне нужно узнать, можно ли тебе доверять...',
                returning: 'Гав! {name}, ты вернулся! Я скучал! 🐕',
                first_time: 'Гав! Я Dobby! 🐕 Я знаю все секреты алхимии... но сначала давай познакомимся!'
            },
            
            moods: {
                happy: 'Dobby счастлив! *виляет хвостом*',
                neutral: 'Гав... что тебе нужно?',
                angry: 'Грррр... Dobby не доволен!',
                loving: 'Ты мой лучший друг! 🥰'
            },
            
            requests: [
                'Принеси мне 2 Огня, и я расскажу секрет Пара!',
                'Мне нужны 3 Воды для купания! Дашь - расскажу про Лёд!',
                'Хочу Смех! Принеси, и узнаешь про Золото!',
                'Дай мне Яйцо, расскажу про драконов!'
            ]
        },
        
        crafting: {
            mix_button: '✨ Смешать безумие ✨',
            min_elements: 'Нужно минимум 2 элемента!',
            recipe_not_found: '❌ Рецепт не найден! Спроси у Dobby!',
            success: '✨ Создано: {element}! ✨',
            failed: 'Эта комбинация не работает... Может Dobby знает секрет?'
        },
        
        shop: {
            buy_button: 'Купить',
            not_enough_coins: 'Недостаточно монет!',
            purchased: 'Куплено: {item}!'
        },
        
        modals: {
            welcome: {
                title: '🐕 Добро пожаловать!',
                subtitle: 'Как тебя зовут, юный алхимик?',
                name_placeholder: 'Введи своё имя',
                start_button: 'Начать приключение!'
            },
            
            unlock: {
                title: '🎉 Новый элемент открыт!',
                button: 'Отлично!'
            },
            
            settings: {
                title: '⚙️ Настройки',
                api_key: 'API ключ Fireworks AI',
                save_button: 'Сохранить',
                reset_button: 'Сбросить прогресс'
            }
        },
        
        leaderboard: {
            title: '🏆 Лидерборд',
            titles: {
                1: 'Начинающий Алхимик',
                5: 'Друг Dobby',
                10: 'Безумный Учёный',
                15: 'Укротитель Стихий',
                20: 'Мастер Хаоса',
                25: 'Повелитель Абсурда'
            }
        },
        
        messages: {
            daily_bonus: '🎁 Ежедневный бонус: +50 🪙 +2 🍖 +3 🦴',
            level_up: '🎉 Уровень {level}! +{meat} 🍖 +{bones} 🦴 +{coins} 🪙',
            trust_gained: '+{amount} доверия! Dobby рад!',
            loyalty_gained: '+{amount} лояльности!',
            api_key_required: 'Введите ваш API ключ для Fireworks AI:',
            api_error: 'Гав! *Dobby чихнул* Что-то пошло не так... Проверь API ключ!'
        },
        
        settings: {
            language: 'Язык',
            theme: 'Тема',
            themes: {
                light: 'Светлая',
                dark: 'Тёмная',
                auto: 'Авто'
            },
            autosave: 'Автосохранение',
            notifications: 'Уведомления',
            export: 'Экспорт сохранения',
            import: 'Импорт сохранения',
            reset: 'Сбросить игру',
            importSuccess: 'Сохранение успешно импортировано!',
            importError: 'Ошибка при импорте сохранения',
            resetConfirm: 'Вы уверены? Весь прогресс будет потерян!',
            resetSuccess: 'Игра сброшена'
        },
        
        production: {
            count: 'Количество',
            rate: 'Скорость'
        },
        
        currency: {
            coins: 'монеты'
        },
        
        items: {},
        buildings: {},
        resources: {}
    },
    
    en: {
        game: {
            title: '🐕 Dobby\'s Absurd Alchemy',
            subtitle: 'Create the impossible with a crazy AI alchemist!',
            powered_by: 'Powered by Sentient AI: dobby-unhinged-llama-3-3-70b'
        },
        
        stats: {
            level: '🎭 Level',
            exp: '⭐ Experience',
            coins: '🪙 Coins',
            elements: '🔮 Elements',
            meat: '🍖 Meat',
            bones: '🦴 Bones'
        },
        
        tabs: {
            game: '🎮 Game',
            shop: '🏪 Dobby Shop',
            tree: '🌳 Element Tree',
            leaderboard: '🏆 Leaderboard',
            settings: '⚙️ Settings'
        },
        
        panels: {
            inventory: '📦 Inventory',
            dobby: '🐕 Dobby AI Assistant',
            crafting: '🔨 Absurdity Workshop',
            shop_title: '🏪 Dobby Shop - Madness Store',
            your_coins: 'Your coins:'
        },
        
        dobby: {
            loyalty: 'Loyalty',
            trust: 'Trust',
            chat_placeholder: 'Talk to Dobby... (Enter to send)',
            chat_button: '💬 Tell Dobby',
            give_meat: '🍖 Give meat',
            give_bone: '🦴 Give bone',
            thinking: 'Dobby is thinking...',
            sniffing: 'Dobby is sniffing your words...',
            complete_request: 'Complete',
            
            greetings: {
                new_player: 'Woof! Hello, {name}! I\'m Dobby - the craziest alchemist dog in the universe! 🐕\n\nI know recipes for things that would make ordinary alchemists dizzy! But first I need to know if I can trust you...',
                returning: 'Woof! {name}, you\'re back! I missed you! 🐕',
                first_time: 'Woof! I\'m Dobby! 🐕 I know all the secrets of alchemy... but let\'s get acquainted first!'
            },
            
            moods: {
                happy: 'Dobby is happy! *wags tail*',
                neutral: 'Woof... what do you need?',
                angry: 'Grrrr... Dobby is not pleased!',
                loving: 'You\'re my best friend! 🥰'
            },
            
            requests: [
                'Bring me 2 Fire, and I\'ll tell you the secret of Steam!',
                'I need 3 Water for bathing! Give them and I\'ll tell you about Ice!',
                'I want Laughter! Bring it, and you\'ll learn about Gold!',
                'Give me an Egg, I\'ll tell you about dragons!'
            ]
        },
        
        crafting: {
            mix_button: '✨ Mix the Madness ✨',
            min_elements: 'Need at least 2 elements!',
            recipe_not_found: '❌ Recipe not found! Ask Dobby!',
            success: '✨ Created: {element}! ✨',
            failed: 'This combination doesn\'t work... Maybe Dobby knows the secret?'
        },
        
        shop: {
            buy_button: 'Buy',
            not_enough_coins: 'Not enough coins!',
            purchased: 'Purchased: {item}!'
        },
        
        modals: {
            welcome: {
                title: '🐕 Welcome!',
                subtitle: 'What\'s your name, young alchemist?',
                name_placeholder: 'Enter your name',
                start_button: 'Start adventure!'
            },
            
            unlock: {
                title: '🎉 New element unlocked!',
                button: 'Great!'
            },
            
            settings: {
                title: '⚙️ Settings',
                api_key: 'Fireworks AI API Key',
                save_button: 'Save',
                reset_button: 'Reset progress'
            }
        },
        
        leaderboard: {
            title: '🏆 Leaderboard',
            titles: {
                1: 'Beginner Alchemist',
                5: 'Dobby\'s Friend',
                10: 'Mad Scientist',
                15: 'Element Tamer',
                20: 'Chaos Master',
                25: 'Lord of Absurdity'
            }
        },
        
        messages: {
            daily_bonus: '🎁 Daily bonus: +50 🪙 +2 🍖 +3 🦴',
            level_up: '🎉 Level {level}! +{meat} 🍖 +{bones} 🦴 +{coins} 🪙',
            trust_gained: '+{amount} trust! Dobby is happy!',
            loyalty_gained: '+{amount} loyalty!',
            api_key_required: 'Enter your Fireworks AI API key:',
            api_error: 'Woof! *Dobby sneezed* Something went wrong... Check the API key!'
        },
        
        settings: {
            language: 'Language',
            theme: 'Theme',
            themes: {
                light: 'Light',
                dark: 'Dark',
                auto: 'Auto'
            },
            autosave: 'Autosave',
            notifications: 'Notifications',
            export: 'Export save',
            import: 'Import save',
            reset: 'Reset game',
            importSuccess: 'Save successfully imported!',
            importError: 'Error importing save',
            resetConfirm: 'Are you sure? All progress will be lost!',
            resetSuccess: 'Game reset'
        },
        
        production: {
            count: 'Count',
            rate: 'Rate'
        },
        
        currency: {
            coins: 'coins'
        },
        
        items: {},
        buildings: {},
        resources: {}
    }
};

// Текущий язык
let currentLanguage = localStorage.getItem('gameLanguage') || 'ru';

// Получить перевод
export function t(key, params = {}) {
    const keys = key.split('.');
    let value = TRANSLATIONS[currentLanguage];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            // Fallback to Russian
            value = TRANSLATIONS.ru;
            for (const k2 of keys) {
                if (value && value[k2]) {
                    value = value[k2];
                } else {
                    return key; // Return key if translation not found
                }
            }
            break;
        }
    }
    
    // Replace parameters
    if (typeof value === 'string') {
        Object.entries(params).forEach(([param, val]) => {
            value = value.replace(`{${param}}`, val);
        });
    }
    
    return value;
}

// Установить язык
export function setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
        currentLanguage = lang;
        localStorage.setItem('gameLanguage', lang);
        updatePageTranslations();
    }
}

// Получить текущий язык
export function getCurrentLanguage() {
    return currentLanguage;
}

// Обновить все переводы на странице
export function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
}

// Инициализация переводов
export async function initTranslations() {
    // Загружаем сохраненный язык
    const savedLang = localStorage.getItem('gameLanguage');
    if (savedLang && TRANSLATIONS[savedLang]) {
        currentLanguage = savedLang;
    }
    
    // Обновляем переводы на странице
    updatePageTranslations();
    
    console.log('Translations initialized with language:', currentLanguage);
    
    return true;
}