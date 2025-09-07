// src/app/api/products/[id]/route.js
import mongoose from 'mongoose';
import { MenuItem } from '@/models/MenuItem';

export async function PATCH(_req, { params }) {
  await mongoose.connect(process.env.MONGO_URI);
  const body = await _req.json();
  const { id } = params;

  const update = {
    ...(body.name !== undefined && { name: body.name }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.image !== undefined && { image: body.image }),
    ...(body.price !== undefined && { price: Number(body.price) }),
  };

  const doc = await MenuItem.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!doc) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(doc);
}

export async function DELETE(_req, { params }) {
  await mongoose.connect(process.env.MONGO_URI);
  const { id } = params;
  const doc = await MenuItem.findByIdAndDelete(id);
  if (!doc) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ ok: true, id });
}
