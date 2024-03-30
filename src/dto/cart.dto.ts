import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCartDto {
  @IsNumber()
  @IsNotEmpty()
  price: string;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsString()
  @IsOptional()
  currency: string;

  @IsString()
  @IsOptional()
  amount: string;

  @IsString()
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  productId: number;

}