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
    id: "ibie-2025",
    title: "IBIE 2025 - International Baking Industry Exposition",
    date: "September 2025",
    location: "Las Vegas, NV",
    description: "Visit us at the world's largest baking industry event. See our latest equipment and innovations.",
    link: "",
  },
];
