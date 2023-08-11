import express, { Router } from "express";
import { EventRepositoryMongoose } from "../repositories/event.repository.mongoose";
import EventController from "../controllers/event.controller";
import EventService from "../services/event.service";

export default class EventRoutes {
  public router: Router;
  private eventController: EventController;

  constructor() {
    this.router = express.Router();
    const eventRepository = new EventRepositoryMongoose();
    const eventService = new EventService(eventRepository);
    this.eventController = new EventController(eventService);
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      "/",
      this.eventController.create.bind(this.eventController)
    );
  }
}
