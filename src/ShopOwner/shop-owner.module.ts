import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopOwnerService } from './shop-owner.service';
import { ShopOwnerController } from './shop-owner.controller';
import { ShopOwner, ShopOwnerSchema } from './shop-owner.schema';
import { Shop, ShopSchema } from '../Shop/shop.schema'; // Import Shop schema
import { ShopModule } from '../Shop/shop.module'; // Import ShopModule
import { MailModule } from 'src/Mail/Mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ShopOwner.name, schema: ShopOwnerSchema }]),
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]), // Register ShopModel here
    ShopModule,
    MailModule // Import ShopModule to make ShopModel available
  ],
  controllers: [ShopOwnerController],
  providers: [ShopOwnerService],
  exports: [ShopOwnerService],
})
export class ShopOwnerModule {}
