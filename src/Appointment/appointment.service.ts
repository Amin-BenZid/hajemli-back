import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Service } from 'src/Service/service.schema';

@Injectable()
export class AppointmentService {
  constructor(@InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  @InjectModel(Service.name) private serviceModel: Model<Service> // Inject Service model
) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const createdAppointment = new this.appointmentModel(createAppointmentDto);
    return createdAppointment.save();
  }

  async findOne(appointmentId: string): Promise<Appointment> {
    const appointment = await this.appointmentModel.findOne({ appointment_id: appointmentId })
      .populate('barber_id')
      .populate('shop_id');
    if (!appointment) throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
    return appointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel.find()
      .populate('barber_id')
      .populate('shop_id')
      .exec();
  }

  async findServiceDetailsByClientId(clientId: string): Promise<Service[]> {
    const appointments = await this.appointmentModel.find({ client_id: clientId });
    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(`No appointments found for client with ID ${clientId}`);
    }

    const serviceIds = appointments.map(appointment => appointment.service_id);
    
    // Query the Service model to get full details of each service
    const services = await this.serviceModel.find({ service_id: { $in: serviceIds } });

    if (services.length === 0) {
      throw new NotFoundException(`No services found for the given service_ids`);
    }

    return services;
  }

}
