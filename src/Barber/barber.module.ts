import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { Barber, BarberSchema } from './barber.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Barber.name, schema: BarberSchema }])],
  controllers: [BarberController],
  providers: [BarberService],
  exports: [BarberService],
})
export class BarberModule {}
