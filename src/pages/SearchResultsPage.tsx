
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import { getFoods, FoodItem } from '../data/foods';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  
  // Parse query parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      performSearch(query);
    }
  }, [location.search]);
  
  const performSearch = (query: string) => {
    const allFoods = getFoods();
    const searchResults = allFoods.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase()) || 
      food.description.toLowerCase().includes(query.toLowerCase()) ||
      food.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setResults(searchResults);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    
    // Update the URL with the new search query
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    const newUrl = `${location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };
  
  return (
    <div className="app-container dark:bg-gray-900 min-h-screen">
      <Navbar />
      
      <div className="p-4 pb-32">
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar pratos, ingredientes..."
              className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </form>
        
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Resultados da busca
          </h1>
          {results.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {results.length} {results.length === 1 ? 'item encontrado' : 'itens encontrados'}
            </span>
          )}
        </div>
        
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Search size={48} className="text-gray-300 dark:text-gray-600 mb-4" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Nenhum resultado encontrado</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Não encontramos nada para "{searchQuery}". Tente outros termos ou navegue pelo cardápio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {results.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
