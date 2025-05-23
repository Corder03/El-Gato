
import React, { useState } from 'react';
import { Pizza, Coffee, Beef, Sandwich, Soup, Wine, Banana } from 'lucide-react';

const categories = [
  { id: 'all', name: 'Todos', icon: Pizza },
  { id: 'tacos', name: 'Tacos', icon: Sandwich },
  { id: 'burritos', name: 'Burritos', icon: Beef },
  { id: 'nachos', name: 'Nachos', icon: Banana },
  { id: 'enchiladas', name: 'Enchiladas', icon: Soup },
  { id: 'quesadillas', name: 'Quesadillas', icon: Pizza },
  { id: 'bebidas', name: 'Bebidas', icon: Coffee },
];

interface CategoryBarProps {
  onSelectCategory: (categoryId: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ onSelectCategory }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onSelectCategory(categoryId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm py-4">
      <div className="overflow-x-auto">
        <div className="flex space-x-3 px-4 min-w-max">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-colors ${
                  activeCategory === category.id
                    ? 'bg-elgato text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs whitespace-nowrap">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
