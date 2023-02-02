// From Shopify
const getNumberWithOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const getScheduleDate = (date = Date.now()) => {
  const today = new Date(date);

  return `${getNumberWithOrdinal(today.getDate())} ${today.toLocaleString("en-ZA", {
    month: "short",
    year: "numeric",
  })}`;
};

const getTicketType = (ticketType) => {
  ticketType = ticketType.toLowerCase();

  if (ticketType.includes("visitors")) return "visitor";
  if (ticketType.includes("pergola") && ticketType.includes("#1")) return "Pergola #1";
  if (ticketType.includes("pergola") && ticketType.includes("#2")) return "Pergola #2";
  if (ticketType.includes("gazebo") && ticketType.includes("children")) return "Gazebo #1";
  if (ticketType.includes("gazebo") && ticketType.includes("adult")) return "Gazebo #2";

  return ticketType;
};
``;

const groupTickets = (ticketData) => {
  const groupedTickets = ticketData.reduce((tickets, ticket) => {
    const { orderNumber, purchaserEmail, ticketType, eventDate } = ticket;

    const existingTicket = tickets.find(
      (t) => t.purchaserEmail === purchaserEmail && t.eventDate.getTime() === eventDate.getTime()
    );

    const isVisitorTicket = ticketType === "visitor";

    // Create new ticket group
    if (!existingTicket) {
      tickets.push({
        orderNumbers: [orderNumber],
        eventDate,
        purchaserEmail,
        visitors: isVisitorTicket ? 1 : 0,
        hires: isVisitorTicket ? [] : [ticketType],
      });
      return tickets;
    }

    // Add multiple order numbers
    if (!existingTicket.orderNumbers.includes(orderNumber)) existingTicket.orderNumbers.push(orderNumber);

    // Add visitors or hires
    if (isVisitorTicket) {
      existingTicket.visitors += 1;
    } else {
      existingTicket.hires.push(ticketType);
    }

    return tickets;
  }, []);

  return groupedTickets;
};

module.exports = {
  getScheduleDate,
  groupTickets,
  getTicketType,
};
