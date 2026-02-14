export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
}

export const defaultProducts: Product[] = [
  // Bakery Products
  {
    id: "bread-racks",
    name: "All Purpose Bread & Bun Cooling Racks",
    description: "All steel construction for high capacities and durable enough for rough industrial use. Constructed in component parts for cost effective maintenance and repair. Shelves remove to create more clearance or easily replace if damaged. Double rod runners allow you to pull shelves 2/3 their depth out for convenient product loading and unloading. Available in Mobile and Stationary configurations.",
    image_url: "/images/Breadrack.jpg",
    category: "bakery",
  },
  {
    id: "pan-tree-racks",
    name: "Pan Tree Mobile Rack",
    description: "Strength, durability, and replaceable component parts make Industrial Bakery Equipment's all-steel mobile Pan Tree Racks the best value in the business. Manufactured with steel for the durability needed in industrial operations. Constructed in component parts for the ability to upgrade or repair easily and cost effectively. Available in 24, 36, and 40 shelf configurations.\n\nOptions: Galvanized Finish, Nickel-Chrome Finish, All Stainless Steel, Any Caster Option Available",
    image_url: "/images/panrack.png",
    category: "bakery",
  },
  {
    id: "pie-racks",
    name: "Stainless Steel High Density Mobile Rack (Pie Rack)",
    description: "All stainless steel construction for rough industrial use. Shelves remove to create more clearance or can be easily replaced if damaged. Tube frame fully enclosed for sanitation. Usable in blast freezer or oven.",
    image_url: "/images/PieRack.png",
    category: "bakery",
  },
  {
    id: "bread-transport-display",
    name: "Bread Transport and Display Racks",
    description: "Dual-purpose racks for transport and retail display. Seamlessly move from production to storefront.",
    image_url: "/images/BreatTransportRack.png",
    category: "bakery",
  },
  {
    id: "dough-troughs",
    name: "Dough Troughs",
    description: "The exceptional quality of Industrial Bakery Equipment troughs has made them a standard in the industry. Available in 11 gauge stainless steel or 11 gauge standard steel. The rim and caster shoes are completely sealed for sanitation. Welds are ground to a BISSC approved smooth, crevice-free surface. Solid steel corners for added durability.\n\nBody Styles: Standard, Control Flow – Rack and Pinion Geared Gate, Control Flow – Drop Chute Gate, Control Flow – Lift Gate, Sloping Bottom, Drop-Side Trough",
    image_url: "/images/croppedtub.png",
    category: "bakery",
  },
  {
    id: "glazing-racks",
    name: "Glazing Racks",
    description: "Designed for efficient glazing operations. Features optimal spacing for consistent coverage.",
    image_url: "/images/Glazing Rack.jpg",
    category: "bakery",
  },
  {
    id: "fry-screens",
    name: "Fry Screens",
    description: "A flat, one-piece stamped metal mesh with 1/4\" openings, welded to a wire frame and three reinforcing bars. Packed 12 per carton. Available in multiple sizes.\n\nAvailable Finishes: Nickel Plated, All Stainless Steel",
    image_url: "/images/FryScreens.png",
    category: "bakery",
  },
  {
    id: "bagel-baskets",
    name: "Bagel Baskets",
    description: "Custom baskets for bagel handling. Designed for efficient boiling and baking processes.",
    image_url: "/images/BagelBaskets.png",
    category: "bakery",
  },
  {
    id: "donut-baskets",
    name: "Donut Nesting Baskets",
    description: "Space-efficient nesting design for donuts. Maximizes storage while protecting product quality.",
    image_url: "/images/Donut Basket.jpg",
    category: "bakery",
  },
  {
    id: "bagel-scoops",
    name: "Bagel Scoops",
    description: "Ergonomic scoops for bagel handling. Streamlines the production process.",
    image_url: "/images/BagelScoops.png",
    category: "bakery",
  },
  // Blast Freeze Racks
  {
    id: "blast-freeze-racks",
    name: "Blast Freeze / Drying Racks",
    description: "All steel construction for high capacities and durable enough for rough industrial use. Constructed in component parts for cost effective maintenance and repair. Shelves remove to create more clearance or easily replace if damaged. Double rod runners allow you to pull shelves 2/3 their depth out for convenient product loading and unloading.\n\nAvailable in 18x54, 24x66, and 28x66 frame sizes.\n\nAvailable Finishes: Galvanized, Glass-Bead Blasted Finish, Electro-Polished Stainless Steel\n\nMobile Options: Single Rod Runner, Double Rod Runner, Various Caster Options, Custom Sizes Available",
    image_url: "/images/Breadrack.jpg",
    category: "blast-freeze",
  },
  // Carts
  {
    id: "mail-carts-ls3",
    name: "LS-3 Mail Cart",
    description: "All steel construction with a durable Nickel-Chrome finish that won't chip, peel, or rust. Ships disassembled to save on freight. Component parts available if repair of existing carts is needed. Features 5\" swivel casters in the front and 10\" roller bearing wheels in the back. Each cart includes 2 hanging file runners. The LS-3 holds up to 80 legal size folders.",
    image_url: "/images/LS3MailCart.png",
    category: "carts",
  },
  {
    id: "mail-carts-ls4",
    name: "LS-4 Mail Cart",
    description: "All steel construction with a durable Nickel-Chrome finish that won't chip, peel, or rust. Ships disassembled to save on freight. Component parts available if repair of existing carts is needed. Features 5\" swivel casters in the front and 10\" roller bearing wheels in the back. Each cart includes 2 hanging file runners. The LS-4 holds up to 120 legal size folders.",
    image_url: "/images/LS4MailCart.png",
    category: "carts",
  },
  {
    id: "grocery-carryout",
    name: "Carryout Cart",
    description: "All steel construction with an epoxy e-coat base and grey polyester powder coated top coat. The top shelf folds up to accommodate larger packages. Features non-marking wheels and casters. Nestable design with a 15\" nesting distance for compact storage.",
    image_url: "/images/CarryoutCart.png",
    category: "carts",
  },
  {
    id: "receiving-carts",
    name: "Receiving Carts",
    description: "Versatile receiving carts with multiple configurations. Available in closed, half-open, and fully open designs.",
    image_url: "/images/receivingcartfullyopen.png",
    category: "carts",
  },
];

export const productCategories = [
  { id: "bakery", name: "Bakery Products" },
  { id: "blast-freeze", name: "Blast Freeze Racks" },
  { id: "carts", name: "Carts" },
] as const;
