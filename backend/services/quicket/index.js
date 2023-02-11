const { firefox } = require("playwright");
const papa = require("papaparse");
const { groupTickets, getTicketType } = require("../../utils/quicket");
const { QuicketSale } = require("../../models/quicket-sale");

const quicketService = {
  running: false,
};
const setUpdateData = (updateDataFn) => (quicketService.updateData = updateDataFn);
const setStopService = (stopServiceFn) => (quicketService.stop = stopServiceFn);

quicketService.start = async () => {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();

  await Promise.all([
    page.goto("https://www.quicket.co.za/account/authentication/login.aspx"),
    page.waitForSelector("#BodyContent_BodyContent_UserName"),
    page.waitForSelector("#BodyContent_BodyContent_Password"),
  ]);

  // Login
  await page.type("#BodyContent_BodyContent_UserName", process.env.QUICKET_USER);
  await page.type("#BodyContent_BodyContent_Password", process.env.QUICKET_PASSWORD);

  await Promise.all([
    page.click("#BodyContent_BodyContent_LoginButton"),
    page.waitForURL("https://www.quicket.co.za/account/users/profile.aspx"),
  ]);

  // Go To Organiser Hub
  await Promise.all([
    page.goto("https://www.quicket.co.za/account/events/manage/myevents.aspx"),
    page.waitForLoadState("domcontentloaded"),
  ]);

  // Get Active Events
  const activeEventIds = (
    await Promise.all(
      (await page.locator("#grid tbody tr").all()).map(async (event) => await event.locator("td").allInnerTexts())
    )
  )
    .filter((event) => event[3] === "Active" && +event[4] > 0)
    .sort((a, b) => b[4] - a[4])
    .map((event) => event[0]);

  setUpdateData(async () => {
    const ticketData = [];

    for (let activeEventId of activeEventIds) {
      // Go to Events Page
      await Promise.all([
        page.goto(`https://www.quicket.co.za/account/events/manage/guests/guestlist.aspx?y=${activeEventId}`),
        page.waitForSelector("#placeHolderContent_BodyContent_lnkCSV"),
      ]);

      // Start download process
      const downloadPromise = page.waitForEvent("download");
      await page.getByText("Download CSV").click();
      const download = await downloadPromise;

      // Wait for the download process to complete.
      const stream = await download.createReadStream();

      const tickets = await new Promise((resolve, reject) => {
        const chunks = [];

        stream.on("data", (chunk) => {
          chunks.push(Buffer.from(chunk));
        });

        stream.on("close", (data) => {
          const csvFile = Buffer.concat(chunks).toString("utf8");
          papa.parse(csvFile, {
            header: true,
            transformHeader: (header) => {
              return header.replace(/ /g, "");
            },
            complete: ({ data }) => {
              const tickets = data.reduce((tickets, ticket) => {
                const { OrderNumber: orderNumber, PurchaserEmail: purchaserEmail, TicketType, EventDate } = ticket;

                if (!orderNumber) return tickets;

                const [date, time] = EventDate.split(" ");
                const [day, month, year] = date.split("/");

                const ticketType = getTicketType(TicketType);
                const eventDate = new Date(`${year}/${month}/${day} ${time}`);
                const today = new Date(new Date().setHours(0, 0, 0, 0));

                if (eventDate >= today) {
                  tickets.push({
                    orderNumber,
                    purchaserEmail,
                    ticketType,
                    eventDate: eventDate.toLocaleString("en-ZA", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }),
                  });
                }

                return tickets;
              }, []);

              resolve(tickets);
            },
          });
        });
      });

      ticketData.push(...tickets);
      await download.delete();
    }

    const groupedTickets = groupTickets(ticketData);

    const { upsertedCount } = await QuicketSale.bulkWrite(
      groupedTickets.map((ticket) => ({
        updateOne: {
          filter: { purchaserEmail: ticket.purchaserEmail, eventDate: ticket.eventDate },
          update: ticket,
          upsert: true,
        },
      }))
    );
    ``;
    console.log(`${upsertedCount} tickets updated`.bgBlue.white);
    return upsertedCount;
  });

  setStopService(async () => {
    await browser.close();
    quicketService.running = false;
    console.log(`Quicket Service Stopped`.bgGreen.black);
  });

  quicketService.running = true;
  console.log(`Quicket Service Started`.bgGreen.black);
};

module.exports = {
  quicketService,
};
