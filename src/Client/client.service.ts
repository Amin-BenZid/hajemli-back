import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Client } from './client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { MailService } from 'src/Mail/Mail.service';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { Shop } from 'src/shop/shop.schema';


@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Shop.name) private shopModel: Model<Shop>, // Inject Shop model
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(createClientDto.password, 10);
    const createdClient = new this.clientModel({
      ...createClientDto,
      password: hashedPassword, // Use the hashed password
    });
    return createdClient.save();
  }

  async findOne(clientId: string): Promise<Client> {
    const client = await this.clientModel.findOne({ client_id: clientId });
    if (!client) throw new NotFoundException(`Client with ID ${clientId} not found`);
    return client;
  }

  
  

  async findAll(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }

  async login(mail: string, password: string) {
    const client = await this.validateClient(mail, password);
    if (!client) {
      throw new UnauthorizedException('Invalid mail or password');
    }

    // Generate JWT token
    const payload = { client_id: client.client_id, mail: client.mail }; // Adjust based on your Client schema
    const token = this.jwtService.sign(payload);

    return { token, client }; // Return token and client data
  }

  async validateClient(mail: string, password: string): Promise<Client | null> {
    const client = await this.findByMail(mail);
    if (client && await bcrypt.compare(password, client.password)) {
      return client; // Return the client if validation is successful
    }
    return null; // Return null if validation fails
  }

  async findByMail(mail: string): Promise<Client | null> {
    const result = await this.clientModel.findOne({ mail }).lean();
    return result ? (result as Client) : null; // Cast to Client
  }

  async requestPasswordReset(mail: string): Promise<void> {
    const client = await this.clientModel.findOne({ mail }).exec();
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Generate a reset token and expiration date
    const resetToken = randomBytes(4).toString('hex'); // Use the imported randomBytes
    client.resetToken = resetToken;
    client.resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour
    await client.save();

    // Send reset token to client
    await this.mailService.sendUserPassword(mail, resetToken);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const client = await this.clientModel.findOne({
      resetToken,
      resetTokenExpiration: { $gte: Date.now() },
    }).exec();

    if (!client) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    client.password = await bcrypt.hash(newPassword, 10);
    client.resetToken = undefined;
    client.resetTokenExpiration = undefined;
    await client.save();
  }

  async getClientFullNameAndPhone(client_id: string): Promise<{ full_name: string; phone: string }> {
    const client = await this.findOne(client_id); // Reuse findOne method to get the client
  
    if (!client) {
      throw new NotFoundException(`Client with ID ${client_id} not found`);
    }
  
    // Concatenate last_name and first_name to form full_name
    const full_name = `${client.last_name} ${client.first_name}`;
    
    return { full_name, phone: client.phone };
  }

  async updateClientDetails(clientId: string, first_name?: string, last_name?: string, phone?: string): Promise<Client> {
    // Find the client by client_id
    const client = await this.clientModel.findOne({ client_id: clientId });

    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Update the attributes if provided
    if (first_name) client.first_name = first_name;
    if (last_name) client.last_name = last_name;
    if (phone) client.phone = phone;

    // Save the updated client
    return client.save();
  }

  async updateShopId(clientId: string, shopId: string): Promise<Client> {
    // Check if the shop exists in the Shop collection
    const shopExists = await this.shopModel.exists({ shop_id: shopId });
    if (!shopExists) {
      throw new NotFoundException(`Shop with ID ${shopId} not found`);
    }

    // Update the client's shop_id if the shop exists
    const updatedClient = await this.clientModel.findOneAndUpdate(
      { client_id: clientId },
      { shop_id: shopId },
      { new: true }
    );

    if (!updatedClient) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    return updatedClient;
  }

 
}
