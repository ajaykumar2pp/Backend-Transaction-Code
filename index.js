require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { connectMonggose } = require('./app/database/db')
const apiRoutes = require('./routes/api')

const app = express();
// ******************  Enable CORS  ********************//
app.use(cors());

// ************************  Database Connection  **********************************//
connectMonggose();

// *********************************** API Routes ********************************//
apiRoutes(app);


// ************************   Port Start   ********************************//
const PORT = process.env.PORT || 8500;
app.listen(PORT, () => {
    console.log(`My server start on this port ${PORT}`)
})
