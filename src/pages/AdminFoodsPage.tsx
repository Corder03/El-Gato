import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '../components/ui/use-toast';
import { getFoods } from '../data/foods';
const AdminFoodsPage: React.FC = () => {
  const [foods, setFoods] = useState(getFoods());
  const [editingFoodId, setEditingFoodId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    spiceLevel: 0
  });
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleEdit = (foodId: number) => {
    const foodToEdit = foods.find(food => food.id === foodId);
    if (foodToEdit) {
      setEditingFoodId(foodId);
      setEditForm({
        name: foodToEdit.name,
        description: foodToEdit.description,
        price: foodToEdit.price,
        image: foodToEdit.image,
        category: foodToEdit.category,
        spiceLevel: foodToEdit.spiceLevel || 0
      });
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };
  const handleSelectChange = (field: string, value: string) => {
    setEditForm({
      ...editForm,
      [field]: field === 'spiceLevel' ? parseInt(value) : value
    });
  };
  const handleSave = () => {
    if (editingFoodId) {
      setFoods(foods.map(food => food.id === editingFoodId ? {
        ...food,
        ...editForm
      } : food));
      setEditingFoodId(null);
      toast({
        title: "Item atualizado",
        description: `"${editForm.name}" foi atualizado com sucesso.`
      });
    }
  };
  const handleCancel = () => {
    setEditingFoodId(null);
  };
  return <div className="app-container min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pb-20 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Cardápio</h1>
          <Button variant="outline" onClick={() => navigate('/profile')}>
            Voltar ao perfil
          </Button>
        </div>
        
        <Tabs defaultValue="foodList" className="w-full bg-slate-900">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="foodList">Lista de Itens</TabsTrigger>
            <TabsTrigger value="addFood">Adicionar Novo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="foodList">
            <div className="rounded-lg shadow overflow-x-auto bg-transparent">
              <Table className="bg-transparent">
                <TableHeader className="bg-transparent">
                  <TableRow className="bg-transparent">
                    <TableHead className="bg-transparent">ID</TableHead>
                    <TableHead className="bg-slate-600">Imagem</TableHead>
                    <TableHead className="bg-slate-600">Nome</TableHead>
                    <TableHead className="bg-slate-600">Preço</TableHead>
                    <TableHead className="bg-slate-600">Categoria</TableHead>
                    <TableHead className="bg-slate-600">Nível de Pimenta</TableHead>
                    <TableHead className="bg-slate-600">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foods.map(food => <TableRow key={food.id}>
                      <TableCell className="bg-slate-700">{food.id}</TableCell>
                      <TableCell className="bg-slate-800">
                        <img src={food.image} alt={food.name} className="w-16 h-16 object-cover rounded" />
                      </TableCell>
                      <TableCell className="bg-slate-800">{food.name}</TableCell>
                      <TableCell className="bg-slate-800">R$ {food.price.toFixed(2)}</TableCell>
                      <TableCell className="bg-slate-800">{food.category}</TableCell>
                      <TableCell className="bg-slate-800">{food.spiceLevel || 0} de 5</TableCell>
                      <TableCell className="bg-slate-800">
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(food.id)}>
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {editingFoodId && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4">Editar Item</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <Input name="name" value={editForm.name} onChange={handleInputChange} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <Input name="description" value={editForm.description} onChange={handleInputChange} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço (R$)
                      </label>
                      <Input name="price" type="number" step="0.01" value={editForm.price} onChange={handleInputChange} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL da Imagem
                      </label>
                      <Input name="image" value={editForm.image} onChange={handleInputChange} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria
                      </label>
                      <Select value={editForm.category} onValueChange={value => handleSelectChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tacos">Tacos</SelectItem>
                          <SelectItem value="burritos">Burritos</SelectItem>
                          <SelectItem value="nachos">Nachos</SelectItem>
                          <SelectItem value="enchiladas">Enchiladas</SelectItem>
                          <SelectItem value="quesadillas">Quesadillas</SelectItem>
                          <SelectItem value="bebidas">Bebidas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nível de Pimenta
                      </label>
                      <Select value={editForm.spiceLevel.toString()} onValueChange={value => handleSelectChange('spiceLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível de pimenta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Sem pimenta</SelectItem>
                          <SelectItem value="1">1 - Muito leve</SelectItem>
                          <SelectItem value="2">2 - Leve</SelectItem>
                          <SelectItem value="3">3 - Médio</SelectItem>
                          <SelectItem value="4">4 - Picante</SelectItem>
                          <SelectItem value="5">5 - Muito picante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSave}>
                        Salvar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>}
          </TabsContent>
          
          <TabsContent value="addFood">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Adicionar Novo Item</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <Input placeholder="Nome do item" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <Input placeholder="Descrição do item" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)
                  </label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL da Imagem
                  </label>
                  <Input placeholder="https://exemplo.com/imagem.jpg" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tacos">Tacos</SelectItem>
                      <SelectItem value="burritos">Burritos</SelectItem>
                      <SelectItem value="nachos">Nachos</SelectItem>
                      <SelectItem value="enchiladas">Enchiladas</SelectItem>
                      <SelectItem value="quesadillas">Quesadillas</SelectItem>
                      <SelectItem value="bebidas">Bebidas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nível de Pimenta
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível de pimenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 - Sem pimenta</SelectItem>
                      <SelectItem value="1">1 - Muito leve</SelectItem>
                      <SelectItem value="2">2 - Leve</SelectItem>
                      <SelectItem value="3">3 - Médio</SelectItem>
                      <SelectItem value="4">4 - Picante</SelectItem>
                      <SelectItem value="5">5 - Muito picante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full bg-elgato">
                    Adicionar Item
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>;
};
export default AdminFoodsPage;