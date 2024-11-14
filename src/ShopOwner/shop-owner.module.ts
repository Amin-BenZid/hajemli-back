import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopOwnerController } from './shop-owner.controller';
import { ShopOwnerService } from './shop-owner.service';
import { ShopOwner, ShopOwnerSchema } from './shop-owner.schema';
import { Shop, ShopSchema } from 'src/Shop/shop.schema';
import { MailService } from 'src/Mail/Mail.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ShopOwner.name, schema: ShopOwnerSchema }]),
        MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'yourSecretKey', // Replace with your actual secret key
            signOptions: { expiresIn: '60s' }, // Adjust expiration time as needed
        }),
    ],
    controllers: [ShopOwnerController],
    providers: [ShopOwnerService, MailService],
})
export class ShopOwnerModule {}
