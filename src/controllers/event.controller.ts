import { NextFunction, Request, Response } from "express";
import EventService from "../services/event.service";

export default class EventController {
  constructor(private eventService: EventService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const eventData = req.body;

    try {
      await this.eventService.create(eventData);

      return res.status(201).json({ message: "Evento criado com sucesso!" });
    } catch (error) {
      next(error);
    }
  }
}
