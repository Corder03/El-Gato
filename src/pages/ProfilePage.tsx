import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useOrderSystem } from '../hooks/useOrderSystem';
import { ClipboardList, User, LogIn, ShoppingBag, Heart } from 'lucide-react';

// User types for session management
type UserRole = 'user' | 'admin';
interface UserSession {
  email: string;
  role: UserRole;
  isLoggedIn: boolean;
}
const ProfilePage: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession>({
    email: '',
    role: 'user',
    isLoggedIn: false
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    orders
  } = useOrderSystem();

  // Load session from localStorage on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession) as UserSession;
      setUserSession(parsedSession);
    }
  }, []);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // For demo purposes, use simple admin check
    if (loginEmail === 'admin@elgato.com' && loginPassword === 'admin123') {
      const session: UserSession = {
        email: loginEmail,
        role: 'admin',
        isLoggedIn: true
      };
      setUserSession(session);
      localStorage.setItem('userSession', JSON.stringify(session));
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo, Administrador!"
      });
    } else if (loginEmail && loginPassword) {
      // For demo, any non-admin email/password combo works
      const session: UserSession = {
        email: loginEmail,
        role: 'user',
        isLoggedIn: true
      };
      setUserSession(session);
      localStorage.setItem('userSession', JSON.stringify(session));
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao El Gato!"
      });
    } else {
      toast({
        title: "Erro de login",
        description: "Por favor, verifique seu email e senha.",
        variant: "destructive"
      });
    }
  };
  const handleLogout = () => {
    setUserSession({
      email: '',
      role: 'user',
      isLoggedIn: false
    });
    localStorage.removeItem('userSession');
    setLoginEmail('');
    setLoginPassword('');
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta."
    });
  };
  return <div className="app-container min-h-screen dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 pb-20 pt-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
          <User className="mr-2" /> Meu Perfil
        </h1>
        
        {!userSession.isLoggedIn ? <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 dark:shadow-none dark:border dark:border-gray-700">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 dark:bg-gray-700">
                <TabsTrigger value="login" className="dark:data-[state=active]:bg-green-700">
                  <LogIn className="h-4 w-4 mr-2" /> Login
                </TabsTrigger>
                <TabsTrigger value="register" className="dark:data-[state=active]:bg-green-700">
                  <User className="h-4 w-4 mr-2" /> Cadastro
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <Input id="email" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="seu@email.com" required className="dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Senha
                    </label>
                    <Input id="password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="********" required className="dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  
                  <Button type="submit" className="w-full bg-elgato dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700">
                    <LogIn className="h-4 w-4 mr-2" /> Entrar
                  </Button>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="font-medium mb-1">Para testar o admin, use:</p>
                    <p>Email: admin@elgato.com</p>
                    <p>Senha: admin123</p>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome completo
                    </label>
                    <Input id="name" type="text" placeholder="Seu nome" required className="dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <Input id="register-email" type="email" placeholder="seu@email.com" required className="dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Senha
                    </label>
                    <Input id="register-password" type="password" placeholder="********" required className="dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  
                  <Button className="w-full bg-elgato dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700">
                    <User className="h-4 w-4 mr-2" /> Cadastrar
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div> : <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 dark:border dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold dark:text-white">
                  {userSession.role === 'admin' ? 'Painel do Administrador' : `Olá, ${loginEmail.split('@')[0]}`}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{userSession.email}</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                Sair
              </Button>
            </div>
            
            {userSession.role === 'admin' ? <div>
                <Button className="w-full mb-4 bg-elgato dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700" onClick={() => navigate('/admin/orders')}>
                  Gerenciar Pedidos
                </Button>
                <Button className="w-full mb-4 bg-elgato dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700" onClick={() => navigate('/admin/foods')}>
                  Editar Cardápio
                </Button>
                
              </div> : <div>
                <div className="flex items-center mb-3">
                  <ClipboardList className="text-elgato dark:text-green-400 mr-2" size={20} />
                  <h3 className="font-semibold text-lg dark:text-white">Meus Pedidos</h3>
                </div>
                
                {orders.length > 0 ? <div className="mb-6">
                    {orders.slice(0, 2).map(order => <div key={order.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium dark:text-white">Pedido #{order.id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                            {order.status === 'pending' ? 'Pendente' : order.status === 'confirmed' ? 'Confirmado' : order.status === 'preparing' ? 'Preparando' : order.status === 'delivering' ? 'Em entrega' : order.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.date).toLocaleString()} • R$ {order.total.toFixed(2)}
                        </p>
                      </div>)}
                    
                    <Button className="w-full mt-4 bg-elgato dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700" onClick={() => navigate('/orders')}>
                      <ClipboardList className="mr-2 h-4 w-4" /> Ver todos meus pedidos
                    </Button>
                  </div> : <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-center text-gray-500 dark:text-gray-400 mb-6">
                    Você ainda não realizou pedidos.
                  </div>}
                
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3 dark:text-white flex items-center">
                    <User className="mr-2 text-elgato dark:text-green-400" size={20} /> 
                    Minha Conta
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300 flex items-center justify-center" onClick={() => navigate('/cart')}>
                      <ShoppingBag className="mr-2 h-4 w-4 text-elgato dark:text-green-400" />
                      Meu Carrinho
                    </Button>
                    
                    <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300 flex items-center justify-center" onClick={() => navigate('/favorites')}>
                      <Heart className="mr-2 h-4 w-4 text-red-500" />
                      Meus Favoritos
                    </Button>
                  </div>

                  <Button className="w-full bg-elgato dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 mt-4" onClick={() => navigate('/')}>
                    Ver Cardápio
                  </Button>
                </div>
              </div>}
          </div>}
      </div>
      <Footer />
    </div>;
};
export default ProfilePage;