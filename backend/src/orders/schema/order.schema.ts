import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      building: { type: String, required: true },
    },
    required: true,
  })
  shippingAddress: {
    country: string;
    city: string;
    street: string;
    building: string;
  };

  @Prop({
    type: {
      cardNumber: { type: String, required: true },
      expiry: { type: String, required: true },
      cvv: { type: String, required: true },
    },
    required: true,
  })
  paymentDetails: {
    cardNumber: string;
    expiry: string;
    cvv: string;
  };

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({
    type: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userEmail: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
