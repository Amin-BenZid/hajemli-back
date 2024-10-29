import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';

@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  async create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Get(':id')
  async findOne(@Param('id') packageId: string) {
    return this.packageService.findOne(packageId);
  }

  @Get()
  async findAll() {
    return this.packageService.findAll();
  }
}
