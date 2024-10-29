import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package } from './package.schema';
import { CreatePackageDto } from './dto/create-package.dto';

@Injectable()
export class PackageService {
  constructor(@InjectModel(Package.name) private packageModel: Model<Package>) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const createdPackage = new this.packageModel(createPackageDto);
    return createdPackage.save();
  }

  async findOne(packageId: string): Promise<Package> {
    const pkg = await this.packageModel.findOne({ package_id: packageId }).populate('shop_owner_id');
    if (!pkg) throw new NotFoundException(`Package with ID ${packageId} not found`);
    return pkg;
  }

  async findAll(): Promise<Package[]> {
    return this.packageModel.find().populate('shop_owner_id').exec();
  }
}
