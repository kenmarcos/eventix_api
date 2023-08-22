import express, { Router } from "express";
import { EventRepositoryMongoose } from "../repositories/event.repository.mongoose";
import EventController from "../controllers/event.controller";
import EventService from "../services/event.service";
import upload from "../infra/multer";

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
      upload.fields([
        {
          name: "banner",
          maxCount: 1,
        },
        {
          name: "flyers",
          maxCount: 3,
        },
      ]),
      this.eventController.create.bind(this.eventController)
    );

    this.router.get(
      "/",
      this.eventController.findEvenstByLocation.bind(this.eventController)
    );

    this.router.get(
      "/category/:category",
      this.eventController.findEventsByCategory.bind(this.eventController)
    );

    this.router.get(
      "/featuredEvents",
      this.eventController.findFeaturedEvents.bind(this.eventController)
    );

    this.router.get(
      "/event",
      this.eventController.findEventsByTitle.bind(this.eventController)
    );

    this.router.get(
      "/:id",
      this.eventController.findEventById.bind(this.eventController)
    );

    this.router.post(
      "/:id/participant",
      this.eventController.addParticipant.bind(this.eventController)
    );
  }
}
