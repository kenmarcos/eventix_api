import Event from "../entities/Event";
import Location from "../entities/Location";
import User from "../entities/User";
import { FilterEventsProps } from "../services/event.service";

export default interface EventRepository {
  add(event: Event): Promise<Event>;
  findByLocationAndDate(
    location: Location,
    date: Date
  ): Promise<Event | undefined>;
  findEventsByCity(city: string): Promise<Event[]>;
  findEventsByCategory(category: string): Promise<Event[]>;
  findEventsByFilter({
    title,
    date,
    category,
  }: FilterEventsProps): Promise<Event[]>;
  findFeaturedEvents(date: Date): Promise<Event[]>;
  findEventsByTitle(title: string): Promise<Event[]>;
  findEventById(id: string): Promise<Event | undefined>;
  update(event: Event, id: string): Promise<any>;
}
