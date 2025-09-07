import mongoose from 'mongoose';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Basic input checks
    if (!name || !email || !password) {
      return Response.json({ message: 'Name, email, and password are required.' }, { status: 400 });
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: 'User with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      // image: optional
    });

    // Return safe fields only
    const { _id, name: n, email: e, image, admin, createdAt, updatedAt } = newUser.toObject();
    return Response.json(
      { _id, name: n, email: e, image, admin, createdAt, updatedAt },
      { status: 201 },
    );
  } catch (err) {
    console.error('REGISTER API ERROR:', err);
    return Response.json({ message: 'Server error occurred.' }, { status: 500 });
  }
}
