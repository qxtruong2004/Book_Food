import React from 'react';
import logo from './logo.svg';
import './App.css';
import Loading from './components/common/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { Route, Routes } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import FoodPage from './pages/FoodPage';
import OrdersTestPage from './pages/OrdersTestPage';
import ReviewsTestPage from './pages/ReviewsTestPage';
import LoginPage from './pages/LoginPage';
import { ToastContainer } from 'react-toastify';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import CategoryPage from './pages/CategoryPage';
import { ROUTE_PATTERNS, ROUTES } from './utils/constants';
import FoodDetailsPage from './pages/FoodDetailsPage ';
const BuggyComponent = () => {
  throw new Error("Lỗi test!");
};

function App() {
  return (
    <>
      <Routes>
        {/* Layout chính */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<FoodPage />} />
          <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
          <Route path={ROUTE_PATTERNS.FOOD_DETAIL} element={<FoodDetailsPage />} />
          <Route path="/reviews" element={<ReviewsTestPage />} />
        </Route>

        {/* Layout cho login/register */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>

      {/* Toast đặt ngoài cùng để toàn app đều gọi được */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
