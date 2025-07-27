// js/data/elements.js
export const ELEMENTS = {
    // Базовые элементы (даются в начале)
    basic: {
        'fire': { 
            icon: '🔥', 
            name: { ru: 'Огонь', en: 'Fire' }, 
            price: 5,
            category: 'basic',
            description: { ru: 'Первичная стихия', en: 'Primary element' }
        },
        'water': { 
            icon: '💧', 
            name: { ru: 'Вода', en: 'Water' }, 
            price: 5,
            category: 'basic',
            description: { ru: 'Первичная стихия', en: 'Primary element' }
        },
        'earth': { 
            icon: '🌍', 
            name: { ru: 'Земля', en: 'Earth' }, 
            price: 5,
            category: 'basic',
            description: { ru: 'Первичная стихия', en: 'Primary element' }
        },
        'air': { 
            icon: '💨', 
            name: { ru: 'Воздух', en: 'Air' }, 
            price: 5,
            category: 'basic',
            description: { ru: 'Первичная стихия', en: 'Primary element' }
        },
        'light': { 
            icon: '🌟', 
            name: { ru: 'Свет', en: 'Light' }, 
            price: 8,
            category: 'basic',
            description: { ru: 'Чистая энергия', en: 'Pure energy' }
        },
        'darkness': { 
            icon: '🌑', 
            name: { ru: 'Тьма', en: 'Darkness' }, 
            price: 8,
            category: 'basic',
            description: { ru: 'Отсутствие света', en: 'Absence of light' }
        }
    },

    // Абсурдные ингредиенты
    absurd: {
        'egg': { 
            icon: '🥚', 
            name: { ru: 'Яйцо', en: 'Egg' }, 
            price: 10,
            category: 'absurd'
        },
        'laugh': { 
            icon: '😂', 
            name: { ru: 'Смех', en: 'Laughter' }, 
            price: 15,
            category: 'absurd'
        },
        'dream': { 
            icon: '💭', 
            name: { ru: 'Мечта', en: 'Dream' }, 
            price: 20,
            category: 'absurd'
        },
        'legend': { 
            icon: '📖', 
            name: { ru: 'Легенда', en: 'Legend' }, 
            price: 25,
            category: 'absurd'
        },
        'song': { 
            icon: '🎵', 
            name: { ru: 'Песня', en: 'Song' }, 
            price: 15,
            category: 'absurd'
        },
        'dance': { 
            icon: '💃', 
            name: { ru: 'Танец', en: 'Dance' }, 
            price: 15,
            category: 'absurd'
        },
        'rainbow': { 
            icon: '🌈', 
            name: { ru: 'Радуга', en: 'Rainbow' }, 
            price: 30,
            category: 'absurd'
        },
        'time': { 
            icon: '⏰', 
            name: { ru: 'Время', en: 'Time' }, 
            price: 40,
            category: 'absurd'
        },
        'wisdom': { 
            icon: '🧠', 
            name: { ru: 'Мудрость', en: 'Wisdom' }, 
            price: 35,
            category: 'absurd'
        },
        'horse': { 
            icon: '🐴', 
            name: { ru: 'Лошадь', en: 'Horse' }, 
            price: 25,
            category: 'absurd'
        },
        'cloud': { 
            icon: '☁️', 
            name: { ru: 'Облако', en: 'Cloud' }, 
            price: 12,
            category: 'absurd'
        },
        'love': { 
            icon: '❤️', 
            name: { ru: 'Любовь', en: 'Love' }, 
            price: 50,
            category: 'absurd'
        },
        'chaos': { 
            icon: '🌀', 
            name: { ru: 'Хаос', en: 'Chaos' }, 
            price: 30,
            category: 'absurd'
        },
        'memory': { 
            icon: '🧩', 
            name: { ru: 'Память', en: 'Memory' }, 
            price: 25,
            category: 'absurd'
        }
    },

    // Крафтабельные элементы
    craftable: {
        // Простые комбинации
        'steam': { 
            icon: '☁️', 
            name: { ru: 'Пар', en: 'Steam' },
            category: 'craftable'
        },
        'lava': { 
            icon: '🌋', 
            name: { ru: 'Лава', en: 'Lava' },
            category: 'craftable'
        },
        'ice': { 
            icon: '🧊', 
            name: { ru: 'Лёд', en: 'Ice' },
            category: 'craftable'
        },
        'life': { 
            icon: '🌱', 
            name: { ru: 'Жизнь', en: 'Life' },
            category: 'craftable'
        },
        'energy': { 
            icon: '⚡', 
            name: { ru: 'Энергия', en: 'Energy' },
            category: 'craftable'
        },
        'mud': { 
            icon: '🟫', 
            name: { ru: 'Грязь', en: 'Mud' },
            category: 'craftable'
        },
        'dust': { 
            icon: '🌪️', 
            name: { ru: 'Пыль', en: 'Dust' },
            category: 'craftable'
        },
        'storm': { 
            icon: '⛈️', 
            name: { ru: 'Шторм', en: 'Storm' },
            category: 'craftable'
        },
        'swamp': { 
            icon: '🌿', 
            name: { ru: 'Болото', en: 'Swamp' },
            category: 'craftable'
        },
        'plant': { 
            icon: '🌿', 
            name: { ru: 'Растение', en: 'Plant' },
            category: 'craftable'
        },
        'rain': { 
            icon: '🌧️', 
            name: { ru: 'Дождь', en: 'Rain' },
            category: 'craftable'
        },
        
        // Металлы и материалы
        'metal': { 
            icon: '🔩', 
            name: { ru: 'Металл', en: 'Metal' },
            category: 'materials'
        },
        'gold': { 
            icon: '🪙', 
            name: { ru: 'Золото', en: 'Gold' },
            category: 'materials'
        },
        'stone': { 
            icon: '🪨', 
            name: { ru: 'Камень', en: 'Stone' },
            category: 'materials'
        },
        'glass': { 
            icon: '🪟', 
            name: { ru: 'Стекло', en: 'Glass' },
            category: 'materials'
        },
        'wood': { 
            icon: '🪵', 
            name: { ru: 'Древесина', en: 'Wood' },
            category: 'materials'
        },
        'paper': { 
            icon: '📄', 
            name: { ru: 'Бумага', en: 'Paper' },
            category: 'materials'
        },
        
        // Существа
        'dragon': { 
            icon: '🐉', 
            name: { ru: 'Дракон', en: 'Dragon' },
            category: 'legendary'
        },
        'unicorn': { 
            icon: '🦄', 
            name: { ru: 'Единорог', en: 'Unicorn' },
            category: 'legendary'
        },
        'phoenix': { 
            icon: '🦅', 
            name: { ru: 'Феникс', en: 'Phoenix' },
            category: 'legendary'
        },
        'human': { 
            icon: '👤', 
            name: { ru: 'Человек', en: 'Human' },
            category: 'creatures'
        },
        'vampire': { 
            icon: '🧛', 
            name: { ru: 'Вампир', en: 'Vampire' },
            category: 'creatures'
        },
        'zombie': { 
            icon: '🧟', 
            name: { ru: 'Зомби', en: 'Zombie' },
            category: 'creatures'
        },
        'angel': { 
            icon: '👼', 
            name: { ru: 'Ангел', en: 'Angel' },
            category: 'creatures'
        },
        'demon': { 
            icon: '😈', 
            name: { ru: 'Демон', en: 'Demon' },
            category: 'creatures'
        },
        
        // Магические артефакты
        'philosopher_stone': { 
            icon: '💎', 
            name: { ru: 'Философский камень', en: 'Philosopher\'s Stone' },
            category: 'legendary'
        },
        'magic': { 
            icon: '✨', 
            name: { ru: 'Магия', en: 'Magic' },
            category: 'magic'
        },
        'portal': { 
            icon: '🌀', 
            name: { ru: 'Портал', en: 'Portal' },
            category: 'magic'
        },
        'spell': { 
            icon: '📜', 
            name: { ru: 'Заклинание', en: 'Spell' },
            category: 'magic'
        },
        
        // Космические сущности
        'infinity': { 
            icon: '♾️', 
            name: { ru: 'Бесконечность', en: 'Infinity' },
            category: 'cosmic'
        },
        'universe': { 
            icon: '🌌', 
            name: { ru: 'Вселенная', en: 'Universe' },
            category: 'cosmic'
        },
        'consciousness': { 
            icon: '👁️', 
            name: { ru: 'Сознание', en: 'Consciousness' },
            category: 'cosmic'
        },
        'paradox': { 
            icon: '🔄', 
            name: { ru: 'Парадокс', en: 'Paradox' },
            category: 'cosmic'
        },
        'singularity': { 
            icon: '⚫', 
            name: { ru: 'Сингулярность', en: 'Singularity' },
            category: 'cosmic'
        },
        'void': { 
            icon: '⚫', 
            name: { ru: 'Пустота', en: 'Void' },
            category: 'cosmic'
        },
        
        // Технологии
        'computer': { 
            icon: '💻', 
            name: { ru: 'Компьютер', en: 'Computer' },
            category: 'technology'
        },
        'internet': { 
            icon: '🌐', 
            name: { ru: 'Интернет', en: 'Internet' },
            category: 'technology'
        },
        'robot': { 
            icon: '🤖', 
            name: { ru: 'Робот', en: 'Robot' },
            category: 'technology'
        },
        'cyborg': { 
            icon: '🦾', 
            name: { ru: 'Киборг', en: 'Cyborg' },
            category: 'technology'
        },
        
        // Новые элементы из paste.txt
        'alcohol': { 
            icon: '🍺', 
            name: { ru: 'Алкоголь', en: 'Alcohol' },
            category: 'materials'
        },
        'herb': { 
            icon: '🌿', 
            name: { ru: 'Трава', en: 'Herb' },
            category: 'materials'
        },
        'bacteria': { 
            icon: '🦠', 
            name: { ru: 'Бактерия', en: 'Bacteria' },
            category: 'creatures'
        },
        'virus': { 
            icon: '🦠', 
            name: { ru: 'Вирус', en: 'Virus' },
            category: 'creatures'
        },
        'medicine': { 
            icon: '💊', 
            name: { ru: 'Медицина', en: 'Medicine' },
            category: 'technology'
        },
        'weapon': { 
            icon: '⚔️', 
            name: { ru: 'Оружие', en: 'Weapon' },
            category: 'materials'
        },
        'blood': { 
            icon: '🩸', 
            name: { ru: 'Кровь', en: 'Blood' },
            category: 'materials'
        },
        'book': { 
            icon: '📚', 
            name: { ru: 'Книга', en: 'Book' },
            category: 'materials'
        },
        'knowledge': { 
            icon: '🎓', 
            name: { ru: 'Знание', en: 'Knowledge' },
            category: 'absurd'
        }
    }
};

// Получить все элементы
export function getAllElements() {
    return {
        ...ELEMENTS.basic,
        ...ELEMENTS.absurd,
        ...ELEMENTS.craftable
    };
}

// Получить элемент по ID
export function getElement(id) {
    const allElements = getAllElements();
    return allElements[id] || null;
}

// Получить имя элемента на текущем языке
export function getElementName(id, lang = 'ru') {
    const element = getElement(id);
    if (!element) return id;
    
    if (typeof element.name === 'string') {
        return element.name;
    }
    
    return element.name[lang] || element.name.ru || id;
}

// Категории элементов
export const ELEMENT_CATEGORIES = {
    basic: {
        name: { ru: '🔥 Базовые элементы', en: '🔥 Basic Elements' },
        order: 1
    },
    absurd: {
        name: { ru: '🎭 Абсурдные ингредиенты', en: '🎭 Absurd Ingredients' },
        order: 2
    },
    materials: {
        name: { ru: '🔨 Материалы', en: '🔨 Materials' },
        order: 3
    },
    creatures: {
        name: { ru: '🐉 Существа', en: '🐉 Creatures' },
        order: 4
    },
    legendary: {
        name: { ru: '✨ Легендарные', en: '✨ Legendary' },
        order: 5
    },
    magic: {
        name: { ru: '🪄 Магия', en: '🪄 Magic' },
        order: 6
    },
    technology: {
        name: { ru: '🔧 Технологии', en: '🔧 Technology' },
        order: 7
    },
    cosmic: {
        name: { ru: '🌌 Космические', en: '🌌 Cosmic' },
        order: 8
    }
};