
import React from 'react';
import { Link } from 'react-router-dom';
import { FoodItem } from '../data/foods';
import { ShoppingBag, Heart, Clock, Star } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { toast } from 'sonner';

interface FoodCardProps {
  food: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
      toast.error("Por favor, faça login para adicionar ao carrinho");
      return;
    }
    
    const cartItem = {
      ...food,
      quantity: 1,
      selectedSpiceLevel: food.spiceLevel || 0,
      totalPrice: food.price
    };
    
    addToCart(cartItem);
    toast.success(`${food.name} adicionado ao carrinho`);
  };

  // Check if food has discount property and it's a valid number
  const hasDiscount = food.hasOwnProperty('discount') && typeof food['discount'] === 'number';

  return (
    <Link to={`/food/${food.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 dark:hover:border-elgato border dark:border-gray-700 hover:border-elgato dark:hover:bg-gray-700">
        <div className="flex">
          <div className="w-1/3 relative">
            <img 
              src={food.image || `https://source.unsplash.com/random/300x200/?mexican,food,${encodeURIComponent(food.name)}`} 
              alt={food.name} 
              className="w-full h-full object-cover min-h-[100px]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://source.unsplash.com/random/300x200/?mexican,food,${encodeURIComponent(food.name)}`;
              }}
            />
            {hasDiscount && (
              <div className="absolute top-2 left-2 bg-elgato-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
                -{food['discount']}%
              </div>
            )}
          </div>
          
          <div className="w-2/3 p-3">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-gray-800 dark:text-white">{food.name}</h3>
              <div className="flex items-center text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">
                <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
                <span className="text-gray-700 dark:text-gray-300">{food.rating}</span>
              </div>
            </div>
            
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2">{food.description}</p>
            
            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3 mr-1" /> 
              <span>{food.prepTime || '15-20 min'}</span>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-elgato dark:text-green-400">R$ {food.price.toFixed(2)}</span>
              <div className="flex space-x-2">
                <button 
                  className="bg-elgato dark:bg-green-600 text-white p-1.5 rounded-full transition-transform hover:scale-110"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
