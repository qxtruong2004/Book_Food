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
import FoodTestPage from './pages/FoodTestPage';
import FoodListTestPage from './pages/FoodListTestPage';
import FoodDetailsTestPage from './pages/FoodDetailsTestPage ';
import FoodPage from './pages/FoodPage';
import OrdersTestPage from './pages/OrdersTestPage';
import ReviewsTestPage from './pages/ReviewsTestPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { ToastContainer } from 'react-toastify';
const BuggyComponent = () => {
  throw new Error("Lỗi test!");
};

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/category" element={<HomePage />} />
          <Route path="/cart" element={<OrdersTestPage />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reviews" element={<ReviewsTestPage />} />

          {/* Admin pages (sau này) */}
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
