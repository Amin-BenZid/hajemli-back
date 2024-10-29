import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from './shop.schema';
import { CreateShopDto } from './dto/create-shop.dto';

@Injectable()
export class ShopService {
  constructor(@InjectModel(Shop.name) private shopModel: Model<Shop>) {}

  async create(createShopDto: CreateShopDto): Promise<Shop> {
    const createdShop = new this.shopModel(createShopDto);
    return createdShop.save();
  }

  async findOne(shopId: string): Promise<Shop> {
    const shop = await this.shopModel.findOne({ shop_id: shopId }).populate('barbers');
    if (!shop) throw new NotFoundException(`Shop with ID ${shopId} not found`);
    return shop;
  }

  async findAll(): Promise<Shop[]> {
    return this.shopModel.find().populate('barbers').exec();
  }
}
