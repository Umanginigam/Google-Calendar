import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent {
  id?: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  date: string; // yyyy-MM-dd
  createdAt?: Date;
  updatedAt?: Date;
}

// Extend Document for the Mongoose document type
export interface IEventDocument extends Document {
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  date: string;
}

const EventSchema = new Schema<IEventDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add index for better query performance
EventSchema.index({ date: 1 });

// Type-safe model
const Event: Model<IEventDocument> =
  mongoose.models.Event || mongoose.model<IEventDocument>("Event", EventSchema);

export default Event;