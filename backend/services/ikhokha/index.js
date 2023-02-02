const { firefox } = require("playwright");
const { createIkhokhaDate, formatIkhokhaData } = require("../../utils/ikhokha");
const { IkhokhaSale } = require("../../models/ikhokha-sale");

const ikhokhaService = {
  running: false,
};
const setGetData = (getDataFn) => (ikhokhaService.getData = getDataFn);
const setStopService = (stopServiceFn) => (ikhokhaService.stop = stopServiceFn);

ikhokhaService.start = async () => {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();

  await Promise.all([page.goto("https://ikhokha.biz:8181/reporter/login"), page.waitForLoadState("domcontentloaded")]);

  // Login
  await page.type(`input[name="username"]`, process.env.IKHOKHA_USER);
  await page.type(`input[name="password"]`, process.env.IKHOKHA_PASSWORD);

  await Promise.all([page.click(`input[name="submit"]`), page.waitForLoadState("domcontentloaded")]);

  setGetData(async (startDate, endDate) => {
    const queryStartDate = createIkhokhaDate(startDate);
    const queryEndDate = createIkhokhaDate(endDate);

    await Promise.all([
      page.goto(`https://ikhokha.biz/reporter/app/myhistory/detailedhistory/${queryStartDate}0000/${queryEndDate}2355`),
      page.waitForLoadState("domcontentloaded"),
    ]);

    return (
      await page.evaluate(() => {
        return JSON.parse(document.querySelector("body").innerText);
      })
    ).filter((x) => x.state !== "Fail");
  });

  setStopService(async () => {
    await browser.close();
    ikhokhaService.running = false;
    console.log(`Ikhoka Service Stopped`.bgBlue.white);
  });

  ikhokhaService.running = true;
  console.log(`Ikhoka Service Started`.bgBlue.white);
};

ikhokhaService.getDailyData = async (date) => {
  const data = await ikhokhaService.getData(date, date);
  return formatIkhokhaData(data);
};

ikhokhaService.getPeriodData = async (startDate, endDate) => {
  const data = await ikhokhaService.getData(startDate, endDate);
  return formatIkhokhaData(data);
};

ikhokhaService.writeDailyData = async () => {
  const salesData = await ikhokhaService.getDailyData(new Date());

  await IkhokhaSale.bulkWrite(
    salesData.map((sale) => ({
      updateOne: {
        filter: { ref: sale.ref },
        update: sale,
        upsert: true,
      },
    }))
  );
};

module.exports = {
  ikhokhaService,
};
