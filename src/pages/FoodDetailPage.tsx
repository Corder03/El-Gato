
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FoodDetail from '../components/FoodDetail';
import { getFoodById } from '../data/foods';

const FoodDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const foodId = parseInt(id || '0');
  const food = getFoodById(foodId);
  
  useEffect(() => {
    if (!food) {
      navigate('/');
    }
  }, [food, navigate]);
  
  if (!food) {
    return null;
  }
  
  return (
    <div className="app-container">
      <Navbar />
      <FoodDetail food={food} />
      <Footer />
    </div>
  );
};

export default FoodDetailPage;
