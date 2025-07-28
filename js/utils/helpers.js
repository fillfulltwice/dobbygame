// js/utils/helpers.js

// Утилиты для работы с DOM
export const DOM = {
    // Получить элемент по ID
    get(id) {
        return document.getElementById(id);
    },
    
    // Получить все элементы по селектору
    getAll(selector) {
        return document.querySelectorAll(selector);
    },
    
    // Создать элемент
    create(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },
    
    // Очистить элемент
    clear(element) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) element.innerHTML = '';
    },
    
    // Показать/скрыть элемент
    show(element) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) element.style.display = 'block';
    },
    
    hide(element) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) element.style.display = 'none';
    },
    
    // Переключить класс
    toggleClass(element, className) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) element.classList.toggle(className);
    },
    
    // Добавить слушатель события
    on(element, event, handler) {
        if (!element || !event || !handler) return;
        
        // Если element это строка, получаем элемент
        if (typeof element === 'string') {
            element = this.get(element);
        }
        
        // Проверяем что element существует и это DOM элемент
        if (element && element.addEventListener) {
            element.addEventListener(event, handler);
        } else if (element === document || element === window) {
            // Для document и window
            element.addEventListener(event, handler);
        }
    },
    
    // Установить текст
    text(element, text) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) element.textContent = text;
    }
};

// Утилиты для анимаций
export const Animation = {
    // Плавное появление
    fadeIn(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = 0;
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Плавное исчезновение
    fadeOut(element, duration = 300) {
        if (!element) return;
        
        const start = performance.now();
        const initialOpacity = parseFloat(element.style.opacity) || 1;
        
        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Анимация числа
    animateNumber(element, from, to, duration = 1000) {
        if (!element) return;
        
        const start = performance.now();
        const diff = to - from;
        
        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(from + diff * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Анимация счетчика
    countUp(elementId, targetValue) {
        const element = DOM.get(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        this.animateNumber(element, currentValue, targetValue, 500);
    },
    
    // Эффекты
    Effects: {
        // Создать частицы
        createParticles(x, y, count = 10, color = '#FFD700') {
            const container = DOM.create('div', 'particles');
            container.style.position = 'fixed';
            container.style.left = x + 'px';
            container.style.top = y + 'px';
            container.style.pointerEvents = 'none';
            container.style.zIndex = '9999';
            
            for (let i = 0; i < count; i++) {
                const particle = DOM.create('div', 'particle');
                particle.style.position = 'absolute';
                particle.style.width = '10px';
                particle.style.height = '10px';
                particle.style.backgroundColor = color;
                particle.style.borderRadius = '50%';
                
                const angle = (Math.PI * 2 * i) / count;
                const velocity = Numbers.random(50, 150);
                const lifetime = Numbers.random(500, 1000);
                
                particle.style.animation = `particle-explode ${lifetime}ms ease-out forwards`;
                particle.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
                particle.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
                
                container.appendChild(particle);
            }
            
            document.body.appendChild(container);
            
            setTimeout(() => container.remove(), 1500);
        },
        
        // Встряхнуть элемент
        shake(element, duration = 500, intensity = 5) {
            if (!element) return;
            
            const originalTransform = element.style.transform;
            const start = performance.now();
            
            const animate = (now) => {
                const elapsed = now - start;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    const x = (Math.random() - 0.5) * intensity * (1 - progress);
                    const y = (Math.random() - 0.5) * intensity * (1 - progress);
                    element.style.transform = `${originalTransform} translate(${x}px, ${y}px)`;
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = originalTransform;
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
};

// Утилиты для работы с числами
export const Numbers = {
    // Форматирование чисел
    format(num) {
        if (typeof num !== 'number') return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    
    // Случайное число в диапазоне
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Случайный элемент массива
    randomFrom(array) {
        if (!array || !array.length) return null;
        return array[Math.floor(Math.random() * array.length)];
    },
    
    // Перемешать массив
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // Ограничить значение
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
};

// Утилиты для работы со временем
export const Time = {
    // Форматирование времени
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}ч ${minutes}м ${secs}с`;
        } else if (minutes > 0) {
            return `${minutes}м ${secs}с`;
        } else {
            return `${secs}с`;
        }
    },
    
    // Дебаунс функции
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle функции
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Утилиты для работы со строками
export const Strings = {
    // Капитализация первой буквы
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    // Обрезка строки
    truncate(str, length = 50, suffix = '...') {
        if (!str || str.length <= length) return str;
        return str.slice(0, length - suffix.length) + suffix;
    },
    
    // Множественное число (русский)
    pluralizeRu(count, one, two, five) {
        const n = Math.abs(count) % 100;
        const n1 = n % 10;
        
        if (n > 10 && n < 20) return five;
        if (n1 > 1 && n1 < 5) return two;
        if (n1 === 1) return one;
        return five;
    }
};

// Экспорт всех утилит
export default {
    DOM,
    Animation,
    Numbers,
    Time,
    Strings
};