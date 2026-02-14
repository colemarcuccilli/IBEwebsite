export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  link?: string;
}

export const defaultEvents: Event[] = [
  {
    id: "seafood-2026",
    title: "2026 Seafood Show - Booth #1280",
    date: "March 2026",
    location: "Boston, MA",
    description: "Visit us at booth #1280 to see our latest equipment and innovations for the seafood industry.",
    link: "",
  },
];
