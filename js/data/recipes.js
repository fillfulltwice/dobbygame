// js/data/recipes.js
export const RECIPES = {
    // Базовые комбинации
    basic: {
        'steam': ['fire', 'water'],
        'mud': ['earth', 'water'],
        'dust': ['earth', 'air'],
        'energy': ['fire', 'air'],
        'lava': ['fire', 'earth'],
        'storm': ['air', 'water'],
        'life': ['energy', 'swamp'],
        'swamp': ['mud', 'plant'],
        'plant': ['earth', 'rain'],
        'rain': ['cloud', 'water']
    },

    // Абсурдные рецепты от Dobby
    absurd: {
        'steam': ['fire', 'water', 'cloud'],
        'gold': ['metal', 'rainbow', 'laugh'],
        'life': ['water', 'earth', 'dance'],
        'dragon': ['fire', 'egg', 'legend'],
        'unicorn': ['horse', 'dream', 'rainbow'],
        'phoenix': ['fire', 'egg', 'time'],
        'philosopher_stone': ['stone', 'wisdom', 'time'],
        'magic': ['light', 'darkness', 'wisdom'],
        'portal': ['chaos', 'space', 'energy'],
        'infinity': ['time', 'paradox', 'consciousness'],
        'universe': ['singularity', 'infinity', 'consciousness']
    },

    // Новые рецепты из paste.txt
    alchemy: {
        // А
        'absinthe': ['alcohol', 'herb'],
        'automobile': ['carriage', 'oil'],
        'adamantite': ['drow', 'metal'],
        'alcoholic': ['human', 'vodka'],
        'angel': ['light', 'life'],
        'antibiotics': ['medicine', 'bacteria'],
        'crossbow': ['human', 'weapon'],
        'assassin': ['poisoned_weapon', 'human'],
        'astral': ['chaos', 'void'],
        'atomic_bomb': ['plutonium', 'weapon'],
        
        // Б
        'b52': ['coffee', 'vodka'],
        'butterfly': ['air', 'worm'],
        'bacteria': ['life', 'swamp'],
        'bank': ['money', 'skyscraper'],
        'bard': ['magic', 'music'],
        'tower': ['wizard', 'house'],
        'white_russian': ['milk', 'vodka'],
        'concrete': ['water', 'cement'],
        'swamp': ['earth', 'water'],
        'paper': ['reed', 'tools'],
        'petrel': ['storm', 'bird'],
        
        // В
        'vampire': ['human', 'blood'],
        'virus': ['human', 'bacteria'],
        'vodka': ['alcohol', 'water'],
        'seaweed': ['life', 'water'],
        'warrior': ['weapon', 'hunter'],
        'wizard': ['human', 'energy'],
        'thief': ['law', 'assassin'],
        'resurrection': ['death', 'healing'],
        
        // Г
        'hero': ['dragon', 'warrior'],
        'clay': ['sand', 'swamp'],
        'dwarf': ['human', 'earth'],
        'goblin': ['human', 'swamp'],
        'golem': ['clay', 'life'],
        'sin': ['religion', 'human'],
        'mushroom': ['earth', 'seaweed'],
        
        // Д
        'dolphin': ['fish', 'beast'],
        'demon': ['beast', 'darkness'],
        'money': ['gold', 'paper'],
        'tree': ['earth', 'seeds'],
        'dinosaur': ['earth', 'egg'],
        'debt': ['money', 'bank'],
        'house': ['concrete', 'brick'],
        'livestock': ['beast', 'human'],
        'armor': ['human', 'metal'],
        'dragon_alt': ['fire', 'dinosaur'],
        'wood': ['tools', 'tree'],
        'drow': ['darkness', 'elf'],
        'druid': ['human', 'tree'],
        'duergar': ['dwarf', 'darkness'],
        
        // Е
        'unicorn_alt': ['magic', 'beast'],
        
        // Ж
        'iron': ['stone', 'fire'],
        'life_alt': ['energy', 'swamp'],
        'beetle': ['earth', 'worm'],
        'journalist': ['typewriter', 'human'],
        
        // З
        'fun': ['sex', 'human'],
        'spell': ['magic', 'knowledge'],
        'law': ['religion', 'human'],
        'castle': ['house', 'armor'],
        'beast': ['earth', 'lizard'],
        'snake': ['sand', 'worm'],
        'knowledge': ['book', 'human'],
        'gold_alt': ['apple', 'mobile_phone'],
        'zombie': ['corpse', 'life'],
        
        // И
        'games': ['law', 'fun'],
        'hut': ['human', 'stone'],
        'limestone': ['shells', 'stone'],
        'caviar': ['fish', 'egg'],
        'illithid': ['astral', 'death'],
        'illusion': ['spell', 'air'],
        'tools': ['human', 'metal'],
        'internet': ['computer', 'computer'],
        
        // К
        'stone': ['water', 'lava'],
        'ceramics': ['clay', 'human'],
        'cyborg': ['human', 'computer'],
        'brick': ['clay', 'fire'],
        'whale': ['fish', 'plankton'],
        'book': ['feather', 'paper'],
        'spellbook': ['spell', 'book'],
        'claws': ['beast', 'weapon'],
        'molotov': ['fire', 'vodka'],
        'chariot': ['beast', 'carriage'],
        'wheel': ['tools', 'wood'],
        'computer': ['tv', 'book'],
        'cone_of_cold': ['spell', 'ice'],
        'ship': ['wood', 'boat'],
        'astronaut': ['human', 'rocket'],
        'coffee': ['seeds', 'energy'],
        'cat': ['beast', 'house'],
        'credit_card': ['money', 'debt'],
        'blood': ['warrior', 'dragon'],
        'rat': ['beast', 'medicine'],
        
        // Л
        'lava_alt': ['earth', 'fire'],
        'laser': ['radio_wave', 'fire'],
        'lightbulb': ['glass', 'void'],
        'healing': ['priest', 'prayer'],
        'ice': ['glass', 'water'],
        'boat': ['water', 'wood'],
        'bow': ['elf', 'weapon'],
        
        // М
        'medicine': ['knowledge', 'virus'],
        'metal': ['stone', 'fire'],
        'mechanism': ['tools', 'law'],
        'sword': ['human', 'weapon'],
        'mithril': ['elf', 'metal'],
        'mobile_phone': ['computer', 'radio_wave'],
        'modron': ['mechanism', 'life'],
        'prayer': ['magic', 'priest'],
        'milk': ['livestock', 'grass'],
        'hammer': ['dwarf', 'weapon'],
        'sea': ['water', 'water'],
        'ice_cream': ['ice', 'milk'],
        'freezer': ['ice', 'mechanism'],
        'moss': ['swamp', 'seaweed'],
        'music': ['reed', 'human'],
        'flour': ['wheat', 'stone'],
        'ant': ['beetle', 'work'],
        'meat': ['hunter', 'bird'],
        
        // Н
        'skyscraper': ['house', 'glass'],
        'necromancer': ['wizard', 'zombie'],
        'oil': ['water', 'coal'],
        'profanity': ['sex', 'sex'],
        'ufo': ['rocket', 'alien'],
        
        // О
        'werewolf': ['beast', 'vampire'],
        'fireball': ['spell', 'fire'],
        'firearm': ['weapon', 'gunpowder'],
        'clothes': ['fabric', 'human'],
        'orc': ['human', 'swamp'],
        'weapon': ['metal', 'tools'],
        'octopus': ['knowledge', 'fish'],
        'poisoned_weapon': ['weapon', 'poison'],
        'hunter': ['human', 'weapon']
    },

    // Категории для UI
    categories: {
        basic: {
            name: { ru: '🔥 Базовые элементы', en: '🔥 Basic Elements' },
            description: { ru: 'Основа всей алхимии', en: 'Foundation of all alchemy' }
        },
        absurd: {
            name: { ru: '🎭 Абсурдные творения', en: '🎭 Absurd Creations' },
            description: { ru: 'Рецепты от безумного Dobby', en: 'Recipes from crazy Dobby' }
        },
        legendary: {
            name: { ru: '✨ Легендарные артефакты', en: '✨ Legendary Artifacts' },
            description: { ru: 'Мощнейшие творения', en: 'Most powerful creations' }
        },
        creatures: {
            name: { ru: '🐉 Существа', en: '🐉 Creatures' },
            description: { ru: 'Живые создания', en: 'Living beings' }
        },
        technology: {
            name: { ru: '🔧 Технологии', en: '🔧 Technology' },
            description: { ru: 'Механизмы и изобретения', en: 'Mechanisms and inventions' }
        },
        magic: {
            name: { ru: '🪄 Магия', en: '🪄 Magic' },
            description: { ru: 'Заклинания и волшебство', en: 'Spells and sorcery' }
        }
    }
};

// Функция для получения всех рецептов
export function getAllRecipes() {
    return {
        ...RECIPES.basic,
        ...RECIPES.absurd,
        ...RECIPES.alchemy
    };
}

// Функция для поиска рецепта
export function findRecipe(ingredients) {
    const allRecipes = getAllRecipes();
    
    for (const [result, recipe] of Object.entries(allRecipes)) {
        if (matchRecipe(ingredients, recipe)) {
            return result;
        }
    }
    
    return null;
}

// Проверка соответствия рецепта
function matchRecipe(ingredients, recipe) {
    if (ingredients.length !== recipe.length) return false;
    
    const ingredientsCopy = [...ingredients];
    for (const item of recipe) {
        const index = ingredientsCopy.indexOf(item);
        if (index === -1) return false;
        ingredientsCopy.splice(index, 1);
    }
    
    return ingredientsCopy.length === 0;
}

// Получить подсказку для рецепта
export function getRecipeHint(element, trustLevel) {
    const allRecipes = getAllRecipes();
    const recipe = allRecipes[element];
    
    if (!recipe) return null;
    
    // Разные уровни подсказок в зависимости от доверия
    if (trustLevel < 30) {
        return { 
            ru: 'Гав! Это секрет! Сначала подружись со мной!',
            en: 'Woof! That\'s a secret! Be my friend first!'
        };
    } else if (trustLevel < 60) {
        // Даём подсказку об одном ингредиенте
        const hint = recipe[Math.floor(Math.random() * recipe.length)];
        return {
            ru: `Хм... Мне кажется, тут нужен ${hint}... или нет? Гав!`,
            en: `Hmm... I think you need ${hint}... or not? Woof!`
        };
    } else {
        // Даём загадочную подсказку о двух ингредиентах
        const hints = recipe.slice(0, 2);
        return {
            ru: `Когда ${hints[0]} встречает ${hints[1]}... происходит что-то особенное! 🐕`,
            en: `When ${hints[0]} meets ${hints[1]}... something special happens! 🐕`
        };
    }
}