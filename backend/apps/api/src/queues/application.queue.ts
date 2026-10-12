import { Queue } from "bullmq";

export const applicationQueue = new Queue("application-processing", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});