import { NextResponse } from "next/server";
import Event from "@/models/Event";
import { connectDB } from "@/lib/db";

export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    console.log('[api/events/:id] PUT id=', id, 'body=', body);
    const updated = await Event.findByIdAndUpdate(id, body, { new: true });
    console.log('[api/events/:id] updated=', updated);
    if (!updated) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[api/events/:id] error', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: any) {
  try {
    await connectDB();
    const { id } = await params;
    console.log('[api/events/:id] DELETE id=', id);
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error('[api/events/:id] DELETE error', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
