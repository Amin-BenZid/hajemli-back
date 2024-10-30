import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package } from './package.schema';
import { v4 as uuidv4 } from 'uuid';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<Package>,
    private subscriptionService: SubscriptionService,
  ) {}

  async create(name: string, shop_owner_id: string): Promise<Package> {
    if (name !== 'par mois' && name !== 'par personne') {
      throw new BadRequestException(
        'The name attribute must be either "par mois" or "par personne"',
      );
    }

    const packageData = {
      package_id: this.generatePackageId(),
      name,
      shop_owner_id,
      price: name === 'par mois' ? 30 : 2,
      duration: '1 month',
    };

    const createdPackage = new this.packageModel(packageData);
    const savedPackage = await createdPackage.save();

    try {
      // Create a subscription for this package
      await this.subscriptionService.createSubscription(shop_owner_id, savedPackage.package_id);
    } catch (error) {
      // Optionally handle rollback or logging here
      throw new BadRequestException('Failed to create subscription');
    }

    return savedPackage;
  }

  private generatePackageId(): string {
    return uuidv4().slice(0, 8);
  }
}
