import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Bell } from 'lucide-react';

export const DealAlertDialog = ({ open, onClose, product, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, targetPrice: parseFloat(targetPrice) });
    setEmail('');
    setTargetPrice('');
  };

  const bestPrice = product ? Math.min(product.amazonPrice, product.flipkartPrice) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Set Price Alert
          </DialogTitle>
          <DialogDescription>
            Get notified when the price drops below your target
          </DialogDescription>
        </DialogHeader>
        
        {product && (
          <div className="space-y-4">
            <div className="rounded-lg border p-3">
              <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Current best price: ₹{bestPrice.toLocaleString()}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target-price">Target Price (₹)</Label>
                <Input
                  id="target-price"
                  type="number"
                  placeholder="Enter target price"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  required
                  min="1"
                  max={bestPrice}
                />
                <p className="text-xs text-muted-foreground">
                  You'll be notified when price drops below ₹{targetPrice || '0'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-email">Email Address</Label>
                <Input
                  id="alert-email"
                  data-testid="deal-alert-email-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button data-testid="deal-alert-submit" type="submit" className="w-full">
                Set Alert
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};