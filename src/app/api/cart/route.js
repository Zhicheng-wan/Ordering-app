import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/authOptions';
import { Cart } from '@/models/Cart';
import { MenuItem } from '@/models/MenuItem';
import { User } from '@/models/User';

async function getUserId(session) {
  if (session?.user?._id) return session.user._id;
  if (session?.user?.email) {
    const u = await User.findOne({ email: session.user.email }).select('_id');
    return u?._id;
  }
  return null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  await mongoose.connect(process.env.MONGO_URI);
  const userId = await getUserId(session);
  if (!userId) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  const cart = await Cart.findOne({ userId });
  return Response.json(cart || { userId, items: [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  await mongoose.connect(process.env.MONGO_URI);
  const userId = await getUserId(session);
  if (!userId) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  const { productId, qty = 1 } = await req.json();
  const product = await MenuItem.findById(productId);
  if (!product) return Response.json({ message: 'Product not found' }, { status: 404 });

  const cart = (await Cart.findOne({ userId })) || new Cart({ userId, items: [] });
  const i = cart.items.findIndex((it) => String(it.productId) === String(productId));
  if (i >= 0) cart.items[i].qty += qty;
  else
    cart.items.push({
      productId,
      name: product.name,
      image: product.image,
      price: Number(product.price || 0),
      qty,
    });

  await cart.save();
  return Response.json(cart);
}
