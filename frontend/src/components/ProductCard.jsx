import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const ProductCard = ({ product, onAddToCart, onAddToWishlist, isInWishlist }) => {
  const bestPrice = Math.min(product.amazonPrice, product.flipkartPrice);
  const bestStore = product.amazonPrice < product.flipkartPrice ? 'Amazon' : 'Flipkart';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <Card data-testid="product-card" className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-md transition-[box-shadow,background-color] duration-200">
        <div className="p-3 space-y-3">
          <Link to={`/product/${product.id}`}>
            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                loading="lazy" 
              />
            </div>
          </Link>
          
          <div className="space-y-2">
            <Link to={`/product/${product.id}`}>
              <h3 className="line-clamp-2 font-medium text-sm md:text-base hover:text-primary transition-colors">{product.name}</h3>
            </Link>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <Badge variant="secondary" className="text-xs">{product.ram}</Badge>
              <Badge variant="secondary" className="text-xs">{product.storage}</Badge>
            </div>
          </div>

          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/70">Amazon</span>
              <span data-testid="compare-amazon-price" className="font-semibold">₹{product.amazonPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/70">Flipkart</span>
              <span data-testid="compare-flipkart-price" className="font-semibold">₹{product.flipkartPrice.toLocaleString()}</span>
            </div>
            <Badge 
              data-testid="best-price-badge" 
              className="w-full justify-center bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Best on {bestStore} - ₹{bestPrice.toLocaleString()}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              data-testid="add-to-cart-button" 
              className="flex-1 h-9 text-sm" 
              onClick={() => onAddToCart(product, bestStore)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button 
              data-testid="wishlist-toggle" 
              variant="outline" 
              size="icon"
              className="h-9 w-9"
              onClick={() => onAddToWishlist(product)}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};