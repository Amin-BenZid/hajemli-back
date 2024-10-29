import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Package extends Document {
  @Prop({ required: true, unique: true })
  package_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  shop_owner_id: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration: string; // e.g., "1 month", "3 months", etc.
}

export const PackageSchema = SchemaFactory.createForClass(Package);
