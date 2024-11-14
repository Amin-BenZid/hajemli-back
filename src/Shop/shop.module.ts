// shop.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopService } from './shop.service';
import { Shop, ShopSchema } from './shop.schema';
import { ShopController } from './shop.controller';
import { ShopOwner, ShopOwnerSchema } from 'src/ShopOwner/shop-owner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema },
      { name: ShopOwner.name, schema: ShopOwnerSchema }
    ]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [MongooseModule], // Export the MongooseModule for reuse
})
export class ShopModule {}
