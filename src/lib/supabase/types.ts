export interface ProductRow {
  id: string;
  name: string;
  description: string;
  image_url: string;
  pdf_url: string;
  category: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface EventRow {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  link: string;
  pdf_url: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface ContactRow {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  product_interest: string;
  products: string;
  created_at: string;
}
