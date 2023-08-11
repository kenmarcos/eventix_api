import Event from "../entities/Event";

export default interface EventRepository {
  add(event: Event): Promise<Event>;
}
