
import { MenuItem } from '@/models/MenuItem';
import mongoose from 'mongoose';

export async function POST(request) {

    mongoose.connect(process.env.MONGO_URI);

    const data = await request.json();
    const menuItemDoc = await MenuItem.create(data)

    return Response.json(menuItemDoc)

}