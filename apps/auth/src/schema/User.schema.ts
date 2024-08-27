import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  registerBy: string;

  @Prop()
  socketId: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  verificationCode: string;

  @Prop({ default: 'freelancer' })
  role: string;
  enum: ['freelancer', 'companies', 'jobSeeker'];
}

export const UserSchema = SchemaFactory.createForClass(User);
