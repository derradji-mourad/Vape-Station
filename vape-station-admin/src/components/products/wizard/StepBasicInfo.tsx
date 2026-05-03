import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductType } from "./StepTypeSelector";

export interface BasicInfoData {
    name: string;
    brandId: number | null;
    price: string;
    costPrice: string;
    stock: string;
    lowStockThreshold: string;
    description: string;
    isActive: boolean;
    mainImage: File | null;
    mainImageUrl?: string;
    galleryImages: File[];
}

interface Brand {
    id_marque: number;
    nom: string;
}

interface StepBasicInfoProps {
    data: BasicInfoData;
    productType: ProductType | null;
    onChange: (data: BasicInfoData) => void;
}

export const StepBasicInfo = ({
    data,
    productType,
    onChange,
}: StepBasicInfoProps) => {
    const { toast } = useToast();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [showNewBrandDialog, setShowNewBrandDialog] = useState(false);
    const [newBrandName, setNewBrandName] = useState("");
    const [creatingBrand, setCreatingBrand] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const { data: brandsData, error } = await supabase
                .from("marque")
                .select("*")
                .order("nom");

            if (error) throw error;
            setBrands(brandsData || []);
        } catch (error) {
            console.error("Error fetching brands:", error);
        } finally {
            setLoadingBrands(false);
        }
    };

    const handleCreateBrand = async () => {
        if (!newBrandName.trim()) return;
        setCreatingBrand(true);

        try {
            const { data: newBrand, error } = await supabase
                .from("marque")
                .insert({ nom: newBrandName.trim(), logo_path: "" })
                .select()
                .single();

            if (error) throw error;

            setBrands([...brands, newBrand]);
            onChange({ ...data, brandId: newBrand.id_marque });
            setShowNewBrandDialog(false);
            setNewBrandName("");

            toast({
                title: "Brand created",
                description: `"${newBrand.nom}" has been added.`,
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error creating brand",
                description: error.message,
            });
        } finally {
            setCreatingBrand(false);
        }
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith("image/")) {
                    onChange({ ...data, mainImage: file });
                }
            }
        },
        [data, onChange]
    );

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onChange({ ...data, mainImage: e.target.files[0] });
        }
    };

    const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            onChange({ ...data, galleryImages: [...data.galleryImages, ...newFiles] });
        }
    };

    const removeGalleryImage = (index: number) => {
        const newImages = data.galleryImages.filter((_, i) => i !== index);
        onChange({ ...data, galleryImages: newImages });
    };

    const imagePreview = data.mainImage
        ? URL.createObjectURL(data.mainImage)
        : data.mainImageUrl;

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
                <p className="text-muted-foreground">
                    Enter the essential product details
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-4">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Product Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter product name"
                            value={data.name}
                            onChange={(e) => onChange({ ...data, name: e.target.value })}
                        />
                    </div>

                    {/* Brand Selector - Only for vapes */}
                    {productType === "vape" && (
                        <div className="space-y-2">
                            <Label>Brand</Label>
                            <div className="flex gap-2">
                                <Select
                                    value={data.brandId?.toString() || ""}
                                    onValueChange={(value) =>
                                        onChange({ ...data, brandId: value ? parseInt(value) : null })
                                    }
                                    disabled={loadingBrands}
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select a brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands.map((brand) => (
                                            <SelectItem
                                                key={brand.id_marque}
                                                value={brand.id_marque.toString()}
                                            >
                                                {brand.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setShowNewBrandDialog(true)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Price, Cost, Stock, Alert Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">
                                Selling Price ($) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={data.price}
                                onChange={(e) => onChange({ ...data, price: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="costPrice">
                                Cost Price ($) <span className="text-muted-foreground text-xs">(Profit calc)</span>
                            </Label>
                            <Input
                                id="costPrice"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={data.costPrice}
                                onChange={(e) => onChange({ ...data, costPrice: e.target.value })}
                            />
                        </div>

                        {/* Profit Calc Display */}
                        {data.price && data.costPrice && (
                            <div className="col-span-2 bg-muted/30 p-3 rounded-lg flex items-center justify-between text-sm border border-border/50">
                                <span className="text-muted-foreground">Unit Profit:</span>
                                <div className="flex gap-4">
                                    <span className={cn(
                                        "font-bold",
                                        (parseFloat(data.price) - parseFloat(data.costPrice)) >= 0 ? "text-green-600" : "text-destructive"
                                    )}>
                                        ${(parseFloat(data.price) - parseFloat(data.costPrice)).toFixed(2)}
                                    </span>
                                    <span className={cn(
                                        "font-medium",
                                        ((parseFloat(data.price) - parseFloat(data.costPrice)) / parseFloat(data.price) * 100) >= 20 ? "text-green-600" : "text-orange-500"
                                    )}>
                                        {((parseFloat(data.price) - parseFloat(data.costPrice)) / parseFloat(data.price) * 100).toFixed(1)}% Margin
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="stock">
                                Stock Quantity <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={data.stock}
                                onChange={(e) => onChange({ ...data, stock: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lowStockThreshold">
                                Low Stock Alert
                            </Label>
                            <Input
                                id="lowStockThreshold"
                                type="number"
                                min="0"
                                placeholder="5"
                                value={data.lowStockThreshold}
                                onChange={(e) => onChange({ ...data, lowStockThreshold: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter product description..."
                            rows={4}
                            value={data.description}
                            onChange={(e) =>
                                onChange({ ...data, description: e.target.value })
                            }
                        />
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                            <Label htmlFor="active" className="font-medium">
                                Active
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Product will be visible to customers
                            </p>
                        </div>
                        <Switch
                            id="active"
                            checked={data.isActive}
                            onCheckedChange={(checked) =>
                                onChange({ ...data, isActive: checked })
                            }
                        />
                    </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-4">
                    {/* Main Image Upload */}
                    <div className="space-y-2">
                        <Label>
                            Main Image <span className="text-destructive">*</span>
                        </Label>
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={cn(
                                "relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer",
                                dragActive
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/25 hover:border-primary/50",
                                imagePreview && "p-2"
                            )}
                        >
                            {imagePreview ? (
                                <div className="relative aspect-square rounded-lg overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onChange({ ...data, mainImage: null, mainImageUrl: undefined })}
                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                                    <div className="p-4 rounded-full bg-primary/10 mb-4">
                                        <Upload className="h-8 w-8 text-primary" />
                                    </div>
                                    <p className="font-medium mb-1">Drop image here or click to upload</p>
                                    <p className="text-sm text-muted-foreground">
                                        PNG, JPG or WEBP (max. 5MB)
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Gallery Images */}
                    <div className="space-y-2">
                        <Label>Gallery Images (optional)</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {data.galleryImages.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-square rounded-lg overflow-hidden group"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(index)}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    >
                                        <X className="h-6 w-6 text-white" />
                                    </button>
                                </div>
                            ))}
                            {data.galleryImages.length < 6 && (
                                <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors">
                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleGallerySelect}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* New Brand Dialog */}
            <Dialog open={showNewBrandDialog} onOpenChange={setShowNewBrandDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Brand</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="brandName">Brand Name</Label>
                            <Input
                                id="brandName"
                                placeholder="Enter brand name"
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowNewBrandDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateBrand}
                            disabled={!newBrandName.trim() || creatingBrand}
                        >
                            {creatingBrand && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
