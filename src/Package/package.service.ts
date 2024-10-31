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
    // Validate the name attribute
    const validNames = ['par mois', 'par personne', 'par 3 mois', 'par ans'];
    if (!validNames.includes(name)) {
      throw new BadRequestException(
        'The name attribute must be either "par mois", "par personne", "par 3 mois", or "par ans"',
      );
    }
  
    // Set price and duration based on the name attribute
    let price: number;
    let duration: string;
  
    switch (name) {
      case 'par mois':
        price = 34.9;
        duration = '1 month';
        break;
      case 'par personne':
        price = 0.15;
        duration = '1 person';
        break;
      case 'par 3 mois':
        price = 99.9;
        duration = '3 months';
        break;
      case 'par ans':
        price = 360;
        duration = '1 year';
        break;
      default:
        throw new BadRequestException('Invalid package name'); // This should never be hit due to previous validation
    }
    const packageData = {
      package_id: this.generatePackageId(),
      name,
      shop_owner_id,
      price,
      duration,
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
