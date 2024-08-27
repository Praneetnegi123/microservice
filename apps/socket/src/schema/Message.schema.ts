import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Messages>;

@Schema({ timestamps: true })
export class Messages {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' }) // Corrected to reference the 'User' model
  from: Types.ObjectId; // Ensure this is of type ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' }) // Corrected to reference the 'User' model
  to: Types.ObjectId; // Ensure this is of type ObjectId

  @Prop()
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Messages);
