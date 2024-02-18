require('dotenv').config()
const axios = require('axios');
const Transaction = require("../model/transactionModel");

const getMonthNumber = (monthName) => {
  const months = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
  };
  return months[monthName];
};

function transactionController() {
  return {

    // Initialize database endpoint
    async initializeDatabase(req, res) {
      try {
        // Fetch data from the third-party API
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        // Initialize database with seed data 
        await Transaction.deleteMany({}); // Clear existing data
        await Transaction.insertMany(data);

        res.status(200).json({ message: 'Database initialized successfully' });
      } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    },


    // List all transactions endpoint
    async listTransactions(req, res) {
      try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const skip = (page - 1) * perPage;
        const search = req.query.search || '';
        const selectedMonth = req.query.month;
        // console.log('Selected month:', selectedMonth);
        const monthName = selectedMonth ? selectedMonth.trim() : '';

        let query = {};
        
        if (monthName) {
          const monthNumber = getMonthNumber(monthName);
          query = {
            $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] }
          };
        }

        if (search) {
          // Search by title, description, or price
          query.$or = [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { price: parseFloat(search) || 0 }
          ];
      }

        const totalCount = await Transaction.countDocuments(query);

        // Query the database based on search and pagination parameters
        const transactions = await Transaction.find(query)
          .select("-updatedAt -createdAt -__v")
          .skip(skip)
          .limit(perPage);

        // console.log(transactions)

        const totalPages = Math.ceil(totalCount / perPage);
        res.json({ data: transactions, totalPages, currentPage: page });
      } catch (error) {
        console.error('Error listing transactions:', error);
        res.status(500).json({ success: false, message: 'Failed to list transactions.' });
      }
    }

  };
}
module.exports = transactionController;


