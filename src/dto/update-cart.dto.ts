import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCartDto {
  @IsString()
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  @IsNumber()
  productId: number;
}