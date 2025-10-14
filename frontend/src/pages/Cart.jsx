import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, ExternalLink, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cart({ cart, products, onRemove }) {
  const cartProducts = cart.map(c => {
    const product = products.find(p => p.id === c.productId);
    return product ? { ...product, cartId: c.id, selectedStore: c.selectedStore } : null;
  }).filter(Boolean);

  const totalAmount = cartProducts.reduce((sum, p) => {
    const price = p.selectedStore === 'Amazon' ? p.amazonPrice : p.flipkartPrice;
    return sum + price;
  }, 0);

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🛒</div>
          <h2 className="text-2xl font-bold font-heading">Your cart is empty</h2>
          <p className="text-muted-foreground">Add products to your cart to proceed</p>
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
          <h1 className="text-3xl font-bold font-heading mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">{cartProducts.length} items</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map((product, index) => {
              const selectedPrice = product.selectedStore === 'Amazon' 
                ? product.amazonPrice 
                : product.flipkartPrice;
              const selectedUrl = product.selectedStore === 'Amazon'
                ? product.amazonUrl
                : product.flipkartUrl;

              return (
                <motion.div
                  key={product.cartId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card data-testid="cart-item-row" className="p-4">
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
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {product.selectedStore}
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <div className="font-bold text-lg">₹{selectedPrice.toLocaleString()}</div>
                          <a href={selectedUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                              Buy on {product.selectedStore} <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          </a>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              data-testid="remove-from-cart-button"
                              variant="outline" 
                              size="icon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove from cart?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this item from your cart?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onRemove(product.id)}>
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div>
            <Card className="p-6 sticky top-20">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{cartProducts.length}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center mb-3">
                  Click on individual product "Buy on" links to complete purchase on respective platforms
                </p>
                <Button className="w-full" size="lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}