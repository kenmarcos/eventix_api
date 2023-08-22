import request from "supertest";
import { App } from "../app";
import EventService from "../services/event.service";
import Event from "../entities/Event";
import crypto from "node:crypto";

const app = new App();
const express = app.app;

describe("Event test", () => {
  it("/POST - create event", async () => {
    const event = {
      title: "Jorge e Mateus",
      price: [{ sector: "Pista", amount: "20" }],
      categories: ["Show"],
      description: "Evento descrição",
      city: "Belo Horizonte",
      location: {
        latitude: "-19.8658659",
        longitude: "-43.9737064",
      },
      coupons: [],
      date: new Date(),
      participants: [],
    };

    const response = await request(express)
      .post("/events")
      .field("title", event.title)
      .field("description", event.description)
      .field("city", event.city)
      .field("coupons", event.coupons)
      .field("categories", event.categories)
      .field("location[latitude]", event.location.latitude)
      .field("location[longitude]", event.location.longitude)
      .field("date", event.date.toISOString())
      .field("price[sector]", event.price[0].sector)
      .field("price[amount]", event.price[0].amount)
      .field("participants", event.participants)
      .attach("banner", "/home/marcos/Downloads/banner.png")
      .attach("flyers", "/home/marcos/Downloads/banner.png");

    if (response.error) {
      console.log("🚀 ~ file: Events.test.ts:34 ~ it ~ error:", response.error);
    }

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Evento criado com sucesso!" });
  });

  it("/GET - get event by location", async () => {
    const response = await request(express).get(
      "/events?latitude=-19.8658659&longitude=-43.9737064"
    );

    if (response.error) {
      console.log("🚀 ~ file: Events.test.ts:34 ~ it ~ error:", response.error);
    }

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("/GET - get event by category", async () => {
    const response = await request(express).get("/events/category/Show");

    if (response.error) {
      console.log("🚀 ~ file: Events.test.ts:34 ~ it ~ error:", response.error);
    }

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("/GET/:id - get event by id", async () => {
    const response = await request(express).get(
      "/events/64dbcd79bcf517573f549cd8"
    );

    if (response.error) {
      console.log("🚀 ~ file: Events.test.ts:34 ~ it ~ error:", response.error);
    }

    expect(response.status).toBe(200);
  });

  it("/POST - insert user", async () => {
    const response = await request(express)
      .post("/events/64dbcd79bcf517573f549cd8/participant")
      .send({
        name: "teste",
        email: crypto.randomBytes(10).toString("hex") + "@teste.com",
      });

    expect(response.status).toBe(200);
  });
});

const eventRepository = {
  add: jest.fn(),
  findEventsByCategory: jest.fn(),
  findFeaturedEvents: jest.fn(),
  findEventsByCity: jest.fn(),
  findByLocationAndDate: jest.fn(),
  findEventsByTitle: jest.fn(),
  findEventById: jest.fn(),
  update: jest.fn(),
};
const eventService = new EventService(eventRepository);
const event: Event = {
  title: "Jorge e Mateus",
  price: [{ sector: "Pista", amount: "20" }],
  categories: ["Show"],
  description: "Evento descrição",
  city: "Belo Horizonte",
  location: {
    latitude: "-19.8658659",
    longitude: "-43.9737064",
  },
  banner: "banner.png",
  flyers: ["flyer1.png", "flyer2.png"],
  coupons: [],
  date: new Date(),
  participants: [],
  formattedAddress: "Rua A, 123",
};

describe("Unit tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an array of events by category", async () => {
    eventRepository.findEventsByCategory.mockResolvedValue([event]);

    const result = await eventService.findEventsByCategory("Show");

    expect(result).toEqual([event]);
    expect(eventRepository.findEventsByCategory).toHaveBeenCalledWith("Show");
  });

  it("should return an array of events by title", async () => {
    eventRepository.findEventsByTitle.mockResolvedValue([event]);

    const result = await eventService.findEventsByTitle("Jorge e Mateus");

    expect(result).toEqual([event]);
    expect(eventRepository.findEventsByTitle).toHaveBeenCalledWith(
      "Jorge e Mateus"
    );
  });

  it("should return an event by Id", async () => {
    eventRepository.findEventById.mockResolvedValueOnce(event);

    const result = await eventService.findEventById("64dbcd79bcf517573f549cd8");

    expect(result).toEqual(event);
    expect(eventRepository.findEventById).toHaveBeenCalledWith(
      "64dbcd79bcf517573f549cd8"
    );
  });
});
