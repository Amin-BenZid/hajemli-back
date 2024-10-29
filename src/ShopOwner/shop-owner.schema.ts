import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Service } from 'src/Service/service.schema';
import { Shop } from 'src/Shop/shop.schema';

@Schema()
export class ShopOwner extends Document {
  @Prop({ required: true, unique: true })
  owner_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  mail: string;


  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  birthdate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Package' })
  package_id: Types.ObjectId;

  @Prop()
  image: string;

  @Prop()
  profile_image: string;

  @Prop()
  bio: string;




  @Prop({ type: [Types.ObjectId], ref: 'Service' }) 
  posts: Service[];

  @Prop({ required: true })
  password: string;
  @Prop()
  resetToken: string; // Path to the image file
  
  @Prop({ required: false })
  resetTokenExpiration: Date;
}

export const ShopOwnerSchema = SchemaFactory.createForClass(ShopOwner);
