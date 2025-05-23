
import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, ShoppingBag, Search, Moon, Sun } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [animateIcon, setAnimateIcon] = useState(false);
  const isHome = location.pathname === '/';
  
  const goBack = () => {
    navigate(-1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleThemeToggle = () => {
    setAnimateIcon(true);
    toggleTheme();
    setTimeout(() => setAnimateIcon(false), 300);
  };

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm dark:shadow-md dark:shadow-black/20 dark:border-b dark:border-gray-700">
      <div className="flex items-center justify-between p-4">
        {!isHome ? (
          <button 
            onClick={goBack}
            className="p-1 rounded-full dark:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <MapPin className="w-4 h-4 text-elgato dark:text-green-400 mr-1" />
            <span>Entregar em</span>
            <span className="font-semibold ml-1 mr-1">Sua Casa</span>
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleThemeToggle} 
            className="p-2 rounded-full dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className={`w-5 h-5 text-amber-400 theme-toggle-icon ${animateIcon ? 'animate' : ''}`} />
            ) : (
              <Moon className={`w-5 h-5 theme-toggle-icon ${animateIcon ? 'animate' : ''}`} />
            )}
          </button>
          
          <div className="relative">
            <Link to="/cart">
              <ShoppingBag className="w-6 h-6 text-gray-700 dark:text-white" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-elgato-secondary dark:bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {isHome && (
        <div className="px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar no El Gato" 
              className="w-full px-10 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-elgato dark:focus:ring-green-500"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default Navbar;
