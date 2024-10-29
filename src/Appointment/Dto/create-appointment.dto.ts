import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  appointment_id: string;

  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  barber_id: string;

  @IsString()
  @IsNotEmpty()
  shop_id: string;

  @IsString()
  @IsNotEmpty()
  service_id: string;

  @IsDate()
  time_and_date: Date;

  @IsString()
  @IsNotEmpty()
  state: string;
}
