export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  price: number;
  created_at: string;
}

export enum OrderStatus {
  Approved = "approved",
  Pending = "pending",
  Rejected = "rejected",
}

export interface CreditCard {
  number: string;
  name: string;
  expiration_month: number;
  expiration_year: number;
  cvv: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product_id: string;
  product: Product;
  order_id: string;
}

export interface Order {
  id: string;
  total: number;
  credit_card: Omit<CreditCard, "cvv" | "name">;
  status: OrderStatus;
  items: OrderItem[];
}

export const products: Product[] = [
  {
    id: "uuid",
    name: "produto teste",
    description: "produto de teste",
    price: 50.5,
    image_url: "https://source.unsplash.com/random?product",
    slug: "produto-teste-1",
    created_at: "2021-06-07T00:00:00",
  },
  {
    id: "uuid-2",
    name: "outro produto teste",
    description: "produto de teste",
    price: 50.5,
    image_url: "https://source.unsplash.com/random?product",
    slug: "produto-teste-2",
    created_at: "2021-06-07T00:00:00",
  },
];
