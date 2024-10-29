import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Service } from 'src/Service/service.schema';

@Schema()
export class Barber extends Document {
  @Prop({ required: true, unique: true })
  barber_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  mail: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  birthdate: Date;

  @Prop({ default: 0 })
  rating: number;

  @Prop()
  image: string;

  @Prop()
  profile_image: string;

  @Prop({ required: true })
    password: string;
  @Prop()
    resetToken: string; // Path to the image file
  
  @Prop({ required: false })
    resetTokenExpiration: Date;

  @Prop()
  bio: string;

  @Prop({ type: [Types.ObjectId], ref: 'Service' }) 
  services: Service[];
}

export const BarberSchema = SchemaFactory.createForClass(Barber);
