import { UserEntity } from "../entity/user.entity";

export interface ProductInterface {
    id: number;
    name: string;
    num_of_products_created: number;
    num_of_products_requested: number;
    price: number;
    currency: string;
    amount: string;
    description: string;
    image: string;
    category: string;
    company: string;
    design_period?: string;
    production_period?: string;
    country_of_manufacture?: string;
    style?: string;
    colors: string[];
    featured: boolean;
    free_shipping: boolean;
    inventory_number: string;
    average_rating: number;
    num_of_reviews: number;
  }