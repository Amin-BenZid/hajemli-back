import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Barber } from './barber.schema';
import { CreateBarberDto } from './dto/create-barber.dto';

@Injectable()
export class BarberService {
  constructor(@InjectModel(Barber.name) private barberModel: Model<Barber>) {}

  async create(createBarberDto: CreateBarberDto): Promise<Barber> {
    const createdBarber = new this.barberModel(createBarberDto);
    return createdBarber.save();
  }

  async findOne(barberId: string): Promise<Barber> {
    const barber = await this.barberModel.findOne({ barber_id: barberId });
    if (!barber) throw new NotFoundException(`Barber with ID ${barberId} not found`);
    return barber;
  }

  async findAll(): Promise<Barber[]> {
    return this.barberModel.find().exec();
  }
}
