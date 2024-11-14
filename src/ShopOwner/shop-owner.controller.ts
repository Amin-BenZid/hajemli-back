import { Controller, Post, Body, Get, Param, NotFoundException, UnauthorizedException, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ShopOwnerService } from './shop-owner.service';
import { CreateShopOwnerDto } from './dto/create-shop-owner.dto';
import { Shop } from 'src/Shop/shop.schema';
import { ShopOwner } from './shop-owner.schema';


@Controller('shop-owners')
export class ShopOwnerController {
    constructor(
        private readonly shopOwnerService: ShopOwnerService,
    ) {}

  @Post()
  async create(@Body() createShopOwnerDto: CreateShopOwnerDto) {
    return this.shopOwnerService.create(createShopOwnerDto);
  }

  @Post(':ownerId/shops')
  async createShop(
    @Param('ownerId') ownerId: string,
    @Body() shopDetails: Partial<Shop>,
  ): Promise<Shop> {
    return this.shopOwnerService.createShop(ownerId, shopDetails);
  }
 
  @Post('login')
    async login(@Body() loginDto: { mail: string; password: string }): Promise<{ token: string; shopOwner: ShopOwner }> {
        return this.shopOwnerService.login(loginDto.mail, loginDto.password);
    }

    // Request password reset
    @Post('reset-password')
    async requestPasswordReset(@Body('mail') mail: string): Promise<void> {
        return this.shopOwnerService.requestPasswordReset(mail);
    }

    // Reset password using a reset token
    @Patch('reset-password')
    async resetPassword(
        @Body() resetDto: { resetToken: string; newPassword: string }
    ): Promise<void> {
        return this.shopOwnerService.resetPassword(resetDto.resetToken, resetDto.newPassword);
    }

  @Get(':id')
  async findOne(@Param('id') shopOwnerId: string) {
    return this.shopOwnerService.findOne(shopOwnerId);
  }

  @Get()
  async findAll() {
    return this.shopOwnerService.findAll();
  }
  @Get(':id/shops')
    async findShopsByOwnerId(@Param('id') shopOwnerId: string): Promise<string[]> {
        const shops = await this.shopOwnerService.findShopsByOwnerId(shopOwnerId);
        if (!shops || shops.length === 0) {
            throw new NotFoundException(`No shops found for Shop Owner with ID ${shopOwnerId}`);
        }
        return shops;
    }

    @Get(':id/client')
    async sendauclient(@Param('id') shopOwnerId: string): Promise<string[]> {
        const shops = await this.shopOwnerService.sendauclient(shopOwnerId);
        if (!shops || shops.length === 0) {
            throw new NotFoundException(`No shops found for Shop Owner with ID ${shopOwnerId}`);
        }
        return shops;
    }
}
