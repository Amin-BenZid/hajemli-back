import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment, AppointmentSchema } from './appointment.schema';
import { ServiceModule } from 'src/Service/service.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]),
  ServiceModule,
],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
