import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProductType, AccessorySubtype } from "./StepTypeSelector";

export interface TechnicalData {
    // Vape fields
    vapeType?: string;
    puissanceWatt?: string;
    capaciteBatterie?: string;
    capaciteReservoir?: string;
    airflowReglable?: boolean;
    niveauUtilisateur?: string;

    // Puff fields
    nombreBouffees?: string;
    tauxNicotine?: string;
    saveur?: string;
    rechargeable?: boolean;

    // Liquid fields
    volumeMl?: string;
    compositionPgv?: string;

    // Accessory fields (clearomizer)
    contenanceMl?: string;
    embout?: string;
    remplissage?: string;
    tirage?: string;
    arriveeAir?: string;
    diametreMm?: string;
    hauteurMm?: string;

    // Resistance fields
    resistanceOhms?: string;
    minWattage?: string;
    maxWattage?: string;
    draw?: string;
    consumption?: string;
}

interface StepTechnicalFieldsProps {
    productType: ProductType;
    accessorySubtype: AccessorySubtype | null;
    data: TechnicalData;
    onChange: (data: TechnicalData) => void;
}

export const StepTechnicalFields = ({
    productType,
    accessorySubtype,
    data,
    onChange,
}: StepTechnicalFieldsProps) => {
    const updateField = (field: keyof TechnicalData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const renderVapeFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Vape Type</Label>
                <Select
                    value={data.vapeType || ""}
                    onValueChange={(value) => updateField("vapeType", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pod">Pod</SelectItem>
                        <SelectItem value="Kit">Kit</SelectItem>
                        <SelectItem value="Box">Box</SelectItem>
                        <SelectItem value="Stylo">Pen / Stylo</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="puissance">Wattage (W)</Label>
                <Input
                    id="puissance"
                    type="number"
                    placeholder="e.g., 80"
                    value={data.puissanceWatt || ""}
                    onChange={(e) => updateField("puissanceWatt", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="batterie">Battery Capacity (mAh)</Label>
                <Input
                    id="batterie"
                    type="number"
                    placeholder="e.g., 3000"
                    value={data.capaciteBatterie || ""}
                    onChange={(e) => updateField("capaciteBatterie", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="reservoir">Tank Capacity (ml)</Label>
                <Input
                    id="reservoir"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 4.5"
                    value={data.capaciteReservoir || ""}
                    onChange={(e) => updateField("capaciteReservoir", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>User Level</Label>
                <Select
                    value={data.niveauUtilisateur || ""}
                    onValueChange={(value) => updateField("niveauUtilisateur", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Débutant">Beginner / Débutant</SelectItem>
                        <SelectItem value="Intermédiaire">Intermediate / Intermédiaire</SelectItem>
                        <SelectItem value="Avancé">Advanced / Avancé</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                    <Label className="font-medium">Adjustable Airflow</Label>
                    <p className="text-sm text-muted-foreground">Airflow réglable</p>
                </div>
                <Switch
                    checked={data.airflowReglable || false}
                    onCheckedChange={(checked) => updateField("airflowReglable", checked)}
                />
            </div>
        </div>
    );

    const renderPuffFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="puffs">Number of Puffs</Label>
                <Input
                    id="puffs"
                    type="number"
                    placeholder="e.g., 5000"
                    value={data.nombreBouffees || ""}
                    onChange={(e) => updateField("nombreBouffees", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Nicotine Level</Label>
                <Select
                    value={data.tauxNicotine || ""}
                    onValueChange={(value) => updateField("tauxNicotine", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0mg">0mg (No nicotine)</SelectItem>
                        <SelectItem value="10mg">10mg</SelectItem>
                        <SelectItem value="20mg">20mg</SelectItem>
                        <SelectItem value="35mg">35mg</SelectItem>
                        <SelectItem value="50mg">50mg</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="flavor">Flavor</Label>
                <Input
                    id="flavor"
                    placeholder="e.g., Mango Ice"
                    value={data.saveur || ""}
                    onChange={(e) => updateField("saveur", e.target.value)}
                />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                    <Label className="font-medium">Rechargeable</Label>
                    <p className="text-sm text-muted-foreground">Can be recharged via USB</p>
                </div>
                <Switch
                    checked={data.rechargeable || false}
                    onCheckedChange={(checked) => updateField("rechargeable", checked)}
                />
            </div>
        </div>
    );

    const renderLiquidFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="volume">Volume (ml)</Label>
                <Input
                    id="volume"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 30"
                    value={data.volumeMl || ""}
                    onChange={(e) => updateField("volumeMl", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Nicotine Level</Label>
                <Select
                    value={data.tauxNicotine || ""}
                    onValueChange={(value) => updateField("tauxNicotine", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0mg">0mg (No nicotine)</SelectItem>
                        <SelectItem value="3mg">3mg</SelectItem>
                        <SelectItem value="6mg">6mg</SelectItem>
                        <SelectItem value="12mg">12mg</SelectItem>
                        <SelectItem value="18mg">18mg</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
                <Label>PG/VG Ratio</Label>
                <Select
                    value={data.compositionPgv || ""}
                    onValueChange={(value) => updateField("compositionPgv", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="50/50">50/50 (Balanced)</SelectItem>
                        <SelectItem value="70/30">70 VG / 30 PG (More vapor)</SelectItem>
                        <SelectItem value="80/20">80 VG / 20 PG (Max vapor)</SelectItem>
                        <SelectItem value="30/70">30 VG / 70 PG (More throat hit)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    const renderClearomizerFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="contenance">Capacity (ml)</Label>
                <Input
                    id="contenance"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 4.5"
                    value={data.contenanceMl || ""}
                    onChange={(e) => updateField("contenanceMl", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="embout">Mouthpiece Type</Label>
                <Input
                    id="embout"
                    placeholder="e.g., 510"
                    value={data.embout || ""}
                    onChange={(e) => updateField("embout", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Fill Type</Label>
                <Select
                    value={data.remplissage || ""}
                    onValueChange={(value) => updateField("remplissage", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Top">Top Fill</SelectItem>
                        <SelectItem value="Bottom">Bottom Fill</SelectItem>
                        <SelectItem value="Side">Side Fill</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Draw Type (Tirage)</Label>
                <Select
                    value={data.tirage || ""}
                    onValueChange={(value) => updateField("tirage", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="tight">Tight (Serré)</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                        <SelectItem value="smooth">Smooth</SelectItem>
                        <SelectItem value="smooth_airy">Smooth Airy</SelectItem>
                        <SelectItem value="airy">Airy</SelectItem>
                        <SelectItem value="open">Open (Ouvert)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Airflow Position</Label>
                <Select
                    value={data.arriveeAir || ""}
                    onValueChange={(value) => updateField("arriveeAir", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bas">Bottom (Bas)</SelectItem>
                        <SelectItem value="haut">Top (Haut)</SelectItem>
                        <SelectItem value="lateral">Side (Latéral)</SelectItem>
                        <SelectItem value="integral">Full (Intégral)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                    <Label className="font-medium">Adjustable Airflow</Label>
                    <p className="text-sm text-muted-foreground">Airflow réglable</p>
                </div>
                <Switch
                    checked={data.airflowReglable || false}
                    onCheckedChange={(checked) => updateField("airflowReglable", checked)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="diametre">Diameter (mm)</Label>
                <Input
                    id="diametre"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 24"
                    value={data.diametreMm || ""}
                    onChange={(e) => updateField("diametreMm", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="hauteur">Height (mm)</Label>
                <Input
                    id="hauteur"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 55"
                    value={data.hauteurMm || ""}
                    onChange={(e) => updateField("hauteurMm", e.target.value)}
                />
            </div>
        </div>
    );

    const renderResistanceFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="resistance">Resistance (Ω)</Label>
                <Input
                    id="resistance"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 0.15"
                    value={data.resistanceOhms || ""}
                    onChange={(e) => updateField("resistanceOhms", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="minWatt">Min Wattage (W)</Label>
                <Input
                    id="minWatt"
                    type="number"
                    placeholder="e.g., 40"
                    value={data.minWattage || ""}
                    onChange={(e) => updateField("minWattage", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="maxWatt">Max Wattage (W)</Label>
                <Input
                    id="maxWatt"
                    type="number"
                    placeholder="e.g., 80"
                    value={data.maxWattage || ""}
                    onChange={(e) => updateField("maxWattage", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Draw Type</Label>
                <Select
                    value={data.draw || ""}
                    onValueChange={(value) => updateField("draw", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Directe">Direct Lung (DL)</SelectItem>
                        <SelectItem value="Indirecte">Mouth to Lung (MTL)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
                <Label>E-Liquid Consumption</Label>
                <Select
                    value={data.consumption || ""}
                    onValueChange={(value) => updateField("consumption", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Moderee">Low (Modérée)</SelectItem>
                        <SelectItem value="Moyenne">Medium (Moyenne)</SelectItem>
                        <SelectItem value="Moyenne_Elevee">Medium-High</SelectItem>
                        <SelectItem value="Elevee">High (Élevée)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    const renderAccessoryFields = () => {
        switch (accessorySubtype) {
            case "clearomizer":
                return renderClearomizerFields();
            case "resistance":
                return renderResistanceFields();
            default:
                return (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Technical fields for this accessory type will be added soon.</p>
                        <p className="text-sm">You can still save the product with basic information.</p>
                    </div>
                );
        }
    };

    const getTitle = () => {
        switch (productType) {
            case "vape":
                return "Vape Specifications";
            case "puff":
                return "Puff Specifications";
            case "liquid":
                return "Liquid Details";
            case "accessory":
                return `${accessorySubtype?.replace("_", " ").replace(/^\w/, c => c.toUpperCase()) || "Accessory"} Specifications`;
            default:
                return "Technical Details";
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">{getTitle()}</h2>
                <p className="text-muted-foreground">
                    Enter the technical specifications for your product
                </p>
            </div>

            {productType === "vape" && renderVapeFields()}
            {productType === "puff" && renderPuffFields()}
            {productType === "liquid" && renderLiquidFields()}
            {productType === "accessory" && renderAccessoryFields()}
        </div>
    );
};
