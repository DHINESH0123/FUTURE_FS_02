import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Wishlist({ wishlist, products, onRemove, onMoveToCart }) {
  const wishlistProducts = wishlist.map(w => {
    const product = products.find(p => p.id === w.productId);
    return product ? { ...product, wishlistId: w.id } : null;
  }).filter(Boolean);

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">💝</div>
          <h2 className="text-2xl font-bold font-heading">Your wishlist is empty</h2>
          <p className="text-muted-foreground">Add products to your wishlist to save them for later</p>
          <Link to="/">
            <Button className="mt-4">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlistProducts.length} items</p>
        </div>

        <div className="grid gap-4">
          {wishlistProducts.map((product, index) => {
            const bestPrice = Math.min(product.amazonPrice, product.flipkartPrice);
            const bestStore = product.amazonPrice < product.flipkartPrice ? 'Amazon' : 'Flipkart';

            return (
              <motion.div
                key={product.wishlistId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card data-testid="wishlist-item-row" className="p-4">
                  <div className="flex gap-4">
                    <Link to={`/product/${product.id}`} className="shrink-0">
                      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">{product.ram}</Badge>
                        <Badge variant="secondary" className="text-xs">{product.storage}</Badge>
                        <Badge className="bg-accent text-accent-foreground text-xs">
                          Best: ₹{bestPrice.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Amazon: </span>
                          <span className="font-semibold">₹{product.amazonPrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Flipkart: </span>
                          <span className="font-semibold">₹{product.flipkartPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button 
                        size="sm" 
                        onClick={() => onMoveToCart(product, bestStore)}
                        className="whitespace-nowrap"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Move to Cart
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onRemove(product.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}