import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './service.schema'; // Import Service schema
import { ServiceService } from './service.service'; // If needed
import { ServiceController } from './service.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]), // Register Service schema
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [MongooseModule], // Make sure to export MongooseModule
})
export class ServiceModule {}
