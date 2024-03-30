import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  num_of_products_created: number;

  @IsNumber()
  @IsOptional()
  num_of_products_requested: number;

  @IsNumber()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsOptional()
  currency: string;

  @IsString()
  @IsOptional()
  amount: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  average_rating: number;

  @IsNumber()
  @IsOptional()
  num_of_reviews: number;

}