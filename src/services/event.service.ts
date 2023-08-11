import Event from "../entities/Event";
import EventRepository from "../repositories/event.repository";

export default class EventService {
  constructor(private eventRepository: EventRepository) {}

  async create(eventData: Event) {
    const newEvent = await this.eventRepository.add(eventData);

    return newEvent;
  }
}
