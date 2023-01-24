const puppeteer = require("puppeteer");
const { createIkhokhaDate, getIkhokhaSaleDetails } = require("../../utils/ikhokha");

const ikhokhaService = {};
const setGetData = (getDataFn) => (ikhokhaService.getData = getDataFn);
const setStopService = (stopServiceFn) => (ikhokhaService.stop = stopServiceFn);

ikhokhaService.start = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const [page] = await browser.pages();
  await page.goto("https://ikhokha.biz:8181/reporter/login");

  // Login
  await page.type(`input[name="username"]`, process.env.IKHOKHA_USER, { delay: 50 });
  await page.type(`input[name="password"]`, process.env.IKHOKHA_PASSWORD, { delay: 50 });

  await Promise.all([
    page.click(`input[name="submit"]`),
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: false }),
  ]);

  setGetData(async (date) => {
    const queryDate = createIkhokhaDate(date);
    await page.goto(`https://ikhokha.biz/reporter/app/myhistory/detailedhistory/${queryDate}0000/${queryDate}2355`);

    return (
      await page.evaluate(() => {
        return JSON.parse(document.querySelector("body").innerText);
      })
    ).filter((x) => x.state !== "Fail");
  });

  setStopService(async () => {
    await browser.close();
    console.log(`Ikhoka Service Ended`.bgBlue.white);
  });

  console.log(`Ikhoka Service Started`.bgBlue.white);
};

ikhokhaService.getDailyData = async (date) => {
  const data = await ikhokhaService.getData(date);

  return data.reduce((sales, sale) => {
    const { date, amountFinal: amount, useremail: employee, trxtype: paymentType, ref, trxBasketItem: basket } = sale;

    const { saleType, saleDesc, quantity } = basket.reduce((total, { itemDescription, nrItems }, i) => {
      if (i === 0) {
        const { saleType, saleDesc } = getIkhokhaSaleDetails(itemDescription);
        total.saleType = saleType;
        total.saleDesc = saleDesc;
      }

      total.quantity = total.quantity ? total.quantity + nrItems : 0 + nrItems;
      return total;
    }, {});

    return [...sales, { date, amount, employee, paymentType, ref, saleType, saleDesc, quantity }];
  }, []);
};

module.exports = {
  ikhokhaService,
};
