import Fastify from "fastify";

import { applicationRoutes } from "./routes/application.routes.js";

export const buildApp = () => {
  const app = Fastify({
    logger: true,
  });

  app.get("/", async () => {
    return {
      message: "Job Automation API is running",
    };
  });

  app.register(applicationRoutes);

  return app;
};