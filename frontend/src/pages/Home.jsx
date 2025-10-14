import { useState, useEffect } from 'react';
import axios from 'axios';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { ProductCard } from '../components/ProductCard';
import { FilterSheet } from '../components/FilterSheet';
import { FilterPanel } from '../components/FilterPanel';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Home({ searchQuery, onAddToCart, onAddToWishlist, wishlist, userId }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 200000],
    ram: [],
    storage: [],
    minRating: 0
  });
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, filters, sortBy, searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }

    // RAM filter
    if (filters.ram.length > 0) {
      filtered = filtered.filter(p => filters.ram.includes(p.ram));
    }

    // Storage filter
    if (filters.storage.length > 0) {
      filtered = filtered.filter(p => filters.storage.includes(p.storage));
    }

    // Price filter
    filtered = filtered.filter(p => {
      const bestPrice = Math.min(p.amazonPrice, p.flipkartPrice);
      return bestPrice >= filters.priceRange[0] && bestPrice <= filters.priceRange[1];
    });

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.minRating);
    }

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => Math.min(a.amazonPrice, a.flipkartPrice) - Math.min(b.amazonPrice, b.flipkartPrice));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => Math.min(b.amazonPrice, b.flipkartPrice) - Math.min(a.amazonPrice, a.flipkartPrice));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleReset = () => {
    setFilters({
      brands: [],
      priceRange: [0, 200000],
      ram: [],
      storage: [],
      minRating: 0
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 sm:py-12 hero-gradient">
        <ParticlesBackground />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight font-semibold font-heading">
              Find the Best <span className="text-primary">Smartphone Deals</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto">
              Compare prices between Amazon and Flipkart. Never miss a deal!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <FilterSheet 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onApply={applyFiltersAndSort}
                  onReset={handleReset}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredProducts.length} products found
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Best Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Filter Panel */}
            <aside className="hidden lg:block w-72 shrink-0">
              <FilterPanel 
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={applyFiltersAndSort}
                onReset={handleReset}
              />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found matching your filters</p>
                  <Button onClick={handleReset} variant="link" className="mt-4">
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.06
                      }
                    }
                  }}
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={onAddToCart}
                        onAddToWishlist={onAddToWishlist}
                        isInWishlist={wishlist.some(w => w.productId === product.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}