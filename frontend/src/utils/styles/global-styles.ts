import cn from 'classnames';

export const mainContainer = cn(
    'main-container', // Подключаем наш кастомный стиль
    'd-flex',
    'flex-column',
    'justify-content-start',
    'align-items-center',
    'w-100'
);

export const subContainer = cn(
    'sub-container', // Подключаем наш кастомный стиль
    'position-relative',
    'd-flex',
    'justify-content-center',
    'flex-row',
    'align-items-stretch',
    'w-100',
    'my-2'
);

export const section = cn(
    'section', // Подключаем наш кастомный стиль
    'card',
    'text-center',
    'mx-2',
    'w-50',
    'h-100'
);

export const visualArea = cn(
    'visual-area', // Подключаем наш кастомный стиль
    'card-body',
    'p-0'
);
