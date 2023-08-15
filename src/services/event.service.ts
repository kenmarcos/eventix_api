import Event from "../entities/Event";
import AppError from "../errors/appError";
import EventRepository from "../repositories/event.repository";
import axios from "axios";
import dotenv from "dotenv";
import { UserRepositoryMongoose } from "../repositories/user.repository.mongoose";

dotenv.config();

export default class EventService {
  constructor(private eventRepository: EventRepository) {}

  async create(eventData: Event) {
    if (!eventData.banner) {
      throw new AppError(400, "Banner is required");
    }

    if (!eventData.flyers) {
      throw new AppError(400, "Flyers are required");
    }

    if (!eventData.date) {
      throw new AppError(400, "Date is required");
    }

    if (!eventData.location) {
      throw new AppError(400, "Location is required");
    }

    const verifyEvent = await this.eventRepository.findByLocationAndDate(
      eventData.location,
      eventData.date
    );

    if (verifyEvent) {
      throw new AppError(409, "Event already exists");
    }

    const cityName = await this.getCityNameByCoordinates(
      eventData.location.latitude,
      eventData.location.longitude
    );

    eventData = {
      ...eventData,
      city: cityName,
    };

    const newEvent = await this.eventRepository.add(eventData);

    return newEvent;
  }

  async findEventsByLocation(latitude: string, longitude: string) {
    const cityName = await this.getCityNameByCoordinates(latitude, longitude);

    const foundEventsByCity = await this.eventRepository.findEventsByCity(
      cityName
    );

    const eventsWithRadius = foundEventsByCity.filter((event) => {
      const distance = this.calculateDistance(
        Number(latitude),
        Number(longitude),
        Number(event.location.latitude),
        Number(event.location.longitude)
      );

      return distance <= 3;
    });

    return eventsWithRadius;
  }

  async findEventsByCategory(category: string) {
    if (!category) {
      throw new AppError(400, "Category is required");
    }

    const foundEventsByCategory =
      await this.eventRepository.findEventsByCategory(category);

    return foundEventsByCategory;
  }

  async findEventsByTitle(title: string) {
    if (!title) {
      throw new AppError(400, "Title is required");
    }

    const foundEventsByTitle = this.eventRepository.findEventsByTitle(title);

    return foundEventsByTitle;
  }

  async findEventById(id: string) {
    if (!id) {
      throw new AppError(400, "Id is required");
    }

    const foundEvent = await this.eventRepository.findEventById(id);

    if (!foundEvent) {
      throw new AppError(404, "Event not found");
    }

    return foundEvent;
  }

  async addParticipant(id: string, name: string, email: string) {
    const event = await this.eventRepository.findEventById(id);

    if (!event) {
      throw new AppError(404, "Event not found");
    }

    const userRepository = new UserRepositoryMongoose();

    const participant = {
      name,
      email,
    };

    let user: any = {};

    const verifyIfUserExists = await userRepository.verifyIfUserExists(email);

    if (!verifyIfUserExists) {
      user = await userRepository.add(participant);
    } else {
      user = verifyIfUserExists;
    }

    if (event.participants.includes(user._id)) {
      throw new AppError(409, "User already exists");
    }

    console.log(
      "🚀 ~ file: event.service.ts:133 ~ EventService ~ addParticipant ~ user:",
      user
    );
    event.participants.push(user._id);

    await this.eventRepository.update(event, id);

    return event;
  }

  private async getCityNameByCoordinates(latitude: string, longitude: string) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_API_KEY}`
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const address = response.data.results[0].address_components;

        const cityType = address.find(
          (type: any) =>
            type.types.includes("administrative_area_level_2") &&
            type.types.includes("political")
        );

        return cityType.long_name;
      }

      throw new AppError(404, "City not found");
    } catch (error) {
      throw new AppError(401, "Error request city name");
    }
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Raio da Terra em quilômetros
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
