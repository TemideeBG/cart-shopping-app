import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  num_of_products_available: number;

  @IsNumber()
  @IsOptional()
  num_of_products_requested: number;

  @IsNumber()
  @IsOptional()
  price: string;

  @IsString()
  @IsOptional()
  currency: string;

  @IsString()
  @IsOptional()
  amount: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  company: string;

  @IsString()
  @IsOptional()
  design_period: string;

  @IsString()
  @IsOptional()
  production_period: string;

  @IsString()
  @IsOptional()
  country_of_manufacture: string;

  @IsString()
  @IsOptional()
  style: string;

  @IsString()
  @IsNotEmpty()
  colors: string[];

  @IsString()
  @IsOptional()
  featured: boolean;

  @IsString()
  @IsOptional()
  free_shipping: boolean;

  @IsString()
  @IsOptional()
  inventory_number: string;

  @IsString()
  @IsOptional()
  average_rating: number;

  @IsNumber()
  @IsOptional()
  num_of_reviews: number;

}