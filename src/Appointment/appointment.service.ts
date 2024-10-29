import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(@InjectModel(Appointment.name) private appointmentModel: Model<Appointment>) {}

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
}
