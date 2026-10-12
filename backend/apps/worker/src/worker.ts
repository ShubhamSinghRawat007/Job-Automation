import { Worker } from "bullmq";
import { getApplicationById } from "@job-automation/shared";
import { chromium } from "playwright";

const worker = new Worker(
  "application-processing",
  async (job) => {
    console.log("Processing job:", {
      id: job.id,
      name: job.name,
      data: job.data,
    });

    const application = await getApplicationById(job.data.applicationId);

    if (!application) {
      throw new Error(`Application ${job.data.applicationId} not found`);
    }

    const browser = await chromium.launch({
      headless: false,
    });

    try {
      const page = await browser.newPage();

      await page.goto(application.job_url, {
        waitUntil: "domcontentloaded",
      });

      await page.waitForTimeout(8000);
      const applyManuallyLink = page
        .locator("a")
        .filter({ hasText: "Apply Manually" });

      console.log("Apply Manually count:", await applyManuallyLink.count());

      console.log("Current URL before click:", page.url());

      await applyManuallyLink.click();

      await page.waitForTimeout(10000);

      console.log("Current URL after click:", page.url());

      console.log(
        "Page text after click:",
        await page.locator("body").innerText(),
      );
      const inputs = await page.locator("input").evaluateAll((elements) =>
        elements.map((element) => ({
          type: element.getAttribute("type"),
          name: element.getAttribute("name"),
          id: element.getAttribute("id"),
          placeholder: element.getAttribute("placeholder"),
          required: element.hasAttribute("required"),
          visible: !!(element as HTMLElement).offsetWidth,
        })),
      );

      console.log("Inputs:", inputs);
      const labels = await page.locator("label").allTextContents();

      console.log("Labels:", labels);
    } finally {
      await browser.close();
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error);
});
