import { User } from "@/app/models/User";
import mongoose from "mongoose";

export async function POST(request) {
    const body = await request.json();
    mongoose.connect(process.env.MONGO_URI)
    const createdUser = await User.create(body)
    return Response.json(createdUser)
}