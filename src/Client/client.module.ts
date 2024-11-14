import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientService } from './client.service';
import { Client, ClientSchema } from './client.schema'; // Adjust according to your actual schema
import { MailModule } from 'src/Mail/mail.module'; // Adjust the import path according to your project structure
import { JwtModule } from '@nestjs/jwt';
import { ClientController } from './client.controller';
import { Shop, ShopSchema } from 'src/shop/shop.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema },
      { name: Shop.name, schema: ShopSchema },
    ]), // Ensure you're using the correct schema
    MailModule, // Ensure MailModule is imported here
    JwtModule.register({
      secret: 'your-secret', // Use a secure secret in production
      signOptions: { expiresIn: '60s' }, // Adjust expiration time as needed
    }),
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService], // Export if needed in other modules
})
export class ClientModule {}
