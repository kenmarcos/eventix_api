import mongoose from "mongoose";
import Event from "../entities/Event";
import EventRepository from "./event.repository";
import Location from "../entities/Location";
import { FilterEventsProps } from "../services/event.service";

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
  participants: {
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
    const foundEvents = await EventModel.find({ categories: category })
      .collation({ locale: "pt", strength: 2 })
      .exec();

    return foundEvents.map((event) => event.toObject());
  }

  async findEventsByFilter({
    title,
    date,
    category,
  }: FilterEventsProps): Promise<Event[]> {
    console.log(
      "🚀 ~ file: event.repository.mongoose.ts:73 ~ EventRepositoryMongoose ~ date:",
      typeof date
    );
    const query = {
      $and: [
        {
          title:
            title !== "undefined"
              ? { $regex: title, $options: "i" }
              : { $exists: true },
        },

        {
          date: date
            ? {
                $gte: new Date(date),
                $lt: new Date(date).setDate(new Date(date).getDate() + 1),
              }
            : { $exists: true },
        },

        {
          categories:
            category !== "undefined" ? { $in: category } : { $exists: true },
        },
      ],
    };

    const findEvents = await EventModel.find(query).exec();

    return findEvents.map((event) => event.toObject());
  }

  async findFeaturedEvents(date: Date): Promise<Event[]> {
    const endDate = new Date(date);

    endDate.setMonth(endDate.getMonth() + 1);

    const foundEvents = await EventModel.find({
      date: { $gte: date, $lte: endDate },
    })
      .limit(4)
      .exec();

    return foundEvents.map((event) => event.toObject());
  }

  async findEventsByTitle(title: string): Promise<Event[]> {
    const foundEvents = await EventModel.find({
      title: {
        $regex: title,
        $options: "i",
      },
    }).exec();

    return foundEvents.map((event) => event.toObject());
  }

  async findEventById(id: string): Promise<Event | undefined> {
    const foundEvent = await EventModel.findOne({ _id: id }).exec();

    return foundEvent ? foundEvent.toObject() : undefined;
  }

  async update(event: Event, id: string): Promise<any> {
    const eventUpdate = await EventModel.updateMany({ _id: id }, event);

    return eventUpdate;
  }
}
