import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const brands = ['Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'Google', 'Vivo', 'Realme', 'Oppo'];
const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB'];
const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];

export const FilterSheet = ({ filters, onFilterChange, onApply, onReset }) => {
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApply();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button data-testid="open-filter-sheet" variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            <Button data-testid="filter-reset-button" variant="ghost" size="sm" onClick={onReset}>
              Reset
            </Button>
          </div>
        </SheetHeader>
        <div className="mt-6">
          <Accordion type="multiple" className="space-y-2">
            <AccordionItem value="brand">
              <AccordionTrigger className="text-sm font-medium">Brand</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {brands.map(b => (
                    <label key={b} className="flex items-center gap-2 py-1 cursor-pointer">
                      <Checkbox 
                        data-testid="filter-brand-checkbox"
                        checked={filters.brands?.includes(b)}
                        onCheckedChange={(checked) => {
                          const newBrands = checked 
                            ? [...(filters.brands || []), b]
                            : (filters.brands || []).filter(brand => brand !== b);
                          onFilterChange({ brands: newBrands });
                        }}
                      />
                      <span className="text-sm">{b}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price">
              <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Slider 
                    data-testid="filter-price-slider"
                    value={filters.priceRange || [0, 200000]}
                    onValueChange={(value) => onFilterChange({ priceRange: value })}
                    max={200000}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹{filters.priceRange?.[0]?.toLocaleString() || 0}</span>
                    <span>₹{filters.priceRange?.[1]?.toLocaleString() || 200000}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ram">
              <AccordionTrigger className="text-sm font-medium">RAM</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {ramOptions.map(r => (
                    <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
                      <Checkbox 
                        checked={filters.ram?.includes(r)}
                        onCheckedChange={(checked) => {
                          const newRam = checked 
                            ? [...(filters.ram || []), r]
                            : (filters.ram || []).filter(ram => ram !== r);
                          onFilterChange({ ram: newRam });
                        }}
                      />
                      <span className="text-sm">{r}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="storage">
              <AccordionTrigger className="text-sm font-medium">Storage</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {storageOptions.map(s => (
                    <label key={s} className="flex items-center gap-2 py-1 cursor-pointer">
                      <Checkbox 
                        checked={filters.storage?.includes(s)}
                        onCheckedChange={(checked) => {
                          const newStorage = checked 
                            ? [...(filters.storage || []), s]
                            : (filters.storage || []).filter(storage => storage !== s);
                          onFilterChange({ storage: newStorage });
                        }}
                      />
                      <span className="text-sm">{s}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rating">
              <AccordionTrigger className="text-sm font-medium">Minimum Rating</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Slider 
                    value={[filters.minRating || 0]}
                    onValueChange={(value) => onFilterChange({ minRating: value[0] })}
                    max={5}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {filters.minRating || 0} stars & above
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <Button 
          data-testid="filter-apply-button" 
          className="mt-6 w-full" 
          onClick={handleApply}
        >
          Apply Filters
        </Button>
      </SheetContent>
    </Sheet>
  );
};