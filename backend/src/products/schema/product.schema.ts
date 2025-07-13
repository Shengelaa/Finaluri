import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps: true})
export class Product {
   @Prop({
        type: String,
        required: true
    })
    title: string

    @Prop({
        type: String,
        required: true
    })
    desc: string


    @Prop({
        type: String,
        required: true
    })
    category: string

    @Prop({
        type: Number,
        required: true,
        index: true
    })
    price: number


    @Prop({
        type: Number,
        required: true
    })
    quantity: number

      @Prop({
        type: String,
        required: true
      })
  imageUrl?: string;
}

export const productSchema = SchemaFactory.createForClass(Product)
