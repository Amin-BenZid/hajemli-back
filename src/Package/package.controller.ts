import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { Package } from './package.schema';

@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  async create(@Body() createPackageDto: { name: string; shop_owner_id: string }): Promise<Package> {
    const { name, shop_owner_id } = createPackageDto;
    return this.packageService.create(name, shop_owner_id);
  }
}
