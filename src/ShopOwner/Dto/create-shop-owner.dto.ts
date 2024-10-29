import { IsString, IsNotEmpty, IsEmail, IsDate, IsOptional, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateShopOwnerDto {
  @IsString()
  @IsNotEmpty()
  owner_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  mail: string;

  
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDate()
  @IsNotEmpty()
  birthdate: Date;

  @IsString()
  @IsOptional()
  package_id: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  profile_image: string;

  @IsString()
  @IsOptional()
  bio: string;

  

  @IsArray()
  @IsOptional()
  services?: Types.ObjectId[];

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  resetToken?: string;

  @IsDate()
  @IsOptional()
  resetTokenExpiration?: Date;
}
