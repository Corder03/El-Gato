
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '../hooks/use-toast';
import { useOrderSystem } from '../hooks/useOrderSystem';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, DollarSign, Calendar, TrendingUp, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

const AdminOrdersPage: React.FC = () => {
  const { adminOrders, updateOrderStatus, deleteOrder, revenueData } = useOrderSystem();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userSession, setUserSession] = useState<any>(null);
  
  // Check authentication
  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setUserSession(session);
      
      if (!session.isLoggedIn || session.role !== 'admin') {
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado como administrador",
          variant: "destructive"
        });
        navigate('/profile');
      }
    } else {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado como administrador",
        variant: "destructive"
      });
      navigate('/profile');
    }
  }, [navigate, toast]);
  
  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
    
    toast({
      title: "Status atualizado",
      description: `Pedido #${orderId} agora está: ${newStatus}`,
    });
  };
  
  const handleRemoveOrder = (orderId: number) => {
    deleteOrder(orderId);
  };
  
  // Status badge colors
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string, text: string }> = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300' },
      confirmed: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-300' },
      preparing: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-300' },
      delivering: { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-800 dark:text-indigo-300' },
      delivered: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-300' },
      cancelled: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-300' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return `${config.bg} ${config.text}`;
  };
  
  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      delivering: 'Em entrega',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    
    return statusLabels[status] || status;
  };
  
  if (!userSession?.isLoggedIn || userSession?.role !== 'admin') {
    return null; // Don't render anything if not an admin
  }
  
  return (
    <div className="app-container min-h-screen dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 pb-20 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Painel Administrativo</h1>
          <Button variant="outline" onClick={() => navigate('/profile')} className="dark:text-white dark:border-gray-700">
            Voltar ao perfil
          </Button>
        </div>
        
        {/* Revenue Cards - Always visible at the top */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <ClipboardCheck className="h-5 w-5 mr-2 text-elgato dark:text-green-400" />
            <h2 className="text-xl font-bold dark:text-white">Resumo de Desempenho</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center dark:text-gray-200">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  Ganhos de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">R$ {revenueData.today.toFixed(2)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Atualizado em tempo real</p>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center dark:text-gray-200">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  Ganhos da Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">R$ {revenueData.week.toFixed(2)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Últimos 7 dias</p>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center dark:text-gray-200">
                  <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                  Ganhos do Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">R$ {revenueData.month.toFixed(2)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Este mês</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Orders Management Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white flex items-center">
              <ClipboardCheck className="h-5 w-5 mr-2 text-elgato dark:text-green-400" />
              Gerenciamento de Pedidos
            </h2>
          </div>
          
          {adminOrders.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">Ainda não há pedidos para gerenciar.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="dark:text-gray-300">ID</TableHead>
                    <TableHead className="dark:text-gray-300">Cliente</TableHead>
                    <TableHead className="dark:text-gray-300">Itens</TableHead>
                    <TableHead className="dark:text-gray-300">Total</TableHead>
                    <TableHead className="dark:text-gray-300">Data</TableHead>
                    <TableHead className="dark:text-gray-300">Status</TableHead>
                    <TableHead className="dark:text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminOrders.map((order) => (
                    <TableRow key={order.id} className="dark:border-gray-700">
                      <TableCell className="dark:text-gray-300">#{order.id}</TableCell>
                      <TableCell className="dark:text-gray-300">{order.address.split(',')[0]}</TableCell>
                      <TableCell className="dark:text-gray-300">
                        <ul className="list-disc list-inside">
                          {order.items.map((item, index) => (
                            <li key={index} className="text-sm dark:text-gray-300">
                              {item.quantity}x {item.name}
                              {item.selectedSpiceLevel > 0 && 
                                <span className="text-red-500 ml-1">{'🌶️'.repeat(item.selectedSpiceLevel)}</span>
                              }
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell className="dark:text-gray-300 font-medium text-elgato dark:text-green-400">R$ {order.total.toFixed(2)}</TableCell>
                      <TableCell className="dark:text-gray-300">{new Date(order.date).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={getStatusBadge(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                          <Select
                            defaultValue={order.status}
                            onValueChange={(value) => handleStatusChange(order.id!, value)}
                          >
                            <SelectTrigger className="w-[130px] dark:border-gray-700 dark:bg-gray-700 dark:text-white text-xs">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                              <SelectItem value="pending" className="dark:text-white dark:focus:bg-gray-700">Pendente</SelectItem>
                              <SelectItem value="confirmed" className="dark:text-white dark:focus:bg-gray-700">Confirmado</SelectItem>
                              <SelectItem value="preparing" className="dark:text-white dark:focus:bg-gray-700">Preparando</SelectItem>
                              <SelectItem value="delivering" className="dark:text-white dark:focus:bg-gray-700">Entregando</SelectItem>
                              <SelectItem value="delivered" className="dark:text-white dark:focus:bg-gray-700">Entregue</SelectItem>
                              <SelectItem value="cancelled" className="dark:text-white dark:focus:bg-gray-700">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/40">
                              <Trash2 className="h-4 w-4 mr-1" /> Remover
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="dark:text-white">Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription className="dark:text-gray-400">
                                Tem certeza que deseja remover o pedido #{order.id}? Esta ação não pode ser desfeita.
                                <br /><br />
                                <span className="font-medium text-amber-600 dark:text-amber-400">
                                  O valor do pedido continuará sendo contabilizado nos relatórios de vendas.
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:border-gray-600">Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleRemoveOrder(order.id!)} 
                                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminOrdersPage;
