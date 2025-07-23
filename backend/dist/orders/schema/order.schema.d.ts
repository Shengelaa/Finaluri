import { Document } from 'mongoose';
export type OrderDocument = Order & Document;
export declare class Order {
    shippingAddress: {
        country: string;
        city: string;
        street: string;
        building: string;
    };
    paymentDetails: {
        cardNumber: string;
        expiry: string;
        cvv: string;
    };
    total: number;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    userId: string;
    userEmail: string;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any> & Order & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}> & import("mongoose").FlatRecord<Order> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
