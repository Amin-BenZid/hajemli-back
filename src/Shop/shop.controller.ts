import { Controller, Post, Body, Get, Param } from '@nestjs/common';
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

  @Get()
  async findAll() {
    return this.shopService.findAll();
  }
}
