import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Star, Heart, ShoppingCart, ExternalLink, Bell, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { DealAlertDialog } from '../components/DealAlertDialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ProductDetail({ onAddToCart, onAddToWishlist, wishlist, userId }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleSetAlert = async (data) => {
    try {
      await axios.post(`${API}/price-alerts`, {
        userId: userId || 'guest',
        productId: product.id,
        targetPrice: data.targetPrice,
        email: data.email
      });
      toast.success('Price alert set successfully!');
      setShowAlertDialog(false);
    } catch (error) {
      toast.error('Failed to set price alert');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Link to="/">
          <Button className="mt-4">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const bestPrice = Math.min(product.amazonPrice, product.flipkartPrice);
  const bestStore = product.amazonPrice < product.flipkartPrice ? 'Amazon' : 'Flipkart';
  const isInWishlist = wishlist.some(w => w.productId === product.id);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div>
            <Card className="p-8">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.brand}</Badge>
              <h1 className="text-3xl font-bold font-heading mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <Badge variant="secondary">{product.ram} RAM</Badge>
                <Badge variant="secondary">{product.storage} Storage</Badge>
              </div>
            </div>

            {/* Price Comparison */}
            <Card data-testid="compare-table" className="p-6">
              <h3 className="font-semibold mb-4">Price Comparison</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FF9900] rounded flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>
                    <span className="font-medium">Amazon</span>
                  </div>
                  <div className="text-right">
                    <div data-testid="compare-amazon-price" className="font-bold text-lg">
                      ₹{product.amazonPrice.toLocaleString()}
                    </div>
                    <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="link" size="sm" className="h-auto p-0">
                        View on Amazon <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#2874F0] rounded flex items-center justify-center text-white text-xs font-bold">
                      F
                    </div>
                    <span className="font-medium">Flipkart</span>
                  </div>
                  <div className="text-right">
                    <div data-testid="compare-flipkart-price" className="font-bold text-lg">
                      ₹{product.flipkartPrice.toLocaleString()}
                    </div>
                    <a href={product.flipkartUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="link" size="sm" className="h-auto p-0">
                        View on Flipkart <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-accent/10 border border-accent rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Best Deal</span>
                  <div className="text-right">
                    <Badge data-testid="best-price-badge" className="bg-accent text-accent-foreground">
                      {bestStore}
                    </Badge>
                    <div className="font-bold text-xl mt-1">₹{bestPrice.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                data-testid="add-to-cart-button"
                className="flex-1" 
                size="lg"
                onClick={() => onAddToCart(product, bestStore)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button 
                data-testid="wishlist-toggle"
                variant="outline" 
                size="lg"
                onClick={() => onAddToWishlist(product)}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button 
                data-testid="deal-alert-open"
                variant="outline" 
                size="lg"
                onClick={() => setShowAlertDialog(true)}
              >
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Specifications Tabs */}
        <Tabs defaultValue="specs" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specs">
            <Card data-testid="specs-table" className="p-6">
              <h3 className="font-semibold text-lg mb-4">Technical Specifications</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Processor</TableCell>
                    <TableCell>{product.processor}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">RAM</TableCell>
                    <TableCell>{product.ram}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Storage</TableCell>
                    <TableCell>{product.storage}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Display</TableCell>
                    <TableCell>{product.display}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Camera</TableCell>
                    <TableCell>{product.camera}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Battery</TableCell>
                    <TableCell>{product.battery}</TableCell>
                  </TableRow>
                  {product.specifications?.os && (
                    <TableRow>
                      <TableCell className="font-medium">Operating System</TableCell>
                      <TableCell>{product.specifications.os}</TableCell>
                    </TableRow>
                  )}
                  {product.specifications?.['5g'] && (
                    <TableRow>
                      <TableCell className="font-medium">5G Support</TableCell>
                      <TableCell>{product.specifications['5g']}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Product Details</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground/80">
                  The {product.name} features a powerful {product.processor} processor, {product.ram} of RAM, 
                  and {product.storage} of storage. It has a stunning {product.display} display and 
                  a {product.camera} camera setup. The {product.battery} battery ensures all-day usage.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DealAlertDialog 
        open={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
        product={product}
        onSubmit={handleSetAlert}
      />
    </div>
  );
}