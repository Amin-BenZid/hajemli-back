import { Controller, Post, Body, Get, Param, NotFoundException, BadRequestException, Put } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Service } from 'src/Service/service.schema';
import { Appointment } from './appointment.schema';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get('count-per-day')
  async getAppointmentsCountPerDay() {
    return await this.appointmentService.countAppointmentsPerDay();
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
  @Get('service/:barberId')
  async getServiceDetailsByBarberId(@Param('barberId') barberId: string): Promise<Service[]> {
    try {
      return await this.appointmentService.findServiceDetailsByBarberId(barberId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('services-total/:barberId')
  async getServicesAndTotal(@Param('barberId') barberId: string) {
    return this.appointmentService.findServiceDetailsByBarberIdAndCalculateTotal(barberId);
  }

  @Get('counttoday/:barberId')
  async countAppointmentsForToday(@Param('barberId') barberId: string): Promise<number> {
    return this.appointmentService.countAppointmentsForToday(barberId);
  }

  @Get('count-by-name/:barberId')
  async getServiceCountByName(@Param('barberId') barberId: string) {
    try {
      const serviceCount = await this.appointmentService.findServiceCountByName(barberId);
      return serviceCount;  // Return the count as an object of { service_name: count }
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('confirmed/:barberId')
  async getConfirmedAppointmentsByBarber(@Param('barberId') barberId: string) {
    return this.appointmentService.getConfirmedAppointmentsByBarber(barberId);
  }

  @Get('pending/:barberId')
  async getPendingAppointmentsByBarber(@Param('barberId') barberId: string) {
    return this.appointmentService.getPendingAppointmentsByBarber(barberId);
  }

  @Put(':id/state')
  async updateAppointmentState(
    @Param('id') appointmentId: string, // Extract appointmentId from the URL parameter
    @Body('newState') newState: string, // Extract newState from the request body
  ): Promise<Appointment> {
    return this.appointmentService.updateAppointmentState(appointmentId, newState);
  }
 

  @Get()
  async findAll() {
    return this.appointmentService.findAll();
  }
}
