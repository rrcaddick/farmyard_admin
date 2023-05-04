const booking = {
  _id: ObjectId("1234789012347891234"),
  date: 123098453645,
  createdBy: {
    _id: ObjectId("1234789012347891234"),
    name: "Ray Caddick",
  },
  group: {
    _id: ObjectId("1234789012347891234"),
    name: "Church on the rock",
    type: {
      group: "Church",
    },
    address: {
      street: "34 Main Road",
      suburb: "Paarl",
      postalCode: "7625",
    },
  },
  visitors: {
    total: 600,
    adults: 200,
    youth: 200,
    kids: 200,
  },
  price: {
    _id: ObjectId("1234789012347891234"),
    type: "Discount",
    unit: 7500,
    total: 5250000,
  },
  comments: [
    {
      createdAt: 123098453645,
      comment: "Group agreed to date. Asked about life gaurds",
      user: {
        _id: ObjectId("1234789012347891234"),
        name: "Ray Caddick",
      },
    },
    {
      createdAt: 123098453645,
      comment: "Send quote and advised on deposit date",
      user: {
        _id: ObjectId("1234789012347891234"),
        name: "Linda Caddick",
      },
    },
  ],
  activity: [
    {
      createdAt: 123098453645,
      action: "Linda Caddick created booking",
      user: {
        _id: ObjectId("1234789012347891234"),
        name: "Linda Caddick",
      },
    },
    {
      createdAt: 123098453645,
      action: "Ray Caddick changed status to in progress",
      user: {
        _id: ObjectId("1234789012347891234"),
        name: "Ray Caddick",
      },
    },
  ],
};
