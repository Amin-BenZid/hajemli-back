import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from './subscription.schema';
import { Shop } from '../shop/shop.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    @InjectModel(Shop.name) private shopModel: Model<Shop>, // Inject ShopModel here
  ) {}


  async createSubscription(shop_owner_id: string, package_id: string): Promise<Subscription> {
    // Find shop_id for the given shop_owner_id
    const shop = await this.shopModel.findOne({ owner_id: shop_owner_id });
    if (!shop) {
      throw new NotFoundException('No shop found with the given owner_id');
    }

    const currentDate = new Date();
    const endDate = new Date();
    endDate.setMonth(currentDate.getMonth() + 1);

    const subscriptionData = {
      sub_id: uuidv4().slice(0, 8),
      shop_id: shop.shop_id,
      package_id,
      starts: currentDate,
      ends: endDate,
      status: 'active',
    };

    const createdSubscription = new this.subscriptionModel(subscriptionData);
    return createdSubscription.save();
  }
}
