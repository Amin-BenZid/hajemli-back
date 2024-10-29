import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Shop extends Document {
  @Prop({ required: true, unique: true })
  shop_id: string;

  @Prop({ required: true })
  shop_name: string;

  @Prop({ required: true, unique: true  })
  owner_id: string;

  @Prop({ required: true })
  localisation: string;

  @Prop({ required: true })
  number: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop()
  work_hours: string; // e.g., "9:00 AM - 5:00 PM"

  @Prop()
  day_off: string; // e.g., "Sunday"

  

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Barber' }] })
  barbers: Types.ObjectId[];

  @Prop([String])
  shop_images: string[];
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
