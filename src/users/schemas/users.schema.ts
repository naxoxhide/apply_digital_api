import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, nullable: false })
  email: string;

  @Prop({ required: true, nullable: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
