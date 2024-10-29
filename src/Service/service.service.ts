import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './service.schema';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
  constructor(@InjectModel(Service.name) private serviceModel: Model<Service>) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const createdService = new this.serviceModel(createServiceDto);
    return createdService.save();
  }

  async findOne(serviceId: string): Promise<Service> {
    const service = await this.serviceModel.findOne({ service_id: serviceId });
    if (!service) throw new NotFoundException(`Service with ID ${serviceId} not found`);
    return service;
  }

  async findAll(): Promise<Service[]> {
    return this.serviceModel.find().exec();
  }
}
