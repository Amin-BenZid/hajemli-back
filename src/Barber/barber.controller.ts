import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BarberService } from './barber.service';
import { CreateBarberDto } from './dto/create-barber.dto';

@Controller('barbers')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Post()
  async create(@Body() createBarberDto: CreateBarberDto) {
    return this.barberService.create(createBarberDto);
  }

  @Get(':id')
  async findOne(@Param('id') barberId: string) {
    return this.barberService.findOne(barberId);
  }

  @Get()
  async findAll() {
    return this.barberService.findAll();
  }
}
