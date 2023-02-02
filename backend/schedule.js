const cron = require("node-cron");
const { ikhokhaService } = require("./services/ikhokha");
const { quicketService } = require("./services/quicket");

const createCronSchedules = () => {
  // Start services and update quicket tickets
  cron.schedule(
    "15 12 * * *",
    async () => {
      // Start Ikhokha Service
      !ikhokhaService.running && (await ikhokhaService.start());

      // Start Quicket Service
      !quicketService.running && (await quicketService.start());

      // Update the tickets
      await quicketService.updateData();
    },
    {
      scheduled: true,
      timezone: "Africa/Johannesburg",
    }
  );

  // Stop services and update ikhokha sales
  cron.schedule(
    "17 12 * * *",
    async () => {
      // Update ikhokha sales
      await ikhokhaService.writeDailyData();

      // Start Ikhokha service
      ikhokhaService.running && (await ikhokhaService.stop());

      // Start Quicket Service
      quicketService.running && (await quicketService.stop());
    },
    {
      scheduled: true,
      timezone: "Africa/Johannesburg",
    }
  );
};

module.exports = {
  createCronSchedules,
};
