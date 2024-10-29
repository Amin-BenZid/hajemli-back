import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  sub_id: string;

  @IsString()
  @IsNotEmpty()
  shop_id: string;

  @IsString()
  @IsNotEmpty()
  package_id: string;

  @IsDate()
  @IsNotEmpty()
  starts: Date;

  @IsDate()
  @IsNotEmpty()
  ends: Date;

  @IsString()
  @IsNotEmpty()
  status: string;
}
