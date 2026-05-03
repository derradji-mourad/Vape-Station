// Sub-category configuration for each main category
export type ProductCategory = "vape" | "puff" | "flavor" | "accessory";

export type ProductSubcategory = 
  // Vape sub-categories
  | "box_mod"
  | "pod_system"
  | "starter_kit"
  | "advanced_mod"
  // Puff sub-categories
  | "low_puff"
  | "mid_puff"
  | "high_puff"
  // Flavor sub-categories
  | "ice_mint"
  | "fruity"
  | "exotic"
  | "tobacco"
  | "dessert"
  // Accessory sub-categories
  | "battery"
  | "charger"
  | "case"
  | "coil"
  | "tank"
  | "drip_tip"
  | "replacement_glass"
  | "clothing";

interface SubcategoryOption {
  value: ProductSubcategory;
  label: string;
  emoji?: string;
}

interface CategoryConfig {
  label: string;
  subcategories: SubcategoryOption[];
}

export const CATEGORY_CONFIG: Record<ProductCategory, CategoryConfig> = {
  vape: {
    label: "Vape",
    subcategories: [
      { value: "box_mod", label: "Box Mod", emoji: "📦" },
      { value: "pod_system", label: "Pod System", emoji: "🔌" },
      { value: "starter_kit", label: "Starter Kit", emoji: "🎁" },
      { value: "advanced_mod", label: "Advanced Mod", emoji: "⚡" },
    ],
  },
  puff: {
    label: "Puff",
    subcategories: [
      { value: "low_puff", label: "Low Range (1000-3000)", emoji: "💨" },
      { value: "mid_puff", label: "Mid Range (4000-8000)", emoji: "🌬️" },
      { value: "high_puff", label: "High Range (9000+)", emoji: "🌪️" },
    ],
  },
  flavor: {
    label: "Flavor",
    subcategories: [
      { value: "ice_mint", label: "Ice & Mint", emoji: "❄️" },
      { value: "fruity", label: "Fruity", emoji: "🍓" },
      { value: "exotic", label: "Exotic", emoji: "🌴" },
      { value: "tobacco", label: "Tobacco", emoji: "🍂" },
      { value: "dessert", label: "Dessert", emoji: "🍰" },
    ],
  },
  accessory: {
    label: "Accessory",
    subcategories: [
      { value: "battery", label: "Battery", emoji: "🔋" },
      { value: "charger", label: "Charger", emoji: "🔌" },
      { value: "case", label: "Case", emoji: "👜" },
      { value: "coil", label: "Coil", emoji: "🔩" },
      { value: "tank", label: "Tank", emoji: "💧" },
      { value: "drip_tip", label: "Drip Tip", emoji: "💎" },
      { value: "replacement_glass", label: "Replacement Glass", emoji: "🪟" },
      { value: "clothing", label: "Clothing", emoji: "👕" },
    ],
  },
};

export const getSubcategoriesForCategory = (category: ProductCategory): SubcategoryOption[] => {
  return CATEGORY_CONFIG[category]?.subcategories || [];
};

export const getSubcategoryLabel = (subcategory: ProductSubcategory): string => {
  for (const config of Object.values(CATEGORY_CONFIG)) {
    const found = config.subcategories.find(s => s.value === subcategory);
    if (found) return found.label;
  }
  return subcategory;
};
