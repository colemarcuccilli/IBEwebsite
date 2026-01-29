export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: "bakery" | "blast-freeze" | "carts";
}

export const defaultProducts: Product[] = [
  // Bakery Products
  {
    id: "bread-racks",
    name: "Bread Racks",
    description: "For cooling, proofing or offloading the production line. Built with precision for maximum durability and efficiency.",
    image: "/images/Breadrack.jpg",
    category: "bakery",
  },
  {
    id: "pan-tree-racks",
    name: "Pan Tree Racks",
    description: "Versatile storage solution for baking pans. Designed for easy access and optimal space utilization.",
    image: "/images/Pan Rack Cropped new.jpg",
    category: "bakery",
  },
  {
    id: "dough-troughs",
    name: "Dough Troughs",
    description: "Heavy-duty containers for dough processing. Available in various sizes to meet your production needs.",
    image: "/images/cropped tub.jpg",
    category: "bakery",
  },
  {
    id: "icing-racks",
    name: "Icing Racks / Steam Pan Grates",
    description: "Precision racks for icing and steam pan applications. Ensures even coating and proper drainage.",
    image: "",
    category: "bakery",
  },
  {
    id: "pie-racks",
    name: "Pie Racks",
    description: "Specialized racks for pie production and storage. Designed to protect delicate pastries during transport.",
    image: "/images/Pie Rack.JPG",
    category: "bakery",
  },
  {
    id: "bread-transport-display",
    name: "Bread Transport and Display Racks",
    description: "Dual-purpose racks for transport and retail display. Seamlessly move from production to storefront.",
    image: "/images/BreadTransport RackwithBuns.jpg",
    category: "bakery",
  },
  {
    id: "glazing-racks",
    name: "Glazing Racks",
    description: "Designed for efficient glazing operations. Features optimal spacing for consistent coverage.",
    image: "/images/Glazing Rack.jpg",
    category: "bakery",
  },
  {
    id: "fry-screens",
    name: "Fry Screens",
    description: "Durable screens for frying applications. Heat-resistant construction for long-lasting performance.",
    image: "",
    category: "bakery",
  },
  {
    id: "bagel-baskets",
    name: "Bagel Baskets",
    description: "Custom baskets for bagel handling. Designed for efficient boiling and baking processes.",
    image: "",
    category: "bakery",
  },
  {
    id: "donut-baskets",
    name: "Donut Nesting Baskets",
    description: "Space-efficient nesting design for donuts. Maximizes storage while protecting product quality.",
    image: "/images/Donut Basket.jpg",
    category: "bakery",
  },
  {
    id: "bagel-scoops",
    name: "Bagel Scoops",
    description: "Ergonomic scoops for bagel handling. Streamlines the production process.",
    image: "",
    category: "bakery",
  },
  // Blast Freeze Racks
  {
    id: "blast-freeze-racks",
    name: "Blast Freeze Racks",
    description: "Industrial-grade racks designed for rapid freezing applications. Built to withstand extreme cold temperatures while maintaining structural integrity.",
    image: "/images/Seafood Rack.jpg",
    category: "blast-freeze",
  },
  // Carts
  {
    id: "mail-carts-ls3",
    name: "LS3 Mail Carts",
    description: "Heavy-duty carts designed for mail and package transport. Compact design for efficient navigation.",
    image: "/images/LS3 Mail Cart.jpg",
    category: "carts",
  },
  {
    id: "mail-carts-ls4",
    name: "LS4 Mail Carts",
    description: "Larger capacity mail carts for high-volume operations. Built for durability and ease of use.",
    image: "/images/LS4 Mail Cart.jpg",
    category: "carts",
  },
  {
    id: "grocery-carryout",
    name: "Grocery Carry Out Carts",
    description: "Durable carts for grocery store customer service applications. Enhances the shopping experience.",
    image: "/images/Carryout Cropped.jpg",
    category: "carts",
  },
  {
    id: "receiving-carts",
    name: "Receiving Carts",
    description: "Versatile receiving carts with multiple configurations. Available in closed, half-open, and fully open designs.",
    image: "/images/Receiving Cart - Fully open.jpg",
    category: "carts",
  },
];

export const productCategories = [
  { id: "bakery", name: "Bakery Products" },
  { id: "blast-freeze", name: "Blast Freeze Racks" },
  { id: "carts", name: "Carts" },
] as const;
