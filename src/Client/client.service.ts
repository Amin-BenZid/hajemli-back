import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './client.schema';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const createdClient = new this.clientModel(createClientDto);
    return createdClient.save();
  }

  async findOne(clientId: string): Promise<Client> {
    const client = await this.clientModel.findOne({ client_id: clientId });
    if (!client) throw new NotFoundException(`Client with ID ${clientId} not found`);
    return client;
  }

  async updateShopId(clientId: string, shopId: string): Promise<Client> {
    return this.clientModel.findByIdAndUpdate(clientId, { shop_id: shopId }, { new: true });
  }

  async findAll(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }
}
