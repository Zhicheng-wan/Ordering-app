import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/authOptions';
import { Cart } from '@/models/Cart';
import { User } from '@/models/User';

export async function DELETE() {
  const session = await getServerSession(authOptions);

  // Connect before any DB lookups
  await mongoose.connect(process.env.MONGO_URI);

  // Prefer _id from session; otherwise resolve by email
  let userId = session?.user?._id;
  if (!userId && session?.user?.email) {
    const u = await User.findOne({ email: session.user.email }).select('_id');
    userId = u?._id; // keep as ObjectId (Cart.userId is ObjectId)
  }

  if (!userId) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } }, { upsert: true });

  return Response.json({ ok: true });
}
