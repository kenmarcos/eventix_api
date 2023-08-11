import express, { Application } from "express";
import cors from "cors";
import connectDatabase from "./infra/database";
import { errorMiddleware } from "./middlewares/error.middleware";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.handleError();
    connectDatabase();
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {}

  private handleError() {
    this.app.use(errorMiddleware);
  }

  listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

export { App };
