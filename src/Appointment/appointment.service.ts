import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findServiceDetailsByBarberId(berberId: string): Promise<Service[]> {
    const appointments = await this.appointmentModel.find({ barber_id: berberId });
    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(`No appointments found for client with ID ${berberId}`);
    }

    const serviceIds = appointments.map(appointment => appointment.service_id);
    
    // Query the Service model to get full details of each service
    const services = await this.serviceModel.find({ service_id: { $in: serviceIds } });

    if (services.length === 0) {
      throw new NotFoundException(`No services found for the given service_ids`);
    }

    return services;
  }

  async findServiceDetailsByBarberIdAndCalculateTotal(berberId: string): Promise<{ services: Service[], totalPrice: number }> {
    const appointments = await this.appointmentModel.find({ barber_id: berberId });
    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(`No appointments found for barber with ID ${berberId}`);
    }
  
    const serviceIds = appointments.map(appointment => appointment.service_id);
  
    // Query the Service model to get full details of each service
    const services = await this.serviceModel.find({ service_id: { $in: serviceIds } });
  
    if (services.length === 0) {
      throw new NotFoundException(`No services found for the given service_ids`);
    }
  
    // Calculate the total price
    const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
  
    return {
      services,
      totalPrice
    };
  }

  async countAppointmentsForToday(barberId: string): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set the start of the day to midnight

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // Set the end of the day to just before midnight

    const count = await this.appointmentModel.countDocuments({
      barber_id: barberId,
      time_and_date: { $gte: todayStart, $lte: todayEnd },
    });

    return count;
  }

  async findServiceCountByName(barberId: string): Promise<Record<string, number>> {
    const appointments = await this.appointmentModel.find({ barber_id: barberId });
    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(`No appointments found for barber with ID ${barberId}`);
    }
  
    const serviceIds = appointments.map(appointment => appointment.service_id);
    
    // Query the Service model to get full details of each service
    const services = await this.serviceModel.find({ service_id: { $in: serviceIds } });
  
    if (services.length === 0) {
      throw new NotFoundException(`No services found for the given service_ids`);
    }
  
    // Group the services by name and count the occurrences
    const serviceCount: Record<string, number> = {};
  
    services.forEach(service => {
      if (serviceCount[service.name]) {
        serviceCount[service.name]++;
      } else {
        serviceCount[service.name] = 1;
      }
    });
  
    return serviceCount;
  }

  async countAppointmentsPerDay() {
    const result = await this.appointmentModel.aggregate([
      {
        // Group by the date part of `time_and_date` field (ignoring the time)
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$time_and_date" } }
        },
      },
      {
        // Group by the `day` and count the number of appointments for each day
        $group: {
          _id: "$day",
          count: { $sum: 1 }
        },
      },
      {
        // Sort the results by day (ascending or descending)
        $sort: { _id: 1 }
      }
    ]);

    return result;
  }

  async getConfirmedAppointmentsByBarber(barberId: string): Promise<Appointment[]> {
    return this.appointmentModel.find({ 
      barber_id: barberId,
      state: 'confirmed' 
    }).exec();
  }

  async getPendingAppointmentsByBarber(barberId: string): Promise<Appointment[]> {
    return this.appointmentModel.find({ 
      barber_id: barberId,
      state: 'pending' 
    }).exec();
  }

  async updateAppointmentState(appointmentId: string, newState: string): Promise<Appointment> {
    // Find the appointment by its ID
    const appointment = await this.appointmentModel.findOne({ appointment_id: appointmentId });
    
    // If appointment is not found, throw a NotFoundException
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
    }
  
    // Update the state of the appointment
    appointment.state = newState;
  
    // Save the updated appointment
    return appointment.save();
  }

}
