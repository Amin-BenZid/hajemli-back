import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BarberService } from './barber.service';
import { Barber, BarberSchema } from './barber.schema';
import { MailModule } from 'src/Mail/mail.module'; // Adjust the import path according to your project structure
import { JwtModule } from '@nestjs/jwt';
import { BarberController } from './barber.controller';
import { ServiceModule } from 'src/Service/service.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Barber.name, schema: BarberSchema }]),
    ServiceModule,
    MailModule, // Ensure MailModule is imported here
    JwtModule.register({
      // Add your JWT configuration here
      secret: 'your-secret', // Use a secure secret in production
      signOptions: { expiresIn: '60s' }, // Adjust expiration time as needed
    }),
  ],
  controllers:[BarberController],
  providers: [BarberService],
  exports: [BarberService], // Export if needed in other modules
})
export class BarberModule {}
