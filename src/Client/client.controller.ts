import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './client.schema';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get(':id')
  async findOne(@Param('id') clientId: string) {
    return this.clientService.findOne(clientId);
  }

  @Put(':id/shop')
  async updateShopId(
    @Param('id') id: string,
    @Body('shop_id') shopId: string,
  ): Promise<Client> {
    return this.clientService.updateShopId(id, shopId);
  }

  @Get()
  async findAll() {
    return this.clientService.findAll();
  }
}
