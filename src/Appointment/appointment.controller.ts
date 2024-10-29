import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

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

  @Get()
  async findAll() {
    return this.appointmentService.findAll();
  }
}
