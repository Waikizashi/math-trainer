import cn from 'classnames';

export const mainContainer = cn(
    'main-container',
    'd-flex',
    'flex-column',
    'justify-content-start',
    'align-items-center',
    'w-100'
);

export const subContainer = cn(
    'sub-container',
    'position-relative',
    'd-flex',
    'justify-content-center',
    'flex-row',
    'align-items-stretch',
    'w-100',
    'my-2'
);
export const subAdminContainer = cn(
    'sub-admin-container',
    'sub-container',
    'position-relative',
    'd-flex',
    'justify-content-center',
    'flex-row',
    'align-items-stretch',
    'w-100',
);

export const section = cn(
    'section',
    'card',
    'text-center',
    'mx-2',
    'w-50',
    'h-100'
);

export const visualArea = cn(
    'visual-area',
    'card-body',
    'p-0'
);
