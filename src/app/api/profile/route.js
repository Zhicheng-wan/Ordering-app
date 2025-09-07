import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/authOptions';
import { User } from '@/models/User';

export async function PUT(request) {
  mongoose.connect(process.env.MONGO_URI);
  const data = await request.json();
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  const update = {};
  if ('name' in data) {
    // update
    update.name = data.name;
    //console.log('Updating user name', data.name, email);
    //await User.updateOne({ email }, { name: data.name })
  }

  if ('avatar' in data) {
    update.image = data.avatar;
  }

  if (Object.keys(update).length > 0) {
    // Update the user in the database
    await User.updateOne({ email }, update);
  }

  return Response.json(true);
}
