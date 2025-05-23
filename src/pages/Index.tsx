
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import FoodCard from '../components/FoodCard';
import Footer from '../components/Footer';
import { foods, getFoodsByCategory } from '../data/foods';
import { ChevronRight, Utensils, Clock, Award } from 'lucide-react';

const Index: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFoods, setFilteredFoods] = useState(foods);
  const [promotedFoods, setPromotedFoods] = useState<typeof foods>([]);
  
  useEffect(() => {
    setFilteredFoods(getFoodsByCategory(selectedCategory));
    // Set a few random foods as promoted ones
    const promoted = [...foods]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setPromotedFoods(promoted);
  }, [selectedCategory]);
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  return (
    <div className="app-container bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-elgato-dark to-elgato p-6 text-white">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">El Gato</h1>
              <p className="text-sm opacity-90 mb-2">Comida mexicana autêntica</p>
              <div className="flex space-x-2 mt-3">
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  Entrega Rápida
                </span>
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  Sabor Autêntico
                </span>
              </div>
            </div>
            {/* Removido o logo do El Gato nesta seção */}
          </div>
        </div>
      </div>
      
      {/* Promotions Carousel */}
      <div className="p-4 pb-0">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <Award className="w-4 h-4 text-elgato-accent mr-2" />
          Especiais do Dia
        </h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-3">
            {promotedFoods.map((food) => (
              <Link to={`/food/${food.id}`} key={`promo-${food.id}`} className="min-w-[250px] flex-shrink-0">
                <div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md">
                  <div className="absolute top-2 right-2 bg-elgato-accent text-black text-xs font-bold px-2 py-1 rounded-full">
                    Especial
                  </div>
                  <img 
                    src={food.image || `https://source.unsplash.com/random/300x200/?mexican,food,${food.name}`} 
                    alt={food.name} 
                    className="w-full h-36 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://source.unsplash.com/random/300x200/?mexican,food,${encodeURIComponent(food.name)}`;
                    }}
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 dark:text-white">{food.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-elgato dark:text-green-400">R$ {food.price.toFixed(2)}</span>
                      <span className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
                        {food.prepTime || '15-20 min'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <CategoryBar onSelectCategory={handleCategorySelect} />
      
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mx-4 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
          <Utensils className="w-5 h-5 mx-auto mb-1 text-elgato" />
          <p className="text-xs text-gray-600 dark:text-gray-400">Opções</p>
          <p className="font-semibold">{foods.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
          <Clock className="w-5 h-5 mx-auto mb-1 text-elgato-secondary" />
          <p className="text-xs text-gray-600 dark:text-gray-400">Entrega</p>
          <p className="font-semibold">15-30min</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
          <Award className="w-5 h-5 mx-auto mb-1 text-elgato-accent" />
          <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
          <p className="font-semibold">4.8/5</p>
        </div>
      </div>
      
      {/* Food list with improved layout */}
      <div className="p-4 pt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Mais Populares</h2>
          <Link to="/favorites" className="text-sm text-elgato flex items-center">
            Ver todos <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {filteredFoods.map(food => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
        
        {filteredFoods.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="mb-2">Nenhum item encontrado nesta categoria.</p>
            <button 
              onClick={() => handleCategorySelect('all')}
              className="text-sm text-elgato"
            >
              Ver todos os itens
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
