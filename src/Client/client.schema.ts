import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Client extends Document {
  @Prop({ required: true, unique: true })
  client_id: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: false })
  shop_id: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  birthdate: Date;

  @Prop({ required: true, unique: true })
  mail: string;

  @Prop({ required: true })
    password: string;
  @Prop()
    resetToken: string; // Path to the image file
  
  @Prop({ required: false })
    resetTokenExpiration: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
