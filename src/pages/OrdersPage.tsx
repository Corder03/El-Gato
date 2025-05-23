
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useOrderSystem, Order } from '../hooks/useOrderSystem';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Clock, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    preparing: { label: 'Preparando', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
    delivering: { label: 'Em entrega', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' },
    delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  };
  
  const config = statusConfig[status];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const OrdersPage: React.FC = () => {
  const { orders } = useOrderSystem();
  const navigate = useNavigate();
  
  return (
    <div className="app-container dark:bg-gray-900 min-h-screen">
      <Navbar />
      
      <div className="p-4 pb-32">
        <div className="flex items-center mb-4">
          <ClipboardList className="text-elgato dark:text-green-400 mr-2" size={24} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Meus Pedidos</h1>
        </div>
        
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh] px-4 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <ClipboardList 
              size={64} 
              className="w-32 h-32 mb-4 opacity-50 text-gray-300 dark:text-gray-600"
              strokeWidth={1.5}
            />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Você ainda não fez pedidos</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Que tal experimentar nossa comida deliciosa?</p>
            
            <Button onClick={() => navigate('/')} className="bg-elgato dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 transition-colors">
              Explorar cardápio
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Pedido #{order.id}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(order.date), { addSuffix: true, locale: ptBR })}
                    </div>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                
                <div className="border-t border-b border-gray-100 dark:border-gray-700 py-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Itens do Pedido</h4>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="dark:text-gray-300">
                          {item.quantity}x {item.name}
                          {item.selectedSpiceLevel > 0 && 
                            <span className="text-red-500 ml-1">{'🌶️'.repeat(item.selectedSpiceLevel)}</span>
                          }
                        </span>
                        <span className="font-medium dark:text-gray-300">R$ {item.totalPrice.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-sm dark:text-gray-300">R$ {order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de entrega</span>
                    <span className="text-sm dark:text-gray-300">R$ 5.00</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="dark:text-white">Total</span>
                    <span className="text-elgato dark:text-green-400">R$ {(order.total + 5).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.address}</p>
                  </div>
                  
                  {order.notes && (
                    <div className="flex items-start mt-2">
                      <MessageSquare className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default OrdersPage;
