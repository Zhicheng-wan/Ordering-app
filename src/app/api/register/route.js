import mongoose from "mongoose";
import { User } from "@/app/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { message: "User with this email already exists." },
        { status: 409 } // Conflict
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    return Response.json(newUser, { status: 201 });
  } catch (err) {
    console.error("REGISTER API ERROR:", err);
    return Response.json(
      { message: "Server error occurred." },
      { status: 500 }
    );
  }
}
