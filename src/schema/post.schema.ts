import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ collection: 'post' })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: number;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: false, type: Date })
  createdAt: Date;

  @Prop({ required: false, type: Date })
  updatedAt: Date;

  @Prop({ required: false, type: String })
  imageUrl: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
