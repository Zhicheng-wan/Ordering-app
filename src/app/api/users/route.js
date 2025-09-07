import mongoose from 'mongoose';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/authOptions';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.admin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await mongoose.connect(process.env.MONGO_URI);

  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim();

  const filter = q
    ? {
        $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }],
      }
    : {};

  const users = await User.find(filter).sort({ createdAt: -1 }).select('-password'); // never send password

  return Response.json(users, { headers: { 'Cache-Control': 'no-store' } });
}
