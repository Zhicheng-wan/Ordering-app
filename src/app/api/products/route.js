
import { MenuItem } from '@/models/MenuItem';
import mongoose from 'mongoose';

export async function POST(request) {

    mongoose.connect(process.env.MONGO_URI);

    const data = await request.json();
    const menuItemDoc = await MenuItem.create(data)

    return Response.json(menuItemDoc)

}


export async function GET() {
  await mongoose.connect(process.env.MONGO_URI);
  const items = await MenuItem.find().sort({ createdAt: -1 });
  return Response.json(items, { headers: { 'Cache-Control': 'no-store' } });
}