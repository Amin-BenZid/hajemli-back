// shop.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopService } from './shop.service';
import { Shop, ShopSchema } from './shop.schema';
import { ShopController } from './shop.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [MongooseModule], // Export the MongooseModule for reuse
})
export class ShopModule {}
