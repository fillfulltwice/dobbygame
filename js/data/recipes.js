export const RECIPES = {
    // Only simplified basic list is used now; other categories cleared
    basic: {
        steam: ['fire','water'],
        lava: ['fire','earth'],
        energy: ['fire','air'],
        plant: ['earth','water'],
        metal: ['stone','fire'],
        mud: ['earth','water']
    },
    absurd: {},
    alchemy: {},
    categories: {}
};

// Функция для получения всех рецептов
export function getAllRecipes() {
    return {
        ...RECIPES.basic
    };
}

// Функция для поиска рецепта
import { getAllElements } from './elements.js';

export function findRecipe(ingredients) {
    const allRecipes = getAllRecipes();
    for (const [result, recipe] of Object.entries(allRecipes)) {
        if (matchRecipe(ingredients, recipe)) return result;
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
