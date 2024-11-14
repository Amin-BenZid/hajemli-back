import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from './shop.schema';
import { CreateShopDto } from './dto/create-shop.dto';
import { ShopOwner } from 'src/ShopOwner/shop-owner.schema';

@Injectable()
export class ShopService {
  constructor(@InjectModel(Shop.name) private shopModel: Model<Shop>,
  @InjectModel(ShopOwner.name) private shopOwnerModel: Model<ShopOwner>
) {}

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

  async getShopDetailsWithOwnerName(shopId: string) {
    const shop = await this.shopModel.findOne({ shop_id: shopId }).populate('barbers');
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${shopId} not found`);
    }

    const shopOwner = await this.shopOwnerModel.findOne({ owner_id: shop.owner_id });
    if (!shopOwner) {
      throw new NotFoundException(`Owner with ID ${shop.owner_id} not found`);
    }

    return {
      shop_name: shop.shop_name,
      owner_name: shopOwner.name,
      localisation: shop.localisation,
      number: shop.number,
      rating: shop.rating,
      barbers_count: shop.barbers.length, // Size of the barbers array
    };
  }

}
