import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Check, X, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductType, AccessorySubtype } from "./StepTypeSelector";
import { BasicInfoData } from "./StepBasicInfo";
import { TechnicalData } from "./StepTechnicalFields";

interface WizardData {
    productType: ProductType | null;
    accessorySubtype: AccessorySubtype | null;
    basicInfo: BasicInfoData;
    technicalData: TechnicalData;
}

interface StepReviewProps {
    wizardData: WizardData;
    onEditStep: (step: number) => void;
}

export const StepReview = ({ wizardData, onEditStep }: StepReviewProps) => {
    const { productType, accessorySubtype, basicInfo, technicalData } = wizardData;

    const imagePreview = basicInfo.mainImage
        ? URL.createObjectURL(basicInfo.mainImage)
        : basicInfo.mainImageUrl;

    const getProductTypeLabel = () => {
        if (productType === "accessory" && accessorySubtype) {
            return `Accessory - ${accessorySubtype.replace("_", " ").replace(/^\w/, c => c.toUpperCase())}`;
        }
        return productType?.replace(/^\w/, c => c.toUpperCase()) || "Unknown";
    };

    const renderTechnicalSpecs = () => {
        const specs: { label: string; value: any }[] = [];

        switch (productType) {
            case "vape":
                if (technicalData.vapeType) specs.push({ label: "Type", value: technicalData.vapeType });
                if (technicalData.puissanceWatt) specs.push({ label: "Wattage", value: `${technicalData.puissanceWatt} W` });
                if (technicalData.capaciteBatterie) specs.push({ label: "Battery", value: `${technicalData.capaciteBatterie} mAh` });
                if (technicalData.capaciteReservoir) specs.push({ label: "Tank Capacity", value: `${technicalData.capaciteReservoir} ml` });
                if (technicalData.niveauUtilisateur) specs.push({ label: "User Level", value: technicalData.niveauUtilisateur });
                specs.push({ label: "Adjustable Airflow", value: technicalData.airflowReglable ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-muted-foreground" /> });
                break;

            case "puff":
                if (technicalData.nombreBouffees) specs.push({ label: "Puff Count", value: `${technicalData.nombreBouffees} puffs` });
                if (technicalData.tauxNicotine) specs.push({ label: "Nicotine", value: technicalData.tauxNicotine });
                if (technicalData.saveur) specs.push({ label: "Flavor", value: technicalData.saveur });
                specs.push({ label: "Rechargeable", value: technicalData.rechargeable ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-muted-foreground" /> });
                break;

            case "liquid":
                if (technicalData.volumeMl) specs.push({ label: "Volume", value: `${technicalData.volumeMl} ml` });
                if (technicalData.tauxNicotine) specs.push({ label: "Nicotine", value: technicalData.tauxNicotine });
                if (technicalData.compositionPgv) specs.push({ label: "PG/VG Ratio", value: technicalData.compositionPgv });
                break;

            case "accessory":
                if (accessorySubtype === "clearomizer") {
                    if (technicalData.contenanceMl) specs.push({ label: "Capacity", value: `${technicalData.contenanceMl} ml` });
                    if (technicalData.embout) specs.push({ label: "Mouthpiece", value: technicalData.embout });
                    if (technicalData.remplissage) specs.push({ label: "Fill Type", value: technicalData.remplissage });
                    if (technicalData.tirage) specs.push({ label: "Draw Type", value: technicalData.tirage });
                    if (technicalData.arriveeAir) specs.push({ label: "Airflow Position", value: technicalData.arriveeAir });
                    specs.push({ label: "Adjustable Airflow", value: technicalData.airflowReglable ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-muted-foreground" /> });
                    if (technicalData.diametreMm) specs.push({ label: "Diameter", value: `${technicalData.diametreMm} mm` });
                    if (technicalData.hauteurMm) specs.push({ label: "Height", value: `${technicalData.hauteurMm} mm` });
                } else if (accessorySubtype === "resistance") {
                    if (technicalData.resistanceOhms) specs.push({ label: "Resistance", value: `${technicalData.resistanceOhms} Ω` });
                    if (technicalData.minWattage) specs.push({ label: "Min Wattage", value: `${technicalData.minWattage} W` });
                    if (technicalData.maxWattage) specs.push({ label: "Max Wattage", value: `${technicalData.maxWattage} W` });
                    if (technicalData.draw) specs.push({ label: "Draw Type", value: technicalData.draw });
                    if (technicalData.consumption) specs.push({ label: "Consumption", value: technicalData.consumption });
                }
                break;
        }

        return specs;
    };

    const specs = renderTechnicalSpecs();

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Review & Confirm</h2>
                <p className="text-muted-foreground">
                    Please review all information before saving
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Image & Basic Info */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Product Information</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => onEditStep(2)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-6">
                            {/* Image */}
                            <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt={basicInfo.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h3 className="text-lg font-semibold">{basicInfo.name || "Untitled Product"}</h3>
                                    <Badge className="mt-1">{getProductTypeLabel()}</Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Price</p>
                                        <p className="font-medium">${parseFloat(basicInfo.price || "0").toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Stock</p>
                                        <p className="font-medium">{basicInfo.stock || 0} units</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-medium",
                                        basicInfo.isActive
                                            ? "bg-green-500/20 text-green-700"
                                            : "bg-red-500/20 text-red-700"
                                    )}>
                                        {basicInfo.isActive ? "Active" : "Inactive"}
                                    </span>
                                    {basicInfo.galleryImages.length > 0 && (
                                        <span className="text-xs text-muted-foreground">
                                            +{basicInfo.galleryImages.length} gallery images
                                        </span>
                                    )}
                                </div>

                                {basicInfo.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {basicInfo.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Technical Specifications */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Technical Specs</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => onEditStep(3)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {specs.length > 0 ? (
                            <div className="space-y-3">
                                {specs.map((spec, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{spec.label}</span>
                                        <span className="font-medium">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No technical specifications added
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Product Type Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Product Type</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => onEditStep(1)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Change
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-lg",
                            productType === "vape" && "bg-blue-500/10 text-blue-600",
                            productType === "puff" && "bg-purple-500/10 text-purple-600",
                            productType === "liquid" && "bg-cyan-500/10 text-cyan-600",
                            productType === "accessory" && "bg-orange-500/10 text-orange-600"
                        )}>
                            <Package className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-medium">{getProductTypeLabel()}</p>
                            <p className="text-sm text-muted-foreground">
                                {productType === "vape" && "Kits, Pods, Box Mods, Pen devices"}
                                {productType === "puff" && "Disposable vapes with set puff count"}
                                {productType === "liquid" && "E-liquids, nicotine salts, flavors"}
                                {productType === "accessory" && "Coils, tanks, batteries, and more"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-green-700">Ready to save</p>
                        <p className="text-sm text-green-600">
                            All required information has been provided. Click "Create Product" to save.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
