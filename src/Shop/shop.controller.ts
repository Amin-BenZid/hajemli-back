import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';

@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  async create(@Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto);
  }

  @Get(':id')
  async findOne(@Param('id') shopId: string) {
    return this.shopService.findOne(shopId);
  }

  @Get(':shopId/details')
  async getShopDetailsWithOwnerName(@Param('shopId') shopId: string) {
    try {
      return await this.shopService.getShopDetailsWithOwnerName(shopId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async findAll() {
    return this.shopService.findAll();
  }
}
