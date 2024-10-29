import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Service extends Document {
  @Prop({ required: true, unique: true })
  service_id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  bio: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  time: string; // e.g., "30 mins", "1 hour"
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
