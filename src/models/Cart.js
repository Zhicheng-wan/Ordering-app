import { Schema, model, models } from 'mongoose';

const CartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: String, // snapshot
    image: String, // snapshot
    price: Number, // snapshot (Number)
    qty: { type: Number, default: 1, min: 1 },
  },
  { _id: false },
);

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true },
);

export const Cart = models.Cart || model('Cart', CartSchema);
