import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ShopOwner } from './shop-owner.schema';
import { CreateShopOwnerDto } from './dto/create-shop-owner.dto';
import { Shop } from 'src/Shop/shop.schema';
import { MailService } from 'src/Mail/Mail.service';

@Injectable()
export class ShopOwnerService {
    constructor(
        @InjectModel(ShopOwner.name) private shopOwnerModel: Model<ShopOwner>,
        @InjectModel(Shop.name) private shopModel: Model<Shop>,
        private mailService: MailService,

    ) {}

    async create(createShopOwnerDto: CreateShopOwnerDto): Promise<ShopOwner> {
        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createShopOwnerDto.password, saltRounds);

        const createdShopOwner = new this.shopOwnerModel({
            ...createShopOwnerDto,
            password: hashedPassword // Save the hashed password
        });
        return createdShopOwner.save();
    }

    async createShop(ownerId: string, shopDetails: Partial<Shop>): Promise<Shop> {
        const newShop = new this.shopModel({ ...shopDetails, owner_id: ownerId });
        await newShop.save();
        return newShop;
    }

    async findOne(shopOwnerId: string): Promise<ShopOwner> {
        const shopOwner = await this.shopOwnerModel
            .findOne({ shop_owner_id: shopOwnerId })
            .populate('package_id');
        if (!shopOwner) throw new NotFoundException(`Shop Owner with ID ${shopOwnerId} not found`);
        return shopOwner;
    }

    async findAll(): Promise<ShopOwner[]> {
        return this.shopOwnerModel.find().populate('package_id').exec();
    }

    async findShopsByOwnerId(shopOwnerId: string): Promise<string[]> {
        const shops = await this.shopModel.find({ shop_owner_id: shopOwnerId }).select('shop_id').exec();
        if (!shops || shops.length === 0) {
            throw new NotFoundException(`No shops found for Shop Owner with ID ${shopOwnerId}`);
        }
        return shops.map(shop => `https://yourdomain.com/shops/${shop.shop_id}`);
    }
    async validateShopOwner(mail: string, password: string): Promise<ShopOwner | null> {
        const shopOwner = await this.shopOwnerModel.findOne({ mail }); // Use appropriate field to find shop owner
        if (shopOwner && await bcrypt.compare(password, shopOwner.password)) {
            // Password is valid
            return shopOwner;
        }
        return null; // Invalid mail or password
    }
    // Example login method in your controller
async login(mail: string, password: string) {
    const shopOwner = await this.validateShopOwner(mail, password);
    if (!shopOwner) {
        throw new UnauthorizedException('Invalid mail or password');
    }

    // Proceed with generating a JWT or similar logic
}
async findByMail(mail: string): Promise<ShopOwner | null> {
    const result = await this.shopOwnerModel.findOne({ mail }).lean();
    return result ? (result as ShopOwner) : null; // Cast to ShopOwner
}




  async requestPasswordReset(mail: string): Promise<void> {
    const user = await this.shopOwnerModel.findOne({ mail }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a reset token and expiration date
    const resetToken = crypto.randomBytes(4).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour
    await user.save();

    // Send reset token to user
    await this.mailService.sendUserPassword(mail, resetToken);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const user = await this.shopOwnerModel.findOne({
      resetToken,
      resetTokenExpiration: { $gte: Date.now() },
    }).exec();

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
  }
}