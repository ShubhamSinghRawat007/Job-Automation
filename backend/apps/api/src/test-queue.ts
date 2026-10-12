import { applicationQueue } from "./queues/application.queue.js";

const main = async () => {
  const job = await applicationQueue.add("process-application", {
    applicationId: "test-application-123",
  });

  console.log("Job added:", {
    id: job.id,
    name: job.name,
    data: job.data,
  });

  await applicationQueue.close();
};

main();