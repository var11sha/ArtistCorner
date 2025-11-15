import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,  // Links event to logged-in user
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,       // Stores the date of the event
    required: true,
  },
  startTime: {
    type: String,     // Format: "HH:MM"
    default: null,
  },
  endTime: {
    type: String,     // optional, in case you want duration later
    default: null,
  },
  fullDay: {
    type: Boolean,
    default: false,   // true if “all day event”
  },
  category: {
    type: String, 
    enum:["Fitness", "Study", "Meal"," Relax", "Travel"] ,   // Fitness, Study, Meal, Relax, Travel, etc.
    default: "Relax",
  },
  repeat: {
    type: String,
    enum: ["None", "Daily", "Weekly", "Monthly", "Custom"],
    default: "None",
  },
  repeatDays: {
    type: [String],   // e.g., ["Monday", "Wednesday"], only relevant if repeat = Weekly or Custom
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,   // Optional: for tracking when user marked event done
  },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
