import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, max, minLength } from "class-validator";

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(1, { message: 'Rating must not exceed 5' })
  rating: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

}