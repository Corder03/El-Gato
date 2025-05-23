
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useOrderSystem, Order } from '../hooks/useOrderSystem';
import { Badge } from '@/components/ui/badge';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart } = useCart();
  const { submitOrder } = useOrderSystem();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [userSession, setUserSession] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      setUserSession(JSON.parse(savedSession));
    }
  }, []);
  
  const handleCheckout = () => {
    if (!userSession?.isLoggedIn) {
      toast.error("Por favor, faça login para finalizar seu pedido");
      navigate('/profile');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }
    
    if (!address.trim()) {
      toast.error("Por favor, informe seu endereço");
      return;
    }
    
    const order: Order = {
      items: cartItems,
      total: getCartTotal(),
      address,
      notes,
      status: 'pending',
      date: new Date().toISOString(),
    };
    
    submitOrder(order);
    clearCart();
    toast.success("Pedido enviado com sucesso!");
    navigate('/orders');
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="app-container dark:bg-gray-900 min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center max-w-md w-full">
            <ShoppingBag size={64} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Adicione alguns itens deliciosos para começar</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/')} className="bg-elgato dark:bg-green-600 hover:bg-green-600 transition-colors">
                Explorar cardápio
              </Button>
              <Button onClick={() => navigate('/favorites')} variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                <Heart className="mr-2 h-4 w-4 text-red-500" /> Ver favoritos
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="app-container dark:bg-gray-900 min-h-screen">
      <Navbar />
      
      <div className="p-4 pb-32">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ShoppingBag className="text-elgato dark:text-green-400 mr-2" size={24} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Seu Carrinho</h1>
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800">
              {cartItems.length} item(s)
            </Badge>
          </div>
          
          {!userSession?.isLoggedIn && (
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline"
              className="text-sm bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
            >
              Faça login para finalizar
            </Button>
          )}
        </div>
        
        {/* Cart Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.selectedSpiceLevel}`} className="flex p-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
              
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-800 dark:text-white">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Pimenta: {item.selectedSpiceLevel === 0 ? 'Sem pimenta' : '🌶️'.repeat(item.selectedSpiceLevel)}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded">
                    <button 
                      onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-l hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 py-1 text-sm dark:text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-r hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="font-semibold text-elgato dark:text-green-400">R$ {item.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Delivery Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Informações de Entrega</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço de Entrega</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Rua das Flores, 123, Apto 101"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-elgato dark:focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observações (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Campainha não funciona, ligar no celular"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-elgato dark:focus:ring-green-500 focus:border-transparent"
              rows={2}
            />
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Resumo do Pedido</h2>
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-medium dark:text-white">R$ {getCartTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Taxa de entrega</span>
            <span className="font-medium dark:text-white">R$ 5.00</span>
          </div>
          <div className="flex justify-between py-3 font-bold">
            <span className="dark:text-white">Total</span>
            <span className="text-elgato dark:text-green-400">R$ {(getCartTotal() + 5).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Checkout Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-20">
        <Button 
          onClick={handleCheckout}
          className="w-full bg-elgato hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white py-6 rounded-lg font-medium flex items-center justify-center transition-colors"
          disabled={!userSession?.isLoggedIn}
        >
          {!userSession?.isLoggedIn ? "Faça login para finalizar" : "Finalizar Pedido"}
          <ArrowRight className="ml-2" />
        </Button>
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;
