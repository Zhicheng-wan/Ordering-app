import mongoose from 'mongoose';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/authOptions';

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.admin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await mongoose.connect(process.env.MONGO_URI);

  const { id } = await params;
  const body = await req.json();

  const update = {};
  if (body.name !== undefined) update.name = String(body.name).trim();
  if (body.email !== undefined) update.email = String(body.email).trim().toLowerCase();
  if (body.image !== undefined) update.image = String(body.image).trim();
  if (body.admin !== undefined) update.admin = !!body.admin;

  // Optional password change
  if (body.newPassword) {
    const pw = String(body.newPassword);
    if (pw.length < 5) {
      return Response.json({ message: 'Password must be at least 5 characters.' }, { status: 400 });
    }
    update.password = await bcrypt.hash(pw, 10);
  }

  // Prevent demoting yourself
  if (String(id) === String(session.user.id) && update.admin === false) {
    return Response.json(
      { message: 'You cannot remove your own admin privileges.' },
      { status: 400 },
    );
  }

  // Enforce unique email if changed
  if (update.email) {
    const exists = await User.findOne({ email: update.email, _id: { $ne: id } });
    if (exists) {
      return Response.json({ message: 'Another user already uses that email.' }, { status: 409 });
    }
  }

  const doc = await User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!doc) {
    return Response.json({ message: 'User not found' }, { status: 404 });
  }

  return Response.json(doc);
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.admin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await mongoose.connect(process.env.MONGO_URI);

  const { id } = params;

  // Prevent deleting yourself
  if (String(id) === String(session.user.id)) {
    return Response.json({ message: 'You cannot delete your own account.' }, { status: 400 });
  }

  const doc = await User.findByIdAndDelete(id);
  if (!doc) {
    return Response.json({ message: 'User not found' }, { status: 404 });
  }

  return Response.json({ ok: true, id });
}
