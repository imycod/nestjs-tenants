import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Log extends Document {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  meta?: Record<string, any>;

  @Prop()
  requestMethod?: string;

  @Prop()
  requestPath?: string;

  @Prop({ type: Object })
  requestHeaders?: Record<string, any>;

  @Prop({ type: Object })
  requestBody?: Record<string, any>;

  @Prop()
  responseTime?: number;

  @Prop({ type: Object })
  responseBody?: Record<string, any>;

  @Prop()
  statusCode?: number;

  @Prop()
  error?: string;

  @Prop()
  stack?: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);