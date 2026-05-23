export const SHOPPING_LIST: Record<string, string[]> = {
  Proteins: [
    "Wild salmon (fresh or frozen)",
    "Sardines in olive oil (canned)",
    "Pasture-raised eggs",
    "Organic chicken breast",
    "Cod or other white fish",
    "Firm tofu",
  ],
  Produce: [
    "Spinach",
    "Kale",
    "Broccoli",
    "Sweet potatoes",
    "Avocados",
    "Blueberries (fresh or frozen)",
    "Pineapple",
    "Ginger root",
    "Garlic",
    "Cherry tomatoes",
    "Lemons",
    "Mango (fresh or frozen)",
  ],
  Pantry: [
    "Extra virgin olive oil",
    "Turmeric powder",
    "Black pepper",
    "Bone broth (cartons)",
    "Walnuts",
    "Almonds",
    "Chia seeds",
    "Whole grain bread",
    "Brown rice",
    "Quinoa",
    "Tart cherry juice (100% pure)",
    "Dark chocolate 85%+",
  ],
  Supplements: [
    "Omega-3 fish oil capsules",
    "Curcumin with piperine",
    "Magnesium glycinate",
    "Vitamin D3 + K2",
    "Hydrolyzed collagen peptides",
  ],
};

export function itemKey(category: string, item: string): string {
  return `${category}::${item}`;
}

export const ALL_ITEM_KEYS: string[] = Object.entries(SHOPPING_LIST).flatMap(
  ([cat, items]) => items.map((item) => itemKey(cat, item))
);
