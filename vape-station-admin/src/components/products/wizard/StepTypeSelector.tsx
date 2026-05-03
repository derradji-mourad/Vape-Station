import { motion } from "framer-motion";
import {
    Wind,
    Cigarette,
    Droplets,
    Wrench,
    Disc,
    Zap,
    Pipette,
    CircleDot,
    Codesandbox,
    Cpu,
    Package,
    Battery,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ProductType = "vape" | "puff" | "liquid" | "accessory";
export type AccessorySubtype =
    | "clearomizer"
    | "resistance"
    | "tank"
    | "drip_tip"
    | "atomizer"
    | "wire"
    | "cotton"
    | "mod";

interface ProductTypeOption {
    type: ProductType;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

interface AccessorySubtypeOption {
    subtype: AccessorySubtype;
    label: string;
    icon: React.ElementType;
}

const productTypes: ProductTypeOption[] = [
    {
        type: "vape",
        label: "Vape",
        description: "Kits, Pods, Box Mods, Pen devices",
        icon: Wind,
        color: "from-blue-500 to-blue-600",
    },
    {
        type: "puff",
        label: "Puff",
        description: "Disposable vapes with set puff count",
        icon: Cigarette,
        color: "from-purple-500 to-purple-600",
    },
    {
        type: "liquid",
        label: "Liquid",
        description: "E-liquids, nicotine salts, flavors",
        icon: Droplets,
        color: "from-cyan-500 to-cyan-600",
    },
    {
        type: "accessory",
        label: "Accessory",
        description: "Coils, tanks, batteries, and more",
        icon: Wrench,
        color: "from-orange-500 to-orange-600",
    },
];

const accessorySubtypes: AccessorySubtypeOption[] = [
    { subtype: "clearomizer", label: "Clearomizers", icon: Disc },
    { subtype: "resistance", label: "Coils / Resistances", icon: Zap },
    { subtype: "tank", label: "Tanks", icon: Pipette },
    { subtype: "drip_tip", label: "Drip Tips", icon: CircleDot },
    { subtype: "atomizer", label: "Atomizers", icon: Codesandbox },
    { subtype: "wire", label: "Wires", icon: Cpu },
    { subtype: "cotton", label: "Cotton", icon: Package },
    { subtype: "mod", label: "Mods & Batteries", icon: Battery },
];

interface StepTypeSelectorProps {
    selectedType: ProductType | null;
    selectedSubtype: AccessorySubtype | null;
    onTypeChange: (type: ProductType) => void;
    onSubtypeChange: (subtype: AccessorySubtype) => void;
}

export const StepTypeSelector = ({
    selectedType,
    selectedSubtype,
    onTypeChange,
    onSubtypeChange,
}: StepTypeSelectorProps) => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Select Product Type</h2>
                <p className="text-muted-foreground">
                    Choose the category that best describes your product
                </p>
            </div>

            {/* Product Type Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {productTypes.map((product) => {
                    const Icon = product.icon;
                    const isSelected = selectedType === product.type;

                    return (
                        <motion.div
                            key={product.type}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onTypeChange(product.type)}
                            className={cn(
                                "relative p-6 rounded-xl cursor-pointer transition-all border-2",
                                isSelected
                                    ? "border-primary bg-primary/5 shadow-lg"
                                    : "border-transparent bg-muted/50 hover:bg-muted hover:border-muted-foreground/20"
                            )}
                        >
                            {isSelected && (
                                <motion.div
                                    layoutId="selected-type"
                                    className="absolute inset-0 rounded-xl border-2 border-primary"
                                    initial={false}
                                />
                            )}
                            <div
                                className={cn(
                                    "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4",
                                    product.color
                                )}
                            >
                                <Icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-semibold mb-1">{product.label}</h3>
                            <p className="text-sm text-muted-foreground">
                                {product.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Accessory Subtypes */}
            {selectedType === "accessory" && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                >
                    <div className="text-center">
                        <h3 className="text-lg font-medium mb-1">Select Accessory Type</h3>
                        <p className="text-sm text-muted-foreground">
                            Choose the specific accessory category
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {accessorySubtypes.map((accessory) => {
                            const Icon = accessory.icon;
                            const isSelected = selectedSubtype === accessory.subtype;

                            return (
                                <motion.div
                                    key={accessory.subtype}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onSubtypeChange(accessory.subtype)}
                                    className={cn(
                                        "p-4 rounded-lg cursor-pointer transition-all border-2 text-center",
                                        isSelected
                                            ? "border-primary bg-primary/5"
                                            : "border-transparent bg-muted/50 hover:bg-muted"
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "h-6 w-6 mx-auto mb-2",
                                            isSelected ? "text-primary" : "text-muted-foreground"
                                        )}
                                    />
                                    <p className="text-sm font-medium">{accessory.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
};
