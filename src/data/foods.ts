
export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  spiceLevel?: number;
  prepTime?: string;
}

export const foods: FoodItem[] = [
  {
    id: 1,
    name: "Tacos de Carne",
    description: "Deliciosos tacos de carne bovina com cebola, coentro e molho especial",
    price: 24.90,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=780&q=80",
    category: "tacos",
    spiceLevel: 2,
    prepTime: "15-20 min"
  },
  {
    id: 2,
    name: "Burrito Supremo",
    description: "Burrito recheado com carne, feijão, arroz, queijo e guacamole",
    price: 32.90,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "burritos",
    spiceLevel: 3,
    prepTime: "20-25 min"
  },
  {
    id: 3,
    name: "Nachos Grande",
    description: "Nachos cobertos com queijo derretido, jalapeños, guacamole e sour cream",
    price: 28.90,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1582169296194-e4d644c48063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1100&q=80",
    category: "nachos",
    spiceLevel: 4,
    prepTime: "10-15 min"
  },
  {
    id: 4,
    name: "Quesadilla de Frango",
    description: "Tortilha recheada com frango desfiado, queijo derretido e pimentões",
    price: 26.90,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "quesadillas",
    spiceLevel: 1,
    prepTime: "15-20 min"
  },
  {
    id: 5,
    name: "Enchiladas Vegetarianas",
    description: "Enchiladas recheadas com legumes, cobertas com molho de tomate e queijo",
    price: 25.90,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    category: "enchiladas",
    spiceLevel: 2,
    prepTime: "20-25 min"
  },
  {
    id: 6,
    name: "Tacos de Camarão",
    description: "Tacos com camarão grelhado, repolho picado e molho picante",
    price: 34.90,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "tacos",
    spiceLevel: 3,
    prepTime: "15-20 min"
  },
  {
    id: 7,
    name: "Margarita",
    description: "Clássica bebida mexicana com tequila, limão e sal",
    price: 18.90,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "bebidas",
    spiceLevel: 0,
    prepTime: "5-10 min"
  },
  {
    id: 8,
    name: "Burrito Vegetariano",
    description: "Burrito com feijão, arroz, legumes grelhados e guacamole",
    price: 28.90,
    rating: 4.3,
    image: "https://www.receiteria.com.br/wp-content/uploads/burrito-vegetariano-capa.jpg",
    category: "burritos",
    spiceLevel: 1,
    prepTime: "15-20 min"
  }
];

export const getFoodById = (id: number): FoodItem | undefined => {
  return foods.find((food) => food.id === id);
};

export const getFoods = (): FoodItem[] => {
  return foods;
};

export const getFoodsByCategory = (category: string): FoodItem[] => {
  if (category === 'all') {
    return foods;
  }
  return foods.filter((food) => food.category === category);
};
