import { IsString, IsEmail, IsNotEmpty, IsDate, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBarberDto {
  @IsString()
  @IsNotEmpty()
  barber_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  mail: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDate()
  birthdate: Date;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  profile_image?: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  resetToken?: string;

  @IsDate()
  @IsOptional()
  resetTokenExpiration?: Date;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsArray()
  @IsOptional()
  services?: Types.ObjectId[];
}
