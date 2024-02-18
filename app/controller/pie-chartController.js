require('dotenv').config()
const Transaction = require("../model/transactionModel");
const getMonthNumber = (monthName) => {
  const months = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
  };
  return months[monthName];
};

function pieChartController() {
  return {

    async pieData(req, res) {
      const selectedMonth = req.query.month;
      // console.log("Selected month for pie chart:", selectedMonth);
      const monthName = selectedMonth.trim();

      // Convert month name to month number
      const monthNumber = getMonthNumber(monthName);

      try {

        const pieChartData = await Transaction.aggregate([
          {
            $match: {
              $expr: {
                $eq: [{ $month: '$dateOfSale' }, monthNumber]
              }
            }
          },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              category: '$_id',
              count: 1
            }
          }
        ]);

        // console.log(pieChartData);
        res.json(pieChartData);
      } catch (error) {
        console.error('Error generating pie chart data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}
module.exports = pieChartController;
