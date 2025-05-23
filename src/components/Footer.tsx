
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-up border-t dark:border-gray-700 z-10">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center h-16">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center w-1/5 pt-1 ${
              isActive('/') 
                ? 'text-elgato dark:text-green-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Início</span>
          </Link>
          
          <Link 
            to="/search" 
            className={`flex flex-col items-center justify-center w-1/5 pt-1 ${
              isActive('/search') 
                ? 'text-elgato dark:text-green-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs mt-1">Buscar</span>
          </Link>
          
          <Link 
            to="/favorites" 
            className={`flex flex-col items-center justify-center w-1/5 pt-1 ${
              isActive('/favorites') 
                ? 'text-elgato dark:text-green-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs mt-1">Favoritos</span>
          </Link>
          
          <Link 
            to="/cart" 
            className={`flex flex-col items-center justify-center w-1/5 pt-1 ${
              isActive('/cart') 
                ? 'text-elgato dark:text-green-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs mt-1">Carrinho</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={`flex flex-col items-center justify-center w-1/5 pt-1 ${
              isActive('/profile') 
                ? 'text-elgato dark:text-green-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Perfil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
