import cn from 'classnames'

export const mainContainer = cn(
    'main-container',
    'd-flex',
    'flex-column',
    'justify-content-start',
    'align-items-center',
    'w-100',
    'h-100'
)
export const subContainer = cn(
    'position-relative',
    'sub-container',
    'd-flex',
    'justify-content-center',
    // 'align-items-center',
    'flex-row',
    'align-items-stretch',
    'w-100',
    'h-100',
    'my-2',
)
export const section = cn(
    "card",
    "text-center",
    "mx-2",
    'h-100',
    'w-50',
)
export const visualArea = cn(
    'visual-area',
    'card-body',
    'p-0',
)
