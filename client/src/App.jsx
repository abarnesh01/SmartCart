import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/common/Toast';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected route wrapper for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin route wrapper for administrator accounts
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated && isAdmin ? children : <Navigate to="/login" replace />;
};

// Storefront layout wrapper with header and footer
const StoreLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <Router>
                <ScrollToTop />
                <Routes>
                  {/* Public Storefront Routes */}
                  <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
                  <Route path="/catalog" element={<StoreLayout><Catalog /></StoreLayout>} />
                  <Route path="/product/:id" element={<StoreLayout><ProductDetail /></StoreLayout>} />
                  <Route path="/cart" element={<StoreLayout><CartPage /></StoreLayout>} />
                  <Route path="/wishlist" element={<StoreLayout><WishlistPage /></StoreLayout>} />
                  <Route path="/login" element={<StoreLayout><LoginPage /></StoreLayout>} />
                  <Route path="/register" element={<StoreLayout><RegisterPage /></StoreLayout>} />

                  {/* Protected Customer Routes */}
                  <Route path="/checkout" element={<ProtectedRoute><StoreLayout><CheckoutPage /></StoreLayout></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><StoreLayout><OrderHistoryPage /></StoreLayout></ProtectedRoute>} />
                  <Route path="/orders/:id" element={<ProtectedRoute><StoreLayout><OrderDetailPage /></StoreLayout></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><StoreLayout><ProfilePage /></StoreLayout></ProtectedRoute>} />

                  {/* Admin Dashboard Routes */}
                  <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
                  <Route path="/admin/reviews" element={<AdminRoute><AdminReviewsPage /></AdminRoute>} />
                  <Route path="/admin/analytics" element={<AdminRoute><AdminAnalyticsPage /></AdminRoute>} />

                  {/* Fallback 404 Route */}
                  <Route path="*" element={<StoreLayout><NotFoundPage /></StoreLayout>} />
                </Routes>
              </Router>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
