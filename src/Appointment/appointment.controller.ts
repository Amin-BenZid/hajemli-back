import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Service } from 'src/Service/service.schema';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get(':id')
  async findOne(@Param('id') appointmentId: string) {
    return this.appointmentService.findOne(appointmentId);
  }

  @Get('services/:clientId')
  async getServiceDetailsByClientId(@Param('clientId') clientId: string): Promise<Service[]> {
    try {
      return await this.appointmentService.findServiceDetailsByClientId(clientId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async findAll() {
    return this.appointmentService.findAll();
  }
}
