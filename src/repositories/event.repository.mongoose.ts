import mongoose from "mongoose";
import Event from "../entities/Event";
import EventRepository from "./event.repository";
import Location from "../entities/Location";

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

  async findByLocationAndDate(
    location: Location,
    date: Date
  ): Promise<Event | undefined> {
    const foundEvent = await EventModel.findOne({ location, date }).exec();

    return foundEvent ? foundEvent.toObject() : undefined;
  }

  async findEventsByCity(city: string): Promise<Event[]> {
    const foundEvents = await EventModel.find({ city }).exec();

    return foundEvents.map((event) => event.toObject());
  }

  async findEventsByCategory(category: string): Promise<Event[]> {
    const foundEvents = await EventModel.find({ categories: category }).exec();

    return foundEvents.map((event) => event.toObject());
  }
}
