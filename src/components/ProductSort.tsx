import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
}

const ProductSort = ({ value, onChange }: ProductSortProps) => {
  return (
    <div className="flex items-center gap-3 justify-center mb-8">
      <ArrowUpDown className="w-5 h-5 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[220px] bg-card border-border">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="puff-desc">Puff Count: High to Low</SelectItem>
          <SelectItem value="name-asc">Alphabetical (A-Z)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSort;
