import Event from "../entities/Event";
import Location from "../entities/Location";

export default interface EventRepository {
  add(event: Event): Promise<Event>;
  findByLocationAndDate(
    location: Location,
    date: Date
  ): Promise<Event | undefined>;
  findEventsByCity(city: string): Promise<Event[]>;
  findEventsByCategory(category: string): Promise<Event[]>;
  findEventsByTitle(title: string): Promise<Event[]>;
  findEventById(id: string): Promise<Event | undefined>;
}
