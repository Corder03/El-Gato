
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import { getFoods, FoodItem } from '../data/foods';
import { Heart, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FoodItem[]>([]);
  const [userSession, setUserSession] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      setUserSession(JSON.parse(savedSession));
    } else {
      // Redirect to profile/login if not logged in
      toast.error("Faça login para ver seus favoritos");
      navigate('/profile');
    }
  }, [navigate]);
  
  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites) as number[];
        const allFoods = getFoods();
        
        const favoriteFoods = allFoods.filter(food => 
          favoriteIds.includes(food.id)
        );
        
        setFavorites(favoriteFoods);
      }
    };
    
    if (userSession?.isLoggedIn) {
      loadFavorites();
      
      // Also add an event listener to update favorites when storage changes
      window.addEventListener('storage', loadFavorites);
      
      // Custom event for favorites update
      const handleFavUpdate = () => loadFavorites();
      window.addEventListener('favoritesUpdated', handleFavUpdate);
      
      return () => {
        window.removeEventListener('storage', loadFavorites);
        window.removeEventListener('favoritesUpdated', handleFavUpdate);
      };
    }
  }, [userSession]);

  const handleRemoveFromFavorites = (foodId: number) => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const favoriteIds = JSON.parse(storedFavorites) as number[];
      const updatedFavorites = favoriteIds.filter(id => id !== foodId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      // Update the UI
      setFavorites(prev => prev.filter(food => food.id !== foodId));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('favoritesUpdated'));
      toast.success("Item removido dos favoritos");
    }
  };
  
  if (!userSession?.isLoggedIn) {
    return null; // Don't render if not logged in
  }
  
  return (
    <div className="app-container dark:bg-gray-900 min-h-screen">
      <Navbar />
      
      <div className="p-4 pb-32">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Heart className="text-red-500 mr-2" size={24} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Meus Favoritos</h1>
            <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800">
              {favorites.length}
            </Badge>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="text-sm dark:border-gray-700 dark:text-gray-300"
          >
            <ShoppingBag className="mr-1 h-4 w-4" />
            Continuar comprando
          </Button>
        </div>
        
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh] px-4 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Heart size={64} className="text-red-300 dark:text-red-600 mb-4" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Você ainda não tem favoritos</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Marque seus pratos preferidos usando o coração</p>
            <Button onClick={() => navigate('/')} className="bg-elgato dark:bg-green-600 hover:bg-green-600 transition-colors">
              Explorar cardápio
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {favorites.map(food => (
              <div key={food.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <button
                  onClick={() => handleRemoveFromFavorites(food.id)}
                  className="absolute top-2 right-2 p-1 bg-red-100 dark:bg-red-900 rounded-full text-red-500 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  aria-label="Remover dos favoritos"
                >
                  <X size={16} />
                </button>
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default FavoritesPage;
