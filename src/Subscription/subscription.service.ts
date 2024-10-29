import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from './subscription.schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(@InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const createdSubscription = new this.subscriptionModel(createSubscriptionDto);
    return createdSubscription.save();
  }

  async findOne(subscriptionId: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findOne({ sub_id: subscriptionId })
      .populate('shop_id')
      .populate('package_id');
    if (!subscription) throw new NotFoundException(`Subscription with ID ${subscriptionId} not found`);
    return subscription;
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionModel.find().populate('shop_id').populate('package_id').exec();
  }
}
