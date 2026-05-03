import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-card border-border">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        <Skeleton className="h-8 w-16" />
      </CardContent>
      
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export const AccessoryCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <Skeleton className="aspect-square w-full rounded-lg mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-6 w-16" />
      </CardContent>
    </Card>
  );
};
