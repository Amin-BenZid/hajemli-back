import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Appointment extends Document {
  @Prop({ required: true, unique: true })
  appointment_id: string;

  @Prop({ required: true })
  client_id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Barber' })
  barber_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  shop_id: Types.ObjectId;

  @Prop({ required: true })
  service_id: string;

  @Prop({ required: true })
  time_and_date: Date;

  @Prop({ required: true })
  state: string; // Example values: 'pending', 'confirmed', 'completed', etc.
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
