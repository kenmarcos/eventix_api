import { NextFunction, Request, Response } from "express";
import EventService from "../services/event.service";
import Event from "../entities/Event";

export default class EventController {
  constructor(private eventService: EventService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    let eventData: Event = req.body;

    const files = req.files as any;

    if (files) {
      const banner = files.banner[0];
      const flyers = files.flyers;

      eventData = {
        ...eventData,
        banner: banner.filename,
        flyers: flyers.map((flyer: any) => flyer.filename),
      };
    }

    try {
      await this.eventService.create(eventData);

      return res.status(201).json({ message: "Evento criado com sucesso!" });
    } catch (error) {
      next(error);
    }
  }

  async findEvenstByLocation(req: Request, res: Response, next: NextFunction) {
    const { latitude, longitude } = req.query;

    try {
      const events = await this.eventService.findEventsByLocation(
        String(latitude),
        String(longitude)
      );

      return res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }

  async findEventsByCategory(req: Request, res: Response, next: NextFunction) {
    const { category } = req.params;

    try {
      const events = await this.eventService.findEventsByCategory(category);

      return res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }
}
