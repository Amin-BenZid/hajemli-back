import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Subscription extends Document {
  @Prop({ required: true, unique: true })
  sub_id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  shop_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Package' })
  package_id: Types.ObjectId;

  @Prop({ required: true })
  starts: Date;

  @Prop({ required: true })
  ends: Date;

  @Prop({ required: true })
  status: string; // e.g., "active", "expired"
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
