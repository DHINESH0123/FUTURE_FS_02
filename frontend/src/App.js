import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Navbar } from './components/Navbar';
import { AuthDialog } from './components/AuthDialog';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import '@/App.css';

// Firebase auth (optional - works without Firebase too)
import { auth, googleProvider } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('guestUserId') || `guest-${Date.now()}`);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    // Store guest user ID
    if (!localStorage.getItem('guestUserId')) {
      localStorage.setItem('guestUserId', userId);
    }
    
    // Seed products on first load
    seedProducts();
    
    // Load user data
    loadUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWishlist();
      fetchCart();
    }
  }, [userId]);

  const seedProducts = async () => {
    try {
      await axios.post(`${API}/admin/seed-products`);
      fetchProducts();
    } catch (error) {
      console.error('Error seeding products:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const loadUserData = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setUserId(JSON.parse(savedUser).id);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${API}/wishlist/${userId}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API}/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleAuth = async (authData) => {
    try {
      if (authData.provider === 'google') {
        // Google Sign In
        if (!auth || !googleProvider) {
          toast.error('Firebase not configured. Please add Firebase credentials.');
          return;
        }
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        
        // Create user in backend
        const response = await axios.post(`${API}/users`, {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          firebaseUid: firebaseUser.uid
        });
        
        const newUser = response.data;
        setUser(newUser);
        setUserId(newUser.id);
        localStorage.setItem('user', JSON.stringify(newUser));
        toast.success(`Welcome, ${newUser.name}!`);
        setShowAuthDialog(false);
      } else {
        // Email/Password Auth
        if (!auth) {
          // Mock auth for demo
          const mockUser = {
            id: `user-${Date.now()}`,
            email: authData.email,
            name: authData.name || authData.email.split('@')[0],
            firebaseUid: `mock-${Date.now()}`
          };
          
          const response = await axios.post(`${API}/users`, mockUser);
          const newUser = response.data;
          setUser(newUser);
          setUserId(newUser.id);
          localStorage.setItem('user', JSON.stringify(newUser));
          toast.success(`Welcome, ${newUser.name}!`);
          setShowAuthDialog(false);
          return;
        }

        let firebaseUser;
        if (authData.isLogin) {
          const result = await signInWithEmailAndPassword(auth, authData.email, authData.password);
          firebaseUser = result.user;
        } else {
          const result = await createUserWithEmailAndPassword(auth, authData.email, authData.password);
          firebaseUser = result.user;
        }
        
        const response = await axios.post(`${API}/users`, {
          email: firebaseUser.email,
          name: authData.name || firebaseUser.email.split('@')[0],
          firebaseUid: firebaseUser.uid
        });
        
        const newUser = response.data;
        setUser(newUser);
        setUserId(newUser.id);
        localStorage.setItem('user', JSON.stringify(newUser));
        toast.success(`Welcome, ${newUser.name}!`);
        setShowAuthDialog(false);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed');
    }
  };

  const handleAddToCart = async (product, selectedStore) => {
    try {
      // Check if already in cart
      const existing = cart.find(c => c.productId === product.id);
      if (existing) {
        toast.info('Product already in cart');
        return;
      }

      await axios.post(`${API}/cart`, {
        userId,
        productId: product.id,
        selectedStore
      });
      
      fetchCart();
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 400) {
        toast.info('Product already in cart');
      } else {
        toast.error('Failed to add to cart');
      }
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const existing = wishlist.find(w => w.productId === product.id);
      
      if (existing) {
        // Remove from wishlist
        await axios.delete(`${API}/wishlist/${userId}/${product.id}`);
        fetchWishlist();
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await axios.post(`${API}/wishlist`, {
          userId,
          productId: product.id
        });
        fetchWishlist();
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      console.error('Error managing wishlist:', error);
      if (error.response?.status === 400) {
        toast.info('Product already in wishlist');
      } else {
        toast.error('Failed to update wishlist');
      }
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API}/wishlist/${userId}/${productId}`);
      fetchWishlist();
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.delete(`${API}/cart/${userId}/${productId}`);
      fetchCart();
      toast.success('Removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const handleMoveToCart = async (product, bestStore) => {
    await handleRemoveFromWishlist(product.id);
    await handleAddToCart(product, bestStore);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cartCount={cart.length}
          wishlistCount={wishlist.length}
          onLoginClick={() => setShowAuthDialog(true)}
          user={user}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                searchQuery={searchQuery}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlist={wishlist}
                userId={userId}
              />
            } 
          />
          <Route 
            path="/product/:id" 
            element={
              <ProductDetail 
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlist={wishlist}
                userId={userId}
              />
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <Wishlist 
                wishlist={wishlist}
                products={products}
                onRemove={handleRemoveFromWishlist}
                onMoveToCart={handleMoveToCart}
              />
            } 
          />
          <Route 
            path="/cart" 
            element={
              <Cart 
                cart={cart}
                products={products}
                onRemove={handleRemoveFromCart}
              />
            } 
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <AuthDialog 
          open={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          onAuth={handleAuth}
        />

        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;