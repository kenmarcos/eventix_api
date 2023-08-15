import request from "supertest";
import { App } from "../app";

const app = new App();
const express = app.app;

describe("Event test", () => {
  it.skip("should create an event", async () => {
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

  it("should find events by location", async () => {
    const response = await request(express).get(
      "/events?latitude=-19.8658659&longitude=-43.9737064"
    );

    if (response.error) {
      console.log("🚀 ~ file: Events.test.ts:34 ~ it ~ error:", response.error);
    }

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should find events by category", async () => {
    const response = await request(express).get("/events/category/Show");

    if (response.error) {
      console.log("🚀 ~ file: Events.test.ts:34 ~ it ~ error:", response.error);
    }

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
