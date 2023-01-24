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
  if (desc.includes("pergola")) return { saleType: "Hire", saleDesc: "Pergola Hire" };
  if (desc.includes("school")) return { saleType: "Entrance", saleDesc: "School Price" };
  if (desc.includes("discount")) return { saleType: "Entrance", saleDesc: "Discount Price" };
  if (desc.includes("peak")) return { saleType: "Entrance", saleDesc: "Peak Price" };
  if (desc.includes("person")) return { saleType: "Entrance", saleDesc: "Normal Price" };
};

module.exports = {
  createIkhokhaDate,
  getIkhokhaSaleDetails,
};
