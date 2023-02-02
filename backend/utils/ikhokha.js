const createIkhokhaDate = (date) => {
  const test = new Date(date);
  return new Date(date)
    .toLocaleString("en-ZA", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "");
};

const getIkhokhaSaleDetails = (description) => {
  const desc = description.toLowerCase();

  if (desc.includes("item")) return { saleType: "Shop", saleDesc: "Shop Sales" };
  if (desc.includes("gazebo")) return { saleType: "Hire", saleDesc: "Gazeebo Hire" };
  if (desc.includes("gazibo")) return { saleType: "Hire", saleDesc: "Gazeebo Hire" };
  if (desc.includes("pergola")) return { saleType: "Hire", saleDesc: "Pergola Hire" };
  if (desc.includes("school")) return { saleType: "Entrance", saleDesc: "School Price" };
  if (desc.includes("discount")) return { saleType: "Entrance", saleDesc: "Discount Price" };
  if (desc.includes("peak")) return { saleType: "Entrance", saleDesc: "Peak Price" };
  if (desc.includes("person")) return { saleType: "Entrance", saleDesc: "Normal Price" };
  if (desc.includes("deposit")) return { saleType: "Entrance", saleDesc: "Deposit" };
  return { saleType: "Entrance", saleDesc: "Discount Price" };
};

const formatIkhokhaData = (data) => {
  return data.reduce((sales, sale) => {
    const { date, amountFinal: amount, useremail: employee, trxtype, ref, trxBasketItem: basket } = sale;

    const paymentType = trxtype === "CHP" ? "Cash" : "Card";

    const { saleType, saleDesc, quantity } = basket.reduce((total, { itemDescription, nrItems }, i) => {
      if (i === 0) {
        const { saleType, saleDesc } = getIkhokhaSaleDetails(itemDescription);
        total.saleType = saleType;
        total.saleDesc = saleDesc;
      }

      total.quantity = total.quantity ? total.quantity + nrItems : 0 + nrItems;
      ``;
      return total;
    }, {});

    return [...sales, { date, amount, employee, paymentType, ref, saleType, saleDesc, quantity }];
  }, []);
};

module.exports = {
  createIkhokhaDate,
  getIkhokhaSaleDetails,
  formatIkhokhaData,
};
