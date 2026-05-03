import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Loader2,
    Wind,
    Cigarette,
    Droplets,
    Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import wizard steps
import { StepTypeSelector, ProductType, AccessorySubtype } from "@/components/products/wizard/StepTypeSelector";
import { StepBasicInfo, BasicInfoData } from "@/components/products/wizard/StepBasicInfo";
import { StepTechnicalFields, TechnicalData } from "@/components/products/wizard/StepTechnicalFields";
import { StepReview } from "@/components/products/wizard/StepReview";
import StockHistoryPanel from "@/components/products/StockHistoryPanel";

interface WizardData {
    productType: ProductType | null;
    accessorySubtype: AccessorySubtype | null;
    basicInfo: BasicInfoData;
    technicalData: TechnicalData;
}

const initialWizardData: WizardData = {
    productType: null,
    accessorySubtype: null,
    basicInfo: {
        name: "",
        brandId: null,
        price: "",
        stock: "",
        lowStockThreshold: "5",
        costPrice: "",
        description: "",
        isActive: true,
        mainImage: null,
        galleryImages: [],
    },
    technicalData: {},
};

const steps = [
    { id: 1, title: "Product Type", description: "Select category" },
    { id: 2, title: "Basic Info", description: "Name, price, images" },
    { id: 3, title: "Technical", description: "Specifications" },
    { id: 4, title: "Review", description: "Confirm & save" },
];

const ProductWizard = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditing = !!id;

    const [currentStep, setCurrentStep] = useState(1);
    const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            const { data, error } = await supabase
                .from("produit")
                .select(`
          *,
          puff:puff!puff_id_produit_fkey(*),
          vape:vape!vape_id_produit_fkey(*, marque:id_marque (*)),
          liquide:liquide!liquide_id_produit_fkey(*),
          clearomiseur:clearomiseur!clearomiseur_id_produit_fkey(*)
        `)
                // Use maybeSingle() to handle missing rows safely without PGRST116 error
                .eq("id_produit", parseInt(id!))
                .maybeSingle();

            if (error) throw error;
            if (!data) throw new Error("Product not found");

            // Determine product type
            let productType: ProductType = "vape";
            let technicalData: TechnicalData = {};

            if (data.puff) {
                productType = "puff";
                technicalData = {
                    nombreBouffees: data.puff.nombre_bouffees?.toString() || "",
                    tauxNicotine: data.puff.taux_nicotine || "",
                    saveur: data.puff.saveur || "",
                    rechargeable: data.puff.rechargeable || false,
                };
            } else if (data.vape) {
                productType = "vape";
                technicalData = {
                    vapeType: data.vape.type || "Pod",
                    puissanceWatt: data.vape.puissance_watt?.toString() || "",
                    capaciteBatterie: data.vape.capacite_batterie_mah?.toString() || "",
                    capaciteReservoir: data.vape.capacite_reservoir_ml?.toString() || "",
                    airflowReglable: data.vape.airflow_reglable || false,
                    niveauUtilisateur: data.vape.niveau_utilisateur || "",
                };
            } else if (data.liquide) {
                productType = "liquid";
                technicalData = {
                    volumeMl: data.liquide.volume_ml?.toString() || "",
                    tauxNicotine: data.liquide.taux_nicotine || "",
                    compositionPgv: data.liquide.composition_pgv || "",
                };
            } else if (data.clearomiseur) {
                productType = "accessory";
                technicalData = {
                    contenanceMl: data.clearomiseur.contenance_ml?.toString() || "",
                    embout: data.clearomiseur.embout || "",
                    remplissage: data.clearomiseur.remplissage || "",
                    tirage: data.clearomiseur.tirage || "",
                    arriveeAir: data.clearomiseur.arrivee_air || "",
                    airflowReglable: data.clearomiseur.airflow_reglable || false,
                    diametreMm: data.clearomiseur.diametre_mm?.toString() || "",
                    hauteurMm: data.clearomiseur.hauteur_mm?.toString() || "",
                };
            }

            setWizardData({
                productType,
                accessorySubtype: productType === "accessory" ? "clearomizer" : null,
                basicInfo: {
                    name: data.nom,
                    brandId: data.vape?.id_marque || null,
                    price: data.prix?.toString() || "",
                    stock: data.stock?.toString() || "",
                    costPrice: data.cout_achat?.toString() || "",
                    lowStockThreshold: data.seuil_alerte?.toString() || "5",
                    description: data.description || "",
                    isActive: data.actif ?? true,
                    mainImage: null,
                    mainImageUrl: data.image_principale,
                    galleryImages: [],
                },
                technicalData,
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error loading product",
                description: error.message,
            });
            navigate("/admin/products");
        } finally {
            setLoading(false);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return wizardData.productType !== null;
            case 2:
                return (
                    wizardData.basicInfo.name.trim() !== "" &&
                    wizardData.basicInfo.price !== "" &&
                    wizardData.basicInfo.stock !== "" &&
                    (wizardData.basicInfo.mainImage !== null || wizardData.basicInfo.mainImageUrl)
                );
            case 3:
                return true; // Technical fields can be optional
            case 4:
                return true;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (canProceed() && currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            let imageUrl = wizardData.basicInfo.mainImageUrl || "";

            // Upload main image if new one was selected
            if (wizardData.basicInfo.mainImage) {
                const file = wizardData.basicInfo.mainImage;
                const fileExt = file.name.split(".").pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("product-images")
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from("product-images")
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            // Prepare product data
            const productData = {
                nom: wizardData.basicInfo.name,
                description: wizardData.basicInfo.description,
                prix: parseFloat(wizardData.basicInfo.price),
                stock: parseInt(wizardData.basicInfo.stock),
                cout_achat: wizardData.basicInfo.costPrice ? parseFloat(wizardData.basicInfo.costPrice) : null,
                seuil_alerte: wizardData.basicInfo.lowStockThreshold ? parseInt(wizardData.basicInfo.lowStockThreshold) : 5,
                actif: wizardData.basicInfo.isActive,
                image_principale: imageUrl,
            };

            let productId: number;

            if (isEditing) {
                // Update existing product
                const { error } = await supabase
                    .from("produit")
                    .update(productData)
                    .eq("id_produit", parseInt(id!));

                if (error) throw error;
                productId = parseInt(id!);
            } else {
                // Insert new product
                const { data: newProduct, error } = await supabase
                    .from("produit")
                    .insert(productData)
                    .select()
                    .single();

                if (error) throw error;
                productId = newProduct.id_produit;
            }

            // Insert/Update subtype data
            await saveSubtypeData(productId);

            toast({
                title: isEditing ? "Product updated" : "Product created",
                description: `${wizardData.basicInfo.name} has been ${isEditing ? "updated" : "added"} successfully.`,
            });

            navigate("/admin/products");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error saving product",
                description: error.message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const saveSubtypeData = async (productId: number) => {
        const { productType, technicalData } = wizardData;

        // Delete existing subtype data if editing
        if (isEditing) {
            await supabase.from("puff").delete().eq("id_produit", productId);
            await supabase.from("vape").delete().eq("id_produit", productId);
            await supabase.from("liquide").delete().eq("id_produit", productId);
            await supabase.from("clearomiseur").delete().eq("id_produit", productId);
        }

        switch (productType) {
            case "puff":
                await supabase.from("puff").insert({
                    id_produit: productId,
                    nombre_bouffees: technicalData.nombreBouffees ? parseInt(technicalData.nombreBouffees) : null,
                    taux_nicotine: technicalData.tauxNicotine || null,
                    saveur: technicalData.saveur || null,
                    rechargeable: technicalData.rechargeable || false,
                });
                break;

            case "vape":
                await supabase.from("vape").insert({
                    id_produit: productId,
                    id_marque: wizardData.basicInfo.brandId,
                    type: (technicalData.vapeType as any) || "Pod",
                    puissance_watt: technicalData.puissanceWatt ? parseInt(technicalData.puissanceWatt) : null,
                    capacite_batterie_mah: technicalData.capaciteBatterie ? parseInt(technicalData.capaciteBatterie) : null,
                    capacite_reservoir_ml: technicalData.capaciteReservoir ? parseFloat(technicalData.capaciteReservoir) : null,
                    airflow_reglable: technicalData.airflowReglable || false,
                    niveau_utilisateur: technicalData.niveauUtilisateur || null,
                });
                break;

            case "liquid":
                await supabase.from("liquide").insert({
                    id_produit: productId,
                    volume_ml: technicalData.volumeMl ? parseFloat(technicalData.volumeMl) : null,
                    taux_nicotine: technicalData.tauxNicotine || null,
                    composition_pgv: technicalData.compositionPgv || null,
                });
                break;

            case "accessory":
                await supabase.from("clearomiseur").insert({
                    id_produit: productId,
                    contenance_ml: technicalData.contenanceMl ? parseFloat(technicalData.contenanceMl) : null,
                    embout: technicalData.embout || null,
                    remplissage: technicalData.remplissage || null,
                    tirage: (technicalData.tirage as any) || null,
                    arrivee_air: (technicalData.arriveeAir as any) || null,
                    airflow_reglable: technicalData.airflowReglable || false,
                    diametre_mm: technicalData.diametreMm ? parseFloat(technicalData.diametreMm) : null,
                    hauteur_mm: technicalData.hauteurMm ? parseFloat(technicalData.hauteurMm) : null,
                });
                break;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">
                        {isEditing ? "Edit Product" : "Add New Product"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditing ? "Update product information" : "Fill in the product details step by step"}
                    </p>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all",
                                    currentStep > step.id
                                        ? "bg-primary text-primary-foreground"
                                        : currentStep === step.id
                                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                            : "bg-muted text-muted-foreground"
                                )}
                            >
                                {currentStep > step.id ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    step.id
                                )}
                            </div>
                            <div className="mt-2 text-center">
                                <p className={cn(
                                    "text-sm font-medium",
                                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-muted-foreground hidden sm:block">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "h-0.5 w-12 sm:w-24 lg:w-32 mx-2",
                                    currentStep > step.id ? "bg-primary" : "bg-muted"
                                )}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <Card className="min-h-[400px]">
                <CardContent className="pt-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {currentStep === 1 && (
                                <StepTypeSelector
                                    selectedType={wizardData.productType}
                                    selectedSubtype={wizardData.accessorySubtype}
                                    onTypeChange={(type) =>
                                        setWizardData({ ...wizardData, productType: type, accessorySubtype: null })
                                    }
                                    onSubtypeChange={(subtype) =>
                                        setWizardData({ ...wizardData, accessorySubtype: subtype })
                                    }
                                />
                            )}
                            {currentStep === 2 && (
                                <StepBasicInfo
                                    data={wizardData.basicInfo}
                                    productType={wizardData.productType}
                                    onChange={(data) =>
                                        setWizardData({ ...wizardData, basicInfo: data })
                                    }
                                />
                            )}
                            {currentStep === 3 && (
                                <StepTechnicalFields
                                    productType={wizardData.productType!}
                                    accessorySubtype={wizardData.accessorySubtype}
                                    data={wizardData.technicalData}
                                    onChange={(data) =>
                                        setWizardData({ ...wizardData, technicalData: data })
                                    }
                                />
                            )}
                            {currentStep === 4 && (
                                <StepReview
                                    wizardData={wizardData}
                                    onEditStep={setCurrentStep}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                {currentStep < 4 ? (
                    <Button onClick={handleNext} disabled={!canProceed()}>
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {isEditing ? "Update Product" : "Create Product"}
                    </Button>
                )}
            </div>

            {/* Stock History Panel (Only in Edit Mode) */}
            {isEditing && id && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8"
                >
                    <StockHistoryPanel
                        productId={parseInt(id)}
                        currentStock={parseInt(wizardData.basicInfo.stock || "0")}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default ProductWizard;
