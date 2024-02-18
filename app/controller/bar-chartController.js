require('dotenv').config();
const Transaction = require("../model/transactionModel");

// Define price ranges
const priceRanges = [
  { min: 0, max: 100 },
  { min: 101, max: 200 },
  { min: 201, max: 300 },
  { min: 301, max: 400 },
  { min: 401, max: 500 },
  { min: 501, max: 600 },
  { min: 601, max: 700 },
  { min: 701, max: 800 },
  { min: 801, max: 900 },
  { min: 901, max: Infinity }
];

const getMonthNumber = (monthName) => {
  const months = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
  };
  return months[monthName];
};

function barChartController() {
  return {
    async barData(req, res) {
      const selectedMonth = req.query.month;
      // console.log("calculate bar-chart mons", selectedMonth);
      const monthName = selectedMonth.trim();

      // Convert month name to month number
      const monthNumber = getMonthNumber(monthName);

      try {
        const barChartData = [];

        // Query the database for each price range
        for (const range of priceRanges) {
          const count = await Transaction.countDocuments({
            $expr: {
              $eq: [{ $month: "$dateOfSale" }, monthNumber]
            },
            price: { $gte: range.min, $lte: range.max }
          });
          barChartData.push({ priceRange: `${range.min} - ${range.max}`, count });
        }
        // console.log(barChartData)
        res.json(barChartData);
      } catch (error) {
        console.error('Error generating bar chart data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}

module.exports = barChartController;
