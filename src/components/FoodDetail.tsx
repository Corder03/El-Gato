
import React, { useState } from 'react';
import { Heart, Minus, Plus, ShoppingBag, Flame } from 'lucide-react';
import { FoodItem } from '../data/foods';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useCart } from '../hooks/useCart';

interface FoodDetailProps {
  food: FoodItem;
}

const FoodDetail: React.FC<FoodDetailProps> = ({ food }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState(food.spiceLevel?.toString() || "0");
  const { addToCart } = useCart();
  
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
    
    // Get current favorites from localStorage
    const storedFavorites = localStorage.getItem('favorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    if (!isFavorite) {
      // Add to favorites
      const updatedFavorites = [...favorites, food.id];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      toast.success("Adicionado aos favoritos");
    } else {
      // Remove from favorites
      const updatedFavorites = favorites.filter((id: number) => id !== food.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      toast.success("Removido dos favoritos");
    }
  };
  
  const handleAddToCart = () => {
    const cartItem = {
      ...food,
      quantity,
      selectedSpiceLevel: parseInt(selectedSpiceLevel),
      totalPrice: food.price * quantity
    };
    
    addToCart(cartItem);
    toast.success(`${food.name} adicionado ao carrinho`);
  };
  
  const renderSpiceLevel = (level: number) => {
    const flames = [];
    for (let i = 0; i < level; i++) {
      flames.push(<Flame key={i} className="h-4 w-4 text-red-500" />);
    }
    return flames;
  };
  
  return (
    <div className="pb-32">
      {/* Food Image */}
      <div className="relative h-64 w-full">
        <img 
          src={food.image || `https://source.unsplash.com/random/600x400/?mexican,food,${food.name}`} 
          alt={food.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://source.unsplash.com/random/600x400/?mexican,food,${encodeURIComponent(food.name)}`;
          }}
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
        >
          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
      </div>
      
      {/* Food Details */}
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{food.name}</h1>
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-medium">{food.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-500 dark:text-gray-300 mt-2">{food.description}</p>
        
        {/* Spice Level Selection */}
        <div className="mt-6 border-t border-b border-gray-200 dark:border-gray-700 py-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Nível de Pimenta</h3>
          <RadioGroup 
            value={selectedSpiceLevel} 
            onValueChange={setSelectedSpiceLevel} 
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="spice-0" />
              <Label htmlFor="spice-0" className="flex items-center">
                <span className="ml-1 dark:text-gray-300">Sem pimenta</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="spice-1" />
              <Label htmlFor="spice-1" className="flex items-center">
                {renderSpiceLevel(1)}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="spice-2" />
              <Label htmlFor="spice-2" className="flex items-center">
                {renderSpiceLevel(2)}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="spice-3" />
              <Label htmlFor="spice-3" className="flex items-center">
                {renderSpiceLevel(3)}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="spice-4" />
              <Label htmlFor="spice-4" className="flex items-center">
                {renderSpiceLevel(4)}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="spice-5" />
              <Label htmlFor="spice-5" className="flex items-center">
                {renderSpiceLevel(5)}
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button 
              onClick={decreaseQuantity}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 dark:text-white">{quantity}</span>
            <button 
              onClick={increaseQuantity}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xl font-bold text-elgato dark:text-green-400">
            R$ {(food.price * quantity).toFixed(2)}
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Sobre o prato</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Um delicioso prato autêntico da culinária mexicana, preparado com ingredientes frescos e temperos tradicionais.
            Nosso chef utiliza técnicas originais para garantir o sabor incomparável deste prato.
          </p>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 mt-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Você também pode gostar</h3>
        {/* Recommendations would go here */}
      </div>
      
      {/* Add to Cart Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-20">
        <button 
          className="w-full bg-elgato dark:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
};

export default FoodDetail;
