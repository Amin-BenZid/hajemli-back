import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';

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

  @Get()
  async findAll() {
    return this.clientService.findAll();
  }
}
