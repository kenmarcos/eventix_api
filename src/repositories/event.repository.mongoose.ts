import mongoose from "mongoose";
import Event from "../entities/Event";
import EventRepository from "./event.repository";

const eventSchema = new mongoose.Schema({
  title: String,
  location: {
    latitude: String,
    longitude: String,
  },
  date: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: String,
  banner: String,
  flyers: [String],
  coupons: [String],
  participans: {
    type: Array,
    ref: "User",
  },
  price: {
    type: Array,
  },
  city: String,
  categories: [String],
  formattedAddress: String,
});

const EventModel = mongoose.model("Event", eventSchema);

export class EventRepositoryMongoose implements EventRepository {
  async add(event: Event): Promise<Event> {
    const eventModel = new EventModel(event);

    await eventModel.save();

    return event;
  }
}
