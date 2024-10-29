import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get(':id')
  async findOne(@Param('id') serviceId: string) {
    return this.serviceService.findOne(serviceId);
  }

  @Get()
  async findAll() {
    return this.serviceService.findAll();
  }
}
