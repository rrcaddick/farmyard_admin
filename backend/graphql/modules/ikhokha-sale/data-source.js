const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { IkhokhaSale } = require("../../../models/ikhokha-sale");
const { ikhokhaService } = require("../../../services/ikhokha");

class IkhokhaSource extends MongoDataSource {
  constructor() {
    super(IkhokhaSale);
  }

  async getDailySalesData(date) {
    return await ikhokhaService.getDailyData(date);
  }

  async getikhokhaSaleSundayTim() {
    return await this.model
      .aggregate([
        {
          $match: {
            $and: [
              { employee: "timothy.farmyard@gmail.com" },
              {
                $expr: {
                  $eq: [
                    {
                      $dayOfWeek: {
                        $toDate: {
                          $add: [
                            { $toLong: "$date" },
                            7200000, // Adjusted for South African timezone (UTC+2)
                          ],
                        },
                      },
                    },
                    1, // 1 represents Sunday in MongoDB (South African time)
                  ],
                },
              },
            ],
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: {
                  $toDate: {
                    $add: [
                      { $toLong: "$date" },
                      7200000, // Adjusted for South African timezone (UTC+2)
                    ],
                  },
                },
              },
            },
            latestTime: { $max: "$date" },
            latestDocument: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$latestDocument" },
        },
      ])
      .exec();
  }
}

module.exports = {
  IkhokhaSource,
};
