import { Controller, Post, Body, Get, Param, Put, Patch, NotFoundException } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './client.schema';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Post('login')
  async login(@Body() loginDto: { mail: string; password: string }): Promise<{ token: string; client: Client }> {
    return this.clientService.login(loginDto.mail, loginDto.password);
  }

  // Request password reset
  @Post('reset-password')
  async requestPasswordReset(@Body('mail') mail: string): Promise<void> {
    return this.clientService.requestPasswordReset(mail);
  }

  // Reset password using a reset token
  @Patch('reset-password')
  async resetPassword(
    @Body() resetDto: { resetToken: string; newPassword: string }
  ): Promise<void> {
    return this.clientService.resetPassword(resetDto.resetToken, resetDto.newPassword);
  }

  @Patch(':clientId/shop')
  async updateClientShop(
    @Param('clientId') clientId: string,
    @Body('shopId') shopId: string,
  ) {
    if (!shopId) {
      throw new NotFoundException('Shop ID is required');
    }
    return await this.clientService.updateShopId(clientId, shopId);
  }

  @Put(':clientId/updateuser')
  async updateClient(
    @Param('clientId') clientId: string, // Extract clientId from the URL
    @Body() updateClientData: { first_name?: string; last_name?: string; phone?: string },
  ) {
    const { first_name, last_name, phone } = updateClientData;

    // Call the service method to update the client details
    return this.clientService.updateClientDetails(clientId, first_name, last_name, phone);
  }

  @Get(':id')
  async findOne(@Param('id') clientId: string) {
    return this.clientService.findOne(clientId);
  }

  @Get(':clientId/fullname-phone')
  async getClientFullNameAndPhone(@Param('clientId') clientId: string) {
    try {
      const { full_name, phone } = await this.clientService.getClientFullNameAndPhone(clientId);
      return { full_name, phone };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }



  @Put(':id/shop')
  async updateShopId(
    @Param('id') id: string,
    @Body('shop_id') shopId: string,
  ): Promise<Client> {
    return this.clientService.updateShopId(id, shopId);
  }

  @Get()
  async findAll() {
    return this.clientService.findAll();
  }
}
