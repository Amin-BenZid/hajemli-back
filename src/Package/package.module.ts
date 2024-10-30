import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageService } from './package.service';
import { PackageController } from './package.controller'; // Import the controller
import { Package, PackageSchema } from './package.schema';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
    SubscriptionModule, // Import SubscriptionModule here
  ],
  controllers: [PackageController], // Add the controller here
  providers: [PackageService],
  exports: [PackageService],
})
export class PackageModule {}
