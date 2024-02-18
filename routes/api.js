const transactionController = require("../app/controller/transactionController");
const statisticsController = require("../app/controller/statisticsController")
const barChartController = require("../app/controller/bar-chartController")
const pieChartController = require("../app/controller/pie-chartController")


function initRoutes(app) {

  //  POST  http://localhost:8500/initializeDatabase
  app.post("/initializeDatabase", transactionController().initializeDatabase);  //Initialize Database

  //  GET  http://localhost:8500/transactions
  app.get("/transactions", transactionController().listTransactions);  //List Transactions

  //  GET  http://localhost:8500/transaction-statistics
  app.get("/transaction-statistics", statisticsController().statisticsData);  //Transactions Statistics

  //  GET  http://localhost:8500/bar-chart
  app.get("/bar-chart", barChartController().barData);  //Bar Chart

  //  GET  http://localhost:8500/pie-chart
  app.get("/pie-chart", pieChartController().pieData );  //Pie Chart


}
module.exports = initRoutes