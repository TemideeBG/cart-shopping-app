import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  tax: number;

  @IsNumber()
  @IsOptional()
  shipping_fee: number;

  @IsString()
  @IsOptional()
  sub_total: number;

  @IsString()
  @IsOptional()
  total: number;

  @IsString()
  @IsNotEmpty()
  order_status: string;

  @IsString()
  @IsNotEmpty()
  client_secret: string;

  @IsString()
  @IsNotEmpty()
  payment_intent_id: string;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  orderItems: string[];

}