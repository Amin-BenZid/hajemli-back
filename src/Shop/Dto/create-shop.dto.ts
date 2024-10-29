import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  shop_id: string;

  @IsString()
  @IsNotEmpty()
  shop_name: string;

  @IsString()
  @IsNotEmpty()
  owner_id: string;

  @IsString()
  @IsNotEmpty()
  localisation: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  work_hours?: string;

  @IsString()
  @IsOptional()
  day_off?: string;

  @IsArray()
  @IsOptional()
  barbers?: Types.ObjectId[];

  @IsArray()
  @IsOptional()
  shop_images?: string[];
}
