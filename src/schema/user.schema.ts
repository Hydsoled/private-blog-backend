import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'user' })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: number;

  @Prop({ required: true, type: String })
  nickname: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, type: String })
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
