import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  rating: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  comment: string;

  @IsOptional()
  @IsNumber()
  productId: number;
}