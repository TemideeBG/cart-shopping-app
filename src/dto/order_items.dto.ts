import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderItemsDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsOptional()
  @IsString()
  cartId: string;
}