
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FoodItem } from '../data/foods';
import { toast } from 'sonner';

interface CartItem extends FoodItem {
  quantity: number;
  selectedSpiceLevel: number;
  totalPrice: number;
}

export interface Order {
  id?: number;
  items: CartItem[];
  total: number;
  address: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  date: string;
  userId?: string;
}

// New interface to track deleted order revenue
interface RevenueRecord {
  date: string;
  amount: number;
}

interface OrderContextProps {
  orders: Order[];
  adminOrders: Order[];
  submitOrder: (order: Order) => void;
  updateOrderStatus: (orderId: number, status: Order['status']) => void;
  getOrderById: (orderId: number) => Order | undefined;
  deleteOrder: (orderId: number) => void;
  revenueData: {
    today: number;
    week: number;
    month: number;
  };
}

const OrderContext = createContext<OrderContextProps>({
  orders: [],
  adminOrders: [],
  submitOrder: () => {},
  updateOrderStatus: () => {},
  getOrderById: () => undefined,
  deleteOrder: () => {},
  revenueData: {
    today: 0,
    week: 0,
    month: 0
  }
});

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [deletedOrdersRevenue, setDeletedOrdersRevenue] = useState<RevenueRecord[]>([]);
  const [revenueData, setRevenueData] = useState({
    today: 0,
    week: 0,
    month: 0
  });

  // Load orders from localStorage when component mounts
  useEffect(() => {
    const storedOrders = localStorage.getItem('userOrders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    
    const storedAdminOrders = localStorage.getItem('adminOrders');
    if (storedAdminOrders) {
      setAdminOrders(JSON.parse(storedAdminOrders));
    }
    
    const storedDeletedRevenue = localStorage.getItem('deletedOrdersRevenue');
    if (storedDeletedRevenue) {
      setDeletedOrdersRevenue(JSON.parse(storedDeletedRevenue));
    }
  }, []);

  // Save orders to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userOrders', JSON.stringify(orders));
  }, [orders]);
  
  useEffect(() => {
    localStorage.setItem('adminOrders', JSON.stringify(adminOrders));
  }, [adminOrders]);
  
  useEffect(() => {
    localStorage.setItem('deletedOrdersRevenue', JSON.stringify(deletedOrdersRevenue));
  }, [deletedOrdersRevenue]);

  // Calculate revenue statistics
  useEffect(() => {
    calculateRevenueData();
  }, [adminOrders, deletedOrdersRevenue]);
  
  const calculateRevenueData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekStart = new Date();
    weekStart.setDate(today.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    // Calculate revenue from active orders
    const todayRevenue = adminOrders
      .filter(order => new Date(order.date) >= today && order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);
      
    const weekRevenue = adminOrders
      .filter(order => new Date(order.date) >= weekStart && order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);
      
    const monthRevenue = adminOrders
      .filter(order => new Date(order.date) >= monthStart && order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);
    
    // Add revenue from deleted orders
    const todayDeletedRevenue = deletedOrdersRevenue
      .filter(record => new Date(record.date) >= today)
      .reduce((sum, record) => sum + record.amount, 0);
      
    const weekDeletedRevenue = deletedOrdersRevenue
      .filter(record => new Date(record.date) >= weekStart)
      .reduce((sum, record) => sum + record.amount, 0);
      
    const monthDeletedRevenue = deletedOrdersRevenue
      .filter(record => new Date(record.date) >= monthStart)
      .reduce((sum, record) => sum + record.amount, 0);
    
    setRevenueData({
      today: todayRevenue + todayDeletedRevenue,
      week: weekRevenue + weekDeletedRevenue,
      month: monthRevenue + monthDeletedRevenue
    });
  };

  const submitOrder = (order: Order) => {
    // Check if user is logged in
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
      toast.error("Por favor, faça login para enviar seu pedido");
      return;
    }
    
    // Create a new order with ID
    const newOrder = {
      ...order,
      id: Date.now(),
    };
    
    // Add to user orders
    setOrders(prev => [...prev, newOrder]);
    
    // Also add to admin orders
    setAdminOrders(prev => [...prev, newOrder]);
    
    // Notify admin (this would actually be a server push notification in a real app)
    toast.success("Pedido enviado! O restaurante irá confirmar em breve.");
  };

  const updateOrderStatus = (orderId: number, status: Order['status']) => {
    // Update in user orders
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    // Update in admin orders
    setAdminOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    toast.success(`Status do pedido atualizado para: ${status}`);
  };

  const getOrderById = (orderId: number) => {
    return orders.find(order => order.id === orderId);
  };
  
  const deleteOrder = (orderId: number) => {
    // Find the order before removing it to record its revenue
    const orderToDelete = adminOrders.find(order => order.id === orderId);
    
    if (orderToDelete && orderToDelete.status !== 'cancelled') {
      // Record the revenue from this order before deleting it
      setDeletedOrdersRevenue(prev => [
        ...prev,
        {
          date: orderToDelete.date,
          amount: orderToDelete.total
        }
      ]);
    }
    
    // Remove from user orders
    setOrders(prev => prev.filter(order => order.id !== orderId));
    
    // Remove from admin orders
    setAdminOrders(prev => prev.filter(order => order.id !== orderId));
    
    toast.success(`Pedido #${orderId} removido com sucesso`);
  };

  return (
    <OrderContext.Provider 
      value={{
        orders,
        adminOrders,
        submitOrder,
        updateOrderStatus,
        getOrderById,
        deleteOrder,
        revenueData
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderSystem = () => useContext(OrderContext);
