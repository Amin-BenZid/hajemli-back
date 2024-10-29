import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  package_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  shop_owner_id: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  duration: string;
}
