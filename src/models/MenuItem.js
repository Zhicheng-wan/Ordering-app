import { Schema } from 'mongoose';
import { model, models } from 'mongoose';

const MenuItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: (props) => `${props.value} is not a valid price! Price must be a positive number.`,
      },
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const MenuItem = models?.MenuItem || model('MenuItem', MenuItemSchema);
