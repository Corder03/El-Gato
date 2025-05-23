
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FoodDetailPage from "./pages/FoodDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminFoodsPage from "./pages/AdminFoodsPage";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import OrdersPage from "./pages/OrdersPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./hooks/useCart";
import { OrderProvider } from "./hooks/useOrderSystem";
import { ThemeProvider } from "./hooks/useTheme";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <CartProvider>
        <OrderProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/food/:id" element={<FoodDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/foods" element={<AdminFoodsPage />} />
                <Route path="/admin/revenue" element={<AdminOrdersPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </OrderProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
