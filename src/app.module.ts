import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentModule } from './Appointment/appointment.module';
import { BarberModule } from './Barber/barber.module';
import { ClientModule } from './Client/client.module';
import { PackageModule } from './Package/package.module';
import { ServiceModule } from './Service/service.module';
import { ShopModule } from './Shop/shop.module';
import { ShopOwnerModule } from './ShopOwner/shop-owner.module';
import { SubscriptionModule } from './Subscription/subscription.module';




@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://oussamalaajili20:Zs87J4tM47Tdk7qf@hajemli.6rwys.mongodb.net/?retryWrites=true&w=majority&appName=hajemli'), 
    AppointmentModule,
    BarberModule,
    ClientModule,
    PackageModule,
    ServiceModule,
    ShopModule,
    ShopOwnerModule,
    SubscriptionModule,
    
  ],
})
export class AppModule {}
