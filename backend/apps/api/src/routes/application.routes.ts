import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";

import { createApplication } from "@job-automation/shared";
import { createApplicationSchema } from "../schemas/application.schema.js";

import { applicationQueue } from "../queues/application.queue.js";

export const applicationRoutes = async (app: FastifyInstance) => {
  app.post("/applications", async (request, reply) => {
    const result = createApplicationSchema.safeParse(request.body);

    if (!result.success) {
      return reply.code(400).send({
        error: "Invalid request",
        details: result.error.flatten(),
      });
    }

    const application = await createApplication({
      id: randomUUID(),
      jobUrl: result.data.jobUrl,
      status: "queued",
    });

    await applicationQueue.add("process-application", {
      applicationId: application.id,
    });

    return reply.code(201).send(application);
  });
};
