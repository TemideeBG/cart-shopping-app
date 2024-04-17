import { IsNotEmpty, IsString } from "class-validator";

export class CreateBlackListedTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}