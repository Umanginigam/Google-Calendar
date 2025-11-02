import { NextResponse } from "next/server";
import Event from "@/models/Event";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const events = await Event.find().sort({ date: 1 });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    // Remove any id from the input data to let MongoDB generate it
    const { id, _id, ...eventData } = data;
    
    const event = await Event.create(eventData);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
