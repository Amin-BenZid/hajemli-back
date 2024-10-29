import { IsString, IsNotEmpty, IsEmail, IsDate, IsOptional  } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDate()
  @IsNotEmpty()
  birthdate: Date;

  @IsEmail()
  @IsNotEmpty()
  mail: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  resetToken?: string;

  @IsDate()
  @IsOptional()
  resetTokenExpiration?: Date;
}
