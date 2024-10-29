import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get(':id')
  async findOne(@Param('id') subscriptionId: string) {
    return this.subscriptionService.findOne(subscriptionId);
  }

  @Get()
  async findAll() {
    return this.subscriptionService.findAll();
  }
}
