import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { BarberService } from './barber.service';
import { CreateBarberDto } from './dto/create-barber.dto';
import { Barber } from './barber.schema';

@Controller('barbers')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Post()
  async create(@Body() createBarberDto: CreateBarberDto) {
    return this.barberService.create(createBarberDto);
  }

  @Post('login/google')
async loginWithGoogle(@Body('token') token: string) {
  return this.barberService.loginWithGoogle(token);
}


  @Get(':id')
  async findOne(@Param('id') barberId: string) {
    return this.barberService.findOne(barberId);
  }

  @Post('login')
  async login(@Body() loginDto: { mail: string; password: string }): Promise<{ token: string; barber: Barber }> {
    return this.barberService.login(loginDto.mail, loginDto.password);
  }

  // Request password reset
  @Post('reset-password')
  async requestPasswordReset(@Body('mail') mail: string): Promise<void> {
    return this.barberService.requestPasswordReset(mail);
  }

  // Reset password using a reset token
  @Patch('reset-password')
  async resetPassword(
    @Body() resetDto: { resetToken: string; newPassword: string }
  ): Promise<void> {
    return this.barberService.resetPassword(resetDto.resetToken, resetDto.newPassword);
  }

  @Get()
  async findAll() {
    return this.barberService.findAll();
  }
}
