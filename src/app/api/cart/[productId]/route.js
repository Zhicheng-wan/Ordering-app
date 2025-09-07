import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/authOptions';
import { Cart } from '@/models/Cart';
import { User } from '@/models/User';

async function getUserId(session) {
  if (session?.user?._id) return session.user._id;
  if (session?.user?.email) {
    const u = await User.findOne({ email: session.user.email }).select('_id');
    return u?._id;
  }
  return null;
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  await mongoose.connect(process.env.MONGO_URI);
  const userId = await getUserId(session);
  if (!userId) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  const { qty } = await req.json();
  if (qty < 1) return Response.json({ message: 'qty must be >= 1' }, { status: 400 });

  const cart = await Cart.findOne({ userId });
  if (!cart) return Response.json({ message: 'Cart not found' }, { status: 404 });

  const it = cart.items.find((i) => String(i.productId) === String(params.productId));
  if (!it) return Response.json({ message: 'Item not in cart' }, { status: 404 });

  it.qty = qty;
  await cart.save();
  return Response.json(cart);
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  await mongoose.connect(process.env.MONGO_URI);
  const userId = await getUserId(session);
  if (!userId) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  const cart = await Cart.findOne({ userId });
  if (!cart) return Response.json({ message: 'Cart not found' }, { status: 404 });

  cart.items = cart.items.filter((i) => String(i.productId) !== String(params.productId));
  await cart.save();
  return Response.json(cart);
}
