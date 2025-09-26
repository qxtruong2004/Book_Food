import React from 'react';
import logo from './logo.svg';
import './App.css';
import Loading from './components/common/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { Route, Routes, Navigate } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import FoodPage from './pages/FoodPage';
import ReviewsTestPage from './pages/ReviewsTestPage';
import LoginPage from './pages/LoginPage';
import { ToastContainer } from 'react-toastify';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import CategoryPage from './pages/CategoryPage';
import { ROUTE_PATTERNS, ROUTES } from './utils/constants';


// ✨ Mới thêm
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import { OrderDraftProvider } from './context/OrderDraftContext';
import { useAuth } from './hooks/useAuth';
import { JSX } from 'react/jsx-runtime';
import FoodDetailsPage from './pages/FoodDetailsPage ';

const BuggyComponent = () => {
  throw new Error("Lỗi test!");
};

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
    {/* phần OrderDraftProvider bao ngoài vì Header vẫn muốn hiện badge, Header phải nằm bên trong Provider; mà Header thường ở MainLayout bao toàn bộ → */}
      <OrderDraftProvider> 
        <Routes>
          {/* Layout chính */}
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<FoodPage />} />
            <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
            <Route path={ROUTE_PATTERNS.FOOD_DETAIL} element={<FoodDetailsPage />} />


            <Route path="/reviews" element={<ReviewsTestPage />} />
            {/* Đặt hàng */}
            <Route path={ROUTES.CHECKOUT} element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path={ROUTES.ORDERS} element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
            <Route path={ROUTE_PATTERNS.ORDER_DETAL} element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
          </Route>

          {/* Layout cho login/register */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </OrderDraftProvider>

      {/* Toast đặt ngoài cùng để toàn app đều gọi được */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
