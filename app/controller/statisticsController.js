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

const statisticsController = () => {
    return {
        async statisticsData(req, res) {
            try {
                const selectedMonth = req.query.month;
                // console.log("calculate statistics mons", selectedMonth)
                const monthName = selectedMonth.trim();

                // Convert month name to month number
                const monthNumber = getMonthNumber(monthName);



                // Query to calculate statistics for the selected month
                const statistics = await Transaction.aggregate([
                    {
                        $addFields: {
                            month: { $month: '$dateOfSale' }
                        }
                    },
                    {
                        $match: {
                            month: monthNumber
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalAmount: { $sum: '$price' },
                            totalSoldItems: { $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] } },
                            totalNotSoldItems: { $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] } }
                        }
                    }
                ]);
                // console.log(statistics)

                if (statistics.length === 0) {
                    return res.status(404).json({ message: 'No data found for the selected month.' });
                }

                const { totalAmount, totalSoldItems, totalNotSoldItems } = statistics[0];

                res.json({ totalAmount, totalSoldItems, totalNotSoldItems });
            } catch (error) {
                console.error('Error fetching transaction statistics:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch transaction statistics.' });
            }
        }
    };
}
module.exports = statisticsController;
