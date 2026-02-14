export interface CustomizationOption {
    id: string;
    name: string;
    price: number;
    type: 'extra' | 'removal' | 'choice';
    categoryId?: string;
}

export const BURGER_CUSTOMIZATIONS: CustomizationOption[] = [
    { id: 'extra-cheese', name: 'Extra Cheese', price: 20, type: 'extra' },
    { id: 'extra-tikki', name: 'Double Tikki', price: 50, type: 'extra' },
    { id: 'no-onion', name: 'No Onion', price: 0, type: 'removal' },
    { id: 'no-capsicum', name: 'No Capsicum', price: 0, type: 'removal' },
    { id: 'no-mayo', name: 'No Mayo', price: 0, type: 'removal' },
];

export const SANDWICH_CUSTOMIZATIONS: CustomizationOption[] = [
    { id: 'extra-cheese', name: 'Extra Cheese', price: 20, type: 'extra' },
    { id: 'no-onion', name: 'No Onion', price: 0, type: 'removal' },
    { id: 'no-butter', name: 'No Butter', price: 0, type: 'removal' },
];

export const getCustomizationsForItem = (category: string): CustomizationOption[] => {
    const cat = category.toLowerCase();
    if (cat.includes('burger')) return BURGER_CUSTOMIZATIONS;
    if (cat.includes('sandwich')) return SANDWICH_CUSTOMIZATIONS;
    return [];
};
