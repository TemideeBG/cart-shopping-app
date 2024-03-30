import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, isString, IsString, Length } from 'class-validator';

export class CreateUserDto {
 
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6,24)
  password: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  nationality: string;

  @IsString()
  @IsOptional()
  home_address: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsDate()
  @IsOptional()
  date_of_birth:Date;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsString()
  @IsOptional()
  phone_number: string;
}
